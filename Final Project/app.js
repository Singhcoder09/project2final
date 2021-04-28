const express = require('express');
const path = require('path');
const routes = require('./routes/index');
//const routes1 = require('./routes/register');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');

const expressSession = require("express-session");
const MongoStore = require('connect-mongo');
const User = require('./models/Registration');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(expressSession({
    secret: "our-passport-local-strategy-app",
    resave :false,
    saveUninitialized: true,
    cookie : {
            maxAge:(1000 * 60 * 100)
    }
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);
app.use(express.static('public'));

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id)
        .then(user => cb(null, user))
        .catch(err => cb(err))
    ;
});

passport.use(new LocalStrategy({passReqToCallback: true},(...args) => {
    const [req,,, done] = args;

    const {username, password} = req.body;

    User.findOne({username})
    .then(user => {
        if (!user) {
        return done(null, false, { message: "Incorrect username" });
        }
        
        if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" });
        }
    
        done(null, user);
    })
    .catch(err => done(err))
    ;
}
));

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
// 
//app.use('/', routes1);
app.use(express.static('public'));

module.exports = app;