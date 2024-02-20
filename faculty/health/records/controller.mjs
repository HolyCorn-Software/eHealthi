/**
 * Copyright 2024 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module (records), provides the possibility of storing client's medical records.
 * A medical record here, is just a dated, titled bunch of text
 */

import muser_common from "muser_common"
import shortUUID from "short-uuid"
import { CollectionProxy } from "../../../system/database/collection-proxy.js"


const collection = Symbol()


/** @type {ehealthi.health.records.Collections} */
const collections = new CollectionProxy({
    'records': 'records.default',
})


export default class MedicalRecordsController {

    constructor() {
        this[collection] = collections.records
    }

    /**
     * This method returns medical records for a given patient
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {string} param0.patient
     * @param {ehealthi.health.records.RecordSeverity} param0.severity
     */
    async getRecordsFor({ userid, patient, severity = 3 }) {

        if (userid !== patient) {
            await muser_common.whitelisted_permission_check(
                {
                    userid,
                    intent: { freedom: 'use' },
                    permissions: ['permissions.health.records.view'],
                }
            )
        }

        const that = this;
        /**
         * @type {()=>AsyncGenerator<ehealthi.health.records.MedicalRecord, void, unknown>}

         */

        async function* dataIterator() {
            for await (const item of await that[collection].find({ patient, severity: { $lte: severity } }, { sort: { time: 'desc' } })) {
                delete item._id
                yield item
                profilesStream.write(item.doctor)
            }
            profilesStream.end()
        }


        const profilesStream = new muser_common.UserProfileTransformStream();


        const res = {
            data: dataIterator,
            profiles: () => profilesStream.iterator()
        }

        return new JSONRPC.ActiveObject(res)

    }

    /**
     * This method is used to create a medical record
     * @param {object} param0 
     * @param {string} param0.patient
     * @param {ehealthi.health.records.MedicalRecordInit} param0.data
     */
    async insertRecord({ userid, patient, data }) {

        await muser_common.whitelisted_permission_check(
            {
                userid,
                permissions: ['permissions.health.records.view']
            }
        )

        soulUtils.checkArgs(data, {
            content: 'string',
            title: 'string',
            severity: 'number',
            type: 'string',
        }, "record", undefined, ['exclusive'])

        const id = shortUUID.generate()

        await this[collection].insertOne(
            {
                ...data,
                id,
                doctor: userid,
                patient,
                time: data.time || Date.now(),
                created: Date.now(),
            }
        )

        return id
    }

    /**
     * This method checks if the record specified by `id`, can be modified by user specified by `userid`
     * @param {object} param0 
     * @param {string} param0.id
     * @param {string} param0.userid
     */
    async canModify({ id, userid }) {
        const existing = await this[collection].findOne({ id })
        if (!existing) {
            throw new Exception(`The medical record you're trying to modify, doesn't exist.`)
        }
        await muser_common.whitelisted_permission_check(
            {
                userid,
                permissions: ['permissions.health.records.modify'],
                whitelist: [existing.doctor]
            }
        );


        if (Date.now() > (existing.created + MedicalRecordsController.MAX_MODIFY_TIME)) {
            throw new Exception(`You can only modify / delete a medical record ${MedicalRecordsController.MAX_MODIFY_TIME} hours after it has been created`)
        }


        return existing
    }

    /**
     * This method tells us if a user has the possibility of viewing other's medical records
     * @param {object} param0 
     * @param {string} param0.userid
     */
    async canViewMedicalRecords({ userid }) {
        return await muser_common.whitelisted_permission_check(
            {
                userid,
                permissions: [
                    'permissions.health.records.view'
                ],
                throwError: false
            }
        )
    }



    /**
     * This method gets all the permission levels the calling user has over the intended patient
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {string} param0.patient
     */
    async getMedicalRecordsRightsFor({ userid, patient }) {

        /** @param {Parameters<muser_common['whitelisted_permission_check']>['0']['permissions']['0']} permission */
        const permissionCheck = (permission) => muser_common.whitelisted_permission_check({ userid, permissions: ['permissions.health.records.view'], throwError: false });
        const supervise = await permissionCheck('permissions.health.records.modify')
        const generalWrite = supervise || await permissionCheck('permissions.health.records.write')
        return {
            read: (userid == patient) || generalWrite || await permissionCheck('permissions.health.records.view'),
            write: generalWrite,
            supervise: supervise
        }
    }


    /**
     * This method modifies a medical record
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {string} param0.id
     * @param {ehealthi.health.records.MedicalRecordInit} param0.data
     */
    async modifyRecord({ userid, id, data }) {

        await this.canModify({ id, userid })

        soulUtils.checkArgs(data, {
            content: 'string',
            title: 'string',
            severity: 'number',
            time: 'number',
            type: 'string',
        }, "record", undefined, ['definite', 'exclusive'])

        this[collection].updateOne(
            {
                id
            },
            {
                $set: {
                    ...data,
                    doctor: userid
                }
            }
        );




    }

    /**
    * This method deletes a medical record
    * @param {object} param0 
    * @param {string} param0.userid
    * @param {string} param0.id
    */
    async delete({ userid, id }) {
        await this.canModify({ id, userid })
        this[collection].deleteOne({ id })
    }

    /** @readonly After this time, a record can no longer be modified */
    static get MAX_MODIFY_TIME() {
        return 12 * 60 * 60 * 1000
    }


}