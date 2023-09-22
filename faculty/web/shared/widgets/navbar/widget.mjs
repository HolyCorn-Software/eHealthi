/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget, is the navigation bar.
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";



/**
 * @extends Widget<Navbar>
 */
export default class Navbar extends Widget {


    constructor() {
        super();

        super.html = hc.spawn(
            {
                classes: Navbar.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'>
                            <div class='logo-section'>
                                <img src='/$/shared/static/logo.png'>
                                <div class='label'>eHealthi</div>
                            </div>
                            <div class='trigger'></div>
                            <div class='content'></div>
                        </div>
                    </div>
                `
            }
        );

        const data = Symbol()

        /** @type {ehealthi.ui.navbar.Item[]} */ this.items
        this.pluralWidgetProperty(
            {
                selector: '.item',
                parentSelector: '.container >.main >.trigger',
                property: 'items',
                transforms: {
                    set: (input) => {
                        const html = hc.spawn({
                            classes: ['item'],
                            innerHTML: `
                                <div class='label'>${input.label}</div>
                            `
                        });

                        html[data] = input
                        return html
                    },
                    get: html => html[data]
                }
            }
        );

        this.items = [
            {
                label: `Home`
            },
            {
                label: `Contact Us`
            },
            {
                label: `Our Services`
            }
        ]
    }

    /**
     * @readonly
     */
    static get classList() {
        return ['hc-ehealthi-navbar']
    }

}
