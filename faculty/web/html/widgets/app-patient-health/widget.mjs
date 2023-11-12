/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget provides an interface for the patient to benefit from direct health-related features.
 */

import SimpleCalendar from "/$/system/static/html-hc/widgets/simple-calendar/widget.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import HealthAlerts from "../app-health-alerts/widget.mjs";
import EHealthiArrowButton from "../arrow-button/widget.mjs";
import BackForth from "/$/system/static/html-hc/widgets/back-forth/widget.mjs";
import PatientConsultationInit from "./consultation/init.mjs";


export default class PatientHealth extends Widget {

    constructor() {

        super();

        this.content = hc.spawn(
            {
                classes: PatientHealth.classList,
                innerHTML: `
                    <div class='container'>

                        <div class='btn-init-appointment'></div>
                        
                        <div class='important'>
                            <div class='title'>Important</div>
                        </div>

                        <div class='main'>
                            <div class='calendar'></div>
                            <div class='stage'></div>
                        </div>

                    </div>
                `
            }
        );

        const backForth = new BackForth(
            {
                view: this.content
            }
        )

        this.html = backForth.html

        this.content.$('.container >.important').appendChild(new HealthAlerts().html)

        this.content.$('.container >.main >.calendar').appendChild(new SimpleCalendar().html)

        this.content.$('.container >.btn-init-appointment').appendChild(
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