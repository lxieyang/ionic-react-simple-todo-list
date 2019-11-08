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

class Home extends Component {
  state = {
    todoList: [
      {
        content: "Meet with Brad",
        finished: false
      },
      {
        content: "Go to Costco",
        finished: true
      },
      {
        content: "Hit the gym",
        finished: true
      },
      {
        content: "Remember to buy milk",
        finished: false
      },
      {
        content: "Finish Homework 6",
        finished: false
      }
    ],
    modalOpen: false,
    newTodoContent: ""
  };

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
    let newTodoList = [...this.state.todoList];
    newTodoList.push({
      content: this.state.newTodoContent,
      finished: false
    });

    this.setState({
      todoList: newTodoList,
      newTodoContent: ""
    });
  };

  switchItemCheckedStatus = (idx: number) => {
    let newTodoList = [...this.state.todoList];
    newTodoList[idx].finished = !newTodoList[idx].finished;
    this.setState({
      todoList: newTodoList
    });
  };

  listRef: any;

  removeItemFromList = (idx: number) => {
    let newTodoList = [...this.state.todoList];
    newTodoList.splice(idx, 1);
    this.setState({
      todoList: newTodoList
    });
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
            {this.state.todoList.map((todoItem, idx) => {
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
