/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * 
 * This faculty deals with features, that are directly related health, such as consultation, medication, etc..
 */

import AppointmentController from "./appointment/controller.mjs"
import HealthPublicMethods from "./remote/public.mjs"


export default async function () {

    const appointmentController = new AppointmentController()
    
    const faculty = FacultyPlatform.get()
    
    faculty.remote.public = new HealthPublicMethods({ appointment: appointmentController })
    
    await appointmentController.init()
    console.log(`${FacultyPlatform.get().descriptor.label.cyan} running!!`)
}