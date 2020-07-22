import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from "../hooks/message.hook"
import {AuthContext} from "../context/AuthContext";

export const CreatePage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
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
    }, [error, message, clearError])

    useEffect( () => {
        window.M.updateTextFields()
    }, [])

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
            const data = await request('/api/auth/register', 'POST', {...form}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
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
                    <div className="card-body">
                        <h5 className="card-title">Создайте новый профиль в системе РосАдапт</h5>
                        <p className="card-text">Введите поля логина и пароля</p>
                        <br/>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="role">Тип</label>
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
                            <input type="text"
                                   name="login"
                                   className="form-control"
                                   placeholder="Логин"
                                   id="login"
                                   onChange = { changeHandler }
                            />
                        </div>

                        <div className="input-group mb-3">
                            <input type="password"
                                   name="password"
                                   className="form-control"
                                   placeholder="Пароль"
                                   id="password"
                                   onChange = { changeHandler }
                            />
                        </div>
                        <br />
                        <div className="input-group mb-3">
                            <input type="text"
                                   name="lastName"
                                   className="form-control"
                                   placeholder="Фамилия"
                                   id="lastName"
                                   onChange = { changeHandler }
                            />
                        </div>

                        <div className="input-group mb-3">
                            <input type="text"
                                   name="firstName"
                                   className="form-control"
                                   placeholder="Имя"
                                   id="firstName"
                                   onChange = { changeHandler }
                            />
                        </div>

                        <div className="input-group mb-3">
                            <input type="text"
                                   name="middleName"
                                   className="form-control"
                                   placeholder="Отчество"
                                   id="middleName"
                                   onChange = { changeHandler }
                            />
                        </div>
                        <br />
                        <div className="input-group mb-3">
                            <input type="text"
                                   name="dept"
                                   className="form-control"
                                   placeholder="Отдел"
                                   id="dept"
                                   onChange = { changeHandler }
                            />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text"
                                   name="pos"
                                   className="form-control"
                                   placeholder="Должность"
                                   id="pos"
                                   onChange = { changeHandler }
                            />
                        </div>

                        <div id="tyroBlock">
                            <div className="input-group mb-3">
                                <input type="text"
                                         name="headId"
                                         className="form-control"
                                         placeholder="Руководитель"
                                         id="headId"
                                         onChange = { changeHandler }
                                />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">с</span>
                                </div>
                                <input type="date" id="probationStart" name="probationStart" className="form-control"
                                       max="2099-12-12"
                                       defaultValue={dateNow()}
                                       onChange = { changeHandler }
                                />
                                <div className="input-group-prepend">
                                    <span className="input-group-text">по</span>
                                </div>
                                <input type="date" id="probationEnd" name="probationEnd" className="form-control"
                                       max="2099-12-12"
                                       placeholder="дата окончания"
                                       defaultValue={dateITM(dateNow())}
                                       onChange = { changeHandler }
                                />
                            </div>

                        </div>

                        <button
                           className="btn btn-primary"
                           onClick = { registerHandler }
                           disabled={loading}
                        >
                            Создать
                        </button>

                        
                    </div>
                </div>
            </div>

        </div>
    )
}