const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    done: {
        type: Boolean,
        default: false
    },
    headLink: {
        type: Types.ObjectId,
        ref: 'User'
    },
    tyroLink: {
        type: Types.ObjectId,
        ref: 'User'
    },
    hrLink: {
        type: Types.ObjectId,
        ref: 'User'
    },
    mark: String,
    comm: String,
    level: {
        type: Number,
        default: 1
    },
    date:{
        dateStart: {
            type: Date,
            required: true
        },
        dateEnd: {
            type: Date,
            required: true
        },
        dateFinished: {
            type: Date
        },
        created: {
            type: Date,
            default: Date.now
        }
    }
})

module.exports = model('Plan', schema)
