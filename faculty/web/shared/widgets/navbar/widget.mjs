/**
 * Copyright 2023 HolyCorn Software
 * DeInstantWay 
 * 
 * This widget is the navigation bar of the website
 */

import { hc, Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class DIWNavbar extends Widget{


    constructor(){

        super()


        this.html = hc.spawn(
            {
                classes: ['hc-diw-navbar'],
                innerHTML:`
                    <div class='container'>
                        <div class='main'>
                            <div class='left'>
                                <div class='logo'>
                                    <img src='/$/shared/static/logo.png'>
                                </div>
                            </div>
                            <div class='middle'></div>
                            <div class='right'>
                                <div class='links'>
                                    <a href='#'>Sell Crypto</a>
                                    <a href='#'>Contact</a>
                                    <a href='#'>About</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        );




        
    }
    
}