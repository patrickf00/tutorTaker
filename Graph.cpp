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




void Graph::addVertex(string name,bool isTutor){//add a person to the string list and to the graph using
  Person v1;
  v1.id = currentAmtOfNames;
  v1.isTutor=isTutor;
  names.push_back(name);

  currentAmtOfNames++;
  vertices.push_back(v1);


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
