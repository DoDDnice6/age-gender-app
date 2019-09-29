import React,{Component} from 'react';
 
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';

import Detector from './android/components/Detector';

export default class AgeGenderEstimator extends Component {
  render(){
    return (
      <View style={styles.container}>
        <Detector  />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});