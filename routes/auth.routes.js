const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Tyro = require('../models/Tyro')
const Head = require('../models/Tyro')
const Hr = require('../models/Hr')
const router = Router()



// /api/auth/register
router.post(
    '/register',
    [
        check('login','Некорректный логин').exists(),
        check('password', 'Минимальная длина пароля 4 символа').isLength({ min: 4})
    ],
    async (req, res) => {
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорретные данные при регистрации'
            })
        }

        const {login, password, role, firstName, middleName, lastName} = req.body

        //const candidate = await User.findOne({ login: login })

        // if (candidate){
        //     return res.status(400).json({ message: 'Такой сотрудник уже существует в базе' })
        // }

        const hashedPassword = await bcrypt.hash(password, 12)
        //console.log('2',req.body)
        const user = new Tyro({ 
            login: login, 
            password: hashedPassword, 
            role: role, 
            name: {
                firstName: firstName, 
                middleName: middleName, 
                lastName: lastName
            } 
        })
        // switch (role) {
        //     case 'Стажёр':
        //         //console.log(login, password, role, firstName, middleName, lastName)
        //         //user = new Tyro({ login, password: hashedPassword, role, firstName, middleName, lastName })
        //         break;
        
        //     default:
        //         break;
        // }
        //const user = new Tyro({ login, password: hashedPassword })
        console.log(user)
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

        //const user = await User.findOne({ login })

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
            { expiresIn: '1h'}
        )

        await res.json({token, userId: user.id, userLogin: user.login})

    } catch (e) {
        await res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = router