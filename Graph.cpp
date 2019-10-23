#include<iostream>
#include<string>
#include<fstream>
#include"Graph.hpp"

using namespace std;


Graph::Graph(){
  currentAmtOfNames =0;
}
Graph::~Graph(){

}




void Graph::addVertex(string name, bool isTutor, string school, string subject[10], int year, vector<double> rating){//add a person to the string list and to the graph using
  Person v1;
  v1.id = currentAmtOfNames;
  v1.isTutor=isTutor;
  v1.school = school;
  v1.year=year;
  for (int i=0; i<subject->length(); i++) {
      v1.subjects[i] = subject[i];
  }
  for (int j=0; j<rating.size(); j++) {
      v1.ratings.push_back(rating[j]);
  }
  names.push_back(name);

  currentAmtOfNames++;
  vertices.push_back(v1);
  cout << "Average rating: " << getRatingAverage(v1.ratings) << endl;
  cout << "Current school year: " << getYear(v1.year) << endl;
  cout << "School: " << v1.school << endl;
  displayMatches(v1);
}

Person* Graph::findVertex(int id){
  for (int i = 0; i<vertices.size();i++){
    if (vertices[i].id == id ){
      return &vertices[i];
    }
  }
  return NULL;
}


void Graph::addEdge(string v1, string v2){
  Person *Edge = findVertex(NameToId(v2));
  Person *temp = findVertex(NameToId(v1));
  temp->Edges.push_back(Edge);
}

void Graph::displayEdges(){
  for(int i=0; i<vertices.size();i++){
    cout << IdToName(vertices[i].id) << "-->";
    //print each connection from edges vector
    for(int j=0; j<vertices[i].Edges.size();j++){

      cout<< IdToName(vertices[i].Edges[j]->id);
      if(j!=vertices[i].Edges.size()-1){
        cout<< "***";
      }
    }
    cout<< endl;
  }
}

int Graph::getCurrentAmtOfNames(){
  return currentAmtOfNames;
}


string Graph::IdToName(int id){ //backend for checking if there is any issues with the name list
  for(int i=0;i<names.size();i++){
    if(i == id){
      return names[i];
    }
  }
  return "Name not associated with Id";
}

int Graph::NameToId(string name){//check associated id that is with the name
  for(int i=0;i<names.size();i++){
    if(names[i] == name){
      return i;
    }
  }
  return -1;
}

bool Graph::isInGraph(string name){
  Person *User = findVertex(NameToId(name));
  if(User == NULL){
    return false;
  }
  return true;
}

void Graph::displayNames(){
  cout<<"Here is Everyone in the database:"<<endl;
  for(int i=0;i<names.size();i++){
    cout<<names[i]<<endl;
  }
}
double Graph::getRatingAverage(vector<double> ratings) {
    double rate = 0;
    for (int i=0; i<ratings.size(); i++) {
        rate+=ratings[i];
    }
    return rate/ratings.size();
}
string Graph::getYear(int year) {
    if (year == 1) {
        return "Freshman";
    }
    else if (year == 2) {
        return "Sophomore";
    }
    else if (year == 3) {
        return "Junior";
    }
    else {
        return "Senior";
    }
}
bool Graph::isMatch(Person v1, Person v2) {
    if (v2.school != v1.school) {
        return false;
    }
    else if (v2.isTutor == 0) {
        return false;
    }
    else if (v2.year < v1.year) {
        return false;
    }
    else {
        for (int i=0; i<v1.subjects->length(); i++) {
            for (int j=0; j<v2.subjects->length(); j++) {
                if (v1.subjects[i] == v2.subjects[j]) {
                    return true;
                }
            }
        }
        return false;
    }
}
void Graph::displayMatches(Person v1) {
    vector<Person> matches;
    for (int i=0; i<vertices.size(); i++) {
        if (vertices[i].id !=v1.id) {
            bool match = isMatch(v1, vertices[i]);
            if (match == true) {
                addEdge(IdToName(vertices[i].id), IdToName(v1.id));
                matches.push_back(vertices[i]);
            }
        }
    }
    cout << "Tutor matches for " << IdToName(v1.id) << ": " << endl;
    for (int k=0; k<matches.size(); k++) {
        cout << k+1 << ". " << IdToName(matches[k].id) << endl;
    }
}