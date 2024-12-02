import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import GalleryScreen from './GalleryScreen';


const Tab = createBottomTabNavigator();

export default function App() {
  

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
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}