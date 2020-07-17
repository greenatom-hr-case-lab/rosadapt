const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name:{
        type: String,
        required: true
    },
    dateStart: { 
        type: Date,
        default: Date.now
    },
    dateEnd: { 
        type: Date,
        //required: true
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
    tyroLink: { 
        type: Types.ObjectId, 
        ref: 'tyro'
    },
    created: { 
        type: Date,
        default: Date.now
    }
})

module.exports = model('Skill', schema)
    