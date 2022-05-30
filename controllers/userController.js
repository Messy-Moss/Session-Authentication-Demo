const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword });

        await newUser.save();
        res.redirect('/home');
    } catch (err) {
        console.log(err);
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.redirect('/login');

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.redirect('/login');

        req.session.userId = user._id;

        res.redirect('/home');
    } catch (err) {
        console.log(err);
    }
}

exports.logout = (req, res) => {
    req.session.destroy( err => {
        if (err) return res.redirect('/home');
    });
    res.redirect('/login');
}
