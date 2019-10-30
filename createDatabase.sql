CREATE DATABASE TutorTaker;

CREATE TABLE users {
  ID int,
  Name varchar(255),
  Tutor boolean,
  Student boolean,
  Rating int,
  Location varchar(255),
  Price decimal
};
