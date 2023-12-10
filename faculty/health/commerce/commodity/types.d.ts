/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module contains type definitions that deal with how data about commodities are stored.
 */


import { Collection } from "mongodb"

global {
    namespace ehealthi.health.commerce.data {
        interface Commodity {
            id: string
            label: string
            description: string
            price: finance.Amount
            created: number

        }

        type CommodityCollection = Collection<Commodity>
    }

    namespace modernuser.permission {
        interface AllPermissions {
            'permissions.health.commerce.modify': true
        }
    }
}