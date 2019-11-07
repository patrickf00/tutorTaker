----
-- Database creation
----

CREATE DATABASE TutorTaker;

-- Switch database with:
-- \c TutorTaker

-- Users table - stores user data
CREATE TABLE Users (
  id serial PRIMARY KEY NOT NULL,
  lastName varchar(255),
  firstName varchar(255),
  pronouns varchar(255),
  username varchar(255),
  pwdHash varchar(255),
  tutor boolean,
  student boolean,
  rating int,
  location varchar(255),
  schoolLevel varchar(255),
  subjects varchar(255),
  price decimal
);

-- Matches table - fulfills the function of the vertices vector
CREATE TABLE Matches (
  matchID serial PRIMARY KEY NOT NULL,
  studentID int REFERENCES Users(id),
  tutorID int
);

-- Messages table - stores messages
CREATE TABLE Messages (
  messageID serial PRIMARY KEY NOT NULL,
  recipID int REFERENCES Users(id),
  senderID int,
  body text,
  date timestamp
);

-- Feedback table - stores feedback
CREATE TABLE Feedback (
  feedbackID serial PRIMARY KEY NOT NULL,
  userID int REFERENCES Users(id),
  raterID int,
  reviewText text,
  report boolean,
  reportedFor text
);

----
-- Views for simplicity
----

-- User messages view (groups messages by recipID)
-- TODO: add functionality for grouping messages by conversation
--  (entails matching messages by sender and recipient and ordering by date)
CREATE VIEW UserMessages AS
  SELECT Users.id, Messages.* FROM Users RIGHT JOIN Messages ON Users.id=Messages.recipID;

-- User feedback view (groups feedback by userID)
CREATE VIEW UserFeedback AS
  SELECT Users.id, Feedback.* FROM Users RIGHT JOIN Feedback ON Users.id=Feedback.userID;

----
-- Data retrieval - for NodeJS integration
-- NJIx is a standin for the appropriate NodeJS variable - replace this in the
--  NodeJS query string with the variable you want to use, from the HTTP request
--  (sanitize first)
----

-- Add user
INSERT INTO Users (
  lastName, firstName, pronouns, username, pwdHash, tutor,
  student, rating, location, schoolLevel, subjects, price
)
VALUES (
  NJIlastName,
  NJIfirstName,
  NJIpronouns,
  NJIusername,
  NJIpwdHash,
  NJItutor,
  NJIstudent,
  NJIrating,
  NJIlocation,
  NJIschoolLevel,
  NJIsubjects,
  NJIprice
);

-- Login/authenticate - retrieve password hash for a particular username, to
--  ensure it Matches the hashed password given
SELECT pwdHash FROM Users WHERE username=NJIusername;

-- Get data for a particular user
-- NJI1 is the data to retrieve, NJIid is the user id
--  (or whatever else you want to search by)
SELECT NJidata FROM Users WHERE id=NJIid;

-- Add match
INSERT INTO Matches (studentID, tutorID) VALUES (
  NJIstudentID,
  NJItutorID
)

-- Get matches for a particular user (returns ids)
-- NJIuser is the userid
BEGIN
  IF (SELECT tutor FROM Users WHERE id=NJIuser)=true THEN
    SELECT studentID FROM Matches WHERE tutorID=NJIuser
  ELSE
    SELECT tutorID FROM Matches WHERE studentID=NJIuser
END;

-- Add message
INSERT INTO Messages (recipID, senderID, body, date) VALUES (
  NJIrecipID,
  NJIsenderID,
  NJIbody,
  NJIdate
)

-- Get messages for a particular user (returns sender, body, and timestamp)
-- NJIuser is the userid
SELECT senderID, body, date FROM UserMessages WHERE recipID=NJIuser;
