const {Router} = require('express')
const {Types} = require('mongoose')
const authMW = require('../middleware/auth.middleware')
const Plan = require('../models/Plan')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const router = Router()

router.post(
    '/createPlan',
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

            const {tyroLink, headLink, probationStart, probationEnd} = req.body
            const plan = new Plan({
                tyroLink,
                headLink,
                hrLink: req.user.userId,
                date: {
                    dateStart: probationStart,
                    dateEnd: probationEnd
                },
            })

            User.findById(tyroLink, function(err, tyro) {
                if (err) throw err
                tyro.planLink = plan._id
                tyro.save()
            })

            await plan.save()
            await res.status(201).json({message: 'План создан'})
        } catch (e) {
            await res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

router.post(
    '/createTask', authMW,
    async (req, res) => {
        try {
            const plans = await Plan.find( )
            await res.json({plans})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось получить список планов'})
        }
    }
)

module.exports = router