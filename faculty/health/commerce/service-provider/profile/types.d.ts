/**
 * Copyright 2024 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module contains type definitions related to managing the profiles of service providers
 */

import { Collection } from "mongodb"

global {
    namespace ehealthi.health.commerce.service_provider.profile {
        interface ServiceProvider {
            userid: string
            created: time
            label: string
            description: string
            enabled: boolean
        }


        type ServiceProvidersCollection = Collection<ServiceProvider>


    }
}