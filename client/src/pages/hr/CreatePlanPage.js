import React, {useContext} from "react";
import {AuthContext} from "../../context/AuthContext"



export const CreatePlanPage = () => {
    const auth = useContext(AuthContext)


    return(
        <main className="container">
            <div className="flexCon">
                <div className="guideCard">
                    <img src="" alt=""/>
                    <h3></h3>
                </div>
                <div className="guideCard">
                    <img src="" alt=""/>
                    <h3></h3>
                </div>
                <div className="guideCard">
                    <img src="" alt=""/>
                    <h3></h3>
                </div>
            </div>
        </main>
    )
}