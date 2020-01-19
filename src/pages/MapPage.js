import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button, Dimensions, OverlayComponent } from "react-native";
import MapView from 'react-native-maps';
import recyclePoints from '../data/recycle';
import trashPoints from '../data/trash';
import compostPoints from '../data/compost';
import ewastePoints from '../data/e-waste';
import { actions } from '../service/vision-api';

export default class MapPage extends Component {
  state = {
    userPos: {
      latitude: 40.758572,
      longitude: -73.968639
    },
    currentPos: {
      latitude: 0,
      longitude: 0
    },
    targetText: "",
    doneLoading: false
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const targetLocation = navigation.getParam("targetLocation", "");
    this.detStartingCoordinates(targetLocation);
  }

  calcCoordDistance(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = (lat2 - lat1) * (Math.PI / 180);
    let dLon = (lon2 - lon1) * (Math.PI / 180);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  compareCoordDistances(point1, point2) {
    let dis1 = this.calcCoordDistance(this.state.userPos.latitude, this.state.userPos.longitude, point1.latitude, point1.longitude);
    let dis2 = this.calcCoordDistance(this.state.userPos.latitude, this.state.userPos.longitude, point2.latitude, point2.longitude);

    return dis1 - dis2;
  }

  detStartingCoordinates(targetLocation) {
    let currentPos = this.state.userPos;
    let text = "";

    switch (targetLocation) {
      case actions.recycle:
        text = "Closest Recycling bin";
        recyclePoints.sort((point1, point2) => this.compareCoordDistances(point1, point2));
        currentPos = recyclePoints[0];
        break;
      case actions.trash:
        trashPoints.sort((point1, point2) => this.compareCoordDistances(point1, point2));
        currentPos = trashPoints[0];
        text = "Closest Garbage Disposal";
        break;
      case actions.compost:
        compostPoints.sort((point1, point2) => this.compareCoordDistances(point1, point2));
        currentPos = compostPoints[0];
        text = 'Closest compost center';

        break;
      case actions.ewaste:
        ewastePoints.sort((point1, point2) => this.compareCoordDistances(point1, point2));
        currentPos = ewastePoints[0];
        text = 'Closest E-Waste Management Center'
        break;
      default:
        break;
    }

    this.setState({
      currentPos: currentPos,
      targetText: text,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: this.state.currentPos.latitude,
            longitude: this.state.currentPos.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
          style={styles.mapStyle}
        >

          <MapView.Marker
            coordinate={{
              latitude: this.state.userPos.latitude,
              longitude: this.state.userPos.longitude
            }}
            title='Your current location'
            pinColor={'yellow'}
          />
          {
            recyclePoints.map((marker, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude
                }}
                title={'Recycling Bin'}
                pinColor={'blue'}
              />
            ))
          }
          {
            trashPoints.map((trash, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: trash.latitude,
                  longitude: trash.longitude
                }}
                title={'Trash Bin'}
                pinColor={'red'}
              />
            ))
          }
          {
            compostPoints.map((compost, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: compost.latitude,
                  longitude: compost.longitude
                }}
                title={'Food Scrap Location'}
                pinColor={'green'}
              />
            ))
          }
          {
            ewastePoints.map((ewaste, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: ewaste.latitude,
                  longitude: ewaste.longitude
                }}
                title={'E-Waste Disposal'}
                pinColor={Platform.OS === 'ios' ? 'black' : 'plum'}
              />
            ))
          }

        </MapView>
        <View style={{ position: "absolute", bottom: 50 }}>
          <Text>{this.state.targetText}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});