import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import * as Camera from 'expo-camera';
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { DatabaseService } from "./DatabaseService";

const CameraScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back');
  const [cameraPermission, setCameraPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Request camera permissions
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      // Request media library permissions
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

      // Request location permissions
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

      setCameraPermission(
        cameraStatus === "granted" &&
        mediaStatus === "granted" &&
        locationStatus === "granted"
      );
    })();
  }, []);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync();

      // Get current location
      const location = await Location.getCurrentPositionAsync({});

      // Save to media library
      await MediaLibrary.createAssetAsync(photo.uri);

      // Save to database
      await DatabaseService.addImage(
        photo.uri,
        location.coords.latitude,
        location.coords.longitude,
        "Captured Image"
      );

      // Set captured image for preview
      setCapturedImage(photo.uri);

      Alert.alert("Success", "Image captured and saved!");
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Failed to capture image");
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const saveAndExit = () => {
    navigation.goBack();
  };

  // If camera permissions are not granted
  if (cameraPermission === null) {
    return <View />;
  }

  if (!cameraPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(status === 'granted');
          }}
        >
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <CameraView 
          style={styles.camera} 
          facing={facing} 
          ref={cameraRef}
        > 
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.previewButtonContainer}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={retakePicture}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveAndExit}>
              <Text style={styles.buttonText}>Save & Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
    },
    camera: {
      flex: 1,
      justifyContent: "flex-end",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 20,
    },
    flipButton: {
      backgroundColor: "rgba(255,255,255,0.5)",
      padding: 15,
      borderRadius: 10,
    },
    captureButton: {
      backgroundColor: "rgba(255,0,0,0.7)",
      padding: 15,
      borderRadius: 10,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
    },
    previewContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
    previewImage: {
      width: "100%",
      height: "80%",
      resizeMode: "contain",
    },
    previewButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 20,
    },
    retakeButton: {
      backgroundColor: "gray",
      padding: 15,
      borderRadius: 10,
    },
    saveButton: {
      backgroundColor: "green",
      padding: 15,
      borderRadius: 10,
    },
    message: {
      textAlign: "center",
      color: "white",
      marginBottom: 20,
    },
    permissionButton: {
      backgroundColor: "rgba(255,255,255,0.5)",
      padding: 15,
      borderRadius: 10,
      alignSelf: "center",
    },
  });

export default CameraScreen;

// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import { useState } from 'react';
// import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function App() {
//   const [facing, setFacing] = useState('back');
//   const [permission, requestPermission] = useCameraPermissions();

//   if (!permission) {
//     // Camera permissions are still loading.
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need your permission to show the camera</Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} facing={facing}>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             <Text style={styles.text}>Flip Camera</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   message: {
//     textAlign: 'center',
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// });
