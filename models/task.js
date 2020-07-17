const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    skill: {
        type: Boolean,
        default: false
    },
    name:{
        type: String,
        required: true
    },
    mentor: {
        type: String
    },
    valuation: String,
    signatureName: String,
    done: {
        type: Boolean,
        default: false
    },
    userLink: { 
        type: Types.ObjectId, 
        ref: 'User'
    },
    date:{
        dateStart: {
            type: Date,
            default: Date.now,
            required: true
        },
        dateEnd: { 
            type: Date,
            required: true
        },
        created: { 
            type: Date,
            default: Date.now
        }
    }
})

module.exports = model('Task', schema)
    