import React, {useContext, useEffect, useState} from "react"
import {NavLink} from 'react-router-dom'
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"
import {roleRus} from "../../functions/roleRus"
import {toggleClass} from "../../functions/toggleClass"
import {statusOfPlanRus} from "../../functions/statusOfPlanRus"



export const HeadPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {request, error, clearError} = useHttp()
    const [users, setUsers] = useState([])
    const [plans, setPlans] = useState([])

    useEffect(() =>{
        const getListOfUsers = async () => {
            try {
                const data = await request('/api/list/listUsers', 'POST', [], {
                    Authorization: `Bearer ${auth.token}`
                })
                message(data.message)
                setUsers(filterUsers(data.users, true, 'tyro', 'all'))
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
        message(error)
        clearError()
        getListOfUsers()
        getPlans()
        window.M.updateTextFields()
    }, [error, message, clearError])

    const clickUserCard = (event) =>{
        if (event.target.tagName !== 'BUTTON'){
            toggleClass(event.target.children[1], "d-none")
            if (event.target.parentElement.parentElement.children[1]){
                toggleClass(event.target.parentElement.parentElement.children[1], "d-none")
            }
        }
    }

    const filterUsers = (allUsers, act, role, sub) => {
        let arrNeed = []
        allUsers.forEach(function(user) {
            if (user.activated === act){
                if (user.role === role){
                    if (sub === 'own'){
                        if (user[auth.userRole + 'Link'] === auth.userId){
                            arrNeed.push(user)
                        }
                    } else {
                        arrNeed.push(user)
                    }
                }
                if (role === 'all'){
                    if (sub === 'own'){
                        if (user[auth.userRole + 'Link'] === auth.userId){
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

    return(
        <main className="container head">
            <div className="row listOfActivated">
                <h1  className="offset-2">Ваши стажёры</h1>
                { users.map((user, index) => {
                    let plan = plans.find(plan => plan.tyroLink === user._id)
                    const classNameForUserCard = () => {
                        if (plan.level === 2) return "userCard bgOrange"
                        if (plan.level === 4) return "userCard bgGreen"
                        return "userCard"
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

                    return (<div key={index}>
                        {!!plan && <div className="offset-2 col-10 userCardBlock">
                            <div className="row">
                                <div className="col-10">
                                    <div className={ classNameForUserCard() } onClick={ clickUserCard }>
                                        <div className="userCardHead">
                                            <div className="row">
                                                <h2 className="col-8">{user.name.lastName + ' ' + user.name.firstName + ' ' + user.name.middleName}</h2>
                                                <h2 className="col-2 text-center">{roleRus(user.role)}</h2>
                                                <h2 className="col-2 text-right text-black-50">{user.login}</h2>
                                            </div>
                                        </div>
                                        <div className="userCardBody d-none">
                                            <div className="row">
                                                <div className="col-8">
                                                    <h2>{user.dept}</h2>
                                                    <h2>{user.pos}</h2>
                                                    {(plan.level === 1 || plan.level === 3 || plan.level === 5) &&
                                                        <NavLink to={ `/plan/${plan._id}` }>
                                                            <button className="btnBlue">Открыть план адаптации</button>
                                                        </NavLink>
                                                    }
                                                    {plan.level === 2 &&
                                                        <NavLink to={ `/plan/${plan._id}` }>
                                                            <button className="btnOrange">Проверить план адаптации</button>
                                                        </NavLink>
                                                    }
                                                    {plan.level === 4 &&
                                                        <NavLink to={ `/plan/${plan._id}` }>
                                                            <button className="btnGreen">Выставить оценку</button>
                                                        </NavLink>
                                                    }
                                                </div>
                                                <div className="col-2 text-center">
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
                            </div>
                        </div>}
                    </div>)
                }) }
            </div>
        </main>
    )
}