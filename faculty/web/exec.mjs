/*
Copyright 2021 HolyCorn Software
The HCTS Project
The web faculty
*/

import WebPublicMethods from "./remote/public.mjs"


export default async function init() {

    try {

        setTimeout(() => WebPublicMethods.init(), 2000)
        FacultyPlatform.get().remote.public = new WebPublicMethods()
        console.log(`${`${platform.descriptor.label}`.yellow} HTTP running`)
    } catch (e) {
        console.log(e)
    }
}
