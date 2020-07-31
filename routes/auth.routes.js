const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const authMW = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()



// /api/auth/register
router.post(
    '/register',
    [
        check('firstName','Некорректное имя').exists(),
        check('middleName','Некорректное отчество').exists(),
        check('lastName','Некорректная фамилия').exists(),
        check('dept','Некорректный отдел').exists(),
        check('pos','Некорректная должность').exists()
    ], authMW,
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорретные данные при регистрации'
            })
        }

        const {firstName, middleName, lastName, role, dept, pos} = req.body

        //код создания логина
        const users = await User.find()
        let login = 'r' + (3420 + users.length)

        const candidate = await User.findOne({ login })
        if (candidate) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Пользователь уже существует'
            })
        }

        //создание пароля
        function randomString(i) {
            let rnd = ''
            while (rnd.length < i)
                rnd += Math.random().toString(36).substring(2)
            return rnd.substring(0, i)
        }
        const password = randomString(4);

        const hashedPassword = await bcrypt.hash(password, 12)

        //создание модели
        const user = new User({
            login,
            password: hashedPassword,
            passwordFirst: password,
            role,
            dept,
            pos,
            name: {
                firstName: firstName,
                middleName: middleName,
                lastName: lastName
            },
            hrLink: req.user.userId,
        })
        await user.save()
        await res.status(201).json({message: 'Профиль создан'})

    } catch (e) {
        await res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('login', 'Введите корректный логин').exists(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорретные данные при входе в систему'
            })
        }

        const {login, password} = req.body

        const user = await User.findOne({ login })

        if (!user) {
            return res.status(400).json({ message: 'Такого пользователя не существует'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            return res.status(400).json({ message: 'Пароль неверный, попробуйте снова'})
        }

        const token = jwt.sign(
            { userId: user.id
                    },
                    config.get('jwtSecret'),
            { expiresIn: '24h'}
        )
        await res.json({token, userId: user.id, userLogin: user.login, userRole: user.role, userData: user})

    } catch (e) {
        await res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = router