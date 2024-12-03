import React, { useState, useEffect } from 'react';
import { 
  View, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Modal, 
  Text 
} from 'react-native';
import { DatabaseService } from './DatabaseService';
import ImageLocationService from './ImageLocationService';

const GalleryScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      // Destructure allImages from the returned object
      const { allImages } = await DatabaseService.getAllImages();
      setImages(allImages || []);
    } catch (error) {
      console.error('Failed to load images:', error);
      setImages([]);
    }
  };

  const captureImage = async () => {
    const imageUri = await ImageLocationService.pickImageFromCamera();
    if (imageUri) {
      const location = await ImageLocationService.getCurrentLocation();
      
      if (location) {
        await DatabaseService.addImage(
          imageUri, 
          location.latitude, 
          location.longitude, 
          'Captured Image'
        );
        loadImages();
      }
    }
  };

  const renderImage = ({ item }) => (
    <TouchableOpacity 
      onPress={() => setSelectedImage(item)}
      style={styles.imageContainer}
    >
      <Image 
        source={{ uri: item.uri }} 
        style={styles.image} 
        resizeMode="cover" 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No images captured yet</Text>
          </View>
        )}
      />
      
      <TouchableOpacity 
        style={styles.captureButton}
        onPress={captureImage}
      >
        <Text style={styles.captureButtonText}>Capture Image</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Modal 
          visible={!!selectedImage}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.modalContainer}>
            <Image 
              source={{ uri: selectedImage.uri }} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  imageContainer: {
    flex: 1,
    margin: 2,
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    backgroundColor: 'rgb(216, 128, 81)',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  captureButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    backgroundColor: 'white',
    padding: 10,
    margin: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'black',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  }
});

export default GalleryScreen;

