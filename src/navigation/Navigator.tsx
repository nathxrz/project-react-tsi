/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar} from 'react-native';
import {Icon, useTheme} from 'react-native-paper';
import Home from '../screens/Home';
import Menu from '../screens/Menu';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Preload from '../screens/Preload';
import ForgotPassword from '../screens/ForgotPassword';
import Profile from '../screens/Profile';
import CatProfile from '../screens/CatProfile';
import ChangeUserPassword from '../screens/ChangeUserPassword';
import Cats from '../screens/Cats';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Preload"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Preload" component={Preload} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}

function AppStack() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        component={Home}
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <Icon source="home" color={theme.colors.primary} size={20} />
          ),
        }}
      />
      <Tab.Screen
        component={Cats}
        name="Cats"
        options={{
          tabBarLabel: 'Cats',
          tabBarIcon: () => (
            <Icon source="cat" color={theme.colors.primary} size={20} />
          ),
        }}
      />
      <Tab.Screen
        component={Menu}
        name="Menu"
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: () => (
            <Icon source="menu" color={theme.colors.primary} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Stack.Navigator
        initialRouteName="AuthStack"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="AppStack" component={AppStack} />
        <Stack.Screen
          component={CatProfile}
          name="CatProfile"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen component={Profile} name="Profile" />
        <Stack.Screen
          component={ChangeUserPassword}
          name="ChangeUserPassword"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
