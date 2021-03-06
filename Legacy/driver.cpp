#include<iostream>
#include"Graph.hpp"
#include <string>
using namespace std;


int main(){
  Graph basicTest;
  string subject[10] = {"Calculus", "Chemistry", "Biology"};
  vector<double> v1{5, 4.6, 4.3};
  basicTest.addVertex("Joe Courington", 1, "CU Boulder", subject, 3, v1);//tutor
  basicTest.addVertex("Christian Molina", 0, "CU Boulder", subject, 2, v1);//non tutor
//tutors will be connected to students only in one way, do not need double connection
  basicTest.displayEdges();
  basicTest.displayNames();
}