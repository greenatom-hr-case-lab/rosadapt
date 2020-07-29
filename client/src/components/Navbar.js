import React, {useContext} from 'react'
import {useHistory} from "react-router-dom"
import {AuthContext} from "../context/AuthContext"
import LogoSVG from "../img/logo.svg"
import LogoutSVG from "../img/logout.svg"

export const Navbar = ({ roleRus }) => {
    const history = useHistory()
    const authContext = useContext(AuthContext)

    const getNested = (obj, keys) => keys.reduce((p, c) => p && p.hasOwnProperty(c) ? p[c] : null, obj);

    const logoutHandler = event => {
        event.preventDefault()
        authContext.logout()
        history.push('/')
    }

    return(
        <nav>
            <div className="container">
                <div className="row">

                    <div className="col-6">
                        <img id="logo" src={LogoSVG} alt="Логотип"/>
                    </div>

                    <div className="col-6 text-right">
                        <div className="profileBlock">
                            <h1>
                                <span id="profileFI">
                                    {getNested(authContext.userData, ['name', 'lastName']) + ' ' + getNested(authContext.userData, ['name', 'firstName'])}
                                    <h2 id="profileRole">{ roleRus }</h2>
                                </span>
                                <a href="/"onClick={logoutHandler}><img id="logoutBtn" src={LogoutSVG} alt="Выйти"/></a>
                            </h1>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    )
}