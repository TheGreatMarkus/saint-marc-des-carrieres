import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button, Dimensions } from "react-native";
import MapView from 'react-native-maps';
import recyclePoints from '../data/recycle';
import trashPoints from '../data/trash';
import compostPoints from '../data/compost';
import ewastePoints from '../data/e-waste';


export default class MapPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: 40.7827,
            longitude: -73.9732,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
          style={styles.mapStyle}
        >
          {recyclePoints.map(marker => (
            <MapView.Marker
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
              title={'Recycling Bin'}
              pinColor={'blue'}
            />
          ))}
          {trashPoints.map(trash => (
            <MapView.Marker
              coordinate={{
                latitude: trash.point2,
                longitude: trash.point1
              }}
              title={'Trash Bin'}
              pinColor={'red'}
            />
          ))}
          {compostPoints.map(compost => (
            <MapView.Marker
              coordinate={{
                latitude: compost.latitude,
                longitude: compost.longitude
              }}
              title={'Food Scrap Location'}
              pinColor={'green'}
            />
          ))}
          {ewastePoints.map(ewaste => (
            <MapView.Marker
              coordinate={{
                latitude: ewaste.latitude,
                longitude: ewaste.longitude
              }}
              title={'E-Waste Disposal'}
              pinColor={'black'}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});