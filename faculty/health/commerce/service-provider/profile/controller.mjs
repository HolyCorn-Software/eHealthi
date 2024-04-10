/**
 * Copyright 2024 HolyCorn Software
 * The eHealthi Project
 * The Faculty of Health
 * This module (profile), deals with the features that allow us to manage profiles of service providers, as well as decide who becomes a service provider
 * These profiles contain additional info aside those found on the user profile.
 * For example, service centers, frequently asked questions
 */

import muser_common from "muser_common";
import collections from "../collections.mjs";

export default class ServiceProviderProfileController {


    static async permissionCheck({ userid }) {
        await muser_common.whitelisted_permission_check({
            userid,
            permissions: ['permissions.health.commerce.service_provider.manage'],
        })
    }


    /**
     * This method makes an account become a service provider account
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {string} param0.accountId The account we want to make a service provider
     */
    async add({ userid, accountId }) {
        await ServiceProviderProfileController.permissionCheck({ userid })
        soulUtils.checkArgs(accountId, 'string', 'accountId')
        const profile = await (await FacultyPlatform.get().connectionManager.overload.modernuser()).profile.get_profile({ id: accountId });
        delete profile.id
        delete profile.time
        await collections.profiles.updateOne(
            {
                userid: accountId
            },
            {
                $setOnInsert: {
                    created: Date.now(),
                },
                $set: {
                    enabled: true
                }
            },
            { upsert: true }
        )

        return {
            $profile: profile
        }
    }

    /**
     * This method removes a service provider's account profile
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {string} param0.accountId
     */
    async remove({ userid, accountId }) {
        await ServiceProviderProfileController.permissionCheck({ userid })
        await collections.profiles.deleteOne({ userid: accountId })
        soulUtils.checkArgs(accountId, 'string', 'accountId')
    }

    /**
     * This method enables/disables a service provider's account
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {string} param0.accountId
     * @param {boolean} param0.state
     */
    async toggleState({ userid, accountId, state }) {
        await ServiceProviderProfileController.permissionCheck({ userid })
        soulUtils.checkArgs(accountId, 'string', 'accountId')
        await collections.profiles.updateOne({ userid: accountId }, { $set: { enabled: !!state } })
    }

    async *getServiceProviders({ userid }) {
        await ServiceProviderProfileController.permissionCheck({ userid })
        for await (const item of collections.profiles.find()) {
            const data = {
                ...item,
                $profile: await (await FacultyPlatform.get().connectionManager.overload.modernuser()).profile.get_profile({ id: item.userid })
            }
            delete data._id
            delete data.$profile.id
            delete data.$profile.time

            yield data

        }
    }

}