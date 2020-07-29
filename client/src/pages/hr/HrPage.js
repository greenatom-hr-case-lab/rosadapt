import React from "react";
import {NavLink} from "react-router-dom"
import listSVG from "../../img/showList.svg"
import addUserSVG from "../../img/addUser.svg"
import addPlanSVG from "../../img/addPlan.svg"


export const HrPage = () => {


    return(
        <div className="flexCon">
            <NavLink to="/showList">
                <div className="guideCard">
                    <img src={ listSVG } alt="Список"/>
                    <h3>списки пользователей</h3>
                </div>
            </NavLink>
            <NavLink to="/createUser">
                <div className="guideCard">
                    <img src={ addUserSVG } alt="Добавить пользователя"/>
                    <h3>создать пользователя</h3>
                </div>
            </NavLink>
            <NavLink to="/createPlan">
                <div className="guideCard">
                    <img src={ addPlanSVG } alt="Добавить план"/>
                    <h3>создать план адаптации</h3>
                </div>
            </NavLink>
        </div>
    )
}