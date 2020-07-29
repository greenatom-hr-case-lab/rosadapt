import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext"
import {NavLink} from "react-router-dom";
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import {roleRus} from "../../functions/roleRus";



export const HrShowPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [users, setUsers] = useState([])
    const [plans, setPlans] = useState([])
    const [activatedUsers, setActivatedUsers] = useState([])
    const [nonActivatedUsers, setNonActivatedUsers] = useState([])

    useEffect(() =>{
        message(error)
        clearError()
        getListOfHeads()
        getPlanOf()
        window.M.updateTextFields()

    }, [error, message, clearError])

    const toggleClass = (element, className) => {
        if (element.classList.contains(className)){
            element.classList.remove(className)
        } else {
            element.classList.add(className)
        }
    }

    const clickUserCard = (event) =>{
        if (event.target.tagName !== 'BUTTON'){
            toggleClass(event.target.children[1], "d-none")
            toggleClass(event.target.parentElement.parentElement.children[1], "d-none")
        }
    }

    const filterUsers = (allUsers, act, role, sub) => {
        let arrNeed = []
        allUsers.forEach(function(user) {
            if (user.activated === act) {
                if (user.role === role){
                    if (sub === 'own'){
                        if (user.hrLink === auth.userId){
                            arrNeed.push(user)
                        }
                    } else {
                        arrNeed.push(user)
                    }
                }
                if (role === 'all'){
                    if (sub === 'own'){
                        if (user.hrLink === auth.userId){
                            arrNeed.push(user)
                        }
                    } else {
                        arrNeed.push(user)
                    }
                }
            }
        })
        return arrNeed
    }

    const getListOfHeads = async () => {
        try {
            const data = await request('/api/list/listUsers', 'POST', [], {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            setActivatedUsers(filterUsers(data.users, false, 'all', 'all'))
            setNonActivatedUsers(filterUsers(data.users,false, 'all', 'own'))
            setUsers(filterUsers(data.users, false, 'tyro', 'own'))
        } catch (e) {}
    }

    const getPlanOf = async () => {
        try {
            const data = await request('/api/list/planUser', 'POST', [], {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            setPlans(data.plans)
        } catch (e) {}
    }

    const purpleSwitch = (event) => {
        if (!event.target.classList.contains('btnPurpleOpened')){
            document.getElementsByClassName('btnPurpleOpened')[0].classList.remove('btnPurpleOpened')
            event.target.classList.add('btnPurpleOpened')
        }

        switch (event.target.innerHTML) {
            case 'Мои стажёры':
                setUsers(filterUsers(activatedUsers, false, 'tyro', 'own'))
                break
            case 'Все стажёры':
                setUsers(filterUsers(activatedUsers, false, 'tyro', 'all'))
                break
            case 'Все пользователи':
                setUsers(filterUsers(activatedUsers, false, 'all', 'all'))
                break
            default:break
        }
    }

    return(
        <main className="container">
            <div className="flexCon">
                <div className="flexItem">
                    <NavLink to="/main">
                        <button className="btnBlue">Назад</button>
                    </NavLink>
                </div>

                <div className="flexItem">
                        <h2>Сотрудники</h2>
                </div>

                <div className="flexItem invisible">
                    <NavLink to="/main">
                        <button className="btnBlue">заглушка</button>
                    </NavLink>
                </div>
            </div>

            <div className="row listOfNotActivated">
                <h1  className="offset-2">Не активированные пользователи</h1>
                { nonActivatedUsers.map((user, index) => {
                    return (
                        <div className="offset-2 col-10 userCardBlock" key={user._id}>
                            <div className="row">
                                <div className="col-10">
                                    <div className="userCard" onClick={ clickUserCard }>
                                        <div className="userCardHead">
                                            <div className="row">
                                                <h2 className="col-8">{user.name.lastName + ' ' + user.name.firstName + ' ' + user.name.middleName}</h2>
                                                <h2 className="col-2 text-center">{roleRus(user.role)}</h2>
                                                <h2 className="col-2 text-right">{user.login}</h2>
                                            </div>
                                        </div>
                                        <div className="userCardBody d-none">
                                            <div className="row">
                                                <div className="col-8">
                                                    <h2>{user.dept}</h2>
                                                    <h2>{user.pos}</h2>
                                                </div>
                                                <div className="col-2 text-center"> </div>
                                                <div className="col-2 text-right">••••••••••</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 text-center d-none">
                                    <button className="btnBlue">Изменить</button>
                                    <button className="btnRed">Удалить</button>
                                </div>
                            </div>
                        </div>
                    )
                }) }
            </div>

            <div className="row listOfActivated">
                <div className="offset-2 col-10 buttonSwitch"><div className="row"><div className="col-10">
                    <button onClick={ purpleSwitch } className="btnPurple btnPurpleOpened">Мои стажёры</button>
                    <button onClick={ purpleSwitch } className="btnPurple">Все стажёры</button>
                    <button onClick={ purpleSwitch } className="btnPurple">Все пользователи</button>
                </div></div></div>
                { users.map((user, index) => {
                    let plan = plans.find(plan => plan.tyroLink === user._id);
                    return (
                        <div className="offset-2 col-10 userCardBlock" key={user._id}>
                            <div className="row">
                                <div className="col-10">
                                    <div className="userCard" onClick={ clickUserCard }>
                                        <div className="userCardHead">
                                            <div className="row">
                                                <h2 className="col-8">{user.name.lastName + ' ' + user.name.firstName + ' ' + user.name.middleName}</h2>
                                                <h2 className="col-2 text-center">{roleRus(user.role)}</h2>
                                                <h2 className="col-2 text-right">{user.login}</h2>
                                            </div>
                                        </div>
                                        <div className="userCardBody d-none">
                                            <div className="row">
                                                <div className="col-8">
                                                    <h2>{user.dept}</h2>
                                                    <h2>{user.pos}</h2>
                                                    <button className="btnBlue">Открыть план адаптации</button>
                                                </div>
                                                <div className="col-2 text-center">25.08 – 25.10{!!plan && plan.date.dateStart.getMonth() + " - " + plan.date.dateEnd.getMonth()}</div>
                                                <div className="col-2 text-right">36%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 text-center d-none">
                                    <button className="btnBlue">Изменить</button>
                                    <button className="btnRed">Удалить</button>
                                </div>
                            </div>
                        </div>
                    )
                }) }
            </div>
        </main>
    )
}