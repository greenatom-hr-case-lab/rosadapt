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
    headLink: { 
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
    