import React, { Component } from 'react';
import {Alert, View, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-expo-image-cache';
import { Container, Header, Content, List, ListItem, Text, Body, Title, Card } from 'native-base';
import TopicItem from './TopicItem'
export default class TopicList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      topics: [],
      loading: true
    }
  }

  handlePress(id, name) {
    this.props.navigation.navigate('Chat', {num: id, name: name});
  }

  static navigationOptions = {
    title: 'Topics',
  };

  componentWillMount() {
    fetch("https://prod.thepeaceful.site/api/v1/topic").then((response) => response.json())
    .then((json) => {
      this.setState({topics: json.topics});
      this.setState({loading: false});
    }).catch((err) => {
      alert("Error loading topics. Please try again!");
    })
  }

  render() {
    var _this = this;
    const content = this.state.loading ?
    <View style={{backgroundColor: "#fff"}}>
    <ActivityIndicator size="large"/>
    </View> :
    <Container style={{backgroundColor: "#fff"}}>
      <Content>
          {this.state.topics.map((topic) => {
            return(
              <TouchableOpacity
              onPress={() => _this.handlePress(topic.id, topic.name)}
              key={topic.id}
              style={{height: 200}}>
                <TopicItem
                  uri={topic.image}
                  title={topic.name}
                />
              </TouchableOpacity>
            );
          })}
        <Container style={{height: 20}}/>
      </Content>
    </Container>

    return (
      <Container>
        {content}
      </Container>
    );
  }
}
