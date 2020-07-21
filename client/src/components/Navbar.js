import React, {useContext} from 'react'
import {NavLink, useHistory} from "react-router-dom"
import {AuthContext} from "../context/AuthContext"

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }
    if (auth.userRole === 'hr') {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="/">РосАдапт</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <NavLink to="/profile" className="nav-link">Профиль<span
                                    className="sr-only">(current)</span></NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/create" className="nav-link">Создать</NavLink>
                            </li>

                            <li className="nav-item">
                                <span className="nav-link disabled">{auth.userLogin}</span>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link" onClick={logoutHandler}>Выйти</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    } else{
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="/">РосАдапт</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <NavLink to="/profile" className="nav-link">Профиль<span
                                    className="sr-only">(current)</span></NavLink>
                            </li>

                            <li className="nav-item">
                                <span className="nav-link disabled">{auth.userLogin}</span>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link" onClick={logoutHandler}>Выйти</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}