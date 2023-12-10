/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget, is part of the app-patient-health widget, where it represents an entry on the timetable to inform the user
 * to take a medication
 */

import TimetableItemView from "./item.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";




export default class PrescriptionView extends TimetableItemView {

    /**
     * 
     * @param {ehealthi.health.prescription.Prescription} prescription
     * @param {ehealthi.health.prescription.IntakeDose}  intake
     */
    constructor(prescription, intake) {
        super(
            {
                image: new URL('./medication.svg', import.meta.url).href,
                title: `Take your medication`,
                caption: `Take ${intake.quantity.value} ${intake.quantity.label} of ${prescription.label}, at <i><b>${hc.toTimeString(new Date(intake.time))}</b></i>.\n<br>Tap for more info.`,
                actions: [
                    new ActionButton(
                        {
                            content: `Info`,
                            onclick: () => {
                                // Show a popup with medication info.
                            }
                        }
                    ).html
                ]
            }
        );

        this.html.classList.add(...PrescriptionView.classList)
    }

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-app-patient-health-main-view-prescription-item']
    }
}


hc.importModuleCSS(import.meta.url)