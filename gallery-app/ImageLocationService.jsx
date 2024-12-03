import React from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

class ImageLocationService {
  // Request camera and storage permissions
  requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      return cameraStatus === 'granted' && locationStatus === 'granted';
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  // Pick image from camera
  pickImageFromCamera = async () => {
    try {
      // Request permissions
      const permissionsGranted = await this.requestPermissions();
      if (!permissionsGranted) {
        Alert.alert(
          'Permissions Required', 
          'Camera and location permissions are needed to capture and tag images.',
          [{ text: 'OK' }]
        );
        return null;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
      });

      // Check if image was captured
      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Camera capture error:', error);
      Alert.alert(
        'Image Capture Error', 
        'Failed to capture image. Please try again.',
        [{ text: 'OK' }]
      );
      return null;
    }
  }

  // Get current location
  getCurrentLocation = async () => {
    try {
      // Request location permission if not already granted
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission', 
          'Location permission is required to tag image locations.',
          [{ text: 'OK' }]
        );
        return null;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error', 
        'Could not retrieve current location.',
        [{ text: 'OK' }]
      );
      return null;
    }
  }
}


export default ImageLocationService;