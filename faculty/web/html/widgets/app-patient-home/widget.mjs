/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget (app-patient-home), provides the interface (in a high-level way) for a patient to interact with app.
 */

import AppChatView from "../app-chat-view/widget.mjs";
import MyProfile from "../app-my-profile/widget.mjs";
import PatientHealth from "../app-patient-health/widget.mjs";
import DeviceFrame from "../device-frame/widget.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import BackForth from "/$/system/static/html-hc/widgets/back-forth/widget.mjs";


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
                        id: 'health',
                        label: 'Health',
                        content: new BackForth({ view: new PatientHealth().html }).html,
                        icon: 'doctor-love.png'
                    },
                    {
                        id: 'chat',
                        label: 'Chat',
                        content: new AppChatView().html,
                        icon: 'message.svg'
                    },
                    {
                        id: 'me',
                        label: 'Me',
                        content: new MyProfile().html,
                        icon: 'user.png'
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