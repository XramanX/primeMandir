// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeityList from '../screens/DeityList';
import DeityDetail from '../screens/DeityDetail';
import ArtiScreen from '../screens/ArtiScreen';
import ShlokasScreen from '../screens/ShlokasScreen';
import SaarathiScreen from '../screens/SaarathiScreen';

import StoriesScreen from '../screens/StoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MalaScreen from '../screens/MalaScreen';

export type RootStackParamList = {
  Home: undefined;
  DeityDetail: { id: string; name?: string } | undefined;
  Arti: undefined;
  Shlokas: undefined;
  Stories: undefined;
  Profile: undefined;
  Mala: undefined;
  Saarathi: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right' as const,
      }}
    >
      <Stack.Screen name="Home" component={DeityList} />
      <Stack.Screen name="DeityDetail" component={DeityDetail} />
      <Stack.Screen name="Arti" component={ArtiScreen} />
      <Stack.Screen name="Shlokas" component={ShlokasScreen} />
      <Stack.Screen name="Saarathi" component={SaarathiScreen} />
      <Stack.Screen name="Stories" component={StoriesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Mala" component={MalaScreen} />
    </Stack.Navigator>
  );
}
