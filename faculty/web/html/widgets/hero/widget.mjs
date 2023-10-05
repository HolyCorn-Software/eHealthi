/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project.
 * This widget (hero), serves as a giant introduction to the website, featuring an image, and some actions.
 */


import FilledButton from "/$/shared/static/widgets/filled-button/widget.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";



/**
 * @extends Widget<Hero>
 */
export default class Hero extends Widget {

    constructor() {
        super()
        super.html = hc.spawn(
            {
                classes: Hero.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'>
                            <div class='text'>
                                <div class='title'>Health, from Home.</div>
                                <div class='caption'>Providing accessible and affordable primary healthcare services to communities around Africa.</div>
                            </div>
                            <div class='action'></div>
                        </div>
                    </div>
                `
            }
        );

        this.html.$('.container >.main >.action').appendChild(
            new FilledButton({
                content: `Contact Us`
            }).html
        )


    }

    /**
     * @readonly
     * @returns {string[]}
     */
    static get classList() {
        return ['hc-ehealthi-hero']
    }

}
