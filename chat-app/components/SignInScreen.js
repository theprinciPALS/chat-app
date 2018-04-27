import {
  AppRegistry,
  AsyncStorage,
  View,
  ToolbarAndroid,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { Header,Container,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import React, {Component} from 'react';

export default class SignInScreen extends Component {

  static navigationOptions = {
    title: "Sign in"
  }

  constructor(props){
    super(props);
    // We have the same props as in our signup.js file and they serve the same purposes.
    this.state = {
      loading: false,
      email: '',
      password: ''
    }
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ?
    <View style={{backgroundColor: "#fff"}}>
    <ActivityIndicator size="large"/>
    </View> :
    <Content style={{backgroundColor: "#fff"}}>
      <List style={{marginTop: "45%"}}>
        <ListItem style={{padding: 10, margin: 10}}>
            <InputGroup>
              <Icon name="ios-person" style={{ color: '#0A69FE' }} />
              <Input
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
                placeholder={"Email Address"} />
            </InputGroup>
          </ListItem>
        <ListItem style={{padding: 10, margin: 10}}>
          <InputGroup>
            <Icon name="ios-unlock" style={{ color: '#0A69FE' }} />
            <Input
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              secureTextEntry={true}
              placeholder={"Password"} />
          </InputGroup>
        </ListItem>
      </List>
      <Button onPress={this.login.bind(this)} style={{marginLeft: "auto", marginRight: "auto", marginTop: 20}}>
        <Text>Login</Text>
        </Button>
    </Content>
    ;

    // A simple UI with a toolbar, and content below it.
    return (
      <Container>
      {content}
      </Container>
    );
  }

  login(){
    fetch('https://prod.thepeaceful.site/api/v1/session', {
      method: 'POST',
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password
      })
    }).then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        if(json.error) {
          alert("Error signing in. Please try again.");
        } else {
          AsyncStorage.setItem('id', json.id);
          AsyncStorage.setItem('salt', json.salt);
          this.props.navigation.navigate('App');
        }
      }).catch((err) => {
        alert("Uh oh! Something went wrong. Please try again." + err);
      });
  }
}
