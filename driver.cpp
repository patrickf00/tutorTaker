#include<iostream>
#include"Graph.hpp"

using namespace std;


int main(){
  Graph basicTest;
  basicTest.addVertex("Joe Courington",1);//tutor
  basicTest.addVertex("Christian Molina",0);//non tutor
  basicTest.addEdge("Joe Courington","Christian Molina");//tutors will be connected to students only in one way, do not need double connection
  basicTest.displayEdges();
  basicTest.displayNames();
}
