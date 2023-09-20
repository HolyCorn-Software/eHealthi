/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Platform
 * This widget is the login widget for the eHealthi platform; customized to suit
 * the design needs
 */

import Onboarding from "./onboarding.mjs";
import LoginWidget from "/$/modernuser/static/widgets/login-widget/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import { SlideContainer } from "/$/system/static/html-hc/widgets/slide-container/container.mjs";



/**
 * @extends Widget<eHealthiLoginWidget>
 */
export default class eHealthiLoginWidget extends Widget {

    constructor() {
        super();

        super.html = hc.spawn(
            {
                classes: eHealthiLoginWidget.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'>
                            <div class='slider'></div>
                        </div>
                    </div>
                `
            }
        );

        this.widgetProperty(
            {
                selector: ['', ...SlideContainer.classList].join('.'),
                parentSelector: '.container >.main >.slider',
                property: 'slider',
                childType: 'widget',
            }
        );
        this.slider = new SlideContainer()


        /** @type {LoginWidget} */ this.main
        Reflect.defineProperty(this, 'main', {
            get: () => this.slider.screens[0]?.widgetObject,
            set: v => this.slider.screens = [v.html, ...this.slider.screens.filter(x => x !== v.html)],
            configurable: true,
            enumerable: true
        });

        /** @type {Onboarding} */ this.onboarding
        Reflect.defineProperty(this, 'onboarding', {
            get: () => this.slider.screens[1]?.widgetObject,
            set: v => this.slider.screens = [...this.slider.screens.filter((x, i) => (x !== v.html)), v.html],
            configurable: true,
            enumerable: true
        })

        this.main = new LoginWidget({ custom: { help: false, navigation: false } })
        this.onboarding = new Onboarding()

        this.main.onAction = async (widget, action, data) => {
            
            // First things first... Actually allow the natural process to flow
            await LoginWidget.prototype.onAction.call(this.main, widget, action, data)

            if (action !== 'signup') { // If the user is not signing up, then we have no futher business
                return
            }


            // Now, if the user just signed up, let's give him the ability to onboard
            this.slider.index = 1

            this.onboarding.addEventListener('complete', () => {
                // And then, when the user has completely set up his account
                // we let him sign up again.
                this.slider.index = 0
            }, { once: true })
        }


    }
    static get classList() {
        return ['hc-ehealthi-login-widget']
    }


}

