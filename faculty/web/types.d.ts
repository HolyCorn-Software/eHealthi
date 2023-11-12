/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This module contains type definitions especially useful to the Web Faculty
 */


import ''

global {
    namespace faculty {
        interface faculties {
            web: {
                remote: {
                    public: {}
                    internal: {}
                }
            }
        }
    }
    namespace modernuser.profile {
        interface UserProfileMeta {
            birthDate: number
            sex: "M" | "F"
        }
    }
}