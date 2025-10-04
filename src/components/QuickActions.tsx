import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { THEME } from '../styles/theme';

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  onPress?: () => void;
};

export default function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.row}>
        {actions.map((q, idx) => (
          <TouchableOpacity
            key={q.id}
            style={[
              styles.btn,
              idx === actions.length - 1 ? { marginRight: 0 } : undefined,
            ]}
            activeOpacity={0.85}
            onPress={q.onPress}
          >
            <View style={styles.iconWrap}>
              <Feather
                name={q.icon as any}
                size={18}
                color={THEME.colors.primary}
              />
            </View>
            <Text style={styles.label}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // NO horizontal padding — parent supplies it via contentContainerStyle
  wrap: { paddingTop: 12, paddingBottom: 4 },
  title: { fontWeight: THEME.fontWeight.bold as any, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: {
    flex: 1,
    marginRight: 10,
    backgroundColor: THEME.colors.surface,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.full ?? 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.glass,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: THEME.fontWeight.medium as any,
    textAlign: 'center',
  },
});
