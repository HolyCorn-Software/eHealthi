/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget provides an interface for the patient to benefit from direct health-related features.
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import HealthAlerts from "../app-health-alerts/widget.mjs";
import MainView from "./main/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import MyProfile from "../app-my-profile/widget.mjs";


export default class PatientHealth extends Widget {

    constructor() {

        super();

        this.html = hc.spawn(
            {
                classes: PatientHealth.classList,
                innerHTML: `
                    <div class='container'>

                        <div class='btn-init-appointment'></div>
                        <div class='hold-profile'>
                            <div class='main'>
                                <div class='icon'></div>
                            </div>
                        </div>
                        
                        <div class='important'>
                            <div class='title'>Important</div>
                        </div>

                        <div class='main'></div>

                    </div>
                `
            }
        );

        // this.widgetProperty(
        //     {
        //         selector: ['', ...MainView.classList].join('.'),
        //         parentSelector: ':scope >.container >.main',
        //         childType: 'widget',
        //     }, 'main'
        // )
        // this.main = new MainView()

        this.html.$('.container >.important').appendChild(new HealthAlerts().html)



        /** @type {string} */ this.meIcon
        this.defineImageProperty(
            {
                selector: '.container >.hold-profile >.main >.icon',
                mode: 'background',
                property: 'meIcon',
                fallback: '/$/shared/static/logo.png'
            }
        )

        this.blockWithAction(async () => {
            const me = await hcRpc.modernuser.authentication.whoami(true)
            this.meIcon = me.icon
        });


        this.html.$('.container >.hold-profile >.main').addEventListener('click', () => {
            let profileUI;
            this.html.dispatchEvent(
                new WidgetEvent('backforth-goto', {
                    detail: {
                        title: `Me`,
                        view: (profileUI ||= new MyProfile()).html,
                    },
                    bubbles: true
                })
            )
        }, { signal: this.destroySignal })


    }

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-app-patient-health']
    }
}