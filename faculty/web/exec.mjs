/*
Copyright 2021 HolyCorn Software
The HCTS Project
The web faculty
*/


export default async function init() {

    try {

        console.log(`${`${platform.descriptor.label}`.yellow} HTTP running`)
    } catch (e) {
        console.log(e)
    }
}
