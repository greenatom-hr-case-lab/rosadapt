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
            }

        }
        catch (e) {}
    }, [request])

    const changeHandler = event => { /*Удалить этот обработчик!! */
        setFormTask({ ...formTask, [event.target.name]: event.target.value })
    }

    const changeHandlerAddTask = event => {
        setFormTask({ ...formTask, [event.target.name]: event.target.value })
    }
    const addHandlerTask = async () => {
        try {
            const data = await request('/api/create/task', "POST", {...formTask}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            setFormTask({ ...formTask, name: undefined })
            setFormTask({ ...formTask, description: undefined })
            getPlanAndTasks()
        } catch (e) {}
    }
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

    if (loading) {
        return <Loader/>
    }

    return (
        <>
            {!loading && plan &&
            <main className="container tyroPage">
                { plan.level === undefined && <main className="container tyroPage">
                    <div className="flexCon">
                        <div className="flexItem">
                            <h2>Ваш план адаптации пока что не был создан, но скоро он здесь появится</h2>
                        </div>
                    </div>
                </main>}
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
                                       max="2099-12-12"
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
                                                    <div className="taskCard" onClick={ clickTaskCard }>
                                                        <div className="taskCardHead">
                                                            <div className="row">
                                                                <h2 className="col-10">{task.name}</h2>
                                                                <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>
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
                { (plan.level === 3 || plan.level === 4) && <>
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
                                                        <div className="taskCard" onClick={ clickTaskCard }>
                                                            <div className="taskCardHead">
                                                                <div className="row">
                                                                    <h2 className="col-10">{task.name}</h2>
                                                                    <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>
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
                                                        <div className="taskCard" onClick={ clickTaskCard }>
                                                            <div className="taskCardHead">
                                                                <div className="row">
                                                                    <h2 className="col-10">{task.name}</h2>
                                                                    <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>
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
                                                    <div className="taskCard" onClick={ clickTaskCard }>
                                                        <div className="taskCardHead">
                                                            <div className="row">
                                                                <h2 className="col-10">{task.name}</h2>
                                                                <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>
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
                                                <div className="taskCard" onClick={ clickTaskCard }>
                                                    <div className="taskCardHead">
                                                        <div className="row">
                                                            <h2 className="col-10">{task.name}</h2>
                                                            <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>
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
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    }
                </>}

                {/*<div className="row headOfPlanPage">*/}

                {/*    <div className="col-2">*/}
                {/*        {userRole === 'hr' && <NavLink to="/showList">*/}
                {/*            <button className="btnBlue">назад</button>*/}
                {/*        </NavLink>}*/}
                {/*        {userRole === 'head' && <NavLink to="/main">*/}
                {/*            <button className="btnBlue">назад</button>*/}
                {/*        </NavLink>}*/}
                {/*    </div>*/}
                {/*    <h1 className="col-10">Стажёр {tyro.name.lastName + ' ' + tyro.name.firstName + ' ' + tyro.name.middleName}</h1>*/}

                {/*    <h2 className="offset-2 col-10">Отдел: {tyro.dept}</h2>*/}
                {/*    <h2 className="offset-2 col-10">Должность: {tyro.pos}</h2>*/}
                {/*    <h2 className="offset-2 col-10">Статус плана атестации: {statusOfPlanRus(plan).toLowerCase()}</h2>*/}
                {/*    { userRole === 'hr' && <h2 className="offset-2 col-10">Руководитель: {head.name.lastName + ' ' + head.name.firstName + ' ' + head.name.middleName }</h2>}*/}
                {/*    <h2 className="offset-2 col-10">Период адаптации: с {dateFormToWords(plan.date.dateStart)} по {dateFormToWords(plan.date.dateEnd)}</h2>*/}
                {/*    <h2 className="offset-2 col-10">Дата создания плана: {dateFormToWords(plan.date.created)}</h2>*/}
                {/*    { plan.level === 5 && <h2 className="offset-2 col-10">{plan.summary}</h2>}*/}
                {/*</div>*/}
                {/*<div className="row bodyOfPlanPage">*/}
                {/*    { (plan.level === 1 || plan.level === 2) &&*/}
                {/*    <div className="row listOfAllTasks">*/}
                {/*        { tasks.length === 0 && <h1  className="offset-2 col-10">Задачи пока что не были добавлены</h1>}*/}
                {/*        { tasks.length !== 0 && <>*/}
                {/*            <h1  className="offset-2 col-8">Список предстоящих задач</h1>*/}
                {/*            { plan.level === 2 &&*/}
                {/*            <div className="col-2">*/}
                {/*                <button className="btnOrange" onClick={ () => {} }>подтвердить</button>*/}
                {/*            </div>*/}
                {/*            }*/}
                {/*            {*/}
                {/*                tasks.map( (task) => {*/}
                {/*                    return (*/}
                {/*                        <div className="offset-2 col-10 taskCardBlock">*/}
                {/*                            <div className="row">*/}
                {/*                                <div className="col-10">*/}
                {/*                                    <div className="taskCard" onClick={ clickTaskCard }>*/}
                {/*                                        <div className="taskCardHead">*/}
                {/*                                            <div className="row">*/}
                {/*                                                <h2 className="col-10">{task.name}</h2>*/}
                {/*                                                <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                        <div className="taskCardBody d-none">*/}
                {/*                                            <div className="row">*/}
                {/*                                                <div className="col-10 font-weight-light">*/}
                {/*                                                    <h2 className="font-weight-light">{task.description}</h2>*/}
                {/*                                                </div>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                </div>*/}
                {/*                                <div className="col-2 text-center buttonSection d-none">*/}
                {/*                                    <button className="btnBlue">Изменить</button>*/}
                {/*                                    <button className="btnRed">Удалить</button>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    )*/}
                {/*                })*/}
                {/*            }*/}
                {/*        </>}*/}

                {/*        <div className="offset-2 col-10 taskCardBlock">*/}
                {/*            <div className="row">*/}
                {/*                <div className="col-10">*/}
                {/*                    <div className="taskCard" onClick={ clickTaskCard }>*/}
                {/*                        <div className="taskCardHead">*/}
                {/*                            <div className="row">*/}
                {/*                                <h2 className="col-10">Заглушка сценария для модульного тестирования</h2>*/}
                {/*                                <h2 className="col-2 text-right">25 февраля</h2>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                        <div className="taskCardBody d-none">*/}
                {/*                            <div className="row">*/}
                {/*                                <div className="col-10 font-weight-light">*/}
                {/*                                    <h2 className="font-weight-light">Настройка и обеспечение прототипов всем необходимым для выявления нарушений среди обычных граждан. Всё что подпадает под строчки закона должно соответсвовать норме, в противном случае будут предприняты меры пресечения.*/}

                {/*                                        Созданный на основе внешних данных прототип всегда лучше, чем тот, что собрали из подручных средств на фабрике из соседней страны. Тем не менее это замечательный опыт для всех нас. Добро пожаловать.</h2>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="col-2 text-center buttonSection d-none">*/}
                {/*                    <button className="btnBlue">Изменить</button>*/}
                {/*                    <button className="btnRed">Удалить</button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    }*/}
                {/*    { plan.level === 3 &&*/}
                {/*    <>*/}
                {/*        <div className="row listOfActualTasks">*/}
                {/*            <h1  className="offset-2 col-8">Текущие задачи</h1>*/}
                {/*            {*/}
                {/*                nonDoneActualTasks.map( (task) => {*/}
                {/*                    return (*/}
                {/*                        <div className="offset-2 col-10 taskCardBlock">*/}
                {/*                            <div className="row">*/}
                {/*                                <div className="col-10">*/}
                {/*                                    <div className="taskCard" onClick={ clickTaskCard }>*/}
                {/*                                        <div className="taskCardHead">*/}
                {/*                                            <div className="row">*/}
                {/*                                                <h2 className="col-10">{task.name}</h2>*/}
                {/*                                                <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                        <div className="taskCardBody d-none">*/}
                {/*                                            <div className="row">*/}
                {/*                                                <div className="col-10 font-weight-light">*/}
                {/*                                                    <h2 className="font-weight-light">{task.description}</h2>*/}
                {/*                                                </div>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                </div>*/}
                {/*                                <div className="col-2 text-center buttonSection d-none">*/}
                {/*                                    <button className="btnBlue">завершить</button>*/}
                {/*                                    <button className="btnBlue">изменить</button>*/}
                {/*                                    <button className="btnRed">удалить</button>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    )*/}
                {/*                })*/}
                {/*            }*/}
                {/*        </div>*/}
                {/*        <div className="row listOfFutureTasks">*/}
                {/*            <h1  className="offset-2 col-8">Предстоящие задачи</h1>*/}
                {/*            {*/}
                {/*                nonDoneFutureTasks.map( (task) => {*/}
                {/*                    return (*/}
                {/*                        <div className="offset-2 col-10 taskCardBlock">*/}
                {/*                            <div className="row">*/}
                {/*                                <div className="col-10">*/}
                {/*                                    <div className="taskCard" onClick={ clickTaskCard }>*/}
                {/*                                        <div className="taskCardHead">*/}
                {/*                                            <div className="row">*/}
                {/*                                                <h2 className="col-10">{task.name}</h2>*/}
                {/*                                                <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                        <div className="taskCardBody d-none">*/}
                {/*                                            <div className="row">*/}
                {/*                                                <div className="col-10 font-weight-light">*/}
                {/*                                                    <h2 className="font-weight-light">{task.description}</h2>*/}
                {/*                                                </div>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                </div>*/}
                {/*                                <div className="col-2 text-center buttonSection d-none">*/}
                {/*                                    <button className="btnBlue">завершить</button>*/}
                {/*                                    <button className="btnBlue">изменить</button>*/}
                {/*                                    <button className="btnRed">удалить</button>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    )*/}
                {/*                })*/}
                {/*            }*/}
                {/*        </div>*/}
                {/*        <div className="row listOfDoneTasks text-lighten-5">*/}
                {/*            <h1  className="offset-2 col-8">Выполненные задачи</h1>*/}
                {/*            <div className="col-2">*/}
                {/*                <button className="btnOrange d-none" onClick={ () => {} }>выставить оценку</button>*/}
                {/*            </div>*/}
                {/*            {*/}
                {/*                doneTasks.map( (task) => {*/}
                {/*                    return (*/}
                {/*                        <div className="offset-2 col-10 taskCardBlock">*/}
                {/*                            <div className="row">*/}
                {/*                                <div className="col-10">*/}
                {/*                                    <div className="taskCard" onClick={ clickTaskCard }>*/}
                {/*                                        <div className="taskCardHead">*/}
                {/*                                            <div className="row">*/}
                {/*                                                <h2 className="col-10">{task.name}</h2>*/}
                {/*                                                <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                        <div className="taskCardBody d-none">*/}
                {/*                                            <div className="row">*/}
                {/*                                                <div className="col-10 font-weight-light">*/}
                {/*                                                    <h2 className="font-weight-light">{task.description}</h2>*/}
                {/*                                                </div>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                </div>*/}
                {/*                                <div className="col-2 text-center buttonSection d-none">*/}
                {/*                                    <button className="btnRed">вернуть</button>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    )*/}
                {/*                })*/}
                {/*            }*/}
                {/*        </div>*/}
                {/*    </>*/}
                {/*    }*/}
                {/*    { plan.level === 4 &&*/}
                {/*    <div className="row listOfAllTasks">*/}
                {/*        <div className="col-2">*/}
                {/*            <button className="btnRed" onClick={ () => {} }>вернуть план</button>*/}
                {/*        </div>*/}
                {/*        <h1 className="col-8">Подведение итогов</h1>*/}
                {/*        { userRole === 'head' &&*/}
                {/*        <div className="col-2">*/}
                {/*            <button className="btnGreen" onClick={ () => {} }>выставить оценку</button>*/}
                {/*        </div>*/}
                {/*        }*/}
                {/*        <h2 className="offset-2 col-8"> </h2>*/}
                {/*        {userRole === 'head' &&*/}
                {/*        <div className="offset-2 col-8">*/}
                {/*            <div className="input-group mb-3">*/}
                {/*                            <textarea type="text" className="form-control"*/}
                {/*                                      rows="3"*/}
                {/*                                      name="descOfTask"*/}
                {/*                                      id="descOfTask"*/}
                {/*                                      placeholder="Описание"*/}
                {/*                                      onChange = { ()=>{} }*/}
                {/*                            />*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        }*/}
                {/*        <h1  className="offset-2 col-8">Выполненные задачи</h1>*/}
                {/*        {*/}
                {/*            tasks.map( (task) => {*/}
                {/*                return (*/}
                {/*                    <div className="offset-2 col-10 taskCardBlock">*/}
                {/*                        <div className="row">*/}
                {/*                            <div className="col-10">*/}
                {/*                                <div className="taskCard" onClick={ clickTaskCard }>*/}
                {/*                                    <div className="taskCardHead">*/}
                {/*                                        <div className="row">*/}
                {/*                                            <h2 className="col-10">{task.name}</h2>*/}
                {/*                                            <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                    <div className="taskCardBody d-none">*/}
                {/*                                        <div className="row">*/}
                {/*                                            <div className="col-10 font-weight-light">*/}
                {/*                                                <h2 className="font-weight-light">{task.description}</h2>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                )*/}
                {/*            })*/}
                {/*        }*/}
                {/*    </div>*/}
                {/*    }*/}
                {/*    { plan.level === 5 &&*/}
                {/*    <div className="row listOfAllTasks">*/}
                {/*        <h1  className="offset-2 col-8">Итоговая оценка {plan.mark}. {descriptionOfMark(plan.mark)}</h1>*/}
                {/*        {*/}
                {/*            tasks.map( (task) => {*/}
                {/*                return (*/}
                {/*                    <div className="offset-2 col-10 taskCardBlock">*/}
                {/*                        <div className="row">*/}
                {/*                            <div className="col-10">*/}
                {/*                                <div className="taskCard" onClick={ clickTaskCard }>*/}
                {/*                                    <div className="taskCardHead">*/}
                {/*                                        <div className="row">*/}
                {/*                                            <h2 className="col-10">{task.name}</h2>*/}
                {/*                                            <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                    <div className="taskCardBody d-none">*/}
                {/*                                        <div className="row">*/}
                {/*                                            <div className="col-10 font-weight-light">*/}
                {/*                                                <h2 className="font-weight-light">{task.description}</h2>*/}
                {/*                                            </div>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                            <div className="col-2 text-center buttonSection d-none">*/}
                {/*                                <button className="btnBlue">Изменить</button>*/}
                {/*                                <button className="btnRed">Удалить</button>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                )*/}
                {/*            })*/}
                {/*        }*/}
                {/*    </div>*/}
                {/*    }*/}
                {/*</div>*/}
            </main>
            }
        </>
    )

    return (
        <>{

        plan.map((plan, index) => {
        console.log(plan.level)
        switch (plan.level) {
            case 1: return (
                <main className="container tyro" key={index}>
                    <div className="flexCon flexConForTyro">
                        <div className="flexItem invisible">
                            <button className="btnBlue">заглушка</button>
                        </div>

                        <div className="flexItem">
                            <h2>Составьте свой план адаптации</h2>
                        </div>
                        <div className="flexItem">
                            <button className="btnGreen">отправить</button>
                        </div>
                    </div>
                    <div className="row addTaskBlock">

                        <h1 className="offset-2 col-10">Добавление задачи</h1>

                        <div className="offset-2 col-6 addTaskInputs">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" required
                                       name="nameOfTask"
                                       id="nameOfTask"
                                       placeholder="Название"
                                       onChange = { changeHandler }
                                />
                            </div>

                            <div className="input-group mb-3">
                                <textarea type="text" className="form-control"
                                          rows="3"
                                          name="descOfTask"
                                          id="descOfTask"
                                          placeholder="Описание"
                                          onChange = { changeHandler }
                                />
                            </div>
                            <button className="btnBlue">Добавить</button>
                        </div>

                        <div className="col-2">
                            <div className="input-group mb-3">
                                <input type="date" id="probationStart" name="probationStart" className="form-control"
                                       max="2099-12-12"
                                       defaultValue={ dateNow() }
                                       onChange = { changeHandler }
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input type="date" id="probationEnd" name="probationEnd" className="form-control"
                                       max="2099-12-12"
                                       placeholder="дата окончания"
                                       defaultValue={ datePlus(dateNow(), 3) }
                                       onChange = { changeHandler }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row listOfAllTasks">
                        { tasks.length === 0 && <h1  className="offset-2 col-10">Задачи пока что не были добавлены</h1>}
                        { tasks.length !== 0 && <>
                            <h1  className="offset-2 col-8">Список предстоящих задач</h1>
                            { plan.level === 2 &&
                            <div className="col-2">
                                <button className="btnOrange" onClick={ () => {} }>подтвердить</button>
                            </div>
                            }
                            {
                                tasks.map( (task) => {
                                    return (
                                        <div className="offset-2 col-10 taskCardBlock">
                                            <div className="row">
                                                <div className="col-10">
                                                    <div className="taskCard" onClick={ clickTaskCard }>
                                                        <div className="taskCardHead">
                                                            <div className="row">
                                                                <h2 className="col-10">{task.name}</h2>
                                                                <h2 className="col-2 text-right">c {dateFormToWords(task.date.dateStart)}</h2>
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
                                                </div>
                                                <div className="col-2 text-center buttonSection d-none">
                                                    <button className="btnBlue">Изменить</button>
                                                    <button className="btnRed">Удалить</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>}
                    </div>
                </main>
            )
            case 2: return (
                <main className="container tyro" key={index}>
                    <div className="flexCon">
                        <div className="flexItem">
                            <h2>Ваш план адаптации проходит проверку у руководителя</h2>
                        </div>
                    </div>
                </main>
            )
            case 3: return (
                <main className="container tyro" key={index}>
                    <div className="flexCon flexConForTyro">
                        <div className="flexItem">
                            <button className="btnGreen">отправить на проверку</button>
                        </div>
                    </div>

                    <div className="row listOfActualTasks">
                        <h1  className="offset-2">Актуальные задачи</h1>
                        {/*{ nonActivatedUsers.map((user, index) => {*/}
                        {/*    return (*/}
                        <div className="offset-2 col-10 taskCardBlock">
                            <div className="row">
                                <div className="col-10">
                                    <div className="taskCard" onClick={ clickTaskCard }>
                                        <div className="taskCardHead">
                                            <div className="row">
                                                <h2 className="col-10">Разработка сценария для модульного тестирования</h2>
                                                <h2 className="col-2 text-right">25 февраля</h2>
                                            </div>
                                        </div>
                                        <div className="taskCardBody d-none">
                                            <div className="row">
                                                <div className="col-10 font-weight-light">
                                                    <h2 className="font-weight-light">Настройка и обеспечение прототипов всем необходимым для выявления нарушений среди обычных граждан. Всё что подпадает под строчки закона должно соответсвовать норме, в противном случае будут предприняты меры пресечения.

                                                        Созданный на основе внешних данных прототип всегда лучше, чем тот, что собрали из подручных средств на фабрике из соседней страны. Тем не менее это замечательный опыт для всех нас. Добро пожаловать.</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 text-center buttonSection d-none">
                                    <button className="btnBlue">завершить</button>
                                </div>
                            </div>
                        </div>
                        {/*    )*/}
                        {/*}) }*/}
                    </div>
                    <div className="row listOfFutureTasks d-none">
                        <h1  className="offset-2">Предстоящие задачи</h1>
                        {/*{ nonActivatedUsers.map((user, index) => {*/}
                        {/*    return (*/}
                        <div className="offset-2 col-10 taskCardBlock">
                            <div className="row">
                                <div className="col-10">
                                    <div className="taskCard" onClick={ clickTaskCard }>
                                        <div className="taskCardHead">
                                            <div className="row">
                                                <h2 className="col-10">Разработка сценария для модульного тестирования</h2>
                                                <h2 className="col-2 text-right">25 февраля</h2>
                                            </div>
                                        </div>
                                        <div className="taskCardBody d-none">
                                            <div className="row">
                                                <div className="col-10 font-weight-light">
                                                    <h2 className="font-weight-light">Настройка и обеспечение прототипов всем необходимым для выявления нарушений среди обычных граждан. Всё что подпадает под строчки закона должно соответсвовать норме, в противном случае будут предприняты меры пресечения.

                                                        Созданный на основе внешних данных прототип всегда лучше, чем тот, что собрали из подручных средств на фабрике из соседней страны. Тем не менее это замечательный опыт для всех нас. Добро пожаловать.</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 text-center buttonSection d-none">
                                    <button className="btnBlue">завершить</button>
                                </div>
                            </div>
                        </div>
                        {/*    )*/}
                        {/*}) }*/}
                    </div>
                    <div className="row listOfDoneTasks text-lighten-5">
                        <h1  className="offset-2">Выполненные задачи</h1>
                        {/*{ nonActivatedUsers.map((user, index) => {*/}
                        {/*    return (*/}
                        <div className="offset-2 col-10 taskCardBlock">
                            <div className="row">
                                <div className="col-10">
                                    <div className="taskCard text-black-50" onClick={ clickTaskCard }>
                                        <div className="taskCardHead">
                                            <div className="row">
                                                <h2 className="col-10">Разработка сценария для модульного тестирования</h2>
                                                <h2 className="col-2 text-right">25 февраля</h2>
                                            </div>
                                        </div>
                                        <div className="taskCardBody d-none">
                                            <div className="row">
                                                <div className="col-10 font-weight-light">
                                                    <h2 className="font-weight-light">Настройка и обеспечение прототипов всем необходимым для выявления нарушений среди обычных граждан. Всё что подпадает под строчки закона должно соответсвовать норме, в противном случае будут предприняты меры пресечения.

                                                        Созданный на основе внешних данных прототип всегда лучше, чем тот, что собрали из подручных средств на фабрике из соседней страны. Тем не менее это замечательный опыт для всех нас. Добро пожаловать.</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 text-center buttonSection d-none">
                                    <button className="btnRed">вернуть</button>
                                </div>
                            </div>
                        </div>
                        {/*    )*/}
                        {/*}) }*/}
                    </div>
                </main>
            )
            case 4: return (
                <main className="container tyro" key={index}>
                    <div className="flexCon flexConForTyro">
                        <div className="flexItem">
                            <h2>Ваши результаты оценивает руководитель</h2>
                        </div>
                    </div>

                    <div className="row listOfDoneTasks">
                        <h1  className="offset-2">Выполненные задачи</h1>
                        {/*{ nonActivatedUsers.map((user, index) => {*/}
                        {/*    return (*/}
                        <div className="offset-2 col-10 taskCardBlock">
                            <div className="row">
                                <div className="col-10">
                                    <div className="taskCard text-black-50" onClick={ clickTaskCard }>
                                        <div className="taskCardHead">
                                            <div className="row">
                                                <h2 className="col-10">Разработка сценария для модульного тестирования</h2>
                                                <h2 className="col-2 text-right">25 февраля</h2>
                                            </div>
                                        </div>
                                        <div className="taskCardBody d-none">
                                            <div className="row">
                                                <div className="col-10 font-weight-light">
                                                    <h2 className="font-weight-light">Настройка и обеспечение прототипов всем необходимым для выявления нарушений среди обычных граждан. Всё что подпадает под строчки закона должно соответсвовать норме, в противном случае будут предприняты меры пресечения.

                                                        Созданный на основе внешних данных прототип всегда лучше, чем тот, что собрали из подручных средств на фабрике из соседней страны. Тем не менее это замечательный опыт для всех нас. Добро пожаловать.</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*    )*/}
                        {/*}) }*/}
                    </div>
                </main>
            )
            case 5: return (
                <main className="container tyro" key={index}>
                    <div className="row summaryMessage">
                        <h1  className="offset-2">Испытательный срок закончен</h1>
                        <h2 className="offset-2 col-10 ">Поздравляем с успешным прохождением испытатльного срока. Ваша оценка А (Исключительно высокий уровень эффективности).</h2>
                    </div>
                    <div className="row summaryComment">
                        <h1  className="offset-2">Комментарий руководителя</h1>
                        <h2 className="offset-2 col-10 font-italic">Спасибо за огромный вклад в развитие нашей культуры и развитие компании в целом. Мы будем рады видеть вас в наших рядах снова, но уже в качестве полноценного сотрудника.
                            <br/><br/>
                            С уважением Дьяков Д. В.</h2>
                    </div>
                    <div className="row listOfDoneTasks">
                        <h1  className="offset-2">Выполненные задачи</h1>
                        {/*{ nonActivatedUsers.map((user, index) => {*/}
                        {/*    return (*/}
                        <div className="offset-2 col-10 taskCardBlock">
                            <div className="row">
                                <div className="col-10">
                                    <div className="taskCard text-black-50" onClick={ clickTaskCard }>
                                        <div className="taskCardHead">
                                            <div className="row">
                                                <h2 className="col-10">Разработка сценария для модульного тестирования</h2>
                                                <h2 className="col-2 text-right">25 февраля</h2>
                                            </div>
                                        </div>
                                        <div className="taskCardBody d-none">
                                            <div className="row">
                                                <div className="col-10 font-weight-light">
                                                    <h2 className="font-weight-light">Настройка и обеспечение прототипов всем необходимым для выявления нарушений среди обычных граждан. Всё что подпадает под строчки закона должно соответсвовать норме, в противном случае будут предприняты меры пресечения.

                                                        Созданный на основе внешних данных прототип всегда лучше, чем тот, что собрали из подручных средств на фабрике из соседней страны. Тем не менее это замечательный опыт для всех нас. Добро пожаловать.</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*    )*/}
                        {/*}) }*/}
                    </div>
                </main>
            )
            case undefined: return (

                <main className="container tyro" key={index}>
                    {console.log('asdf')}
                    <div className="flexCon">
                        <div className="flexItem">
                            <h2>Ваш план адаптации пока что не был создан, но скоро он здесь появится</h2>
                        </div>
                    </div>
                </main>
            )
            default:return (

                <main className="container tyro" key={index}>
                    {console.log('asdf')}
                    <div className="flexCon">
                        <div className="flexItem">
                            <h2>Загрузка...</h2>
                        </div>
                    </div>
                </main>
            )
        }
    })}</>)
}