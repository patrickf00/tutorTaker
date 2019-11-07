/***********************
 
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database

***********************/

const express = require('express'); // Add the express framework has been added
var app = express();

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies
app.set('view engine', 'ejs');


//Create Database Connection
const pgp = require('pg-promise')();
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory


const dbConfig = {
	host: 'localhost', // temp until we figure out our host
	port: 5432,
	database: 'tutortaker',
	user: 'postgres',
	password: 'Vaughn35!*'
};

//let db = pgp(dbConfig);
let db = pgp(dbConfig);
// set the view engine to ejs

app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory

/* will render the search page*/
app.get('/tutor-finder', function(req, res){
  var query1 = 'SELECT firstName, lastName, rating FROM users;';
  db.task('get-everything', task => {
      return task.batch([
          task.any(query1),
      ]);
  })
  .then(data => {
    res.render('pages/searchPage',{
        result_1: data[0]
    })
  .catch(err => {
      // display error message in case an error
          console.log('error', err);
          res.render('pages/searchPage',{
              result_1: ''
          })
      })
  });
});

app.listen(3000);
console.log('3000 is the magic port');