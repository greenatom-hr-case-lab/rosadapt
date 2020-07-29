const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const authMW = require('../middleware/auth.middleware')
const User = require('../models/User')
const Plan = require('../models/Plan')
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
    '/planUser', authMW,
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