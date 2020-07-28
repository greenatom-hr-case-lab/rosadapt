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
        // function rus_to_latin ( str ) {
    
        //     var ru = {
        //         'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
        //         'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 
        //         'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
        //         'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
        //         'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 
        //         'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
        //     }, n_str = [];
            
        //     str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
            
        //     for ( var i = 0; i < str.length; ++i ) {
        //        n_str.push(
        //               ru[ str[i] ]
        //            || ru[ str[i].toLowerCase() ] == undefined && str[i]
        //            || ru[ str[i].toLowerCase() ].replace(/^(.)/, function ( match ) { return match.toUpperCase() })
        //        );
        //     }
            
        //     return n_str.join('');
        // }
        //var login = rus_to_latin(lastName).toLowerCase() + '.' + rus_to_latin(firstName)[0].toLowerCase() + '.' + rus_to_latin(middleName)[0].toLowerCase()
        //проверка существования логина

        const users = await User.find()
        let login = 'r' + (3400 + users.length)

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

        const hashedPassword = password //await bcrypt.hash(password, 12)
        //создание модели
        const user = new User({
            login,
            password: hashedPassword,
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
        //await user.save()
        console.log(user)
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