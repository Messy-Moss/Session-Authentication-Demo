const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const { createMessage } = require('./controllers/messageController');
const { createUser, login, logout } = require('./controllers/userController');
const Message = require('./models/messageModel');
const User = require('./models/userModel');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('public'));

app.use(express.json());

app.use(express.urlencoded({ extended:false }));

const isAuth = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/login');
}

const store = new MongoDBSession({
    uri: process.env.DB_STRING,
    collection: 'user-sessions'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));

mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(conn => {
    console.log('db connection successful')
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', async (req, res) => {

    const numPerPage = 4;

    const numOfPages = Math.ceil(await Message.find().count() / numPerPage);

    const allMessages = await Message.find()
        .sort({ createdAt: -1 })
        .skip(numPerPage * req.query.page)
        .limit(numPerPage);
    
    for (const message of allMessages) {
        const user = await User.findById(message.owner);
        message.owner = user;
    }

    res.render('home', { messages:  allMessages, isAuth: req.session.userId ? true : false, numOfPages });
});

app.get('/register', (req, res) => {
    res.render('register', { isAuth: req.session.userId ? true : false });
});

app.get('/login', (req, res) => {
    res.render('login', { isAuth: req.session.userId ? true : false });
});

app.get('/create-message', isAuth, (req, res) => {
    res.render('createMessage', { isAuth: req.session.userId ? true : false });
});

app.post('/create-message', createMessage);

app.post('/user', createUser);

app.post('/login', login);

app.post('/logout', logout);