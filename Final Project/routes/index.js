
const path = require('path');
const auth = require('http-auth');
const bcrypt = require('bcryptjs');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd')
});

const express = require('express');
const mongoose = require('mongoose');
const {check, validationResult } = require ('express-validator');

const passport = require('passport');

const router = express.Router();
const Registration = mongoose.model('Registration');

const User = require('../models/Registration')


router.get('/login', function(req, res) {
    res.render('login', {title: 'Shop'});
});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, theUser, errorMessage) => {
      if (!theUser) {
        // Unauthorized
        res.render('login', {errorMessage: 'Wrong password or username'}); 
        return;
      }
  
      // save user in session: req.user
      req.login(theUser, (err) => {
        if (err) {
          // Session save went bad
          return next(err);
        }
  
        // All good, we are now logged in and `req.user` is now set
        res.redirect('/layout')
      });
    })(req, res, next);
});


router.get('/layout', function(req, res) {
    res.render('layout', {title: 'Shop'});
});

router.get('/mencollection', function(req, res) {
    res.render('mencollection', {title: 'Shoping'});
});

router.get('/femalecollection', function(req, res) {
    res.render('femalecollection', {title: 'Shoping'});
});
// 
router.get('/register', function(req, res) {
    res.render('register', {title: 'Registration form'});
});
// 

router.get('/', function(req, res) {
    res.render('form', {title: 'Registration form'});
});

router.get('/registrants',basic.check((req, res) => {
    Registration.find()
        .then((registrations) => {
            res.render('registrants', {title: 'Listing registrants', registrations});
        })
        .catch(() => {res.send('Sorry! Something went wrong.');});
    
}));


router.post('/',
    [
    check('name')
        .isLength({ min: 1 })
        .withMessage('Please enter a name'),
    check('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),    
    check('username')
        .isLength({ min: 1 })
        .withMessage('Please enter an username'),     
    check('password')
        .isLength({ min: 1 })
        .withMessage('Please enter a password'),     
    ],
    async (req, res) => { //function -> async
        // console.log(req.body);
        const errors = validationResult(req);
        if(errors.isEmpty()){
           const mySchema = new Registration(req.body);
           //generate salt to hash password
           const salt = await bcrypt.genSalt(10);
           //set user passward t hashed password
           mySchema.password = await bcrypt.hash(mySchema.password, salt);
           mySchema.save()
            .then(()=>{res.render('thankyou', { title: 'Thankyou form'});})
            .catch((err) => {
                console.log(err);
                res.send('Sorry! Something went wrong.');
            });
        }  else {
            res.render('register', {
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
            });
        }       
    }
);

module.exports = router;