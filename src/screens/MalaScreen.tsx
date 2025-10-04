// src/screens/MalaScreen.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import MalaCounter from '../components/MalaCounter';
import { THEME } from '../styles/theme';
import { View, StyleSheet } from 'react-native';

export default function MalaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Mala Japa"
        subtitle="Digital mala counter"
        compact={false}
      />
      <View style={styles.body}>
        <MalaCounter
          initialName="Ram"
          beadsPerMala={108}
          onCompleteMala={(count, malasCompleted) => {
            // small feedback or analytics hook
            console.log(
              `Completed mala #${malasCompleted} (total taps ${count})`,
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  body: { paddingHorizontal: THEME.space.md, paddingTop: THEME.space.md },
});
