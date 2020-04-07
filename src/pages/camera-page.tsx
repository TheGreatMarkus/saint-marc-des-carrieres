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
import { ItemCategory, CategoryName, Action, CameraType } from "../types";
import { AppLoading } from "expo";
import {
  CAMERA_BUTTON_COLOR,
  PAGES,
  LoadingState,
} from "../constants/constants";

export interface IProps {
  navigation: StackNavigationProp;
}

export default function CameraPage({ navigation }: IProps) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.NONE
  );
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.BACK);
  const [showCamera, setShowCamera] = useState<boolean>(true);
  const [image, setImage] = useState<any>(null);
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
    console.log(Camera.Constants.Type);
    setCameraType(
      cameraType === CameraType.BACK ? CameraType.FRONT : CameraType.BACK
    );
  };

  const takePicture = async () => {
    setLoadingState(LoadingState.TAKING_PICTURE);
    let photo = await camera.current.takePictureAsync({ base64: true });

    setLoadingState(LoadingState.PROCESSING);

    if (photo.base64) {
      photo.base64 = photo.base64 as string;
      let imageInformation = await getImageInformation(photo.base64);
      setImage(photo.uri);
      setShowCamera(false);
      setInfos(imageInformation);
    }

    setLoadingState(LoadingState.NONE);
  };

  const openCamera = async () => {
    if (!hasPermission) {
      const { granted } = await Camera.requestPermissionsAsync();
      setHasPermission(granted);
      if (!granted) {
        Alert.alert("Error", "No access to camera");
      }
    } else {
      setShowCamera(true);
    }
  };

  if (hasPermission == null || hasPermission === false) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      {!showCamera && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.biggerText}>Your Image</Text>
          {image && (
            <Image
              style={styles.latestImage}
              resizeMode={"center"}
              source={{ uri: image }}
            />
          )}

          <Text style={styles.bigText}>What this is? {infos.name}</Text>

          <Text style={styles.normalText}>{infos.info}</Text>
          <Text style={styles.bigText}>Actions:</Text>

          {!infos.actions.includes(Action.UNKNOWN) &&
            infos.actions.map((action, index) => (
              <Button
                key={index}
                buttonStyle={styles.button}
                onPress={() =>
                  navigation.navigate(PAGES.map, {
                    targetLocation: action,
                  })
                }
                title={`${action}`}
              />
            ))}
          <Text style={styles.bigText}>Take another picture!</Text>
          <TouchableOpacity onPress={openCamera}>
            <MaterialIcons
              name="camera-alt"
              size={50}
              color={CAMERA_BUTTON_COLOR}
            />
          </TouchableOpacity>
        </ScrollView>
      )}
      {showCamera && (
        <>
          <Camera style={styles.camera} type={cameraType} ref={camera}>
            {loadingState !== LoadingState.NONE && (
              <View style={styles.loadingView}>
                <Text style={styles.loadingText}>{loadingState}</Text>
              </View>
            )}
          </Camera>
          <View style={styles.cameraFooter}>
            <TouchableOpacity
              style={styles.buttonFlipCamera}
              onPress={flipCamera}
            >
              <MaterialIcons
                name={
                  cameraType === CameraType.BACK
                    ? "camera-rear"
                    : "camera-front"
                }
                size={37}
                color={CAMERA_BUTTON_COLOR}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
              <MaterialIcons
                name="camera"
                size={50}
                color={CAMERA_BUTTON_COLOR}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonCloseCamera}
              onPress={() => setShowCamera(false)}
            >
              <MaterialIcons
                name="close"
                size={40}
                color={CAMERA_BUTTON_COLOR}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  normalText: {
    fontSize: 16,
    padding: 5,
    textAlign: "center",
  },
  bigText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  biggerText: {
    fontSize: 30,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  latestImage: {
    width: "90%",
    aspectRatio: 1,
  },
  camera: {
    flex: 1,
  },
  cameraFooter: {
    flex: 0.15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    backgroundColor: "#1e1e1e",
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonFlipCamera: {
    alignSelf: "center",
    alignContent: "center",
  },
  buttonCamera: { alignSelf: "center", alignContent: "center" },
  buttonCloseCamera: { alignSelf: "center", alignContent: "center" },
  button: {
    backgroundColor: CAMERA_BUTTON_COLOR,
    borderRadius: 100,
    margin: 5,
  },
  loadingView: {
    backgroundColor: "rgba(52, 52, 52, 0.4)",
    position: "absolute",
    alignSelf: "center",
    padding: 10,
    top: 20,
    borderRadius: 20,
  },
  loadingText: { color: "white", fontSize: 20 },
});
