import React from 'react';
import io from 'socket.io-client';
import TopicChat from './components/TopicChat';
import TopicList from './components/TopicList';
import SignInScreen from './components/SignInScreen';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, SwitchNavigator } from 'react-navigation';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TopicList/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const appNav =  StackNavigator({
  Topics: {
    screen: TopicList
  },
  Chat: {
    screen: TopicChat
  }
},
{
  initialRouteName: 'Topics'
});

const loginNav = StackNavigator({
  SignIn: SignInScreen,
});

export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: appNav,
    Auth: loginNav,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
