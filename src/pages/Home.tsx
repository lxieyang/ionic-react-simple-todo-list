import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonTextarea,
  IonButtons,
  IonButton,
  IonCheckbox,
  IonItemSliding,
  IonItemOptions,
  IonItemOption
} from "@ionic/react";
import { add, close, checkmark, trash } from "ionicons/icons";
import React, { Component } from "react";

import firebase from "firebase/app";
import { firebaseConfig } from "../secret.firebase";
import { any } from "prop-types";
require("firebase/firestore");

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

interface TodoItem {
  content: string;
  finished: boolean;
  id: string;
}

class Home extends Component {
  state = {
    todoList: [],
    modalOpen: false,
    newTodoContent: ""
  };

  unsubscribeTodos: any;

  componentDidMount() {
    // set up a listener for the 'todos' collection in Firestore
    // once there's any changes made to this collection, the listener function will run
    this.unsubscribeTodos = db.collection("todos").onSnapshot(querySnapshot => {
      // the listener function will
      // 1. receive the latest version of the 'todo' collection
      // 2. loop through all the todo items in the collection
      // 3. push them in a temporary list stored in memory
      // 4. update the state with the new todo list
      let todos: TodoItem[] = [];
      querySnapshot.forEach(snapshot => {
        // each todo item looks like: {content: 'xxxxx', finished: true, id: 3unuq9yt4ndas}
        const todoItemData = snapshot.data();
        todos.push({
          content: todoItemData.content,
          finished: todoItemData.finished,
          id: snapshot.id
        });
      });
      this.setState({ todoList: todos });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeTodos) {
      // it's a good practice to unsubscribe the listeners to prevent memory leaks
      this.unsubscribeTodos();
    }
  }

  todoContentInputHandler = (event: any) => {
    this.setState({
      newTodoContent: event.target.value
    });
  };

  clearNewTodoContent = () => {
    this.setState({ newTodoContent: "" });
  };

  addItemToList = () => {
    if (this.state.newTodoContent === "") {
      return;
    }
    // add the new todo item to the 'todos' collection in Firestore as a new document.
    // the add() method will automatically take care of IDing the new document to make
    // sure it's unqiue within the 'todos' collection
    db.collection("todos").add({
      content: this.state.newTodoContent,
      finished: false
    });

    this.setState({
      newTodoContent: ""
    });
  };

  switchItemCheckedStatus = (idx: number) => {
    db.collection("todos")
      .doc(this.state.todoList[idx]["id"])
      .update({
        finished: !this.state.todoList[idx]["finished"]
      });
  };

  listRef: any;

  removeItemFromList = (idx: number) => {
    // remove the todo with id equals {this.state.todoList[idx].id} from
    // the 'todos' collection in firestore
    db.collection("todos")
      .doc(this.state.todoList[idx]["id"])
      .delete();
  };

  toggleModalOpenStatus = () => {
    const isModalOpen = this.state.modalOpen;
    this.setState({ modalOpen: !isModalOpen });
  };

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>To do</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList ref={me => (this.listRef = me)}>
            {this.state.todoList.map((todoItem: TodoItem, idx) => {
              return (
                <IonItemSliding key={idx}>
                  <IonItem>
                    <IonCheckbox
                      onClick={() => this.switchItemCheckedStatus(idx)}
                      slot="start"
                      value={todoItem.content}
                      checked={todoItem.finished}
                    />
                    <IonLabel>{todoItem.content}</IonLabel>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption
                      onClick={() => {
                        this.removeItemFromList(idx);
                        this.listRef.closeSlidingItems(); // close sliding
                      }}
                      color="danger"
                    >
                      <IonIcon icon={trash} slot="start" /> Delete
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              );
            })}
          </IonList>

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => this.toggleModalOpenStatus()}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>

          <IonModal isOpen={this.state.modalOpen}>
            <IonHeader>
              <IonToolbar>
                <IonButtons>
                  <IonTitle>New Todo</IonTitle>
                  <IonButton onClick={() => this.toggleModalOpenStatus()}>
                    <IonIcon icon={close} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonButton
                onClick={() => {
                  this.addItemToList();
                  this.toggleModalOpenStatus();
                }}
              >
                <IonIcon icon={checkmark} slot="start" />
                Done
              </IonButton>
              <IonButton
                color="danger"
                onClick={() => this.clearNewTodoContent()}
              >
                <IonIcon icon={trash} slot="start" />
                Clear
              </IonButton>
              <IonTextarea
                placeholder="new todo..."
                value={this.state.newTodoContent}
                onIonChange={e => this.todoContentInputHandler(e)}
                autofocus
                autoGrow
              />
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    );
  }
}

export default Home;
