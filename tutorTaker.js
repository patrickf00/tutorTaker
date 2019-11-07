/***********************

  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pug          - A view engine for dynamically rendering HTML pages
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database

***********************/

const express = require('express'); // Add the express framework has been added
let app = express();

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const html = require('html'); // Add the 'html' view engine

//Create Database Connection
const pgp = require('pg-promise')();


const dbConfig = {
	host: 'localhost', // temp until we figure out our host
	port: 5432,
	database: 'TutorTaker',
	user: '',
	password: ''
};

let db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'html');
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resou


// login page
app.get('/loginPage', function(req, res) {
	res.render('/loginPage',{
		my_title:"Login Page"
	});
});



app.listen(3000);
console.log('3000 is the magic port');
