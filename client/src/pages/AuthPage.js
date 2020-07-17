import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        login: '', password: ''
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

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId, data.userLogin)
        } catch (e) {}
    }

    return(
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <br/>
                <br/>
                <br/>
                <h1 className="text-center">РОСАТОМ</h1>
                <br/>
                <br/>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Импровизируй. Адаптируйся. Выживай.</h5>
                        <p className="card-text">Добро пожаловать в программу адаптации сотрудника в Росатоме.</p>
                        <br/>
                        <br/>
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

                        <button
                           className="btn btn-primary mr-3"
                           onClick = { loginHandler }
                           disabled={loading}
                        >
                            Авторизоваться
                        </button>
                        <button
                           className="btn btn-primary"
                           onClick = { registerHandler }
                           disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}