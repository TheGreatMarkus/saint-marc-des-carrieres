import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert, ScrollView, Image, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from "@expo/vector-icons";
import { getImageInformation } from '../service/vision-api';
import { Button } from 'react-native-elements';


export default class CameraPage extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
  }

  state = {
    hasCameraPermission: true,
    cameraType: Camera.Constants.Type.back,
    isCameraVisible: true,
    latestImage: null,
    labels: [],
    infos: {
      category: '',
      actions: [],
      info: ''
    }
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.isCameraVisible && (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.mainContent}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.openCamera}>
                  <MaterialIcons name="camera-alt" size={40} color="#1083bb" />
                </TouchableOpacity>


                {this.state.latestImage && (
                  <Image
                    style={styles.latestImage}
                    resizeMode={"cover"}
                    source={{ uri: this.state.latestImage }}
                  />
                )}

                <View style={styles.textBox}>
                  <Text style={styles.textBoxBig}>What this is: {this.state.infos.category}</Text>
                  <Text style={styles.textBoxBig}>What you can do: {this.state.infos.actions.join(", ")}!</Text>
                  <Text style={styles.textBoxText}>{this.state.infos.info}</Text>
                </View>

                {this.state.infos.actions !== 'Unknown' &&
                  this.state.infos.actions.map((action, index) => (
                    <Button
                      key={index}
                      backgroundColor="green"
                      onPress={() => this.props.navigation.navigate('Map', { targetLocation: action })}
                      title={`${action}!`}
                      borderRadius={100}
                      color="white"
                    />
                  ))

                }
              </View>
            </View>
          </ScrollView>
        )}
        {this.state.isCameraVisible && (
          <Camera
            style={styles.camera}
            type={this.state.cameraType}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={styles.cameraFiller} />
            <View style={styles.cameraContent}>
              <TouchableOpacity
                style={styles.buttonFlipCamera}
                onPress={this.flipCamera}
              >
                <MaterialIcons name="flip" size={25} color="#e8e827" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonCamera}
                onPress={this.takePicture}
              >
                <MaterialIcons name="camera" size={50} color="#e8e827" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonCloseCamera}
                onPress={this.closeCamera}
              >
                <MaterialIcons name="close" size={25} color="#e8e827" />
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>
    );
  }


  flipCamera = () => {
    this.setState({
      cameraType:
        this.state.cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  };

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({ base64: true });

      let imageInformation = await getImageInformation(photo.base64);

      this.setState({
        latestImage: photo.uri,
        isCameraVisible: false,
        infos: {
          category: imageInformation.category,
          actions: imageInformation.actions,
          info: imageInformation.info
        }
      });
    };
  }

  openCamera = () => {
    const { hasCameraPermission } = this.state;
    if (!hasCameraPermission) {
      Alert.alert("Error", "No access to camera");
    } else {
      this.setState({ isCameraVisible: true });
    }
  };

  closeCamera = () => {
    this.setState({
      isCameraVisible: false
    });
  };
}

takePicture = async () => {
  if (this.camera) {
    let photo = await this.camera.takePictureAsync({ base64: true });

    let formData = new FormData();
    formData.append("image", photo.base64);
    formData.append("type", "base64");

    this.props.navigation.navigate('Catalog')
  }
}

const styles = {
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1
  },
  scroll: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  textBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5
  },
  textBoxText: {
    fontSize: 14,
    padding: 10,
  },
  textBoxBig: {
    fontSize: 18,
    fontWeight: "bold"
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
    flex: 1
  },
  latestImage: {
    width: 250,
    height: 350,
    marginTop: 10,
    borderWidth: 5,
    borderColor: "#FFF",
    alignSelf: "center"
  },
  camera: {
    flex: 1
  },
  cameraFiller: {
    flex: 8
  },
  cameraContent: {
    flex: 2,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  buttonFlipCamera: {
    flex: 3,
    padding: 10,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  buttonTextFlipCamera: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e8e827"
  },
  buttonCamera: {
    flex: 4,
    alignSelf: "center",
    alignItems: "center"
  },
  buttonCloseCamera: {
    flex: 3,
    padding: 10,
    alignSelf: "flex-end",
    alignItems: "center"
  }
};
