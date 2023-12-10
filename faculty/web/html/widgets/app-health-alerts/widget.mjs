/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget (app-health-alerts), shows the most important activities, such as upcoming appointments, and medications to be taken.
 */

import PendingMedicationView from "./item/pending-medication/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import DelayedAction from "/$/system/static/html-hc/lib/util/delayed-action/action.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class HealthAlerts extends Widget {

    /**
     * 
     * @param {ehealthi.ui.app.app_patient_health.Statedata} statedata 
     */
    constructor(statedata) {
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
        );
        this.statedata = statedata
        /** @type {HTMLElement[]} */ this.items
        this.pluralWidgetProperty(
            {
                selector: '*',
                parentSelector: '.container >.items',
                childType: 'html',
            },
            'items'
        );


        this.statedata.$0.addEventListener('items-change', this.draw)
        this.waitTillDOMAttached().then(() => {
            if (this.statedata.items.length > 0) {
                this.draw()
            }
        })


    }
    draw = new DelayedAction(() => {
        // This method populates the UI with important stuff
        /*
        The priority goes thus:
        1) Appointments of the current day
        2) Pending medications.
        3) Pending payments.
        4) Appointments upcoming in 3 days.
        5) Appointments upcoming in more than 3 days.
        */

        const appointmentsToday = []
        /** @type {ehealthi.health.timetable.TimetablePrescriptionMeta[]} */
        const pendingMedications = []
        const pendingPayments = []
        const appointmentsL3 = []
        const appointmentsG3 = []

        this.statedata.items.forEach(item => {
            if (item['@timetable-entry'].type == 'prescription' && !item.started) {
                pendingMedications.push(item)
            }
        });


        this.items = [
            ...pendingMedications.map(x => {
                const widget = new PendingMedicationView(x);

                const onStart = async () => {
                    try {
                        await widget.loadWhilePromise(hcRpc.health.prescription.start({ id: x.id }))
                        widget.destroy()
                        this.statedata.items.find(it => it.id == x.id).started = Date.now()
                        this.statedata.items = JSON.parse(JSON.stringify(this.statedata.$0data.items))
                        widget.removeEventListener('started', onStart)
                    } catch (e) {
                        handle(e)
                    }
                }
                widget.addEventListener('started', onStart)

                return widget.html
            })
        ]




    }, 250, 1000)

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-app-health-alerts']
    }
}