/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget (item), represents a single item on the target-diseases widget
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


/**
 * @extends Widget<Item>
 */
export default class Item extends Widget {


    /**
     * 
     * @param {ehealthi.ui.target_diseases.TargetDisease} data 
     */
    constructor(data) {
        super()

        this.html = hc.spawn(
            {
                classes: Item.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='image'></div>
                        <div class='label'></div>
                    </div>
                `
            }
        );

        /** @type {string} */ this.image
        this.defineImageProperty({ selector: '.container >.image', property: 'image', mode: 'inline' })
        /** @type {string} */ this.label
        this.htmlProperty('.container >.label', 'label', 'innerHTML')

        Object.assign(this, data)

        this.image ||= '/$/shared/static/logo.png'

    }

    /** @readonly */
    static get classList() {
        return ['hc-ehealthi-target-diseases-item']
    }
}