const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    planLink: {
        type: Types.ObjectId, 
        ref: 'Plan'
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
        dateFinished: Date,
        created: { 
            type: Date,
            default: Date.now
        }
    }
})

module.exports = model('Task', schema)
    