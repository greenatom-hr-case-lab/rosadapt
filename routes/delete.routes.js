const {Router} = require('express')
const authMW = require('../middleware/auth.middleware')
const Plan = require('../models/Plan')
const User = require('../models/User')
const Task = require('../models/Task')
const {check, validationResult} = require('express-validator')
const router = Router()

router.post(
    '/user', /*ШАБЛОН*/
    [
        check('tyroLink','Некорректное имя').exists(),
        check('headLink','Некорректное отчество').exists(),
        check('probationStart','Некорректная фамилия').exists(),
        check('probationEnd','Некорректный отдел').exists()
    ], authMW,
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорретные данные'
                })
            }
            await plan.save()
            await res.status(201).json({message: 'План создан'})
        } catch (e) {
            await res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

router.get(
    '/task/:id',
    authMW,
    async (req, res) => {
        try {
            const task = await Task.findById(req.params.id)
            console.log(task)
            task.remove()

            await res.status(201).json({message: 'Задача удалена'})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось получить список планов'})
        }
    }
)

module.exports = router