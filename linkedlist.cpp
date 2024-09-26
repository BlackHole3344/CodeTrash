#include <iostream>


using namespace std ; 



struct Node {
    int data  ;
    Node *next ;
    Node *prev ; 

    Node(int value) : data(value) , next(nullptr) , prev(nullptr) {}
} ; 


class Linkedlist {
    private : 
    Node *head ; 

    public : 

    Linkedlist() : head(nullptr)  {}


    void append(int val) {
        Node *newnode = new Node(val) ; 
        if(!head) {
            head = newnode ; 
            return ; 
        }

        Node *curr = head ; 
        while(curr->next) {
            curr = curr->next ; 
        }
        curr->next = newnode ; 
        newnode->prev = curr ; 
        head->prev = newnode ; 
    }

    void display() {
        Node *curr = head ; 
        while(curr) {
            cout<<"<-"<<curr->data; 
            curr = curr->next ; 
        }
    }

    void revdisplay() {
        Node *curr = head->prev ; 
        while(curr != head) {
            cout<<"->"<<curr->data ; 
            curr = curr->prev ; 
        }
        cout<<"->"<<curr->data ; 

    }
} ; 

int main() {

    // Node *node1 = new Node(3) ; 
    // Node *node2 = new Node(4) ; 
    // Node *node3 = new Node(5) ; 

    Linkedlist l ; 
    l.append(3) ; 
    l.append(4) ;
    l.append(5) ; 

    // l.display() ; 
    cout<<endl;
    l.revdisplay() ; 

    // node1->next = node2 ;
    // node2->next = node3 ;  

}