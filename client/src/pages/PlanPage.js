import React, {useContext,useCallback, useEffect, useState} from "react"
import {roleRus} from "../functions/roleRus";
import {NavLink, useParams} from "react-router-dom";
import {statusOfPlanRus} from "../functions/statusOfPlanRus";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from '../context/AuthContext'
import {Loader} from "../components/Loader";
import {useMessage} from "../hooks/message.hook";
import {dateFormToWords} from "../functions/dateFormToWords"
import {toggleClass} from "../functions/toggleClass";
import {descriptionOfMark} from "../functions/descriptionOfMark"
import {filterTasks} from "../functions/filterTasks"
import {TaskCard} from "../components/TaskCard"

export const PlanPage = () => {
    const {userRole, token} = useContext(AuthContext)
    const message = useMessage()
    const {request, loading} = useHttp()
    const [plan,  setPlan]  = useState(null)
    const [tasks, setTasks] = useState(null)
    const [doneTasks, setDoneTasks] = useState(null)
    const [nonDoneTasks, setNonDoneTasks] = useState([])
    const [nonDoneActualTasks, setNonDoneActualTasks] = useState(null)
    const [nonDoneFutureTasks, setNonDoneFutureTasks] = useState(null)
    const [tyro, setTyro] = useState(null)
    const [head, setHead] = useState(null)
    const planId = useParams().id

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
    const [{...formSummary}, setFormSummary] = useState({ dateFinished: dateNow()})

    const getPlanTasksTyroHead = useCallback(async () => {
        try {
            const data = await request (`/api/list/plan/${planId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            setPlan(data.plan)
            setTasks(data.tasks)
            setDoneTasks(filterTasks(data.tasks,true,null))
            setNonDoneTasks(filterTasks(data.tasks,false,null))
            setNonDoneActualTasks(filterTasks(data.tasks,false,true))
            setNonDoneFutureTasks(filterTasks(data.tasks,false,false))

            const data2 = await  request (`/api/list/user/${data.plan.tyroLink}`, 'GET',null,{
                Authorization: `Bearer ${token}`
            })
            setTyro (data2.user)
            message(data2.message)

            const data3 = await  request (`/api/list/user/${data.plan.headLink}`, 'GET',null,{
                Authorization: `Bearer ${token}`
            })
            setHead (data3.user)
            message(data2.message)

            setFormTask({...formTask, planLink: data.plan._id})
        }
        catch (e) {}
    }, [token, planId, request])

    useEffect(() => {
        getPlanTasksTyroHead()
    }, [getPlanTasksTyroHead])

    const changeHandlerAddTask = event => {
        setFormTask({ ...formTask, [event.target.name]: event.target.value })
    }
    const addHandlerTask = async () => {
        try {
            console.log({...formTask})
            const data = await request('/api/create/task', "POST", {...formTask}, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            setFormTask({ ...formTask, name: undefined })
            setFormTask({ ...formTask, description: undefined })
            getPlanTasksTyroHead()
        } catch (e) {}
    }
    const deleteHandlerTask = async (event) => {
        try{
            const data = await request (`/api/delete/task/${event.target.name}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            getPlanTasksTyroHead()
        }
        catch (e) {}
    }

    const nextLevel = async () => {
        try {
            const data = await request(`/api/change/plan/levelUp/${plan._id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            getPlanTasksTyroHead()
        } catch (e) {}
    }
    const prevLevel = async () => {
        try {
            const data = await request(`/api/change/plan/levelDown/${plan._id}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
            getPlanTasksTyroHead()
        } catch (e) {}
    }
    const clickTaskCard = (event) =>{
        if (event.target.tagName !== 'BUTTON'){
            toggleClass(event.target.children[1], "d-none")
            if (event.target.parentElement.parentElement.children[1]){
                toggleClass(event.target.parentElement.parentElement.children[1], "d-none")
            }
        }
    }
    const doneHandlerTask = async (event) => {
        try{
            const data = await request (`/api/change/task/done/${event.target.name}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            if (nonDoneTasks.length === 1) await nextLevel()
            else message(data.message)
            getPlanTasksTyroHead()
        }
        catch (e) {}
    }
    const unDoneHandlerTask = async (event) => {
        try{
            const data = await request (`/api/change/task/undone/${event.target.name}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            if (nonDoneTasks.length === 0) await prevLevel()
            else message(data.message)
            getPlanTasksTyroHead()
        }
        catch (e) {}
    }

    const changeSummaryFormHandler = (event) => {
        setFormSummary({...formSummary, [event.target.name] : event.target.value})
    }

    const closePlan = async () => {
        const data = await request (`/api/change/plan/done/${plan._id}`, 'POST', {...formSummary}, {
            Authorization: `Bearer ${token}`
        })
        await nextLevel()
        console.log(data)
        getPlanTasksTyroHead()
    }

    if (loading) {
        return <Loader/>
    }
    return (
        <>
            {!loading && plan && tyro && tasks && head &&
                <main className="container planPage">
                    <div className="row headOfPlanPage">

                        <div className="col-2">
                            {userRole === 'hr' && <NavLink to="/showList">
                                <button className="btnBlue">Назад</button>
                            </NavLink>}
                            {userRole === 'head' && <NavLink to="/main">
                                <button className="btnBlue">Назад</button>
                            </NavLink>}
                        </div>
                        <h1 className="col-10">стажёр {tyro.name.lastName + ' ' + tyro.name.firstName + ' ' + tyro.name.middleName}</h1>

                        <h2 className="offset-2 col-10">Отдел: {tyro.dept}</h2>
                        <h2 className="offset-2 col-10">Должность: {tyro.pos}</h2>
                        <h2 className="offset-2 col-10">Статус плана атестации: {statusOfPlanRus(plan).toLowerCase()}</h2>
                        { userRole === 'hr' && <h2 className="offset-2 col-10">Руководитель: {head.name.lastName + ' ' + head.name.firstName + ' ' + head.name.middleName }</h2>}
                        <h2 className="offset-2 col-10">Период адаптации: с {dateFormToWords(plan.date.dateStart)} по {dateFormToWords(plan.date.dateEnd)}</h2>
                        <h2 className="offset-2 col-10">Дата создания плана: {dateFormToWords(plan.date.created, true)}</h2>
                        { plan.level === 5 && <h2 className="offset-2 col-10">{plan.summary}</h2>}
                    </div>
                    <div className="row bodyOfPlanPage">
                        { (plan.level === 1 || plan.level === 2) && <>
                            { plan.level === 2 &&
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
                                                   max="2099-12-12"
                                                   placeholder="дата окончания"
                                                   defaultValue={ datePlus(dateNow(), 1) }
                                                   onChange = { changeHandlerAddTask }
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="row listOfAllTasks">
                                { tasks.length === 0 && <h1  className="offset-2 col-10">Задачи пока что не были добавлены</h1>}
                                { tasks.length !== 0 && <>
                                    <div className="offset-2 col-10">
                                        <div className="row">
                                            <div className="col-10">
                                                <div className="row">
                                                    <h1  className="col-10">Список предстоящих задач</h1>
                                                    { plan.level === 2 &&
                                                        <div className="col-2 buttonSection">
                                                            <button className="btnGreen" onClick={ nextLevel }>Подтвердить</button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            {
                                                tasks.map( (task, i) => {
                                                    return (
                                                        <div className="col-10 taskCardBlock" key={i}>
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
                                        </div>
                                    </div>

                                </>}
                            </div>
                        </>}
                        { (plan.level === 3 || plan.level === 4) &&
                            <>
                                { userRole === 'head' && plan.level === 4 &&
                                    <div className="row summaryForm">
                                        <div className="offset-2 col-10 ">
                                            <div className="row">
                                                <h1 className="col-6">Подведение итогов</h1>
                                                <div className="col-4 text-right">
                                                    <button className="btnGreen" onClick={ closePlan }>Выставить оценку</button>
                                                </div>
                                                <div className="col-10">
                                                    <div className="input-group mb-3">
                                                        <div className="input-group-prepend">
                                                            <label htmlFor="mark" className="input-group-text">Оценка</label>
                                                        </div>
                                                        <select className="custom-select"
                                                                id="mark"
                                                                name="mark"
                                                                onChange = { changeSummaryFormHandler }>

                                                            <option defaultValue="none"></option>
                                                            <option defaultValue="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                            <option value="E">E</option>
                                                        </select>
                                                    </div>
                                                    <div className="input-group mb-3">
                                                <textarea type="text" className="form-control"
                                                          rows="5"
                                                          name="comm"
                                                          id="comm"
                                                          placeholder="Ваш комментарий..."
                                                          onChange = { changeSummaryFormHandler }
                                                />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
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
                                                                <button className="btnBlue">изменить</button>
                                                                <button className="btnRed" name={task._id} onClick={deleteHandlerTask}>удалить</button>
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
                                                                <button className="btnBlue">изменить</button>
                                                                <button className="btnRed">удалить</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                                { doneTasks.length !== 0 &&
                                    <div className="row listOfDoneTasks text-lighten-5">
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
                        }
                        { plan.level === 5 &&
                            <div className="row listOfAllTasks">
                                <h1  className="offset-2 col-8">Итоговая оценка {plan.mark}. {descriptionOfMark(plan.mark)}</h1>
                                {
                                    tasks.map( (task) => {
                                        return (
                                            <div className="offset-2 col-10 taskCardBlock" key={task._id}>
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
                    </div>
                </main>
            }
        </>
    )
}