/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget (app-chat-view), allows a doctor, or patient to chat, and call other users.
 */

import Item from "./item.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import AlarmObject from "/$/system/static/html-hc/lib/alarm/alarm.mjs";
import DelayedAction from "/$/system/static/html-hc/lib/util/delayed-action/action.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


/**
 * @extends Widget<AppChatView>
 */
export default class AppChatView extends Widget {


    constructor() {

        super();

        this.html = hc.spawn(
            {
                classes: AppChatView.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='top'>
                            <div class='title'>Chats</div>
                            <div class='search'>
                                <input >
                            </div>
                        </div>

                        <div class='content'>
                        </div>
                        
                    </div>
                `
            }
        );

        /** @type {ehealthi.ui.app.app_chat_view.Statedata} */
        this.statedata = new AlarmObject()
        this.statedata.items = []

        /** @type {(this['statedata']['chats'][number])[]} */ this.items
        this.pluralWidgetProperty(
            {
                selector: ['', ...Item.classList].join('.'),
                parentSelector: '.container >.content',
                property: 'items',
                transforms: {
                    set: (input) => {
                        return new Item(input.$0data || input).html
                    },
                    get: (html) => {
                        return html?.widgetObject?.statedata?.$0data
                    }
                }
            }
        )

        const onchange = new DelayedAction(() => {
            this.items = this.statedata.$0data.chats
        }, 200, 1000)

        this.statedata.$0.addEventListener('chats-$array-items-change', onchange)
        this.statedata.$0.addEventListener('chats-change', onchange)

        this.waitTillDOMAttached().then(() => {
            this.statedata.chats = [...' '.repeat(5)].map(x => [
                {
                    label: `Tanko Fabiola`,
                    caption: `I went for consultation, and
                    the doctor said we have to
                    take long walks to get back.`,
                    id: 'tanko-0',
                    lastTime: Date.now() - 10 * 60 * 1000,
                    unreadCount: 2,
                    icon: '/$/shared/static/logo.png',
                    lastDirection: 'incoming'
                },
                {
                    label: `Awah Sandrine`,
                    caption: `I went for consultation, and
                    the doctor said we have to
                    take long walks to get back.`,
                    id: 'tanko-0',
                    lastTime: Date.now() - 30 * 60 * 1000 + (Math.random() * 60000),
                    unreadCount: 1,
                    icon: '/$/shared/static/logo.png',
                    lastDirection: 'outgoing'
                }
            ]).flat()
        });

        this.blockWithAction(async () => {
            this.statedata.chats = await hcRpc.chat.getMyChatsMetadata()
        })



    }

    /**
     * @readonly
     */
    static get classList() {
        return ['hc-ehealthi-app-chat-view']
    }

}