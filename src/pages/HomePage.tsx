import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-elements";
import * as Font from "expo-font";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";

export interface IProps {
  navigation: StackNavigationProp;
}

export interface IState {
  fontLoaded: boolean;
}
export default class HomePage extends Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

  state = {
    fontLoaded: false,
  };

  componentDidMount() {
    Font.loadAsync({
      bangers: require("../../assets/fonts/Bangers-Regular.ttf"),
    }).then(() => {
      this.setState({ fontLoaded: true });
    });
  }

  static navigationOptions = {
    //To hide the NavigationBar from current Screen
    headerShown: false,
  };

  render() {
    if (!this.state.fontLoaded) {
      return <Text>Loading</Text>;
    }
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/wallpaper2.png")}
          style={{ width: "100%", height: "100%" }}
        >
          <Text style={styles.headerText}>Trash-It!</Text>
          <View style={styles.btnContainer}>
            <Button
              buttonStyle={styles.button}
              titleStyle={{ color: "green" }}
              onPress={() => this.props.navigation.navigate("Camera")}
              title="Identify Waste"
            />
            <Text>{"\n"}</Text>

            <Button
              buttonStyle={styles.button}
              titleStyle={{ color: "green" }}
              onPress={() => this.props.navigation.navigate("Map")}
              title="Look at Map"
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  headerText: {
    fontSize: 75,
    textAlign: "center",
    marginTop: 100,
    fontWeight: "bold",
    fontFamily: "bangers",
  },
  btnContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    borderRadius: 100,
    backgroundColor: "white",
  },
});
