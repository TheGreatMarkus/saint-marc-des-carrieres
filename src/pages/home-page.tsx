import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";
import { PAGES } from "../constants/constants";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface IProps {
  navigation: StackNavigationProp;
}

export interface IState {
  fontLoaded: boolean;
}

HomePage["navigationOptions"] = {
  headerShown: false,
};

export default function HomePage({ navigation }: IProps) {
  let [fontsLoaded] = useFonts({
    "bangers-font": require("../../assets/fonts/Bangers-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/wallpaper2.png")}
        style={StyleSheet.absoluteFill}
      >
        <Text style={styles.headerText}>Trash-It!</Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(PAGES.camera)}
          >
            <Text style={styles.buttonText}>Identify Waste</Text>
          </TouchableOpacity>
          <Text>{"\n"}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(PAGES.map)}
          >
            <Text style={styles.buttonText}>Look at Map</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
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
    fontFamily: "bangers-font",
  },
  btnContainer: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    alignItems: "stretch",
  },
  button: {
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 100,
    backgroundColor: "white",
    padding: 10,
  },
  buttonText: {
    color: "green",
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
