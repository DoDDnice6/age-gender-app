import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import _ from 'lodash';
export default class Detector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_style: {
        position: 'relative',
        width: 480,
        height: 480
      },
      filePath: {},
      has_photo: false,
      face_data: null
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>

          <ImageBackground
            source={{ uri: this.state.filePath.uri }}
            style={this.state.photo_style}
          >
            {this._renderFaceBoxes.call(this)}
          </ImageBackground>
          <TouchableOpacity
            style={styles.button}
            onPress={this.chooseFile.bind(this)}
          >
            <Text>Choose File</Text>
          </TouchableOpacity>
          {this._renderDetectFacesButton.call(this)}
        </View>
      </View>
    );
  }
  chooseFile = () => {
    const image_picker_options = {
      title: 'Select Photo',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      cameraType: 'back',
      mediaType: 'photo',
      maxWidth: 480,
      quality: 1,
      noData: false,
      path: 'images'
    };
    this.setState({
      face_data: null
    });
    ImagePicker.showImagePicker(image_picker_options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        this.setState({
          photo_style: {
            position: 'relative',
            width: source.width,
            height: source.height
          }
        });
        // alert(source.width)
        this.setState({
          filePath: source,
          has_photo: true,
          photo_data: response.data
        });
      }
    });
  };
  _renderDetectFacesButton = () => {
    if (this.state.has_photo) {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={this._detectFaces.bind(this)}
        >
          <Text>Estimate</Text>
        </TouchableOpacity>
      );
    }

  }
  _detectFaces = () => {
    const formData = new FormData();
    formData.append('image', {
      name: this.state.filePath.fileName,
      type: this.state.filePath.type,
      uri: this.state.filePath.uri
    });
    fetch(
      'https://age-gender-estimation.herokuapp.com/predict',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      })
      .then((res) => res.json())
      .then((json) => {
        if (JSON.stringify(json)) {
          this.setState({
            face_data: json
          });
          // alert("Done");
        } else {
          alert("Sorry, I can't see any faces in there.");
        }

        return JSON.stringify(json);
      })
      .catch(function (error) {
        console.log(error);
        alert('Sorry, the request failed. Please try again.' + JSON.stringify(error));
      });


  }

  _renderFaceBoxes = () => {
    if (this.state.face_data != null) {
      // x = JSON.stringify(this.state.face_data)
      // 
      // alert(x);
      x = this.state.face_data
      var _views = [];
      for (let i = 0; i < x.predictions.genders.length; i++) {
        let box = {
          position: 'absolute',
          top: x.predictions.boudingboxes[i][1],
          left: x.predictions.boudingboxes[i][0],
        };

        let style = {
          width: x.predictions.boudingboxes[i][2],
          height: x.predictions.boudingboxes[i][3],
          borderWidth: 2,
          borderColor: '#fff',
        };
        let gender = x.predictions.genders[i][0] < 0.5 ? "Nam" : "Nữ";
        let age = Math.round(x.predictions.ages[i]);
        _views.push(
          <View style={box} key={i}>
            <View style={style}></View>
            <Text style={styles.text}>{gender} - {age}</Text>
          </View>
        )
      }

      return (<View>
        {_views}
      </View>)
    }
  }





}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 10,
    padding: 15,
    backgroundColor: '#529ecc'
  },
  text: {
    textAlign: 'center',
    backgroundColor: '#bbff99',
    color: '#ffffff',
    opacity: 0.5
  }
});