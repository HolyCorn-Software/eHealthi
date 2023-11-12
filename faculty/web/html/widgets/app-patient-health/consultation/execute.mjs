/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This part of the app-patient-health widget, is where the consultation is actually created
 */

import EHealthiArrowButton from "../../arrow-button/widget.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class PatientConsultationExec extends Widget {

    constructor(init) {

        super();

        this.html = hc.spawn(
            {
                classes: PatientConsultationExec.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='stage'></div>
                        <div class='btn-continue'></div>
                    </div>
                `
            }
        );

        this.html.$('.container >.btn-continue').appendChild(
            new EHealthiArrowButton(
                {
                    content: `Continue`
                }
            ).html
        )
    }

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-app-patient-health-consultation-exec']
    }

}