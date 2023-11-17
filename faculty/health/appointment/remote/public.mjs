/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This module allows other components to make use of features related to appointments, over the public web.
 */

import muser_common from "muser_common";
import AppointmentController from "../controller.mjs";


const controller = Symbol()


export default class AppointmentPublicMethods {

    /**
     * 
     * @param {AppointmentController} controller_ 
     */
    constructor(controller_) {
        this[controller] = controller_;
    }

    /**
     * This method creates a new appointment
     * @param {Omit<ehealthi.health.appointment.AppointmentInit, "userid">} init 
     */
    async create(init) {
        init = arguments[1];

        const userid = (await muser_common.getUser(arguments[0])).id;

        return await this[controller].create(
            {
                userid: userid,
                time: init.time,
                patient: init.patient || userid,
                doctor: init.doctor,
            }
        )
    }

    /**
     * This method retrieves an appointment from the database
     * @param {object} param0 
     * @param {string} param0.id
     * 
     */
    async getAppointment({ id }) {


        const userid = (await muser_common.getUser(arguments[0])).id;

        return await this[controller].getAppointment(
            {
                ...arguments[1],
                userid: userid,
            }
        )
    }


}