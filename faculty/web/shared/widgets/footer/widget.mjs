/**
 * Copyright 2022 HolyCorn Software
 * The Donor Forms Project
 * This widget is the footer
 * Ported to the DeInstantWay Project
 */

import FooterSection from "./section.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import { Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";



export default class Footer extends Widget {

    constructor() {
        super();

        this.html = hc.spawn({
            classes: ['hc-donorforms-footer'],
            innerHTML: `
                <div class='container'>
                    <div class='main'>
                        <div class='logo-section'>
                            <img src='/$/shared/static/logo-minimal.png'>
                            <div class='copyright'>&copy; 2023</div>
                        </div>

                        <div class='data-section'>
                        
                        </div>
                        
                    </div>

                    <div class='author-info'>Carefully Engineered by <a href='mailto:holycornsoftware@gmail.com'>HolyCorn Software</a></div>
                    
                </div>
            `
        });

        /** @type {[import("./types.js").FooterSectionData]} */ this.data
        this.pluralWidgetProperty({
            selector: '.hc-donorforms-footer-section',
            parentSelector: '.container >.main >.data-section',
            property: 'data',
            transforms: {
                /**
                 * 
                 * @param {import("./types.js").FooterSectionData} data 
                 */
                set: (data) => {
                    return new FooterSection(data).html
                },
                get: (html) => {
                    let widget = html?.widgetObject
                    return {
                        title: widget.title,
                        links: widget.links
                    }
                }
            }
        });


        this.data = [


            {
                title: `Contact`,
                links: [
                    {
                        label: `holycornsoftware@gmail.com`,
                        href: `#`
                    },
                    {
                        label: `237 677683958`,
                        href: `tel:237677683958`
                    },
                    {
                        label: `Mile 3, Nkwen Bamenda`,
                        href: '#'
                    }
                ]
            },

            {
                title: `Social Media`,
                links: [

                    {
                        label: `Facebook`,
                        href: `#`
                    }

                    ,

                    {
                        label: `Instagram`,
                        href: `#`
                    },


                    {
                        label: `Twitter`,
                        href: `#`
                    },
                ]
            },

        ]

    }

    static get classList(){
        return ['hc-donorforms-footer']
    }

}