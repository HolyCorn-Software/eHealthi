/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module, allows access to certain features of this faculty, via public rpc
 */


import AppointmentPublicMethods from "../appointment/remote/public.mjs";
import PrescriptionPublicMethods from "../prescription/remote/public.mjs";
import TimetablePublicMethods from "../timetable/remote/public.mjs";




export default class HealthPublicMethods extends FacultyPublicMethods {

    /**
     * 
     * @param {object} controllers 
     * @param {import("../appointment/controller.mjs").default} controllers.appointment
     * @param {import('../timetable/controller.mjs').default} controllers.timetable
     * @param {import('../prescription/controller.mjs').default} controllers.prescription
     */
    constructor(controllers) {
        super()
        this.appointment = new AppointmentPublicMethods(controllers.appointment)
        this.timetable = new TimetablePublicMethods(controllers.timetable)
        this.prescription = new PrescriptionPublicMethods(controllers.prescription)
    }
}