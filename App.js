import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import HomePage from './src/pages/HomePage';
import CatalogPage from './src/pages/CatalogPage';
import CameraPage from './src/pages/CameraPage';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

export default function App() {
  return (
    <AppContainer />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const RootStack = createStackNavigator(
  {
    Home: HomePage,
    Catalog: CatalogPage,
    Camera: CameraPage
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);
