import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import HomePage from './HomePage';
import CatalogPage from './CatalogPage';
import CameraPage from './CameraPage';
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
