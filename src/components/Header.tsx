// src/components/Header.tsx  (fixed safe-top / reduced whitespace)
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Platform,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { THEME } from '../styles/theme';

export type Action = {
  id: string;
  node?: React.ReactNode;
  iconName?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightActions?: Action[];
  showLogo?: boolean;
  logoSrc?: any;
  compact?: boolean;
  style?: ViewStyle;
};

export default function Header({
  title = 'PrimeTemple',
  subtitle,
  onBack,
  rightActions = [],
  showLogo = false,
  logoSrc,
  compact = false,
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  const maxTop = Platform.OS === 'ios' ? 44 : 0;
  const safeTop = Math.min(insets.top || 0, maxTop);

  const baseHeight = compact ? 48 : 56;

  const headerHeight = safeTop + baseHeight;

  return (
    <View
      style={[
        styles.header,
        { paddingTop: safeTop, height: headerHeight },
        style,
      ]}
      accessible
      accessibilityRole="header"
    >
      <View style={styles.sideLeft}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={20} color={THEME.colors.primary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.center}>
        {showLogo && logoSrc ? (
          <Image source={logoSrc} style={styles.logo} resizeMode="contain" />
        ) : null}

        <Text
          style={[styles.title, compact ? styles.titleCompact : undefined]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.sideRight}>
        {rightActions.map(a => (
          <Pressable
            key={a.id}
            onPress={a.onPress}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            accessibilityLabel={a.accessibilityLabel ?? a.id}
            accessibilityRole="button"
          >
            {a.node ? (
              a.node
            ) : a.iconName ? (
              <Feather
                name={a.iconName as any}
                size={18}
                color={THEME.colors.primary}
              />
            ) : null}
          </Pressable>
        ))}

        <View style={styles.avatarPlaceholder}>
          <Feather name="user" size={16} color={THEME.colors.muted} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: THEME.colors.bg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 10,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: Platform.OS === 'ios' ? 0.06 : 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sideLeft: {
    width: 64,
    paddingLeft: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  sideRight: {
    minWidth: 92,
    paddingRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  logo: { width: 120, height: 18, marginBottom: 6 },
  title: {
    color: THEME.colors.primary,
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.black as any,
  },
  titleCompact: { fontSize: THEME.fontSize.md },
  subtitle: {
    marginTop: 2,
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.muted,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginLeft: 8,
  },
  pressed: { opacity: 0.7 },
  avatarPlaceholder: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
