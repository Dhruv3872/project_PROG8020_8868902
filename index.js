const express = require('express');
const {check, validationResult} = require('express-validator');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const session = require('express-session');
mongoose.connect('mongodb://localhost:27017/8020project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//define the model:
const User = mongoose.model('User', {
  userName : String,
  password : String
});
let myApp = express();
// set up the session middleware
myApp.use(session({
  secret: 'voldemort',
  resave: false,
  saveUninitialized: true
}));
myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');
myApp.use(express.urlencoded({ extended: false }));
myApp.use(fileUpload());
myApp.get('/', (req,res) => {
    res.render('home');
});

myApp.get('/login', (req,res) => {
  res.render('login');
});

myApp.post('/thankForSubmission', (req,res) =>{
  var imageName = req.files.photo.name;
  var image = req.files.photo;
  var imagePath = 'public/uploads/requests/' + imageName;
  image.mv(imagePath, function(err){
    console.log(err);
  });
  res.render('thankYouForSubmission');
});

myApp.get('/dashboard', (req,res) => {
  res.render('dashboard');
});
myApp.post('/verifyLogin', (req,res) =>{
  var user = req.body.username;
  var pw = req.body.password;
  // console.log(req.body);
  // console.log(user);
  // console.log(pw);
  User.findOne({userName : user, password : pw}).exec(function(err, user){
    // set up the session variables for logged in users
    console.log('Errors: ' + err);
    // console.log(user);
    if(user){
      console.log("user");
      req.session.user = user.user;
      req.session.loggedIn = true;
      //redirect to admin dashboard:
      res.redirect('/dashboard');
    }
    else{
      res.redirect('/login');
    }
  });
});
  
  /* exec(function(err, user){
    // set up the session variables for logged in users
    if(user){
      req.session.user = user.username;
      req.session.loggedIn = true;
      //redirect to admin dashboard:
      res.redirect('/dashboard');
    }
    else{
      res.render('dashboard');//, {error: 'Incorrect username/password'});
    }
  });
}); */
myApp.listen(8081);
  console.log('Everthing executed fine.. Open http://localhost:8081/');