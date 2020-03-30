var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const dbConnection = require('../database');
const { body, validationResult } = require('express-validator');


router.get('/login', function (re, res, next) {
    res.render('login', { page: 'Login', menuId: 'login' });
});

router.get('/register', function (req, res, next) {
    res.render('signup', { page: 'SignUp', menuId: 'signup' });
});

router.post('/login', 
    [
        body('email', 'Invalid email address!').isEmail().custom((value) => {
            return checkEmail(value).then(user =>{
                if(user.length == 0){
                    return Promise.reject('No User Found');
                }
                return true;
            })
        })
    ],
    function (req, res, next) {
        const validation_result = validationResult(req);
        if(validation_result.isEmpty()){
            getUser(req.body.email, req.body.password).then(result=>{
                console.log("result", result);
                if(result){
                    res.send(`correct password`);
                }else{
                    res.send(`Incorrect password`);
                }
            }).catch(err =>{
                if(err) throw err;
            })
        }else{
            let allErrors = validation_result.errors.map((error) => {
                return error.msg;
            });
            res.render('login', {
                register_error: allErrors,
                old_data: req.body,
                page: 'login',
                menuId: 'login'
            });
        }
});

router.post('/register',
    [
        body('email', 'Invalid email address!').isEmail().custom((value) => {
            return checkEmail(value).then(user => {
                if (user.length > 0) {
                    return Promise.reject('This E-mail already in use!');
                }
                return true;
            });
        }),
        // body('username', 'Username is Empty!').trim().not().isEmpty(),
        body('password', 'The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
    ],
    function (req, res, next) {
        const validation_result = validationResult(req);
        if (validation_result.isEmpty()) {
            createUser(req).then(result => {
                if(result){
                    console.log("result", result);
                    res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
                }
            }).catch(err => {
                if (err) throw err;
            })
        }
        else {
            // COLLECT ALL THE VALIDATION ERRORS
            let allErrors = validation_result.errors.map((error) => {
                return error.msg;
            });
            // REDERING login-register PAGE WITH VALIDATION ERRORS
            res.render('signup', {
                register_error: allErrors,
                old_data: req.body,
                page: 'SignUp',
                menuId: 'signup'
            });
        }

    });

router.get('/fetch', function (req, res, next) {
    dbConnection.query('SELECT * FROM `contact_us`', function (error, result, fields) {
        console.log("result", result);
        if(result){
            res.render('fetch', { page: 'Fetch', menuId: 'fetch', 'result': result});
        }else{
            res.render('fect', { page: 'Fetch', menuId: 'fetch', 'result': 'eroor'});
        }
    })
});


function checkEmail(email) {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT `email` FROM `users` WHERE `email`=?', [email], function (error, result, fields) {
            resolve(result);
        });
    });
}

function createUser(req) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const date = new Date();
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12).then((password) => {
            dbConnection.query("INSERT INTO `users` (`name`,`email`,`password`,`date_created`) VALUES(?,?,?,?)", [name, email, password, date], function (error, result, fields) {
                if(error){
                    reject(error);
                }else{
                    let inserted_id = result.insertId;
                    resolve(inserted_id);
                }
            })
        }).catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    });
}

function getUser(email, password) {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT `password` FROM `users` WHERE `email`=?', [email], function (error, result, fields) {
            bcrypt.compare(password, result[0].password, function(err, result){
                if(result == true){
                    return resolve(true);; 
                }else{
                    resolve(false);
                }
            })
        })
        
    });
}

module.exports = router;