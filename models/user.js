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
    role: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    pos: {
        type: String,
        required: true
    },
    headLink: { 
        type: Types.ObjectId, 
        ref: 'User'
    },
    dates: {
        dateB: Date,
        dateStart: { 
            type: Date,
            default: Date.now
        },
        dateEnd: Date,
        dateCreated: { 
            type: Date,
            default: Date.now
        }
    },
    email: {
        address:{
            type: String,
            unique: true
        },
        visAll: {
            type: Boolean,
            default: false
        },
        visSub: {
            type: Boolean,
            default: false
        }
    },
    phone: {
        number:{
            type: Number,
            unique: true
        },
        visAll: {
            type: Boolean,
            default: false
        },
        visSub: {
            type: Boolean,
            default: false
        }
    }
})

module.exports = model('User', schema)
    