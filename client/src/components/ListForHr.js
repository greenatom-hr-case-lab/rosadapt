import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const ListForHr = () => {
    const {token} = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [users, setUsers] = useState([])
    useEffect(() =>{
        message(error)
        clearError()
    }, [error, message, clearError])

    function roleRus(role){
        switch (role) {
            case 'hr':
                return 'Сотрудник кадровой службы'
            case 'head':
                return 'Руководитель'
            default:
                return 'Стажёр'
        }
    }

    const showListHandler = useCallback(async (event) => {
        try {
            let data
            switch (event.target.id) {
                case 'showMyTyrosBtn':
                    data = await request('/api/list/listUsers', 'POST', {role: 'tyro', sub: 'own'}, {
                        Authorization: `Bearer ${token}`
                    })
                    setUsers(data.users)
                    break
                case 'showAllTyrosBtn':
                    data = await request('/api/list/listUsers', 'POST', {role: 'tyro', sub: 'all'}, {
                        Authorization: `Bearer ${token}`
                    })
                    setUsers(data.users)
                    break
                case 'showAllUsersBtn':
                    data = await request('/api/list/listUsers', 'POST', {role: 'all', sub: 'all'}, {
                        Authorization: `Bearer ${token}`
                    })
                    console.log(data)
                    setUsers(data.users)
                    break
                default:
                    message('в showlistHandler не определился event.target.id')
            }

        } catch (e) {}
    }, [token, request, message])

    return(
        <div className="listOfUsersForHr">
            <h1>это список всех пользователей</h1>
            <button
                className="btn btn-primary"
                id="showMyTyrosBtn"
                onClick = { showListHandler }
                disabled={ loading }
            >
                Мои стажёры
            </button>
            <button
                className="btn btn-primary"
                id="showAllTyrosBtn"
                onClick = { showListHandler }
                disabled={ loading }
            >
                Все стажёры
            </button>
            <button
                className="btn btn-primary"
                id="showAllUsersBtn"
                onClick = { showListHandler }
                disabled={ loading }
            >
                Все пользователи
            </button>
            <br/>
            <br/>
            {users.length !== 0 &&
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ФИО</th>
                        <th scope="col">Роль</th>
                        <th scope="col">Отчество</th>
                    </tr>
                </thead>
                <tbody>
                { users.map((user, index) => {
                    return (
                        <tr key={user._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.name.lastName + ' ' + user.name.firstName[0] + '. ' + user.name.middleName[0] + '.'}</td>
                            <td>{roleRus(user.role)}</td>
                            <td>@mdo</td>
                        </tr>
                    )
                }) }
                </tbody>
            </table>}
        </div>
    )
}