/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module allows notifications to be sent, about appointments with doctor.
 */

import { CollectionProxy } from "../../../system/database/collection-proxy.js";
import WorkerWorld from "../../../system/util/worker-world/main.mjs"


const processor = Symbol()


/** @type {ehealthi.health.appointment.notification.Collections} */
const collections = new CollectionProxy({
    'main': 'appointment.notifications.default',
});

export class AppointmentNotificationController {

    constructor() {
        this[processor] = new WorkerWorld(
            {
                width: 5,
                stages: [
                    {
                        label: `Default`,
                        name: 'default',
                        collection: collections.main,
                    }
                ],
                execute: (task) => {
                    // TODO: Create notification templates
                }
            }
        );

    }

    /**
     * This method schedules important notifications for the stakeholders of a particular appointment (i.e, doctor, patient, admin)
     * @param {ehealthi.health.appointment.Appointment} appointment 
     * @param {object} param1
     * @param {boolean} param1.isFirst Some notifications are only sent when it's the first time anyone is hearing about an appointment.
     * @param {object} param1.change If specified, then we're scheduling notifications, because the appointment has changed. It has to be done differently.
     * @param {string} param1.change.prevDoctor If specified, then there was a previous doctor, who is no longer assigned to this appointment
     * @returns {Promise<void>}
     */
    async scheduleNotifications(appointment, { isFirst, change: change } = {}) {
        // The notification to inform the admin, and ?doctor, that there's an appointment


        // First things first, we need to critically cancel other notification tasks.
        // Rule number one of cancelation...
        // We cancel initial notifications, if the doctor changed
        if (change?.prevDoctor) {
            await this[processor].deleteMany(
                {
                    appointment: appointment.id,
                    inital: true,
                    type: 'default',
                    user: 'doctor',
                }
            )
        }

        // However, no matter the situation, cancel all non-initial notifications, and all notifications, that don't go to the doctor
        await this[processor].deleteMany(
            {
                appointment: appointment.id,
                $or: [
                    {
                        inital: false
                    },
                    {
                        inital: { $exists: false }
                    },
                    {
                        user: { $ne: 'doctor' }
                    }
                ]
            }
        );


        // After canceling similar notifications, let's go ahead to reschedule them.


        if (isFirst) {


            await this[processor].insertOne(
                {
                    appointment: appointment.id,
                    inital: true,
                    type: 'default',
                    user: 'admin',
                    time: Date.now() // Just now
                }
            );

            if (appointment.doctor) {
                await this[processor].insertOne(
                    {
                        appointment: appointment.id,
                        inital: true,
                        type: 'default',
                        user: 'doctor',
                        time: Date.now() + (10 * 60 * 1000) // Let's give the doctor up to 10 mins, so that if the appointment is re-scheduled, we'd have time to cancel the notification
                    }
                );
            }

        }


        // If the appointment is three or more days in advance, let's place a notification to remind the important stakeholders one day beforehand
        if (appointment.time >= new Date().setHours(0, 0, 0, 0) + (3 * 24 * 60 * 60 * 1000)) {
            let eve = new Date(new Date(appointment.time).setDate(new Date(appointment.time).getDate() - 1))
            eve = new Date(eve).setHours(eve.getHours() - 1, 0, 0, 0)

            // For the doctor
            await this[processor].insertOne(
                {
                    appointment: appointment.id,
                    type: 'default',
                    user: 'doctor',
                    time: eve
                }
            );

            // And for the patient
            await this[processor].insertOne(
                {
                    appointment: appointment.id,
                    type: 'default',
                    user: 'patient',
                    time: eve
                }
            );

            // In case the notification is being sent because something about the appointment changed, we have additional notifications to send
            if (change) {

                // For the patient, actually
                await this[processor].insertOne(
                    {
                        appointment: appointment.id,
                        type: 'change',
                        user: 'patient',
                        time: Date.now() + (10 * 60 * 1000) // 10mins delay. In case something changes again, we'd have sufficient time to cancel it
                    }
                );


                if (change?.prevDoctor) {
                    // And if it's a new doctor, let's tell the old doctor he's off
                    await this[processor].insertOne(
                        {
                            appointment: appointment.id,
                            type: 'change',
                            user: 'doctor',
                            doctorType: 'old',
                            time: Date.now() + (10 * 60 * 1000) // Another 10mins to inform the doctor, to handle cases where the admin changes his mind.
                        }
                    );
                }
            }
        }



    }

}