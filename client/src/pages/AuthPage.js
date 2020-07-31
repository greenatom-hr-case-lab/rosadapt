import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'
import LogoSVG from "../img/logo.svg";

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
        setTimeout(()=>{
            document.getElementById('logoOnAuth').style.opacity = "1"
            setTimeout(()=>{
                document.getElementsByClassName('card')[0].style.opacity = "1"
            },250)
        }, 500)
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/auth/login', 'POST', {...form})
                auth.login(data.token, data.userId, data.userLogin, data.userRole, data.userData)
            } catch (e) {}
        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId, data.userLogin, data.userRole, data.userData)
        } catch (e) {}
    }

    return(
        <div className="row justify-content-md-center">
            <div className="col-md-auto">
                <img id="logoOnAuth" src={LogoSVG} alt="Логотип"/>

                <div className="card">
                    <div className="card-body text-center">
                        <div className="input-group mb-3">
                            <input type="text"
                                   name="login"
                                   className="form-control"
                                   placeholder="Логин"
                                   id="login"
                                   onChange = { changeHandler }
                                   onKeyPress={ pressHandler }
                            />
                        </div>

                        <div className="input-group mb-3">
                            <input type="password"
                                   name="password"
                                   className="form-control"
                                   placeholder="Пароль"
                                   id="password"
                                   onChange = { changeHandler }
                                   onKeyPress={ pressHandler }
                            />
                        </div>

                        <button
                           className="btn btnGreen"
                           onClick = { loginHandler }
                           disabled={loading}
                        >
                            Войти
                        </button>

                    </div>
                </div>
            </div>

        </div>
    )
}