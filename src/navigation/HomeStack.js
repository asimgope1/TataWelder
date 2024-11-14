import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DashBoard from '../Pages/DashBoard/DashBoard';
import Registration from '../Pages/Registratration/Registration';
import NewJob from '../Pages/NewJob/NewJob';
import JobApproval from '../Pages/JobApproval/JobApproval';
import RTReport from '../Pages/RTReport/RTReport';
import PAUTReport from '../Pages/PAUTReport/PAUTReport';
import QualityVerification from '../Pages/QualityVerification\'/QualityVerification';
import TPI from '../Pages/TPI/TPI';
import FinalApproval from '../Pages/FinalApproval/FinalApproval';
import CustomDrawerContent from './CustomDrawerContent';
import { WIDTH } from '../constants/config';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      screenOptions={{
        headerShown: false,
        drawerWidth: WIDTH,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />} // Use custom drawer here
    >
      <Drawer.Screen name="DashBoard" component={DashBoard} />
      <Drawer.Screen name="Registration" component={Registration} />
      <Drawer.Screen name="New Job" component={NewJob} />
      <Drawer.Screen name="Job Approval" component={JobApproval} />
      <Drawer.Screen name="RT Report" component={RTReport} />
      <Drawer.Screen name="PAUT-Report" component={PAUTReport} />
      <Drawer.Screen name="Quality Verification" component={QualityVerification} />
      <Drawer.Screen name="TPI" component={TPI} />
      <Drawer.Screen name="Final Approval" component={FinalApproval} />
    </Drawer.Navigator>
  );
};

const HomeStack = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Drawer">
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStack;
