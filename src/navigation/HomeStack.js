import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DashBoard from '../Pages/DashBoard/DashBoard';
import Registration from '../Pages/Registratration/Registration';
import { BRAND, WHITE } from '../constants/color';
import { WIDTH } from '../constants/config';

// Create instances of StackNavigator and DrawerNavigator
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Define the DrawerNavigator with DashBoard as the only screen
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      screenOptions={{
        headerShown: false, // Hide headers for screens inside the drawer
        drawerStyle: {
          backgroundColor: WHITE, // Customize drawer background color
          width: WIDTH * 0.6, // Set the drawer width
        },
      }}
    >
      <Drawer.Screen
        name="DashBoard"
        component={DashBoard}
        options={{ drawerLabel: 'Dashboard' }} // Customize the drawer label
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="Registration"
        component={Registration}
      />
    </Drawer.Navigator>
  );
};

// Main component that includes only the DrawerNavigator for DashBoard
const HomeStack = () => {
  return (
    <NavigationContainer
      independent={true}
    >
      <Stack.Navigator initialRouteName="Drawer">
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator} // Embed the DrawerNavigator here
          options={{ headerShown: false }} // Hide the header for the stack
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStack;
