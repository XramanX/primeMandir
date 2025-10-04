import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { THEME } from '../styles/theme';

export type RecentItem = {
  id: string;
  name: string;
  sub?: string;
  onPress?: () => void;
};

export default function RecentStrip({ items }: { items: RecentItem[] }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Recently Played</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {items.map((r, idx) => (
          <TouchableOpacity
            key={r.id}
            style={[
              styles.item,
              idx === items.length - 1 ? { marginRight: 0 } : undefined,
            ]}
            onPress={r.onPress}
            activeOpacity={0.85}
          >
            <View style={styles.avatar}>
              <Text style={styles.initial}>{(r.sub || r.name || 'D')[0]}</Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {r.name}
            </Text>
            {r.sub ? (
              <Text style={styles.sub} numberOfLines={1}>
                {r.sub}
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // NO horizontal padding here
  wrap: { paddingTop: 12, paddingBottom: 8 },
  title: { fontWeight: THEME.fontWeight.bold as any, marginBottom: 8 },
  scroll: { paddingVertical: 4 },
  item: {
    width: 140,
    marginRight: 12,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: THEME.radius.full ?? 999,
    backgroundColor: '#FFF1E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  initial: {
    fontSize: 26,
    fontWeight: THEME.fontWeight.black as any,
    color: THEME.colors.primary,
  },
  name: { fontWeight: THEME.fontWeight.bold as any, textAlign: 'center' },
  sub: { color: THEME.colors.muted, fontSize: 12 },
});
