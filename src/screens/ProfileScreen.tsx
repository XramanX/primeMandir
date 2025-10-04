import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { THEME } from '../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Profile" />
      <View style={styles.container}>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.desc}>
          Account, favorites, settings and app preferences.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: THEME.colors.primary },
  desc: { marginTop: 8, color: THEME.colors.muted },
});
