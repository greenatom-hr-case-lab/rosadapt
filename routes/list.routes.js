const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const authMW = require('../middleware/auth.middleware')
const User = require('../models/User')
const Plan = require('../models/Plan')
const Task = require('../models/Task')
const router = Router()

router.post(
    '/listUsers', authMW,
    async (req, res) => {
        try {

            const users = await User.find( ).sort({ "planLink": 1, "role": 1, "name.lastName": 1})
            await res.json({users})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось получить список пользователей'})
        }
    }
)

router.post(
    '/plans', authMW,
    async (req, res) => {
        try {
            const { tyroId } = req.body
            if ( !!tyroId ) {
                const plan = await Plan.find({ tyroLink: tyroId })
                if (plan.length === 0) plan[0] = 0
                await res.json({plan})
            }
            else {
                const plans = await Plan.find()
                await res.json({plans})
            }
        } catch (e) {
            await res.status(500).json({message: 'Не удалось получить список планов'})
        }
    }
)

router.get(
    '/plan/:id', authMW,
    async (req, res) => {
        try {
            const userPrbly = await User.findById(req.params.id)
            if (userPrbly){
                const plans = await Plan.find({tyroLink: userPrbly._id})

                if (plans.length !== 0) {
                    const tasks = await Task.find({planLink: plans[0]._id}).sort({"date.dateStart": 1})
                    await res.json({plan: plans[0], tasks})
                } else await res.json({})

            } else {
                const plan = await Plan.findById(req.params.id)
                const tasks = await Task.find({planLink: req.params.id}).sort({"date.dateStart": 1})
                await res.json({plan,tasks})
            }
        } catch (e) {
            await res.status(500).json({message: 'Не удалось получить информацию о плане'})
        }
    }
)

router.get(
    '/user/:id', authMW,
    async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            await res.json({user})
        } catch (e) {
            await res.status(500).json({message: 'Не удалось получить информацию о стажёре'})
        }
    }
)

module.exports = router