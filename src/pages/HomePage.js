import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Welcome to Trash-it!
        </Text>

        <Button
          onPress={() => this.props.navigation.navigate('Camera')}
          title="Take a Picture"
          color="green"
        />
         <Button
          onPress={() => this.props.navigation.navigate('Map')}
          title="Look at Map"
          color="blue"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});