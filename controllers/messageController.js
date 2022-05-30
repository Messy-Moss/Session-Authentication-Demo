const { ObjectId } = require('mongodb');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Mongoose = require('mongoose');

exports.createMessage = async (req, res) => {
    try {
        const newMessage = await Message.create({ ...req.body, owner: ObjectId(req.session.userId) });
        const currentUser = await User.findById(req.session.userId);

        currentUser.messages.push(newMessage._id);
        await currentUser.save();

        res.redirect('/home');
    } catch (err) {
        console.log(err);
    }
}