var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const dbConnection = require('../database');
const { body, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});

router.get('/about', function(req, res, next) {
  res.render('about', {page:'About Us', menuId:'about'});
});

router.get('/services', function(req, res, next) {
  res.render('services', {page:'IT Services', menuId:'services'});
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {page:'Contact Us', menuId:'contact'});
});

router.post('/submit', function(req, res, next) {
  console.log("tessstt",req.body.lastname);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dattatechconsulting@gmail.com',
      pass: 'Datta@123'
    }
  });

  var content = 'Name: '+ req.body.lastname+', '+ req.body.firstname + '\n';
    content+= 'Phone: ' + req.body.phone + '\n' + 'Email: ' + req.body.email + '\n';
    content+= 'Msg :' + req.body.text;
  
  var mailOptions = {
    from: 'dattatech12@outlook.com',
    // to: 'sandhu.hardilpreet@gmail.com',
    to: 'info@dattatechconsulting.com',
    subject: req.body.subject,
    text: content
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      saveData(req).then(result=>{
        if(result){
          console.log('Record save: ' + info.response);
          res.render('submit', {page:'Contact Us', menuId:'contact', response:"sucess", msg: "Thanks for the message! We‘ll be in touch :)"});
        }else{
          console.log('Email sent: ' + info.response);
          res.render('submit', {page:'Contact Us', menuId:'contact', response:"sucess", msg: "Thanks for the message! We‘ll be in touch :)"});
        }
      })
    }
  });
});

router.get('/jobs', function(req, res, next) {
  res.render('jobs', {page:'Jobs ', menuId:'job', response:"sucess", msg: "THERE ARE CURRENTLY NO VACANCIES AVAILABLE :)"});
});

function saveData(req){
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const phone = req.body.phone;
  const subject = req.body.subject;
  const text = req.body.text;
  const date = new Date();
  return new Promise((resolve, reject) => {
        dbConnection.query("INSERT INTO `contact_us` (`firstname`, `lastname`,`email`,`phone`,`subject`,`text`,`date_created`) VALUES(?,?,?,?,?,?,?)", 
            [firstname, lastname, email, phone, subject, text, date], function (error, result, fields) {
            if(error){
                reject(error);
            }else{
                let inserted_id = result.insertId;
                resolve(inserted_id);
            }
      })
  });
}

module.exports = router;
