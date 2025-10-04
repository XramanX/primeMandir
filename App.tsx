import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator, {
  RootStackParamList,
} from './src/navigation/AppNavigator';
import { NavItem } from './src/components/FloatingBottomNav';
import Feather from 'react-native-vector-icons/Feather';
import { THEME } from './src/styles/theme';
import { BottomNavProvider } from './src/contexts/BottomNavContext';
import FloatingBottomNavWrapper from './src/wrapper/FloatingBottomNavWrapper';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
  const items: NavItem[] = [
    {
      id: 'home',
      label: 'Deities',
      icon: <Feather name="home" size={18} color={THEME.colors.muted} />,
      onPress: () => navigationRef.current?.navigate('Home'),
    },
    {
      id: 'mala',
      label: 'Mala',
      icon: <Feather name="circle" size={18} color={THEME.colors.muted} />,
      onPress: () => navigationRef.current?.navigate('Mala'),
    },
    {
      id: 'saarathi',
      label: 'Saarathi',
      icon: (
        <Feather name="message-circle" size={18} color={THEME.colors.muted} />
      ),
      onPress: () => navigationRef.current?.navigate('Saarathi'),
    },
    {
      id: 'shlokas',
      label: 'Shlokas',
      icon: <Feather name="file-text" size={18} color={THEME.colors.muted} />,
      onPress: () => navigationRef.current?.navigate('Shlokas'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <Feather name="user" size={18} color={THEME.colors.muted} />,
      onPress: () => navigationRef.current?.navigate('Profile'),
    },
  ];

  return (
    <SafeAreaProvider>
      <BottomNavProvider>
        <NavigationContainer ref={navigationRef}>
          <View style={styles.container}>
            <AppNavigator />
            <FloatingBottomNavWrapper
              items={items}
              centerAction={{
                icon: <Text style={{ fontSize: 28 }}>🛕</Text>,
                onPress: () => navigationRef.current?.navigate('Arti'),
                size: 28,
                accessibilityLabel: 'Arti',
              }}
              backgroundColor={THEME.colors.surface}
            />
          </View>
        </NavigationContainer>
      </BottomNavProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
});
