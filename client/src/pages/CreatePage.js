import React, {useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from "../hooks/message.hook"

export const CreatePage = () => {
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        firstName: '', middleName: '', lastName: '', role: 'tyro', dept: ''
    })

    useEffect(() =>{
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect( () => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
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