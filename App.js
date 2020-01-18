import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import HomePage from './HomePage';
import CatalogPage from './CatalogPage';
import TrashCamera from './TrashCamera';
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
    Camera: TrashCamera
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);
