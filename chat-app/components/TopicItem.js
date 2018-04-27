import React, { Component } from 'react';
import {Alert} from 'react-native';
import {Image} from 'react-native-expo-image-cache';
import { Container, Header, Content, List, ListItem, Text, Body, Title, Card } from 'native-base';

export default class TopicItem extends Component {
  render() {
    const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
    const uri = this.props.uri;
    const titleMargin = 85;
    const imageMargin = (-1 * titleMargin) - 30;
    const radius = 15;
    return(
      <Container style={{height: 200, backgroundColor:  "#000", borderRadius: radius, marginRight: 20, marginLeft: 20, marginTop: 20}}>
          <Title style={{height: 30, marginTop: titleMargin, fontSize: 25, color: "#fff"}}>{this.props.title}</Title>
          <Image {...{preview, uri}}
          style={{width: "100%", height: "100%", borderRadius: radius, zIndex: -1, marginTop: imageMargin, opacity: 0.7}}
          />
      </Container>
    )
  }
}
