import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from "../hooks/message.hook"
import {AuthContext} from "../context/AuthContext"

export const CreatePage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [users, setUsers] = useState([])
    const dateNow = () => {
        const date = new Date()
        let yyyy = date.getFullYear()
        let mm = date.getMonth() + 1
        let dd = date.getDate()
        if(mm<10) { mm = '0' + mm }
        if(dd<10) { dd = '0' + dd }
        return yyyy+'-'+mm+'-'+dd
        //D.setMonth(D.getMonth() + 3);
    }
    const dateITM = (el) => {
        const date = new Date(el)
        date.setMonth(date.getMonth() + 3)
        let yyyy = date.getFullYear()
        let mm = date.getMonth() + 1
        let dd = date.getDate()
        if(mm<10) { mm = '0' + mm }
        if(dd<10) { dd = '0' + dd }
        return yyyy+'-'+mm+'-'+dd
    }

    const [form, setForm] = useState({
        firstName: '', middleName: '', lastName: '', role: 'tyro', dept: '', pos: '', headId: '', probationStart: dateNow(), probationEnd: dateITM(dateNow())
    })

    useEffect(() =>{
        message(error)
        clearError()
        getListOfHeads()
        window.M.updateTextFields()

    }, [error, message, clearError])

    const changeHandler = event => {
        if (event.target.name === 'role') {
            if (event.target.value === 'tyro'){
                document.getElementById('tyroBlock').style.display = 'block'
            }else {
                document.getElementById('tyroBlock').style.display = 'none'
            }
        }
        if (event.target.name === 'probationStart'){
            document.getElementById('probationEnd').value = dateITM(event.target.value)
            form.probationEnd = dateITM(event.target.value)
        }
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            console.log({...form})
            // const data = await request('/api/auth/register', 'POST', {...form}, {
            //     Authorization: `Bearer ${auth.token}`
            // })
            message('лог в консоли, реквест заковычен')
        } catch (e) {}
    }

    const getListOfHeads = async () => {
        try {
            const data = await request('/api/list/listUsers', 'POST', {role: 'head', sub: 'all'}, {
                Authorization: `Bearer ${auth.token}`
            })
            setUsers(data.users)
        } catch (e) {}
    }

    return(
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <br/>
                <br/>
                <br/>
                <h1 className="text-center">Добавление новых сотрудников</h1>
                <br/>
                <br/>
                <div className="card">
                    <form className="card-body">
                        <h5 className="card-title">Создайте новый профиль в системе РосАдапт</h5>
                        <p className="card-text">Введите поля логина и пароля</p>
                        <br/>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="role">Роль</label>
                            </div>
                            <select className="custom-select"
                                    id="role" 
                                    name="role" 
                                    onChange = { changeHandler }>
                                        
                                <option defaultValue="tyro" value="tyro">Стажёр</option>
                                <option value="hr">Сотрудник кадров</option>
                                <option value="head">Руководитель</option>
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control"
                                   name="login"
                                   id="login"
                                   onChange = { changeHandler }
                            />
                            <div className="input-group-append">
                                <label htmlFor="login" className="input-group-text">Логин</label>
                            </div>
                        </div>

                        <div className="input-group mb-3">
                            <input type="password" className="form-control"
                                   name="password"
                                   id="password"
                                   onChange = { changeHandler }
                            />
                            <div className="input-group-append">
                                <label htmlFor="password" className="input-group-text">Пароль</label>
                            </div>
                        </div>
                        <br />
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" required
                                   name="lastName"
                                   id="lastName"
                                   onChange = { changeHandler }
                            />
                            <div className="input-group-append">
                                <label htmlFor="lastName" className="input-group-text">Фамилия</label>
                            </div>
                        </div>

                        <div className="input-group mb-3">
                            <input type="text" className="form-control"
                                   name="firstName"
                                   id="firstName"
                                   onChange = { changeHandler }
                            />
                            <div className="input-group-append">
                                <label htmlFor="firstName" className="input-group-text">Имя</label>
                            </div>
                        </div>

                        <div className="input-group mb-3">
                            <input type="text" className="form-control"
                                   name="middleName"
                                   id="middleName"
                                   onChange = { changeHandler }
                            />
                            <div className="input-group-append">
                                <label htmlFor="middleName" className="input-group-text">Отчество</label>
                            </div>
                        </div>
                        <br />
                        <div className="input-group mb-3">
                            <input type="text" className="form-control"
                                   name="dept"
                                   id="dept"
                                   onChange = { changeHandler }
                            />
                            <div className="input-group-append">
                                <label htmlFor="dept" className="input-group-text">Отдел</label>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control"
                                   name="pos"
                                   id="pos"
                                   onChange = { changeHandler }
                            />
                            <div className="input-group-append">
                                <label htmlFor="pos" className="input-group-text">Должность</label>
                            </div>
                        </div>

                        <div id="tyroBlock"> {/*Отсек с параметрами для TYRO*/}
                            <div className="input-group mb-3">
                                <select className="custom-select"
                                        id="headId"
                                        name="headId"
                                        onChange = { changeHandler }>
                                    <option value=""></option>
                                    { users.map((user, index) => {
                                        return (
                                            <option key={user._id} value={user._id}>{user.name.lastName + ' ' + user.name.firstName + ' ' + user.name.middleName}</option>
                                        )
                                    }) }

                                </select>
                                <div className="input-group-append">
                                    <label htmlFor="headId" className="input-group-text">Руководитель</label>
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
                                       defaultValue={ dateITM(dateNow()) }
                                       onChange = { changeHandler }
                                />
                            </div>

                        </div>

                        <button
                           className="btn btn-primary" type="submit"
                           onClick = { registerHandler }
                           disabled={ loading }
                        >
                            Создать
                        </button>

                        
                    </form>
                </div>
            </div>

        </div>
    )
}