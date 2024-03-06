/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget (app-patient-home), provides the interface (in a high-level way) for a patient to interact with app.
 */

import AppChatView from "../app-chat-view/widget.mjs";
import PatientHealth from "../app-patient-health/widget.mjs";
import DeviceFrame from "../device-frame/widget.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


/**
 * @extends Widget<PatientHome>
 */
export default class PatientHome extends Widget {


    constructor() {
        super();

        this.html = hc.spawn(
            {
                classes: PatientHome.classList,
                innerHTML: `
                    <div class='container'>

                    </div>
                `
            }
        );

        this.blockWithAction(
            async () => {
                const frame = new DeviceFrame()
                frame.statedata.items = [
                    {
                        id: 'home',
                        label: 'Home',
                        content: new PatientHealth().html,
                        icon: '/$/shared/static/logo.png'
                    },
                    {
                        id: 'consult',
                        label: 'Consult',
                        content: hc.spawn({ innerHTML: `Coming soon` }),
                        icon: 'doctor-love.png',
                    },
                    {
                        id: 'chat',
                        label: 'Chats',
                        content: new AppChatView().html,
                        icon: 'message.svg'
                    },
                    {
                        id: 'lab',
                        label: 'Lab',
                        content: hc.spawn({ innerHTML: `Coming soon` }),
                        icon: 'labs.svg'
                    }
                ]



                this.html.appendChild(frame.html)
            }
        )
    }

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-app-patient-home']
    }
}