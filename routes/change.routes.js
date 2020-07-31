const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const authMW = require('../middleware/auth.middleware')
const User = require('../models/User')
const Plan = require('../models/Plan')
const Task = require('../models/Task')
const {check, validationResult} = require('express-validator')
const router = Router()

router.get(
    '/plan/levelUp/:id', authMW,
    async (req, res) => {
        try {
            const plan = await Plan.findById(req.params.id)
            plan.level++
            plan.save()
            await res.json({message: 'Отправлено'})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось повысить уровень'})
        }
    }
)
router.get(
    '/plan/levelDown/:id', authMW,
    async (req, res) => {
        try {
            const plan = await Plan.findById(req.params.id)
            plan.level--
            plan.save()
            await res.json({message: 'Возвращено'})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось понизить уровень'})
        }
    }
)
router.post(
    '/plan/done/:id',
    [
        check('dateFinished','Некорректное дата окончания').exists(),
        check('mark','Некорректная оценка').exists(),
        check('comm','Некорректный комментарий').exists()
    ], authMW,
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорретные данные'
            })
        }

        try {
            const {dateFinished, mark, comm} = req.body

            const plan = await Plan.findById(req.params.id)
            plan.mark = mark
            plan.comm = comm
            plan.done = true
            plan.date.dateFinished = dateFinished
            plan.save()
            await res.json({message: 'Выполнен'})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось понизить уровень'})
        }
    }
)

router.get(
    '/task/done/:id', authMW,
    async (req, res) => {
        try {
            const task = await Task.findById(req.params.id)
            task.done = true
            task.save()

            const plan = await Plan.findById(task.planLink)
            plan.countsOfDoneTasks++
            plan.save()
            await res.json({message: 'Завершено'})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось завершить задание'})
        }
    }
)
router.get(
    '/task/undone/:id', authMW,
    async (req, res) => {
        try {
            const task = await Task.findById(req.params.id)
            task.done = false
            task.save()

            const plan = await Plan.findById(task.planLink)
            plan.countsOfDoneTasks--
            plan.save()
            await res.json({message: 'Возвращено'})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось вернуть задание'})
        }
    }
)

module.exports = router

// $('#percent').on('change', function(){
//     var val = parseInt($(this).val());
//     var $circle = $('#svg #bar');
//
//     if (isNaN(val)) {
//         val = 100;
//     }
//     else{
//         var r = $circle.attr('r');
//         var c = Math.PI*(r*2);
//
//         if (val < 0) { val = 0;}
//         if (val > 100) { val = 100;}
//
//         var pct = ((100-val)/100)*c;
//
//         $circle.css({ strokeDashoffset: pct});
//
//         $('#cont').attr('data-pct',val);
//     }
// });