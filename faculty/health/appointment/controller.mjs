/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module deals with features, that are related to scheduling consultations
 */

import shortUUID from "short-uuid";
import { CollectionProxy } from "../../../system/database/collection-proxy.js";
import WorkerWorld from "../../../system/util/worker-world/main.mjs";
import { AppointmentNotificationController } from "./notification.mjs";
import muser_common from "muser_common";


/** @type {ehealthi.health.appointment.Collections} */
const collections = new CollectionProxy({
    'recent': 'appointments.recent',
    'ready': 'appointments.ready',
    'archive': 'appointments.old',
})

export default class AppointmentController {

    constructor() {
        this.dbController = new WorkerWorld(
            {

                stages: [
                    {
                        collection: collections.recent,
                        name: 'recent',
                        label: 'New'
                    },
                    {
                        collection: collections.ready,
                        name: 'ready',
                        label: "Paid"
                    },
                    {
                        collection: collections.archive,
                        name: 'archive',
                        label: `Old`,
                    }
                ],
                width: 4,
                execute: async (data) => {
                    // The creteria for determining whether or not to archive an appointment record is simple:
                    // Is the appointment passed more than 3 days ago?
                    if ((Date.now() - (data.time || 0)) > 3 * 24 * 60 * 60 * 1000) {
                        return {
                            newStage: 'archive'
                        }
                    }

                    // Well, if the payment has been made, create a job for activating the chats on the day of consultation
                    if (data.paid && data["@worker-world-task"].stage != 'ready') {
                        const finance = await FacultyPlatform.get().connectionManager.overload.finance()
                        if ((await finance.payment.getPayment({ id: data.payment })).done) {

                            // At this point, the task is paid, and it's not yet in the 'ready' stage, so let's create a task to issue a notification
                            // After that, the appointment would be 'ready'

                            await this.notification.scheduleNotifications(data)

                            return {
                                newStage: 'ready'
                            }
                        } else {
                            data.paid = false
                            return {
                                ignored: Date.now() + (10 * 60 * 1000), // 10 mins delay for this attempt to defraud us.
                                newStage: 'ready',
                            }
                        }
                    }

                }
            }
        );


        this.notification = new AppointmentNotificationController()
    }

    async init() {


        const finance = await FacultyPlatform.get().connectionManager.overload.finance();

        // Now that we're connected to the Faculty of Finance, let's listen for cases of payments for appointments, that have been completed

        const processPayment = async (id) => {
            // Let's first verify that the payment was done.
            try {
                if (!id || !(await finance.payment.getPayment({ id })).done) {
                    return;
                }
                // If so, remember that the appointment was paid
                await this.dbController.updateOne({ payment: id }, { $set: { paid: true } })
            } catch (e) {
                console.error(`Failed to automatically process appointment, for payment ${id}\n`, e)
            }
        }

        // But first, let's make provision for handling subsequent payments.
        FacultyPlatform.get().connectionManager.events.addListener('finance.payment-complete', async (fac, id) => {
            // TODO: What if we have a suffix attached to payment ids, that can help us distinguish payments that are likely to have happened here.
            // This would prevent unnecessary query to our database
            processPayment(id)
        });

        // So, let's look at the unpaid appointments, and see which ones were paid for, when the faculty was offline
        // It's not something urgent. Let's wait for the system to complete boot
        FacultyPlatform.get().connectionManager.events.addListener('platform-ready', async () => {


            try {
                // The unpaid appointments, that coming after the end of yesterday
                const today = new Date()
                const items = await this.dbController.find({
                    // All recent appointments,
                    $stages: ['recent'],
                    // that have not been paid
                    paid: { $ne: true },
                    // that were supposed to be paid
                    payment: { $exists: true },
                    // since yesterday ending
                    time: { $gte: new Date(new Date().setMonth(today.getMonth(), today.getDate() - 1)).setHours(23, 59, 0, 0) },

                })

                for await (const appointment of items) {
                    try {
                        if ((await finance.payment.getPayment({ id: appointment.payment })).done) {
                            await this.dbController.updateOne({ id: appointment.id, $stages: ['recent'] }, { $set: { paid: true } })
                        }
                    } catch (e) {
                        console.error(`Could not process likely past payment for appointment ${appointment.id}.\n`, e)
                    }
                }

            } catch (e) {
                console.error(`Could not process past appointment payments.\n`, e)
            }
        })

    }


    /**
     * This method creates a new appointment.
     * @param {ehealthi.health.appointment.AppointmentInit} init 
     * @returns {Promise<string>}
     */
    async create(init) {
        const id = shortUUID.generate()
        let payment;
        const user = await (await FacultyPlatform.get().connectionManager.overload.modernuser()).profile.get_profile({ id: init.userid })
        if (!user.meta?.isDoctor) {
            payment = await (await FacultyPlatform.get().connectionManager.overload.finance()).payment.create({
                owners: [user.id],
                type: 'invoice',
                amount: {
                    value: 1,
                    currency: 'XAF', // TODO: create settings for price of consultation.
                }
            })
        }

        await this.dbController.insertOne({
            ...init,
            id,
            paid: (typeof payment) == 'undefined',
            payment,
        });

        return id
    }

    /**
     * This method retreives an appointment from the database
     * @param {object} param0 
     * @param {string} param0.id
     * @param {string} param0.userid The id of the user wanting it. 
     */
    async getAppointment({ id, userid }) {
        const data = await this.dbController.findOne({ id })

        if (!data) {
            throw new Exception(`The appointment you're looking for, was not found.`)
        }

        await muser_common.whitelisted_permission_check(
            {
                userid,
                permissions: ['permissions.health.appointment.view'],
                whitelist: [
                    data.userid,
                    data.doctor,
                    data.patient
                ]
            }
        );

        return data;
    }

}