import React, {useContext} from 'react'
import {AuthContext} from "../context/AuthContext"
import {ListForHr} from "../components/ListForHr"
import {ListForHead} from "../components/ListForHead"

export const ProfilePage = () => {
    const auth = useContext(AuthContext)

    const getNested = (obj, keys) => keys.reduce((p, c) => p && p.hasOwnProperty(c) ? p[c] : null, obj);

    const firstName = getNested(auth.userData, ['name', 'firstName'])
    const middleName = getNested(auth.userData, ['name', 'middleName'])
    const lastName = getNested(auth.userData, ['name', 'lastName'])
    const pos = getNested(auth.userData, ['pos'])
    const dept = getNested(auth.userData, ['dept'])

    switch (auth.userRole) {
        case 'hr':
            return(
                <div className='container'>
                    <h1>{lastName} {firstName} {middleName}</h1>
                    <h3>Роль: сотрудник кадровой службы</h3>
                    <br/>
                    <h4>{dept}</h4>
                    <h4>{pos}</h4>
                    <br/>
                    <ListForHr />
                </div>
            )
        case 'head':
            return(
                <div className='container'>
                    <h1>{lastName} {firstName} {middleName}</h1>
                    <h3>Роль: руководитель</h3>
                    <br/>
                    <h4>{dept}</h4>
                    <h4>{pos}</h4>
                    <br/>
                    <ListForHead />
                </div>
            )
        default:
            return(
                <div className='container'>
                    <h1>{lastName} {firstName} {middleName}</h1>
                    <h3>Роль: стажёр</h3>
                    <br/>
                    <h4>{dept}</h4>
                    <h4>{pos}</h4>
                </div>
            )
    }




}