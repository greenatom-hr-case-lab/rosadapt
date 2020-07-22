import React, {useContext} from 'react'
import {AuthContext} from "../context/AuthContext"

export const ProfilePage = () => {
    const auth = useContext(AuthContext)

    const getNested = (obj, keys) => keys.reduce((p, c) => p && p.hasOwnProperty(c) ? p[c] : null, obj);

    getNested(auth.userData, ['name', 'firstName'])

    const firstName = getNested(auth.userData, ['name', 'firstName'])
    const middleName = getNested(auth.userData, ['name', 'middleName'])
    const lastName = getNested(auth.userData, ['name', 'lastName'])
    const pos = getNested(auth.userData, ['pos'])
    const dept = getNested(auth.userData, ['dept'])
    let roleRus = null
    switch (auth.userRole) {
        case 'hr':
            roleRus = 'Сотрудник кадровой службы'
            break
        case 'head':
            roleRus = 'Руководитель'
            break
        default:
            roleRus = 'Стажёр'
    }



    return(
        <div className='container'>
            <h1>{lastName} {firstName} {middleName}</h1>
            <h3>Роль: {roleRus.toLowerCase()}</h3>
            <br/>
            <h4>{dept}</h4>
            <h4>{pos}</h4>
        </div>
    )
}