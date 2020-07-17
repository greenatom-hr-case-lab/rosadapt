const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number,
        unique: true
    },
    name:{
        firstName: {
            type: String,
            required: true
        },
        middleName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    dept: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    bday: Date,
    created: { 
        type: Date,
        default: Date.now
    }
})

module.exports = model('Head', schema)
    