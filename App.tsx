import React from "react";
import HomePage from "./src/pages/home-page";
import MapPage from "./src/pages/map-page";
import CameraPage from "./src/pages/camera-page";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

export default function App() {
  return <AppContainer />;
}

const RootStack = createStackNavigator(
  {
    Home: HomePage,
    Map: MapPage,
    "Waste Identification": CameraPage,
  },
  {
    initialRouteName: "Home",
  }
);

const AppContainer = createAppContainer(RootStack);
