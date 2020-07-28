import React, {useContext} from "react";
import {NavLink, useHistory} from "react-router-dom"
import {AuthContext} from "../../context/AuthContext"
import listSVG from "../../img/list.svg"
import addUserSVG from "../../img/addUser.svg"
import addPlanSVG from "../../img/addPlan.svg"


export const HrPage = () => {
    const auth = useContext(AuthContext)


    return(
        <div className="flexCon">
            <NavLink to="/showList">
                <div className="guideCard">
                    <img src={ listSVG } alt="Список"/>
                    <h3>Списки пользователей</h3>
                </div>
            </NavLink>
            <NavLink to="/createUser">
                <div className="guideCard">
                    <img src={ addUserSVG } alt="Добавить пользователя"/>
                    <h3>Создать пользователя</h3>
                </div>
            </NavLink>
            <NavLink to="/createPlan">
                <div className="guideCard">
                    <img src={ addPlanSVG } alt="Добавить план"/>
                    <h3>Создать план адаптации</h3>
                </div>
            </NavLink>
        </div>
    )
}