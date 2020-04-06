import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { Button } from "react-native-elements";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";

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
        style={{ width: "100%", height: "100%" }}
      >
        <Text style={styles.headerText}>Trash-It!</Text>
        <View style={styles.btnContainer}>
          <Button
            buttonStyle={styles.button}
            titleStyle={{ color: "green" }}
            onPress={() => navigation.navigate("Camera")}
            title="Identify Waste"
          />
          <Text>{"\n"}</Text>

          <Button
            buttonStyle={styles.button}
            titleStyle={{ color: "green" }}
            onPress={() => navigation.navigate("Map")}
            title="Look at Map"
          />
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
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    borderRadius: 100,
    backgroundColor: "white",
  },
});
