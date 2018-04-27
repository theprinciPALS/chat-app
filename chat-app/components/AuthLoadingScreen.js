import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const id = await AsyncStorage.getItem('id');
    const salt = await AsyncStorage.getItem('salt');

    if(id && salt) {
      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{backgroundColor: "#fff"}}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
