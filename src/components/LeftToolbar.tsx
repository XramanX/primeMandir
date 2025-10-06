// src/components/LeftToolbar.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { THEME } from '../styles/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type Item = { id: string; label?: string; src?: any; onPress?: () => void };

export default function LeftToolbar({ items = [] }: { items?: Item[] }) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {items.map(it => (
        <TouchableOpacity
          key={it.id}
          style={styles.btn}
          onPress={it.onPress}
          activeOpacity={0.8}
        >
          {it.src ? (
            <Image source={it.src} style={styles.icon} />
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
          {it.label && <Text style={styles.label}>{it.label}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    bottom: 140, // sits above carpet controls; tweak as needed
    zIndex: 30,
    justifyContent: 'center',
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.surface,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadowDepth.soft,
  },
  icon: { width: 36, height: 36, resizeMode: 'contain' },
  iconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.lightTeal,
  },
  label: {
    fontSize: 11,
    color: THEME.colors.muted,
    marginTop: 6,
    textAlign: 'center',
  },
});
