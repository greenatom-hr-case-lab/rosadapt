import React from "react";

export const roleRus = (userRole) => {
    switch (userRole) {
        case 'hr': return 'HR'
            break
        case 'tyro': return 'стажёр'
            break
        case 'head': return 'руководитель'
            break
        default:break
    }
}