const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'I am new!'
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
})
userSchema.index({ email: 1 });
module.exports = mongoose.model('User', userSchema);