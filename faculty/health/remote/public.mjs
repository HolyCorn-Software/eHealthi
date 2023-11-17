/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module, allows access to certain features of this faculty, via public rpc
 */


import AppointmentPublicMethods from "../appointment/remote/public.mjs";




export default class HealthPublicMethods extends FacultyPublicMethods {

    /**
     * 
     * @param {object} controllers 
     * @param {import("../appointment/controller.mjs").default} controllers.appointment
     */
    constructor(controllers) {
        super()
        this.appointment = new AppointmentPublicMethods(controllers.appointment)
    }
}