import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { DatabaseService } from './DatabaseService';

const MapScreen = () => {
  const [imageLocations, setImageLocations] = useState([]);

  useEffect(() => {
    loadImageLocations();
  }, []);

  const loadImageLocations = async () => {
    try {
      const images = await DatabaseService.getAllImages();
      setImageLocations(images.filter(img => img.latitude && img.longitude));
    } catch (error) {
      console.error('Failed to load image locations:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {imageLocations.map(image => (
          <Marker
            key={image.id}
            coordinate={{
              latitude: image.latitude,
              longitude: image.longitude
            }}
            title={`Image ${image.id}`}
          >
            <View style={styles.marker}>
              <Image 
                source={{ uri: image.uri }} 
                style={styles.markerImage} 
              />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  markerImage: {
    width: '100%',
    height: '100%',
  }
});

export default MapScreen;