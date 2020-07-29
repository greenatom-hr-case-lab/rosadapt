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
    passwordFirst: {
      type: String,
      required: true
    },
    activated: {
        type: Boolean,
        default: true
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
    hrLink: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    planLink: {
        type: Types.ObjectId,
        ref: 'Plan',
        default: null
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('User', schema)