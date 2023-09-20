/**
 * Copyright 2023 HolyCorn Software
 * DeInstantWay Project
 * This script controls the home page
 */

import DIWNavbar from "/$/shared/static/widgets/navbar/widget.mjs";
import Footer from "/$/shared/static/widgets/footer/widget.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";

const navbar = new DIWNavbar()

const footer = new Footer()

document.body.prepend(navbar.html)
document.body.appendChild(footer.html)

hc.importModuleCSS(import.meta.url);