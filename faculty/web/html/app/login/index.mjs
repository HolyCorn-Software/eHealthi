/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Platform
 * This script runs on the custom login page of the platform
 */

import eHealthiLoginWidget from "../../widgets/login-widget/widget.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


const widget = new eHealthiLoginWidget()

document.body.querySelector('.login').appendChild(widget.html)

hc.importModuleCSS(import.meta.url);