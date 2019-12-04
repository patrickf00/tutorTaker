/***********************

  Load Components!

  Express         - A Node.js Framework
  Express-session - An addition to Express to deal with user sessions
  Body-Parser     - A tool to help parse the data in a post request
  Cookie-Parser   - A tool to help parse cookie data
  Pg-Promise      - A database tool to help use connect to our PostgreSQL database
  Chatkit         - A chat API

***********************/

// Set port & db config variables (from env or defaults)
const PORT = process.env.PORT || 3000; // Use either the port assigned by Heroku, or 3000
const DB = process.env.DATABASE_URL || {
	host: 'localhost',
	port: 5432,
	database: 'tutortaker',
	user: 'postgres',
	password: 'password'
}; // Use either database URL assigned by Heroku, or defaults

// Dependencies
const express = require('express'); // Add the express framework has been added
const session = require('express-session');
const bodyParser = require('body-parser'); // Add the body-parser tool has been added
const cookieParser = require('cookie-parser')
const pgp = require('pg-promise')();
const Chatkit = require('@pusher/chatkit-server');

// Chatkit initialization
const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:72542696-9aeb-4905-b562-282191c1d894",
  key: "64bdf710-c3dc-467a-93d7-93b3d80ee827:MyNNpPQs0Xw86nvuNqWvnyyI/L4ICIShSqsgVQmDjnk="
});

// Middleware & path names
var app = express();
app.use(session({
  secret: 'yeet',
  resave: false,
  saveUninitialized: true
})); // Add the session handler
app.use(bodyParser.json()); // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies
app.use(cookieParser()); // Add cookie parser tool
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory
app.set('view engine', 'ejs'); // Set the view engine to ejs


// Create Database Connection
let db = pgp(DB);

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

// will render index page (renders as login)
app.get('/', function(req, res){
	res.redirect('/login')
});

//will render base about page
app.get('/About', function(req, res){
  res.render('pages/About');
});

//will render base login page
app.get('/login', function(req, res){
  res.render('pages/LoginPage', {
    incorrectLogin: false,
    redirectToLogin: false
  });
  req.session.destroy();
});

//will render settings page
app.get('/settings', function(req, res){
  res.render('pages/settings');
});

app.get('/editBio', function(req, res){
  res.render('pages/editBio')
});

app.post('/editBio/valid', function(req, res){

  var isTutor = false;
  var isStudent = false;
  var statusQuery = "SELECT tutor, student FROM Users WHERE id='" + req.session.uid + "';";
  db.query(statusQuery, task => {
    return task.batch(
      task.any(statusQuery)
    );
  })
  .then(data => {
    isTutor = data.tutor;
    isStudent = data.student;
    console.log(data);
  })
  .catch(err => console.log(err));

  console.log("Body:", req.body);
  var changes = {
      "lastName": req.body.lName,
      "firstName": req.body.fName,
      "pronouns": req.body.pronouns,
      "tutor": isTutor,
      "student": isStudent,
      "location": req.body.school,
      "subject": req.body.subject,
      "bio": req.body.bio
  };
  var update = "UPDATE Users SET ";
  var element;
  for(element in changes){
    if(changes[element] != ""){
      if(element == "tutor" || element == "student"){
        if((req.body.tutorStatus != "None") != isTutor){
          isTutor = !isTutor;
        }else if((req.body.studentStatus != "None") != isStudent){
          isStudent = !isStudent;
        }
      }
      update += element + "='" + changes[element] + "', ";
    }
  }
  update = update.substr(0, update.length - 3);
  update += "' WHERE id='" + req.session.uid + "';";

  db.query(update, task => {
    task.batch(
      task.any(update)
    );
  })
  .then(data => {
    res.redirect('/profile');
  })
  .catch(err => {
      console.log('error', err);
      res.render('pages/editBio')
      })
});


//will render base registration page
app.post('/regPage', function(req, res){
  res.render('pages/regPage', {
    emailAlreadyInDatabase: false,
    usernameAlreadyInDatabase: false,
    redirectToLogin: false,
    redirectFromLogin: false,
    usernameAndEmailAlreadyInDatabase: false
  });
});

//will get request for verification process the login page
app.post('/login/verify', function(req, res){
  var username1 = req.body.verifyEmail;
  console.log(username1);
  var query1 = "SELECT username, email, id, pwdhash, lastName, firstName, location FROM users WHERE username = '" + username1 + "';";
  db.query(query1, task => {
      return task.batch([
          task.any(query1)
      ]);
  })
  .then(data => {
    if(!data[0]){ // User not found in DB
      res.render('pages/regPage', {
        usernameAlreadyInDatabase: false,
        emailAlreadyInDatabase: false,
        redirectToLogin: false,
        redirectFromLogin: true,
        usernameAndEmailAlreadyInDatabase: false
      });
    }else if(req.body.verifyPwd != data[0].pwdhash){ // Username doesn't match password
      // Placeholder for now
      console.log("Incorrect password");
      console.log("Input password = " + req.body.verifyPwd);
      console.log(typeof req.body.verifyPwd);
    //  console.log(typeof data[0].pwdhash);
    //  console.log(String(req.body.verifyPwd) != String(data[0].pwdhash));
      console.log(data[0]);
      res.render('pages/LoginPage', {
        incorrectLogin: true
      });
    }else{ // Successful login
      // Set user session data & redirect to profile
      sess=req.session;
      sess.username = data[0].username;
      sess.email = data[0].email;
      sess.uid = data[0].id;
      sess.name = [data[0].lastname, data[0].firstname];
      sess.loc = data[0].location;
      res.cookie('uid', sess.uid);
      res.redirect('/profile');
      console.log(sess);
    }
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/LoginPage',{
        incorrectLogin: false
      })
  })
});

