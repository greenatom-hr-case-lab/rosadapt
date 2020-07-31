import React, {useCallback, useContext, useEffect, useState} from "react"
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"
import {toggleClass} from "../../functions/toggleClass"
import {filterTasks} from "../../functions/filterTasks";
import {dateFormToWords} from "../../functions/dateFormToWords";
import {Loader} from "../../components/Loader";
import {NavLink} from "react-router-dom";
import {statusOfPlanRus} from "../../functions/statusOfPlanRus";
import {descriptionOfMark} from "../../functions/descriptionOfMark";
import {TaskCard} from "../../components/TaskCard";

export const TyroPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()

    const [plan, setPlan] = useState({})
    const [tasks, setTasks] = useState([])
    const [doneTasks, setDoneTasks] = useState([])
    const [nonDoneTasks, setNonDoneTasks] = useState([])
    const [nonDoneActualTasks, setNonDoneActualTasks] = useState([])
    const [nonDoneFutureTasks, setNonDoneFutureTasks] = useState([])

    const dateNow = () => {
        const date = new Date()
        let yyyy = date.getFullYear()
        let mm = date.getMonth() + 1
        let dd = date.getDate()
        if(mm<10) { mm = '0' + mm }
        if(dd<10) { dd = '0' + dd }
        return yyyy+'-'+mm+'-'+dd
    }
    const datePlus = (yourDate, monthNumber) => {
        const date = new Date(yourDate)
        date.setMonth(date.getMonth() + monthNumber)
        let yyyy = date.getFullYear()
        let mm = date.getMonth() + 1
        let dd = date.getDate()
        if(mm<10) { mm = '0' + mm }
        if(dd<10) { dd = '0' + dd }
        return yyyy+'-'+mm+'-'+dd
    }
    const [formTask,  setFormTask]  = useState({ dateStart: dateNow(), dateEnd: datePlus(dateNow(), 1)})

    useEffect(() =>{
        message(error)
        clearError()
        getPlanAndTasks()
        window.M.updateTextFields()
    }, [error, message, clearError, auth])


    const clickTaskCard = (event) =>{
        if (event.target.tagName !== 'BUTTON'){
            toggleClass(event.target.children[1], "d-none")
            if (event.target.parentElement.parentElement.children[1]){
                toggleClass(event.target.parentElement.parentElement.children[1], "d-none")
            }
        }
    }

    let flagForProgress = true
    const getPlanAndTasks = useCallback(async () => {
        try {
            const data = await request (`/api/list/plan/${auth.userId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)

            if (data.plan){
                setPlan(data.plan)
                setTasks(data.tasks)
                setDoneTasks(filterTasks(data.tasks,true,null))
                setNonDoneTasks(filterTasks(data.tasks,false,null))
                setNonDoneActualTasks(filterTasks(data.tasks,false,true))
                setNonDoneFutureTasks(filterTasks(data.tasks,false,false))
                setFormTask({...formTask, planLink: data.plan._id})
                changeBar(100)
                console.log(data.plan.level)
                setTimeout(()=>{
                        if (data.plan.countsOfAllTasks > 0) changeBar(data.plan.countsOfDoneTasks/data.plan.countsOfAllTasks*100)
                        if (data.plan.level === 5) changeBar(100, plan.mark)
                    }
                ,10)

            }

        }
        catch (e) {}
    }, [request])

    const changeHandler = event => { /*Удалить этот обработчик!! */
        setFormTask({ ...formTask, [event.target.name]: event.target.value })
    }

    const changeHandlerAddTask = event => {
        if (event.target.name === 'dateStart') {
            document.getElementById('dateEnd').value = datePlus(event.target.value, 1)
            setFormTask({...formTask, dateStart: document.getElementById('dateStart').value, dateEnd: document.getElementById('dateEnd').value})
        } else {
            setFormTask({ ...formTask, [event.target.name]: event.target.value })
        }
        console.log({...formTask})
    }
    const addHandlerTask = useCallback(
        async () => {
            console.log({...formTask})
            try {
                console.log({...formTask})
                const data = await request('/api/create/task', "POST", {...formTask}, {
                    Authorization: `Bearer ${auth.token}`
                })
                message(data.message)
                setFormTask({ ...formTask, name: undefined })
                setFormTask({ ...formTask, description: undefined })
                getPlanAndTasks()
            } catch (e) {}
        }
        ,[request])

    const deleteHandlerTask = async (event) => {
        try{
            const data = await request (`/api/delete/task/${event.target.name}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            getPlanAndTasks()
        }
        catch (e) {}
    }
    const doneHandlerTask = async (event) => {
        try{
            const data = await request (`/api/change/task/done/${event.target.name}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            if (nonDoneTasks.length === 1) await nextLevel()
            else message(data.message)
            getPlanAndTasks()
        }
        catch (e) {}
    }
    const unDoneHandlerTask = async (event) => {
        try{
            const data = await request (`/api/change/task/undone/${event.target.name}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            if (nonDoneTasks.length === 0) await prevLevel()
            else message(data.message)
            getPlanAndTasks()
        }
        catch (e) {}
    }

    const nextLevel = async () => {
        try {
            const data = await request(`/api/change/plan/levelUp/${plan._id}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            getPlanAndTasks()
        } catch (e) {}
    }
    const prevLevel = async () => {
        try {
            const data = await request(`/api/change/plan/levelDown/${plan._id}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            getPlanAndTasks()
        } catch (e) {}
    }

    // if (loading) {
    //     return <Loader/>
    // }

    const changeBar = (percent, mark) => {
        console.log(percent, mark)
        if (mark) {
            document.getElementById('cont').setAttribute('data-pct', mark)
            return
        }
        let val = parseInt(percent)

        let circle = document.querySelector('#bar')
        if (isNaN(val)) {
            val = 100
        } else {

            let r = circle.getAttribute('r')
            let c = Math.PI*(r*2)

            if (val < 0) { val = 0 }
            if (val > 100) { val = 100 }
            let pct = ((100-val)/100)*c
            circle.style.strokeDashoffset = pct
            document.getElementById('cont').setAttribute('data-pct', val);
        }
    }


    return (
        <>  { plan && plan.level === 5 &&
                <div className="progressCircleBlock">
                    <div id="cont" className="done" data-pct="100">
                        <svg id="svg" width="128" height="128" viewport="0 0 100 100" version="1.1"
                             xmlns="http://www.w3.org/2000/svg">
                            <circle          r="60" cx="64" cy="64" fill="transparent" strokeDasharray="376.99111843077515"
                                             strokeDashoffset="0"/>
                            <circle id="barr" r="60" cx="64" cy="64" fill="transparent"
                                    strokeDasharray="376.99111843077515" strokeDashoffset="0"/>
                        </svg>
                    </div>
                </div>
            }
            {(!plan || (plan && plan.level !== 5)) &&
                <div className="progressCircleBlock">
                    <div id="cont" data-pct="100">
                        <svg id="svg" width="128" height="128" viewport="0 0 100 100" version="1.1"
                             xmlns="http://www.w3.org/2000/svg">
                            <circle          r="60" cx="64" cy="64" fill="transparent" strokeDasharray="376.99111843077515"
                                             strokeDashoffset="0"/>
                            <circle id="bar" r="60" cx="64" cy="64" fill="transparent"
                                    strokeDasharray="376.99111843077515" strokeDashoffset="0"/>
                        </svg>
                    </div>
                </div>
            }
            <main className="container tyroPage">
                {loading && <Loader/>}
            {!loading && plan && <>
                { plan.level === undefined &&
                    <div className="flexCon">
                        <div className="flexItem">
                            <h2>Ваш план адаптации пока что не был создан, но скоро он здесь появится</h2>
                        </div>
                    </div>}
                { plan.level === 1 && <>
                    <div className="flexCon flexConForTyro">
                        <div className="flexItem invisible">
                            <button className="btnBlue">заглушка</button>
                        </div>
                        <div className="flexItem">
                            <h2>Составьте план адаптации</h2>
                        </div>
                        <div className="flexItem">
                            <button className="btnGreen" onClick={ nextLevel }>отправить</button>
                        </div>
                    </div>

                    <div className="row addTaskBlock">

                        <h1 className="offset-2 col-10">Добавление задачи</h1>

                        <div className="offset-2 col-6 addTaskInputs">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" required
                                       name="name"
                                       id="nameOfTask"
                                       placeholder="Название"
                                       onChange = { changeHandlerAddTask }
                                />
                            </div>

                            <div className="input-group mb-3">
                                <textarea type="text" className="form-control"
                                          rows="3"
                                          name="description"
                                          id="descOfTask"
                                          placeholder="Описание"
                                          onChange = { changeHandlerAddTask }
                                />
                            </div>
                            <button className="btnBlue" onClick={ addHandlerTask }>Добавить</button>
                        </div>

                        <div className="col-2">
                            <div className="input-group mb-3">
                                <input type="date" id="dateStart" name="dateStart" className="form-control"
                                       max="2099-12-12"
                                       defaultValue={ dateNow() }
                                       onChange = { changeHandlerAddTask }
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input type="date" id="dateEnd" name="dateEnd" className="form-control"
                                       max="2099-12-12" min={ dateNow() }
                                       placeholder="дата окончания"
                                       defaultValue={ datePlus(dateNow(), 1) }
                                       onChange = { changeHandlerAddTask }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row listOfAllTasks">
                        { tasks.length === 0 && <h1  className="offset-2 col-10">Задачи пока что не были добавлены</h1>}
                        { tasks.length !== 0 && <>
                            <h1  className="offset-2 col-8">Список предстоящих задач</h1>
                            {
                                tasks.map( (task, i) => {
                                    return (
                                        <div className="offset-2 col-10 taskCardBlock" key={i}>
                                            <div className="row">
                                                <div className="col-10">
                                                    <TaskCard task={task} clickTaskCard={clickTaskCard}/>
                                                </div>
                                                <div className="col-2 text-center buttonSection d-none">
                                                    <button className="btnBlue">Изменить</button>
                                                    <button className="btnRed" name={task._id} onClick={ deleteHandlerTask }>Удалить</button>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>}
                    </div>
                </>}
                { plan.level === 2 && <>
                    <div className="flexCon flexConForTyro">
                        <div className="flexItem">
                            <h2>Ваш план адаптации проходит проверку у руководителя</h2>
                        </div>
                    </div>
                </>}
                { (plan.level === 3 || plan.level === 4) &&<>
                    <div className="flexCon flexConForTyro">

                    </div>
                    <>
                        { nonDoneActualTasks.length !== 0 &&
                            <div className="row listOfActualTasks">
                                <h1  className="offset-2 col-8">Текущие задачи</h1>
                                {
                                    nonDoneActualTasks.map( (task) => {
                                        return (
                                            <div className="offset-2 col-10 taskCardBlock" key={task._id}>
                                                <div className="row">
                                                    <div className="col-10">
                                                        <TaskCard task={task} clickTaskCard={clickTaskCard}/>
                                                    </div>
                                                    <div className="col-2 text-center buttonSection d-none">
                                                        <button className="btnBlue" onClick={ doneHandlerTask } name={task._id}>Завершить</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        { nonDoneFutureTasks.length !== 0 &&
                            <div className="row listOfFutureTasks">
                                <h1  className="offset-2 col-8">Предстоящие задачи</h1>
                                {
                                    nonDoneFutureTasks.map( (task) => {
                                        return (
                                            <div className="offset-2 col-10 taskCardBlock"  key={task._id}>
                                                <div className="row">
                                                    <div className="col-10">
                                                        <TaskCard task={task} clickTaskCard={clickTaskCard}/>
                                                    </div>
                                                    <div className="col-2 text-center buttonSection d-none">
                                                        <button className="btnBlue" onClick={ doneHandlerTask } name={task._id}>Завершить</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        { doneTasks.length !== 0 &&
                        <div className="row listOfDoneTasks">
                            <h1  className="offset-2 col-8">Выполненные задачи</h1>
                            {
                                doneTasks.map( (task) => {
                                    return (
                                        <div className="offset-2 col-10 taskCardBlock"  key={task._id}>
                                            <div className="row">
                                                <div className="col-10">
                                                    <TaskCard task={task} clickTaskCard={clickTaskCard}/>
                                                </div>
                                                <div className="col-2 text-center buttonSection d-none">
                                                    <button className="btnRed" name={task._id} onClick={ unDoneHandlerTask }>Вернуть</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        }

                    </>

                </>}
                { plan.level === 5 && <>
                    <div className="row summaryMessage">
                        <h1  className="offset-2">Испытательный срок окончен</h1>
                        <h2 className="offset-2 col-10 ">Поздравляем с завершением прохождения испытатльного срока. Ваша оценка {plan.mark} ({descriptionOfMark(plan.mark)}).</h2>
                    </div>
                    <div className="row summaryComment">
                        <h1  className="offset-2">Комментарий руководителя</h1>
                        <h2 className="offset-2 col-10 font-italic">{plan.comm}</h2>
                    </div>
                    { doneTasks.length !== 0 &&
                    <div className="row listOfDoneTasks">
                        <h1  className="offset-2 col-8">Выполненные задачи</h1>
                        {
                            doneTasks.map( (task) => {
                                return (
                                    <div className="offset-2 col-10 taskCardBlock"  key={task._id}>
                                        <div className="row">
                                            <div className="col-10">
                                                <TaskCard task={task} clickTaskCard={clickTaskCard}/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    }
                </>}

            </>}</main>
        </>
    )
}