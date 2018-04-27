import { GiftedChat, Bubble, Message, InputToolbar } from 'react-native-gifted-chat';import React from 'react';
import io from 'socket.io-client';
import {Container, Header, Left, Body, Right, Title} from 'native-base';
import { StyleSheet, Text, View, Alert, AsyncStorage, ScrollView, Platform } from 'react-native';

export default class TopicChat extends React.Component {
  state = {
    messages: []
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.name : 'Topic Chat',
      headerTintColor: "#383838"
    }
  };

  async componentWillMount() {
    this.setState({
      messages: [
       {
         _id: 1,
         text: 'Welcome to the chatroom! Please stay positive!',
         createdAt: new Date(),
         system: true,
         display: true
       }
      ],
      keyboardUp: false,
      platform: Platform.OS
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  async componentDidMount() {
    const session = await AsyncStorage.getItem('id');
    const salt = await AsyncStorage.getItem('salt');
    this.setState({session: session, salt: salt});
    while (this.state.session == null && this.state.salt == null) {
      // we gotta wait :(
    }
    var props = this.props.navigation.state.params;
    this.socket = io("https://prod.thepeaceful.site", {query: "topicID=" + props.num + "&session=" + session + "&salt=" + salt});
    this.socket.on('message', (message) => {
      if(message == "invalid") {
        this.props.navigation.navigate('Auth');
      } else {
        console.log("received message " + JSON.stringify(message));
        if(message.user._id != this.state.session) {
          this.checkPositive(message).then((positive) => {
            if(positive) {
              console.log('appending foreign positive in componentDidMount');
              this.setState((previousState) => {
                return {
                  messages: GiftedChat.append(previousState.messages, message),
                };
              });
            }
          });
        } else {
          console.log("appending message (in componentDidMount)" + JSON.stringify(message));
          this.setState((previousState) => {
            return {
              messages: GiftedChat.append(previousState.messages, message),
            };
          });
        }
      }
    })
  }

  onSend(messages = []) {
    for (message of messages) {
      // this is a big enough number it should never conflict
      var id = Math.floor(Math.random() * 1000000000);
      var data = {
        _id: id,
        text: message.text,
        createdAt: new Date(),
        user: {
          _id: this.state.session,
          name: "Ryan Ziegler"
        },
        display: true
      };
      console.log("message is (in onSend) " + JSON.stringify(message));
      this.socket.emit("message", data);
      this.checkPositive(message).then((positive) => {
        console.log("positive (in onSend)" + positive);
        if(!positive) {
          this.deleteLastSent();
        }
      })
    }
  }

  deleteLastSent() {
    var i = 0;
    while(true) {
      if(this.state.messages[i].user._id == this.state.session) {
        break;
      } else {
        i++;
      }
    }
    console.log("i is " + i)
    var n = this.state.messages;
    n.splice(i, 1);
    console.log("n is " + JSON.stringify(n));
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(n, {
          _id: Math.floor(Math.random() * 1000000000),
          text: 'Remember to stay positive!',
          createdAt: new Date(),
          system: true,
          display: true
        }),
      };
    });
  }

  renderMessage (props) {
    if(props.currentMessage.display) {
      return (
        <Message
          {...props}
        />
      )
    } else {
      return null;
    }
  }

  checkPositive(message) {
    return new Promise(function(resolve) {
      fetch('https://ml.nexosis.com/v1/models/949c278e-0955-4613-a473-03c946027ee9/predict', {
        method: 'POST',
        headers: {
          'accept': "application/json, text/json",
          "content-type": "application/json",
          "api-key": "479eac78ffdc4bbdaa87a1af79de3612",
          "cache-control": "no-cache",
          "postman-token": "f54b518d-794c-ac60-4c60-2cbbea76b71d"
        },
        body: JSON.stringify({
          data: [
            {
              text: JSON.stringify(message.text)
            }
          ]
      })}).then((response) => response.json())
      .then((json) => {
        if(json.error) {
          resolve(true);
        } else {
          if(json.data[0].airline_sentiment == "negative") {
            resolve(false);
          } else {
            console.log("message is (in checkPositive)" + JSON.stringify(message));
            resolve(true);
          }
        }
      }).catch((err) => {
        resolve(true);
      });
    });
  }

  render() {
    console.log("render, state is " + JSON.stringify(this.state));
    return (
      <Container style={{backgroundColor: "#fff"}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.session,
          }}
          renderAvatar={null}
          renderMessage={props => this.renderMessage(props)}
        />
      </Container>

    )
  }
}