//will render profile page
app.get('/profile', function(req, res){
  defaultUser = {
    id: '',
    lastname: 'Selected',
    firstname: 'No User',
    pronouns: '',
    username: '',
    email: '',
    pwdhash: '',
    tutor: false,
    student: false,
    rating: 0,
    location: '',
    schoollevel: 'Empty',
    subjects: 'None',
    price: ''
  };
  var userData;
  if(!req.session.uid){
    console.log("Rendering for empty user");
    res.render('pages/Profile',{
      user: defaultUser,
      feedback: defaultUser
    });
  }else{
    var query1 = "SELECT * FROM users WHERE id='" + req.session.uid + "';";
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
    var query2 = "SELECT reviewText, rating FROM feedback WHERE userid= '" + req.session.uid + "';";
    db.query(query2, task => {
      return task.batch([
        task.any(query2)
      ]);
    })
    .then(queryFeedback => {
      // TODO: Add redirect for users who aren't logged in (session undefined)
      // Default user values to avoid crashing when someone isn't logged in
      console.log("Rendering for valid user");
      if (queryFeedback){
        console.log("feedback query:", queryFeedback[0]);
        res.render('pages/Profile',{
        user: userData,
        feedback: queryFeedback
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
  console.log("Tutor status: " + tutorStatus1);
  if(tutorStatus1){
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
  //set up for where second db qeary goes
  var usernameQuery = "SELECT lastName FROM users WHERE username= '" + username + "';";//query to check if that username is already in the database
  var emailQuery = "SELECT lastName FROM users WHERE email= '" + email + "';"; //query to check if email is already in the db
  db.task('get-everything', task => {
    return task.batch([
        task.any(emailQuery),
        task.any(usernameQuery)
    ]);
  })
  .then(dataCheck => { //renamed data to dataCheck bc did not want conflicting variables
    console.log(dataCheck[0]);
    console.log(dataCheck[1]);
    if((dataCheck[0]== '') && (dataCheck[1]== '' ) ){ // User not found in DB
      console.log('Username and email not in db');
      res.render('pages/LoginPage', {
        // usernameAlreadyInDatabase: false,
        // emailAlreadyInDatabase: false,
        // redirectFromLogin: false,
        incorrectLogin: false,
        redirectToLogin: true
        // usernameAndEmailAlreadyInDatabase: false
      });
      var sql = "INSERT INTO Users (lastName, firstName, pronouns, username,pwdHash,tutor,student,rating,location,schoolLevel,subjects,price,email) VALUES ('" + lname + "','" + fname + "','"+ pronouns + "','" + username + "','" + password + "','" + tutorStatus+ "','" + studentStatus + "'," + rating + ",'" + school + "','" + yearStatus+ "','" + subjectStatus+ "', " + price + ",'" + email + "'); " +
        "SELECT id FROM Users WHERE email='" + email + "';";
      db.query(sql, task => {
        return task.batch([
            task.any(sql)
        ]);
      })
      .then(data => {//i believe this is where the bug starts
        uid = data[0]['id'].toString();
        console.log("User ID:", uid, "for", fname, lname);
        chatkit.createUser({
          id: uid,
          name: fname + " " + lname
        })
        .then(() => console.log("Chatkit user created successfully"))
        .catch((err) => console.log(err));
        //res.redirect('pages/LoginPage');
      })
      .catch(err => {
          // display error message in case an error
          console.log('error', err);
          res.render('pages/regPage', {
            usernameAlreadyInDatabase: false,
            emailAlreadyInDatabase:false,
            //redirectToLogin: false,
            redirectFromLogin: false,
            usernameAndEmailAlreadyInDatabase: false
          });
      })
    } //end of if statement
    else if((dataCheck[0]) && (dataCheck[1])){ //if both are already in db
      console.log('Username and email are already in database');
      res.render('pages/regPage',{
        usernameAlreadyInDatabase: false,
        emailAlreadyInDatabase:false,
        //redirectToLogin: false,
        redirectFromLogin: false,
        usernameAndEmailAlreadyInDatabase: true
  		})
    }
    else if(dataCheck[0]){ //if email already in db
      console.log('Email are already in database');
      res.render('pages/regPage',{
        usernameAlreadyInDatabase: false,
        emailAlreadyInDatabase:true,
        //redirectToLogin: false,
        redirectFromLogin: false,
        usernameAndEmailAlreadyInDatabase: false
  		})
    }
    else if(dataCheck[1]){ //if email is already in db
      console.log('Username already in database');
      res.render('pages/regPage',{
        usernameAlreadyInDatabase: true,
        emailAlreadyInDatabase:false,
        //redirectToLogin: false,
        redirectFromLogin: false,
        usernameAndEmailAlreadyInDatabase: false
  		})
    }
  })
  .catch(error => {
    // display error message in case an error
    console.log('error', err);
    res.render('pages/regPage',{
      usernameAlreadyInDatabase: false,
      emailAlreadyInDatabase:false,
      //redirectToLogin: false,
      redirectFromLogin: false,
      usernameAndEmailAlreadyInDatabase: false
		})
  });

  /////////////////////////////////////////////////
});

// will render the search page
app.get('/tutor-finder', function(req, res){
  var query1 = "SELECT id, firstname, lastname, rating, subjects, location, username FROM users WHERE tutor = true AND id != '" + req.session.uid + "' AND location = '" + req.session.loc + "'  ORDER BY lastname ASC;";
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
  var filterChoice = req.body.filterChoice;
  console.log("user location " + req.session.loc);
  if(filterChoice == 1){
    var query1 = "SELECT id, firstname, lastname, rating, subjects, username FROM users WHERE tutor = true AND id != '" + req.session.uid + "' AND location = '" + req.session.loc + "' ORDER BY lastname ASC;";
  } else if(filterChoice == 2) {
    var query1 = "SELECT id, firstname, lastname, rating, subjects, username FROM users WHERE tutor = true AND id != '" + req.session.uid + "'  AND location = '" + req.session.loc + "' ORDER BY rating DESC;"
  } else {
    var query1 = "SELECT id, firstname, lastname, rating, subjects, username FROM users WHERE tutor = true AND id != '" + req.session.uid + "'  AND location = '" + req.session.loc + "' ORDER BY subjects ASC;"
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

// will render a profile of another user
app.get('/userProfile', function(req, res){
  // gets user id of selected student
  var userid = req.query.studentID;
  console.log("User ID**" + userid);
  // get all info of student
  var query1 = "SELECT * FROM users WHERE id = '"+ userid + "';";
  db.query(query1, task => {
      return task.batch([
          task.any(query1)
      ]);
  })
  .then(data => {
    console.log(data)
    userData = data[0];
  })
  .catch(err => console.log(err));
  // gets all feed back for user
  var query2 = "SELECT reviewtext, rating FROM feedback WHERE userid= '" + userid + "';";
  db.query(query2, task => {
    return task.batch([
      task.any(query2)
    ]);
  })
  .then(queryFeedback => {
    // Default user values to avoid crashing when someone isn't logged in
    console.log("Rendering for valid user");
    //console.log(queryFeedback[0].reviewtext);
    if (queryFeedback){
      console.log(queryFeedback);
      res.render('pages/userProfile',{
      user: userData,
      feedback: queryFeedback
      })
    } else {
      res.render('pages/userProfile',{
      user: userData,
      feedback: null
      })
    }
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/userProfile',{
           user: '',
           feedback: ''
      })
  })
});

// feedback page
app.get('/feedback', function(req, res){
  // id of profile being viewed
  var userid = req.query.studentID;
  console.log("USER ID for FEEDBACK: " + userid);
  var query = "SELECT * FROM users WHERE id = '" + userid + "';"
  db.query(query, task => {
      return task.batch([
          task.any(query)
      ]);
  })
  .then(data => {
    console.log(data)
    res.render('pages/feedback',{
      user: data[0]
    });
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.render('pages/feedback',{
           user: ''
      })
  })
});

// feedback submited
app.post('/feedback/submitted', function(req, res){
  // id of profile being viewed
  var userID = req.body.studentID;
  var feedback = req.body.feedback;
  var rating = req.body.rating;
  console.log("feedback:", feedback, "rating:", rating, "user id:", userID);
  var query = "INSERT INTO feedback (userid, raterid, reviewtext, rating)  VALUES ('" + userID + "','" + req.session.uid + "','"+ feedback + "','" + rating + "');";
  var avgRate = "UPDATE users SET rating = (SELECT AVG(feedback.rating) FROM feedback INNER JOIN users on feedback.userid=users.id) WHERE users.id = '" + userID + "';";
  db.query(query, task => {
    return task.batch([
        task.any(query)
    ]);
  })
  //test
  .then(data => {
    console.log(data);
  })
  .catch(err => {
      // display error message in case an error
      console.log('error', err);
      res.redirect('/profile')
  })
  db.query(avgRate, task => {
    return task.batch([
      task.any(avgRate)
    ]);
  })
  .then(data => {
    res.redirect('/profile')
  })
  .catch(err => {
    // display error message in case an error
    console.log('error', err);
    res.redirect('/profile')
  })
});


// Start server
app.listen(PORT);
console.log(PORT + ' is the magic port');
