import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";

export default class CatalogPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Catalog page
        </Text>
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