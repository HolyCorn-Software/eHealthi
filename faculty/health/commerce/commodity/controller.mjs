/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This part of the commerce controller, that deals with data about the commodities themselves, not even about who provides
 * them, or how they were prescribed
 */


const collection = Symbol()


export default class CommodityDataController {

    /**
     * 
     * @param {ehealthi.health.commerce.data.CommodityCollection} collection_ 
     */
    constructor(collection_) {
        this[collection] = collection_
    }

    
    
}