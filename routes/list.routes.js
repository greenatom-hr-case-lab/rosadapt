const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const authMW = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

router.post(
    '/listUsers', authMW,
    async (req, res) => {
        try {
            const {role, sub} = req.body

            let users
            switch (role + sub) {sort( { "item.category": 1, "item.type": 1 } )
                case 'tyroown':
                    users = await User.find({ role, hrLink: req.user.userId}).sort({ "role": 1, "name.lastName": 1})
                    break
                case 'tyroall':
                    users = await User.find({ role }).sort({ "role": 1, "name.lastName": 1})
                    break
                case 'allall':
                    users = await User.find().sort({ "role": 1, "name.lastName": 1})
                    break
                default:
                    break
            }

            await res.json({users})

        } catch (e) {
            await res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

module.exports = router