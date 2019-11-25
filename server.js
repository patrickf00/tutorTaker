/***********************

  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database

***********************/

const PORT = process.env.PORT || 3000; // Use either the port assigned by Heroku, or 3000
const DB = process.env.DATABASE_URL || {
	host: 'localhost',
	port: 5432,
	database: 'tutortaker',
	user: 'postgres',
	password: 'password'
}; // Use either database URL assigned by Heroku, or defaults

const express = require('express'); // Add the express framework has been added
var app = express();

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies
app.set('view engine', 'ejs');


//Create Database Connection
const pgp = require('pg-promise')();
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory
const dbConfig = DB;

//let db = pgp(dbConfig);
let db = pgp(dbConfig);
// set the view engine to ejs

app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory

// will render index page (renders as login)
app.get('/', function(req, res){
	res.render('pages/LoginPage',{})
});

/* will render the search page*/
app.get('/tutor-finder', function(req, res){
  var query1 = 'SELECT id, firstname, lastname, rating, subjects FROM users ORDER BY lastname ASC;';
  db.query(query1, task => {
      return task.batch([
          task.any(query1)
      ]);
  })
  .then(data => {
    console.log(data)
    res.render('pages/searchPage',{
        tutors: data
      })
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/searchPage',{
           tutors: ''
      })
  })
});
app.get('/tutor-finder/filter', function(req, res){
  var filterChoice = req.query.filterChoice;
  if(filterChoice == 1){
    var query1 = 'SELECT id, firstname, lastname, rating, subjects FROM users ORDER BY lastname ASC;';
  } else if(filterChoice == 2) {
    var query1 = 'SELECT id, firstname, lastname, rating, subjects FROM users ORDER BY rating DESC;'
  } else {
    var query1 = 'SELECT id, firstname, lastname, rating, subjects FROM users ORDER BY subjects ASC;'
  }

  db.query(query1, task => {
      return task.batch([
          task.any(query1)
      ]);
  })
  .then(data => {
    console.log(data)
    res.render('pages/searchPage',{
        tutors: data
      })
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/searchPage',{
           tutors: ''
      })
  })
});

// //will render base login page
// app.get('/login', function(req, res){
//   var query1 = 'SELECT username,pwdHash FROM Users;';
//   db.query(query1, task => {
//       return task.batch([
//           task.any(query1)
//       ]);
//   })
//   .then(data => {
//     console.log(data)
//     res.render('pages/LoginPage',{
//         users: data
//       })
//   })
//   .catch(err => {
//       // display error message in case an error
//       console.log('error', err);
//       res.render('pages/LoginPage',{
//            users: ''
//       })
//   })
// });

//will get request for verification process the login page
app.post('/login/verify', function(req, res){
  var username1 = req.body.verifyEmail;
  console.log(username1);
  var query1 = "SELECT pwdhash FROM users WHERE email = '" + username1 + "';";
  db.query(query1, task => {
      return task.batch([
          task.any(query1)
      ]);
  })
  .then(data => {
    console.log(data)
    res.render('pages/LoginPage',{
        users: data
      })
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/LoginPage',{
           users: ''
      })
  })
});

app.get('/profile', function(req, res){
  var query1 = 'SELECT reviewText';
  db.query(query1, task => {
      return task.batch([
          task.any(query1)
      ]);
  })
  .then(data => {
    console.log(data)
    res.render('pages/Profile',{
        users: data
      })
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/Profile',{
           users: ''
      })
  })
});



//will render base registration page
app.post('/regPage', function(req, res){
  var query1 = 'SELECT id FROM Users;';
  db.query(query1, task => {
      return task.batch([
          task.any(query1)
      ]);
  })
  .then(data => {
    console.log(data)
    res.render('pages/regPage',{
        users: data
      })
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/regPage',{
           users: ''
      })
  })
});


//will enter someones data to the db
app.post('/regPage/valid', function(req, res){
  var complete = formDone();
  if (complete) {
  	var fname = req.body.fName;
	var lname = req.body.lName;
	var school = req.body.school;
	var studentStatus1 = req.body.studentStatus;
	if(studentStatus1 == "None"){
	  var studentStatus = true;
	}
	else{
	  var studentStatus = false;
	}
	var tutorStatus1 = req.body.tutorStatus;
	if(tutorStatus1 == "None"){
	  var tutorStatus = true;
	}
	else{
	  var tutorStatus = false;
	}
	var yearStatus = req.body.yearStatus;
	if(yearStatus == ""){
	  yearStatus ="NULL";
	}
	var subjectStatus = req.body.subjectStatus;
	if(subjectStatus == ""){
	  subjectStatus ="NULL";
	}
	var email = req.body.email;
	var password = req.body.password;
	var pronouns = "they,them"; //temp till added to reg page
	var username ="user" //temp till added to reg page
	var rating = 10;
	var price = 0.00; //temp till added to reg page
	console.log(fname);
	console.log(lname);
	console.log(school);
	console.log(studentStatus);
	console.log(tutorStatus);
	console.log(yearStatus);
	console.log(subjectStatus);
	console.log(email);
	console.log(password);
	res.render('pages/regPage',{})
    var sql = "INSERT INTO Users (lastName, firstName, pronouns, username,pwdHash,tutor,student,rating,location,schoolLevel,subjects,price,email) VALUES ('" + lname + "','" + fname + "','"+ pronouns + "','" + username + "','" + password + "','" + tutorStatus+ "','" + studentStatus + "'," + rating + ",'" + school + "','" + yearStatus+ "','" + subjectStatus+ "', " + price + ",'" + email + "');";
    db.query(sql, function (err, result) {
    if (err) throw err;
      console.log("1 row inserted");
    });
  } else{
  	res.render('pages/regPage',{})
 };




app.listen(PORT);
console.log(PORT + ' is the magic port');
