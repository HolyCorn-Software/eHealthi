/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This module contains type definitions especially useful to the Web Faculty
 */


import ''
import WebPublicMethods from "./remote/public.mjs"

global {
    namespace faculty {
        interface faculties {
            web: {
                remote: {
                    public: WebPublicMethods
                    internal: {}
                }
            }
        }
    }
}