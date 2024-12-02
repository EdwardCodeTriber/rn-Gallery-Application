import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import GalleryScreen from "./GalleryScreen";
import MapScreen from "./MapScreen";
import { initializeDatabase } from "./DatabaseService";

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    initializeDatabase()
      .then(() => console.log("Database initialized successfully"))
      .catch((error) => {
        console.error("Database initialization failed:", error);
      });
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
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
