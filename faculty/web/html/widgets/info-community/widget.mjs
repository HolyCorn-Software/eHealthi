/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project.
 * This widget (info-community), presents the user with the opportunity to join the organization's social media community
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";


/**
 * @extends Widget<InfoCommunity>
 */
export default class InfoCommunity extends Widget {

    constructor() {
        super();
        this.html = hc.spawn(
            {
                classes: InfoCommunity.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='bg-doodle'></div>
                        <div class='content'>
                            <div class='text'>
                                <div class='title'>Gain <highlight>FREE</highlight> Health Tips</div>
                                <div class='caption'>by joining our community</div>
                            </div>
                            <div class='action'></div>
                        </div>
                    </div>
                `
            }
        );

        /** @type {ActionButton} */ this.action
        this.widgetProperty(
            {
                selector: ['', ...ActionButton.classList].join('.'),
                parentSelector: '.container >.content >.action',
                property: 'action',
                childType: 'widget'
            }
        );

        this.action = new ActionButton(
            {
                content: `Join WhatsApp Community`,
                hoverAnimate: false
            }
        )

    }

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-info-community']
    }

}