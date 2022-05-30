const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'please, provide a valid email']
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    membershipStatus: {
        type: String
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }]
});

module.exports = new mongoose.model('User', userSchema);
