import React, {useContext, useEffect, useState} from "react";
import {NavLink, useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import logoOfPageSVG from "../../img/addPlan.svg";

export const CreatePlanPage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [allActivatedTyros, setActivatedUsers] = useState([])
    const [allActivatedHeads, setActivatedHeads] = useState([])
    const tyroIdURL = useParams().id

    const dateNow = () => {
        const date = new Date()
        let yyyy = date.getFullYear()
        let mm = date.getMonth() + 1
        let dd = date.getDate()
        if(mm<10) { mm = '0' + mm }
        if(dd<10) { dd = '0' + dd }
        return yyyy+'-'+mm+'-'+dd
    }
    const datePlus = (yourDate, monthNumber) => {
        const date = new Date(yourDate)
        date.setMonth(date.getMonth() + monthNumber)
        let yyyy = date.getFullYear()
        let mm = date.getMonth() + 1
        let dd = date.getDate()
        if(mm<10) { mm = '0' + mm }
        if(dd<10) { dd = '0' + dd }
        return yyyy+'-'+mm+'-'+dd
    }

    const [form,  setForm]  = useState({
        probationStart: dateNow(), probationEnd: datePlus(dateNow(), 3)
    })

    useEffect(() =>{
        message(error)
        clearError()
        getListOfUsers()
        if (tyroIdURL) setForm({...form, tyroLink: tyroIdURL})
        window.M.updateTextFields()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const createHandler = async () => {
        try {
            const data = await request('/api/create/plan', 'POST', {...form}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push('/main')
        } catch (e) {}
    }

    const getListOfUsers = async () => {
        try {
            const data = await request('/api/list/listUsers', 'POST', [], {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            setActivatedUsers(filterUsers(data.users, true, 'tyro', 'all'))
            setActivatedHeads(filterUsers(data.users, true, 'head', 'all'))
        } catch (e) {}
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

    return(
        <main className="container">
            <img className="logoOfPage" src={ logoOfPageSVG } alt="лого страницы"/>

            <div className="flexCon">

                <div className="flexItem">
                    {tyroIdURL &&
                        <NavLink to="/showList">
                            <button className="btnBlue">Назад</button>
                        </NavLink>
                    }
                    {!tyroIdURL &&
                        <NavLink to="/main">
                            <button className="btnBlue">Назад</button>
                        </NavLink>
                    }
                </div>

                <div className="flexItem">
                    <form action="">
                        <h2>Новый план адаптации</h2>
                        <br/>

                        <div className="input-group mb-3">
                            {tyroIdURL &&
                                <select className="custom-select" style={{appearance: "none", WebkitAppearance: "none", pointerEvents: "none"}}
                                        id="tyroLink"
                                        name="tyroLink"
                                        onChange = { changeHandler }>
                                    { allActivatedTyros.map((user, index) => {
                                        if (user._id === tyroIdURL){
                                            return (
                                                <option key={user._id} defaultValue={user._id}>{user.name.lastName + ' ' + user.name.firstName + ' ' + user.name.middleName}</option>
                                            )
                                        }
                                    }) }
                                </select>
                            }
                            {!tyroIdURL &&
                                <select className="custom-select"
                                        id="tyroLink"
                                        name="tyroLink"
                                        onChange = { changeHandler }>

                                    <option defaultValue="none"> </option>
                                    { allActivatedTyros.map((user, index) => {
                                        if (user.planLink === null){
                                            return (
                                                <option key={user._id} value={user._id}>{user.name.lastName + ' ' + user.name.firstName + ' ' + user.name.middleName}</option>
                                            )
                                        }
                                    }) }
                                </select>
                            }
                            <div className="input-group-append">
                                <label htmlFor="tyroLink" className="input-group-text">Стажёр</label>
                            </div>
                        </div>

                        <div className="input-group mb-3">
                            <select className="custom-select"
                                    id="headLink"
                                    name="headLink"
                                    onChange = { changeHandler }>

                                <option defaultValue="none"> </option>
                                { allActivatedHeads.map((user, index) => {
                                    return (
                                        <option key={user._id} value={user._id}>{user.name.lastName + ' ' + user.name.firstName + ' ' + user.name.middleName}</option>
                                    )
                                }) }
                            </select>
                            <div className="input-group-append">
                                <label htmlFor="headLink" className="input-group-text">Руководитель</label>
                            </div>
                        </div>

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <label htmlFor="probationStart" className="input-group-text">с</label>
                            </div>
                            <input type="date" id="probationStart" name="probationStart" className="form-control"
                                   max="2099-12-12"
                                   defaultValue={ dateNow() }
                                   onChange = { changeHandler }
                            />
                            <div className="input-group-prepend">
                                <label htmlFor="probationEnd" className="input-group-text">по</label>
                            </div>
                            <input type="date" id="probationEnd" name="probationEnd" className="form-control"
                                   max="2099-12-12"
                                   placeholder="дата окончания"
                                   defaultValue={ datePlus(dateNow(), 3) }
                                   onChange = { changeHandler }
                            />
                        </div>
                    </form>
                </div>

                <div className="flexItem">
                    <button
                        className="btnGreen" type="submit"
                        onClick = { createHandler }
                        disabled={ loading }
                    >
                        Создать
                    </button>
                </div>

            </div>
        </main>
    )
}