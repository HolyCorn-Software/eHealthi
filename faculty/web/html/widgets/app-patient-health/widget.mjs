/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget provides an interface for the patient to benefit from direct health-related features.
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import HealthAlerts from "../app-health-alerts/widget.mjs";
import EHealthiArrowButton from "../arrow-button/widget.mjs";
import PatientConsultationInit from "./consultation/init.mjs";
import MainView from "./main/widget.mjs";


export default class PatientHealth extends Widget {

    constructor() {

        super();

        this.html = hc.spawn(
            {
                classes: PatientHealth.classList,
                innerHTML: `
                    <div class='container'>

                        <div class='btn-init-appointment'></div>
                        
                        <div class='important'>
                            <div class='title'>Important</div>
                        </div>

                        <div class='main'></div>

                    </div>
                `
            }
        );

        this.widgetProperty(
            {
                selector: ['', ...MainView.classList].join('.'),
                parentSelector: ':scope >.container >.main',
                childType: 'widget',
            }, 'main'
        )
        this.main = new MainView()

        this.html.$('.container >.important').appendChild(new HealthAlerts(this.main.statedata).html)


        this.html.$('.container >.btn-init-appointment').appendChild(
            new EHealthiArrowButton(
                {
                    content: `See the doctor`,
                    onclick: async () => {
                        this.html.dispatchEvent(
                            new WidgetEvent('backforth-goto', {
                                detail: {
                                    title: `Consultation`,
                                    view: new PatientConsultationInit().html,
                                },
                                bubbles: true
                            })
                        )
                    }
                }
            ).html
        );


    }

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-app-patient-health']
    }
}