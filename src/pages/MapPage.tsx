import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Text, View, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import MapView, { LatLng, Marker } from "react-native-maps";
import { recyclePoints } from "../data/recycle";
import { trashPoints } from "../data/trash";
import { compostPoints } from "../data/compost";
import { ewastePoints } from "../data/e-waste";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { getDistance } from "geolib";
import { Action } from "../types";

export interface IProps {
  navigation: StackNavigationProp;
}
export interface IState {
  userPos: LatLng;
  currentPos: LatLng;
  targetText: string;
  doneLoading: boolean;
}

export default function MapPage({ navigation }: IProps) {
  const [userPosition, setUserPosition] = useState<LatLng>({
    latitude: 40.758572,
    longitude: -73.968639,
  });
  const [currentPosition, setCurrentPosition] = useState<LatLng>({
    latitude: 40.758572,
    longitude: -73.968639,
  });
  const [targetText, setTargetText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const targetLocation = navigation.getParam("targetLocation", "") as Action;
    getStartingCoordinates(targetLocation);
  }, []);

  const compareCoordDistances = (point1: LatLng, point2: LatLng): number => {
    return (
      getDistance(userPosition, point1) - getDistance(userPosition, point2)
    );
  };

  const getStartingCoordinates = (targetLocation: Action) => {
    let currentPos = userPosition;
    let text = "";

    switch (targetLocation) {
      case Action.RECYCLE:
        text = "Closest Recycling bin";
        recyclePoints.sort((point1, point2) =>
          compareCoordDistances(point1, point2)
        );
        currentPos = recyclePoints[0];
        break;
      case Action.TRASH:
        trashPoints.sort((point1, point2) =>
          compareCoordDistances(point1, point2)
        );
        currentPos = trashPoints[0];
        text = "Closest Garbage Disposal";
        break;
      case Action.COMPOST:
        compostPoints.sort((point1, point2) =>
          compareCoordDistances(point1, point2)
        );
        currentPos = compostPoints[0];
        text = "Closest compost center";

        break;
      case Action.EWASTE:
        ewastePoints.sort((point1, point2) =>
          compareCoordDistances(point1, point2)
        );
        currentPos = ewastePoints[0];
        text = "Closest E-Waste Management Center";
        break;
      default:
        break;
    }
    setTargetText(text);
    setCurrentPosition(currentPos);
  };

  return (
    <View style={styles.container}>
      <MapView
        region={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        style={styles.mapStyle}
      >
        <Marker
          coordinate={{
            latitude: userPosition.latitude,
            longitude: userPosition.longitude,
          }}
          title="Your current location"
          pinColor={"yellow"}
          tracksInfoWindowChanges={false}
          tracksViewChanges={false}
        />
        {recyclePoints.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={"Recycling Bin"}
            pinColor={"blue"}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
          />
        ))}
        {trashPoints.map((trash, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: trash.latitude,
              longitude: trash.longitude,
            }}
            title={"Trash Bin"}
            pinColor={"red"}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
          />
        ))}
        {compostPoints.map((compost, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: compost.latitude,
              longitude: compost.longitude,
            }}
            title={"Food Scrap Location"}
            pinColor={"green"}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
          />
        ))}
        {ewastePoints.map((ewaste, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: ewaste.latitude,
              longitude: ewaste.longitude,
            }}
            title={"E-Waste Disposal"}
            pinColor={Platform.OS === "ios" ? "black" : "plum"}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
          />
        ))}
      </MapView>

      <View style={styles.targetText}>
        <Text style={{ fontSize: 18 }}>{targetText}</Text>
      </View>

      <View style={styles.mapContainer}>
        <Button
          buttonStyle={{
            ...styles.mapButton,
            ...styles.recycleButton,
          }}
          title="Recycling"
          titleStyle={styles.mapButtonText}
          onPress={() => getStartingCoordinates(Action.RECYCLE)}
        />
        <Button
          buttonStyle={{
            ...styles.mapButton,
            ...styles.trashButton,
          }}
          title="Trash"
          titleStyle={styles.mapButtonText}
          onPress={() => getStartingCoordinates(Action.TRASH)}
        />
        <Button
          buttonStyle={{
            ...styles.mapButton,
            ...styles.compostButton,
          }}
          title="Compost"
          titleStyle={styles.mapButtonText}
          onPress={() => getStartingCoordinates(Action.COMPOST)}
        />
        <Button
          buttonStyle={{
            ...styles.mapButton,
            ...styles.ewasteButton,
          }}
          title="E-waste"
          titleStyle={styles.mapButtonText}
          onPress={() => getStartingCoordinates(Action.EWASTE)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  mapContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "flex-start",
    bottom: 10,
    left: 10,
  },
  mapButton: {
    width: 100,
    marginTop: 2,
    marginBottom: 2,
  },
  mapButtonText: {
    color: "white",
  },
  recycleButton: {
    backgroundColor: "blue",
  },
  trashButton: {
    backgroundColor: "red",
  },
  compostButton: {
    backgroundColor: "green",
  },
  ewasteButton: {
    backgroundColor: "black",
  },
  targetText: {
    position: "absolute",
    top: 15,
    backgroundColor: "white",
    padding: 10,
  },
});
