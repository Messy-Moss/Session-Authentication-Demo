const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        trim: true,
        maxlength: 200
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
module.exports = new mongoose.model('Message', messageSchema);