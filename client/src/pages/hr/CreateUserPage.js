import React, {useContext, useEffect, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import logoOfPageSVG from "../../img/addUser.svg";

export const CreateUserPage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form,  setForm]  = useState({
        role: 'tyro'
    })

    useEffect(() =>{
        message(error)
        clearError()
        window.M.updateTextFields()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push('/main')
        } catch (e) {}
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
                    <form action="">
                        <h2>Новый пользователь</h2>
                        <br/>
                        <div className="input-group mb-3">
                            <select className="custom-select"
                                    id="role"
                                    name="role"
                                    onChange = { changeHandler }>

                                <option defaultValue="tyro" value="tyro">Стажёр</option>
                                <option value="hr">Сотрудник кадров</option>
                                <option value="head">Руководитель</option>
                            </select>
                            <div className="input-group-append">
                                <label htmlFor="role" className="input-group-text">Роль</label>
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

                            <select className="custom-select"
                                    id="dept"
                                    name="dept"
                                    onChange = { changeHandler }>

                                <option defaultValue="none"></option>
                                <option defaultValue="Космические войска" value="Космические войска">Космические войска</option>
                                <option value="Отдел создания ядер">Отдел создания ядер</option>
                                <option value="Атомная топография">Атомная топография</option>
                                <option value="Отдел кадров">Отдел кадров</option>
                            </select>
                            <div className="input-group-append">
                                <label htmlFor="dept" className="input-group-text">Отдел</label>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <select className="custom-select"
                                    id="pos"
                                    name="pos"
                                    onChange = { changeHandler }>

                                <option defaultValue="none"></option>
                                <option defaultValue="Младший научный сотрудник">Младший научный сотрудник</option>
                                <option value="Старший научный сотрудник">Старший научный сотрудник</option>
                                <option value="Мастер">Разработчик ПО</option>
                                <option value="Старший сотрудник">Старший сотрудник</option>
                            </select>
                            <div className="input-group-append">
                                <label htmlFor="pos" className="input-group-text">Должность</label>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flexItem">
                    <button
                        className="btnGreen" type="submit"
                        onClick = { registerHandler }
                        disabled={ loading }
                    >
                        Создать
                    </button>
                </div>

            </div>
        </main>
    )
}