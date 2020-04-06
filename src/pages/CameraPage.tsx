import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageInformation } from "../service/vision-api";
import { Button } from "react-native-elements";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { ItemCategory, CategoryName, Action } from "../types";

export interface IProps {
  navigation: StackNavigationProp;
}

export default function CameraPage({ navigation }: IProps) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [cameraVisible, setCameraVisible] = useState<boolean>(true);
  const [image, setImage] = useState<any>(null);
  const [labels, setLabels] = useState<any[]>([]);
  const [infos, setInfos] = useState<ItemCategory>({
    name: CategoryName.UNKNOWN,
    labels: [],
    actions: [],
    info: "",
  });

  let camera = useRef<Camera>({} as Camera);

  useEffect(() => {
    (async () => {
      const { granted } = await Camera.requestPermissionsAsync();
      setHasPermission(granted);
    })();
  }, []);

  const flipCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    let photo = await camera.current.takePictureAsync({ base64: true });
    if (photo.base64) {
      photo.base64 = photo.base64 as string;
      let imageInformation = await getImageInformation(photo.base64);
      setImage(photo.uri);
      setCameraVisible(false);
      setInfos(imageInformation);
    }
  };

  const openCamera = () => {
    if (!hasPermission) {
      Alert.alert("Error", "No access to camera");
    } else {
      setCameraVisible(true);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!cameraVisible && (
        <ScrollView style={styles.scroll}>
          <View style={styles.mainContent}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={openCamera}>
                <MaterialIcons name="camera-alt" size={40} color="#1083bb" />
              </TouchableOpacity>

              {image && (
                <Image
                  style={styles.latestImage}
                  resizeMode={"cover"}
                  source={{ uri: image }}
                />
              )}

              <View style={styles.textBox}>
                <Text style={styles.textBoxBig}>
                  What this is: {infos.name}
                </Text>
                <Text style={styles.textBoxBig}>
                  What you can do: {infos.actions.join(", ")}!
                </Text>
                <Text style={styles.textBoxText}>{infos.info}</Text>
              </View>

              {!infos.actions.includes(Action.UNKNOWN) &&
                infos.actions.map((action, index) => (
                  <Button
                    key={index}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("Map", {
                        targetLocation: action,
                      })
                    }
                    title={`${action}!`}
                  />
                ))}
            </View>
          </View>
        </ScrollView>
      )}
      {cameraVisible && (
        <Camera style={styles.camera} type={cameraType} ref={camera}>
          <View style={styles.cameraFiller} />
          <View style={styles.cameraContent}>
            <TouchableOpacity
              style={styles.buttonFlipCamera}
              onPress={flipCamera}
            >
              <MaterialIcons name="flip" size={25} color="#e8e827" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
              <MaterialIcons name="camera" size={50} color="#e8e827" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonCloseCamera}
              onPress={() => setCameraVisible(false)}
            >
              <MaterialIcons name="close" size={25} color="#e8e827" />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  textBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  textBoxText: {
    fontSize: 14,
    padding: 10,
  },
  textBoxBig: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
    flex: 1,
  },
  latestImage: {
    width: 250,
    height: 350,
    marginTop: 10,
    borderWidth: 5,
    borderColor: "#FFF",
    alignSelf: "center",
  },
  camera: {
    flex: 1,
  },
  cameraFiller: {
    flex: 8,
  },
  cameraContent: {
    flex: 2,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonFlipCamera: {
    flex: 3,
    padding: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonTextFlipCamera: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e8e827",
  },
  buttonCamera: {
    flex: 4,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonCloseCamera: {
    flex: 3,
    padding: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  button: {
    backgroundColor: "green",
    borderRadius: 100,
    color: "white",
  },
});
