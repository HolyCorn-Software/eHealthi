/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project.
 * This module contains type definitions for the info-services widget.
 */


import ''

global {
    namespace ehealthi.ui.info_services {
        interface ServiceInfo {
            id: string
            title: string
            description: string
            image: string
        }

        type Statedata = htmlhc.lib.alarm.AlarmObject<{
            services: ServiceInfo[]
        }>

    }
}