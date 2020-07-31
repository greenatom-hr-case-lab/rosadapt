import React, {useContext, useEffect, useState} from "react"
import {AuthContext} from "../../context/AuthContext"
import {NavLink, useHistory} from "react-router-dom"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"
import {roleRus} from "../../functions/roleRus"
import {toggleClass} from "../../functions/toggleClass"
import {statusOfPlanRus} from "../../functions/statusOfPlanRus"
import logoOfPageSVG from "../../img/showList.svg"


export const HrShowPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const history = useHistory()
    const {request, error, clearError} = useHttp()
    const [users, setUsers] = useState([])
    const [plans, setPlans] = useState([])
    const [activatedUsers, setActivatedUsers] = useState([])
    const [nonActivatedUsers, setNonActivatedUsers] = useState([])

    useEffect(() =>{
        message(error)
        clearError()
        getListOfUsers()
        getPlans()
        window.M.updateTextFields()

    }, [error, message, clearError])

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

    const getListOfUsers = async () => {
        try {
            const data = await request('/api/list/listUsers', 'POST', [], {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            setActivatedUsers(filterUsers(data.users, true, 'all', 'all'))
            setNonActivatedUsers(filterUsers(data.users,false, 'all', 'own'))
            setUsers(filterUsers(data.users, true, 'tyro', 'own'))
        } catch (e) {}
    }
    const getPlans = async () => {
        try {
            const data = await request('/api/list/plans', 'POST', [], {
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
                setUsers(filterUsers(activatedUsers, true, 'tyro', 'own'))
                break
            case 'Все стажёры':
                setUsers(filterUsers(activatedUsers, true, 'tyro', 'all'))
                break
            case 'Все пользователи':
                setUsers(filterUsers(activatedUsers, true, 'all', 'all'))
                break
            default:break
        }
    }

    return(
        <main className="container">
            <img className="logoOfPage" src={ logoOfPageSVG } alt="лого страницы"/>
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
                    let plan = plans.find(plan => plan._id === user.planLink)
                    let head
                    if (!!plan) head = activatedUsers.find((item) => item._id === plan.headLink)
                    const classNameForUserCard = () => {
                        if (!!plan || user.role !== "tyro") return "userCard"
                        return "userCard bgOrange"
                    }

                    const datePeriodFormat = () => {
                        const dateStart = new Date(plan.date.dateStart)
                        const dateEnd   = new Date(plan.date.dateEnd)
                        let arr = [dateStart.getDate(), dateStart.getMonth()+1,dateEnd.getDate(),dateEnd.getMonth()+1]
                        arr.forEach(function(item,i) {
                            if (item < 10){
                                arr[i] = '0' + item
                            }
                        })
                        return arr[0] + '.' + arr[1] + ' – ' + arr[2] + '.' + arr[3]
                    }

                    return (
                        <div className="offset-2 col-10 userCardBlock" key={user._id}>
                            <div className="row">
                                <div className="col-10">
                                    <div className={ classNameForUserCard() } onClick={ clickUserCard }>
                                        <div className="userCardHead">
                                            <div className="row">
                                                <h2 className="col-7">{user.name.lastName + ' ' + user.name.firstName + ' ' + user.name.middleName}</h2>
                                                <h2 className="col-3 text-center">{roleRus(user.role)}</h2>
                                                <h2 className="col-2 text-right text-black-50">{user.login}</h2>
                                            </div>
                                        </div>
                                        <div className="userCardBody d-none">
                                            <div className="row">
                                                <div className="col-7">
                                                    <h2>{user.dept}</h2>
                                                    <h2>{user.pos}</h2>
                                                    {!!plan && user.role === "tyro" &&
                                                    <>
                                                        <h2>Руководитель {head.name.lastName + ' ' + head.name.firstName + ' ' + head.name.middleName}</h2>
                                                        <NavLink to={ `/plan/${plan._id}` }>
                                                            <button className="btnBlue">Открыть план адаптации</button>
                                                        </NavLink>
                                                    </>
                                                    }
                                                    {!plan && user.role === "tyro" &&
                                                    <NavLink to={ `/createPlan/${user._id}` }>
                                                        <button className="btnOrange">Создать план адаптации</button>

                                                    </NavLink>
                                                    }
                                                </div>
                                                <div className="col-3 text-center">
                                                    {!!plan && user.role === "tyro" &&
                                                    <>
                                                        <h2>{ datePeriodFormat() }</h2>
                                                        <h2>{ statusOfPlanRus(plan) }</h2>
                                                    </>
                                                    }

                                                </div>
                                                <div className="col-2 text-right">
                                                    <h2>{ /*percentOfPlan(plan)*/ }</h2>
                                                </div>
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