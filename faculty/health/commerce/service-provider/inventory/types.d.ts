/**
 * Copyright 2024 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module, contains type definitions for the service-provider/inventory module
 */


import ''
import { Collection } from "mongodb"

global {
    namespace ehealthi.health.commerce.service_provider.inventory {


        interface InventoryItem {
            commodity: string
            enabled: time
            serviceProvider: string
        }

        type InventoryCollection = Collection<InventoryItem>
    }
}