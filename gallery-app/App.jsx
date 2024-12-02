import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import GalleryScreen from './GalleryScreen';
import MapScreen from './MapScreen';
import { initializeDatabase } from './DatabaseService';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    // Initialize database when app starts
    initializeDatabase()
      .then(() => console.log('Database initialized'))
      .catch(error => console.error('Database initialization error:', error));
  }, []);

  return (
    <NavigationContainer>
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}