/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget (app-health-alerts), shows the most important activities, such as upcoming appointments, and medications to be taken.
 */

import PendingMedicationView from "./item/pending-medication/widget.mjs";
import PrescriptionView from "./item/prescription/prescription.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import AlarmObject from "/$/system/static/html-hc/lib/alarm/alarm.mjs";
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
        /** @type  {ehealthi.ui.app.app_patient_health.Statedata}*/
        this.statedata = new AlarmObject() // TODO: Deal with this issue
        this.statedata.items ||= []

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
        });

        this.blockWithAction(async () => {
            this.statedata.items = []

            for await (const item of await hcRpc.health.timetable.getRecentEntries({
                types: ['prescription'],
                start: new Date().setHours(0, 0, 0, 0)
            })) {
                this.statedata.items.push(item)
            }
        })


    }
    draw = new DelayedAction(() => {
        // This method populates the UI with important stuff
        /*
        The priority goes thus:
        1) Pending medications.
        2) Pending payments.
        3) Medications that day.
        */

        /** @type {ehealthi.health.timetable.TimetablePrescriptionMeta[]} */
        const pendingMedications = []
        const pendingPayments = []

        /** @type {ehealthi.health.timetable.TimetablePrescriptionMeta[]} */
        const todaysMedications = []

        this.statedata.items.forEach(item => {
            if (item['@timetable-entry'].type == 'prescription') {
                if (!item.started) {
                    pendingMedications.push(item)
                } else {
                    if (
                        item.intake.some(
                            intake => (intake.start <= Date.now()) && (intake.end > Date.now())
                        )
                    ) {
                        todaysMedications.push(item)
                    }
                }
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
            }),
            ...todaysMedications.map(x => {
                return (x.intake || []).map(intake => {
                    return intake.dosage.map(dosage => {
                        intake.dosage[0]
                        return new PrescriptionView(x, dosage, dosage.time).html
                    })
                })
            }).flat(3)
        ]




    }, 250, 1000)

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-app-health-alerts']
    }
}