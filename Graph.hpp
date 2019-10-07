#ifndef GRAPH_HPP
#define GRAPH_HPP

#include <vector>
#include <iostream>

using namespace std;
struct Person;

/*this is the struct for each vertex in the graph. */
struct Person
{
    int id;//will be representative of there name
    bool isTutor; // 1 if they are a tutor/ 0 if they are not a tutor
    vector<Person*> Edges; //stores edges to adjacent vertices

};
class Graph
{
    public:
    Graph(); //constructor that does not need to do anything
    ~Graph();//destructor that will free all memory
    void addEdge(string v1, string v2);//this will connect one person to another
    void addVertex(string name,bool isTutor);//will create new Person vertex -add name to names vector
    void displayEdges(); //displays who is connected to who
    int getCurrentAmtOfNames();//will return the current amt of ppl in dating app
    //void setAllVerticesUnvisited();//this will set all person verteces to not be visited may need later for searches
    string IdToName(int id); //flip the id to name
    int NameToId(string name);//flips the name to the id associated with it
    void displayNames();//will display all names in list of names


    bool isInGraph(string name);//return if someone is in graph




    Person *findVertex(int id);//will find a person vertex in verteces vector

  private:
    vector<Person> vertices; //stores vertices
    vector<string>names; //stores the names of each person with corresponding id
    int currentAmtOfNames; //will count the current Amt Of Names
    void incrementMatchedList();//will increase the amount in each person's matched list





};

#endif
