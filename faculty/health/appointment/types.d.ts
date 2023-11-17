/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This module contains type definitions related to managing appointments
 */



import { Collection } from "mongodb"

global {
    namespace ehealthi.health.appointment {
        interface Appointment {
            id: string
            /** The doctor who's responsible for this appointment. */
            doctor: string
            /** The user who's being a patient for this appointment. */
            patient: string
            /** The user who created this appointment. */
            userid: string
            /** If payment is required, this field is the id of the payment to be made. */
            payment: string
            /** This field indicates if the {@link payment} has been made. */
            paid: boolean
            /** This field is the time when the appointment is expected to happen. */
            time: number
            /** This field indicates if the doctor even started the appointment. */
            opened: boolean
            /** This field indicates if the doctor has marked the appointment over. */
            complete: boolean
        }

        type AppointmentInit = Pick<Appointment, "doctor" | "patient" | "userid" | "time">

        type AppointmentCollection = soul.util.archivecollectiongroup.ArchiveCollection<Appointment>

        interface Collections {
            recent: AppointmentCollection
            archive: AppointmentCollection
            ready: AppointmentCollection
        }

        namespace notification {

            interface NotificationJob {

                /** The appointment we're notifying users about */
                appointment: string

                /** The time the notification is supposed to be sent */
                time: number

                /** Who is to be notified about the appointment */
                user: 'doctor' | 'patient' | 'admin'

                doctorType: 'old' | 'current'

                /** 
                 * This field indicates if this is the first notification to the admin, or doctor. 
                 * That is, the notification just telling him that an appointment has just been scheduled, and needs to be confirmed.
                 */
                inital: boolean

                /**
                 * This tells us the type of notification we're sending.
                 * default notifications, just go to tell the user, that his appointment is upcoming.
                 * change notifications, indicate, that doctor, or the time for the appointment has been changed
                 */
                type: 'default' | 'change'

            }

            type NotificationTasksCollection = soul.util.workerworld.TaskCollection<NotificationJob>

            interface Collections {
                main: NotificationTasksCollection
            }
        }
    }
}