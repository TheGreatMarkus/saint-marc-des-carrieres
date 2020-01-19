import React, { useState, useEffect, Component } from 'react';
import { Text, View, TouchableOpacity, Button, Alert, ScrollView, Image } from 'react-native';
import { Camera, Permissions } from 'expo-camera';
import { MaterialIcons } from "@expo/vector-icons";
import { getLabelsFromImage } from '../service/vision-api';

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
      type: '',
      material: '',
      action: '',
      moreInfo: ''
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
              </View>

              {this.state.latestImage && (
                <Image
                  style={styles.latestImage}
                  resizeMode={"cover"}
                  source={{ uri: this.state.latestImage }}
                />
              )}

              <View style={styles.textBox}>
              <Text style={styles.textBoxBig}>{this.state.infos.material} {this.state.infos.type}</Text>
                <Text style={styles.textBoxBig}>{this.state.infos.action}!</Text>
                <Text style={styles.textBoxText}>{this.state.infos.moreInfo}</Text>
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

  findMoreInfo = (material, action) => {
    let moreInfo = '';
    switch (action) {
      case 'Recyclable':
        switch (material) {
          case 'Plastic':
            moreInfo = 'Plastics are often recyclable, but there are a few exceptions: plastic bags, straws and coffee cups aren\'t usually recyclable. Additionally, only CLEAN plastics are recyclable, so wash your food off before putting it in the bin!';
            break;
          case 'Paper':
            moreInfo = 'Clean paper products are both recyclable and compostable. Soiled paper, such as greasy pizza boxes, are compostable but not recyclable, so rip up that old pizza box and compost it!';
            break;
          case 'Glass':
          case 'Aluminum':
            moreInfo = 'Both glass and metal (such as aluminum cans) products are infinitely recyclable!';
            break;
          default:
        }
        break;
      case 'Compostable':
        moreInfo = 'Things that are compostable include dead leaves, twigs, grass clippings, fruit and vegetable scraps, coffee grounds, cardboard, and more. Things that arent compostable include things that emit odors and attract rodents and flies, such as fats and oils, dairy products and meat products.';
        break;
      case 'Trash':
        moreInfo = 'Trash is usually composite materials or plastics that aren\'t recyclable, such as cereal, cookie or cracker wrappers, black plastic containers, coffee cups, bubble wrap, plastic or foil wrappers, straws, toothpicks, ribbons, broken dishes, etc.';
        break;
      case 'E-waste':
        moreInfo = 'If you can plug it into an outlet, or it has circuit boards or chips, it\'s e-waste. Dispose of it in specially designated areas in your city.';
        break;
      default:
    }
    return moreInfo;
  }

  determineInfo = () => {
    this.setState({
      infos: {
        type: 'Bottle',
        material: 'Plastic',
        action: 'Recyclable',
        moreInfo: this.findMoreInfo('Plastic', 'Recyclable')
      }
    });
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

      let labels = await getLabelsFromImage(photo.base64);

      this.setState({
        latestImage: photo.uri,
        isCameraVisible: false,
        labels: labels
      });

      this.determineInfo();
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
    backgroundColor: "#fafafa"
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
    backgroundColor: "#FFF",
    padding: 5
  },
  textBoxText: {
    fontSize: 14,
    padding: 10
  },
  textBoxBig: {
    fontSize: 18,
    fontWeight: "bold"
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20
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
