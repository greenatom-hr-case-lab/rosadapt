import React, {useContext} from 'react'
import {AuthContext} from "../context/AuthContext"

export const ProfilePage = () => {
    const auth = useContext(AuthContext)

    const getNested = (obj, keys) => keys.reduce((p, c) => p && p.hasOwnProperty(c) ? p[c] : null, obj);

    getNested(auth.userData, ['name', 'firstName'])

    const firstName = getNested(auth.userData, ['name', 'firstName'])
    const middleName = getNested(auth.userData, ['name', 'middleName'])
    const lastName = getNested(auth.userData, ['name', 'lastName'])
    let roleRus = null
    switch (auth.userRole) {
        case 'hr':
            roleRus = 'Сотрудник кадровой службы'
            break
        case 'tyro':
            roleRus = 'Стажёр'
            break
        case 'head':
            roleRus = 'Руководитель'
            break
        default:
            roleRus = null
    }
    return(
        <div className='container'>
            <h1>{lastName} {firstName} {middleName}</h1>
            <h3>{roleRus}</h3>
            {}
            {/*<h1>{auth.userData.name.firstName}</h1>*/}
        </div>
    )
}