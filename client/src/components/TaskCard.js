import React from 'react'
import {dateFormToWords} from "../functions/dateFormToWords";

export const TaskCard = ({task, clickTaskCard}) => {
    return (
        <div className="taskCard" onClick={ clickTaskCard }>
            <div className="taskCardHead">
                <div className="row">
                    <h2 className="col-9">{task.name}</h2>
                    <h2 className="col-3 text-right">c {dateFormToWords(task.date.dateStart)}</h2>
                </div>
            </div>
            <div className="taskCardBody d-none">
                <div className="row">
                    <div className="col-10 font-weight-light">
                        <h2 className="font-weight-light">{task.description}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}