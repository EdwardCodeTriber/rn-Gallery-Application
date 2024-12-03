import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { initializeDatabase } from './DatabaseService';
import GalleryScreen from './GalleryScreen';
import MapScreen from './MapScreen';
import CameraScreen from './CameraScreen';
import { useEffect } from 'react';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {

  useEffect(() => {
    initializeDatabase()
      .then(() => console.log('Database initialized successfully'))
      .catch(error => {
        console.error('Database initialization failed:', error);
        // Optionally show an error to the user
      });
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Gallery" 
        component={GalleryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ 
            title: 'Take a Picture',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'white',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}