/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget (app-health-alerts), shows the most important activities, such as upcoming appointments, and medications to be taken.
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class HealthAlerts extends Widget {

    constructor() {
        super();

        this.html = hc.spawn(
            {
                classes: HealthAlerts.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='items'></div>
                    </div>
                `
            }
        )
    }

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-app-health-alerts']
    }
}