/**
 * Copyright 2024 HolyCorn Software
 * The eHealthi Project
 * This module allows access to generalized features by users over the public web
 */


/**
 * @type {modernuser.notification.Template}
 */
const SUPPORT_NOTIF_TEMPLATE = {
    label: `Customer Support Request`,
    name: 'ehealthi_customer_support_request',
    fields: {
        en: {
            text: `A customer left a request with the following details:\n\nCustomer Names: {{1}}\n\nContact: {{2}}\n\nMessage:\n{{3}}`,
            html: `A customer left a request with the following details:\n\nCustomer Names: {{1}}\n\nContact: {{2}}\n\nMessage:\n{{3}}`,
            whatsapp: {
                category: 'UTILITY',
                components: [
                    {
                        type: 'BODY',
                        text: `A customer left a request with the following details:\n\n*Customer Names*: {{1}}\n\n*Contact*: {{2}}\n\n*Message*:\n{{3}}\n\n.The request was created since: {{4}}.\nPlease, respond promptly.`,
                        example: {
                            body_text: [
                                [
                                    'Jean Paul',
                                    'jeanpaul15@gmail.com',
                                    "I have trouble logging into my account. Please, what do I do?",
                                    "April 7, 2024"
                                ]
                            ]
                        }
                    }
                ]
            }
        }
    }
}


export default class WebPublicMethods extends FacultyPublicMethods {



    /**
     * This method is called by the frontend, when an annonymous user wants to contact support.
     * @param {object} data 
     * @param {string} data.names
     * @param {string} data.contact
     * @param {string} data.message
     */
    async requestSupport(data) {
        data = arguments[1]

        /** @type {ehealthi.ui.contact_us.customer_support.CustomerSupportContact[]} */
        const entries = await FacultyPlatform.get().settings.get({ namespace: 'widgets', name: 'organization_support_contacts' });

        // Try reaching each of the support contacts
        // Only continue if one of them succeeds
        await Promise.any(entries.map(async entry => {
            await (await FacultyPlatform.get().connectionManager.overload.modernuser()).notification.notify(
                {
                    template: SUPPORT_NOTIF_TEMPLATE.name,
                    contact: entry.contact,
                    data: [
                        data.names || 'NO names',
                        data.contact || 'No contact',
                        data.message || 'Empty message'
                    ],
                    language: 'en',

                }
            )
        }))
    }

    static async init() {
        await (await FacultyPlatform.get().connectionManager.overload.modernuser()).notification.createTemplate(SUPPORT_NOTIF_TEMPLATE)
    }

}