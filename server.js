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
const session = require('express-session');
const Chatkit = require('@pusher/chatkit-server');
const cookieParser = require('cookie-parser')
var app = express();

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:72542696-9aeb-4905-b562-282191c1d894",
  key: "64bdf710-c3dc-467a-93d7-93b3d80ee827:MyNNpPQs0Xw86nvuNqWvnyyI/L4ICIShSqsgVQmDjnk="
});

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(session({
  secret: 'yeet',
  resave: false,
  saveUninitialized: true
})); // Add the session handler
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies
app.use(cookieParser()); // Add cookie parser tool
app.set('view engine', 'ejs');


//Create Database Connection
const pgp = require('pg-promise')();
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory
const dbConfig = DB;

//let db = pgp(dbConfig);
let db = pgp(dbConfig);
// set the view engine to ejs

// Create a match between a student & tutor - add to database & create chat room
// Unimplemented
function createMatch(studentID, tutorID){
  var query = "INSERT INTO Matches (studentid, tutorid) VALUES ('" + studentID + "', '" + tutorID + "'); " +
    "SELECT matchid FROM Matches WHERE studentid = '" + studentID + "' AND tutorid = '" + tutorID + "'; " +
    "SELECT fname FROM Users WHERE id = '" + studentID + "'; "
    "SELECT fname FROM Users WHERE id = '" + tutorID + "';";
  db.query(query, task => {
    return task.batch([
      task.any(query)
    ]);
  })
  .then(data => {
    roomId = data[0]['id'].toString();
    studentName = data[1]['fname'];
    tutorName = data[2]['fname'];
    chatkit.createRoom({
      id: roomId,
      creatorId: studentID,
      name: "Chat: " + studentName + " - " + tutorName
    })
    .then(() => console.log("Room created successfully"))
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
}

app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory

// will render index page (renders as login)
app.get('/', function(req, res){
	res.redirect('/login')
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
app.get('/login', function(req, res){
  res.render('pages/LoginPage');
});

//will get request for verification process the login page
app.post('/login/verify', function(req, res){
  var username1 = req.body.verifyEmail;
  console.log(username1);
  var query1 = "SELECT username, email, id, pwdhash, lastName, firstName FROM users WHERE username = '" + username1 + "';";
  db.query(query1, task => {
      return task.batch([
          task.any(query1)
      ]);
  })
  .then(data => {
    if(!data){ // User not found in DB
      //TODO: display user not found message & redirect to registration page
      res.render('pages/regPage');
    }else if(req.body.verifyPwd != data[0].pwdhash){ // Username doesn't match password
      // Placeholder for now
      console.log("Incorrect password");
      console.log("Input password = " + req.body.verifyPwd);
      console.log(typeof req.body.verifyPwd);
      console.log(typeof data[0].pwdhash);
      console.log(String(req.body.verifyPwd) != String(data[0].pwdhash));
      console.log(data[0]);
      res.render('pages/regPage'); //TODO: display password error
    }else{ // Successful login
      // Set user session data & redirect to profile
      sess=req.session;
      sess.username = data[0].username;
      sess.email = data[0].email;
      sess.uid = data[0].id;
      sess.name = [data[0].lastname, data[0].firstname];
      res.cookie('uid', sess.uid);
      res.redirect('/profile');
      console.log(sess);
    }
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
  defaultUser = [{
    id: '',
    lastname: '',
    firstname: '',
    pronouns: '',
    username: '',
    email: '',
    pwdhash: '',
    tutor: false,
    student: false,
    rating: 0,
    location: '',
    schoollevel: '',
    subjects: '',
    price: ''
  }]
  if(!req.session.uid){
    console.log("Rendering for empty user");
    res.render('pages/Profile',{
      user: defaultUser
    });
  }else{
    var query1 = "SELECT * FROM users WHERE id='" + req.session.uid + "';";
    var userData;
    db.query(query1, task => {
      return task.batch(
        task.any(query1)
      );
    })
    .then(data => {
      console.log("User data:", data[0]);
      userData = data[0];
    })
    .catch(err => console.log(err));

    // gets all feed back for user
    var query2 = "SELECT reviewtext FROM feedback WHERE userid= '" + req.session.uid + "';";
    db.query(query2, task => {
      return task.batch([
        task.any(query2)
      ]);
    })
    .then(queryFeedback => {
      // TODO: Add redirect for users who aren't logged in (session undefined)
      // Default user values to avoid crashing when someone isn't logged in
      console.log("Rendering for valid user");
      //console.log(queryFeedback[0].reviewtext);
      if (feedback){ 
        res.render('pages/Profile',{
        user: userData,
        feedback: queryFeedback[0]
        })
      } else {
        res.render('pages/Profile',{
        user: userData,
        feedback: null
        })
      }
      
    })
    .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/Profile',{
        user: '',
        feedback: ''
      })
    })
  }
});

//will render base registration page
app.post('/regPage', function(req, res){
  res.render('pages/regPage');
});

//will enter someones data to the db
app.post('/regPage/valid', function(req, res){
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
  var pronouns = req.body.pronouns;
  var username =req.body.username;
  var rating = 10;
  var price = Number(req.body.wage);
  console.log(fname);
  console.log(lname);
  console.log(school);
  console.log(studentStatus);
  console.log(tutorStatus);
  console.log(yearStatus);
  console.log(subjectStatus);
  console.log(email);
  console.log(password);
  var sql = "INSERT INTO Users (lastName, firstName, pronouns, username,pwdHash,tutor,student,rating,location,schoolLevel,subjects,price,email) VALUES ('" + lname + "','" + fname + "','"+ pronouns + "','" + username + "','" + password + "','" + tutorStatus+ "','" + studentStatus + "'," + rating + ",'" + school + "','" + yearStatus+ "','" + subjectStatus+ "', " + price + ",'" + email + "'); " +
    "SELECT id FROM Users WHERE email='" + email + "';";
  db.query(sql, task => {
    return task.batch([
        task.any(sql2)
    ]);
  })
  .then(data => {
    uid = data[0]['id'].toString();
    console.log("User ID:", uid, "for", fname, lname);
    chatkit.createUser({
      id: uid,
      name: fname + " " + lname
    })
    .then(() => console.log("Chatkit user created successfully"))
    .catch((err) => console.log(err));
    res.redirect('/login');
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/regPage')
  })
});

app.listen(PORT);
console.log(PORT + ' is the magic port');
