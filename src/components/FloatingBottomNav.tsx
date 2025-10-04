import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../styles/theme';

export type NavItem = {
  id: string;
  label?: string;
  // icon can be a React element (preferred) or a fallback string/emoji
  icon?: React.ReactNode | string;
  badge?: number | string | null;
  onPress?: () => void;
  accessibilityLabel?: string;
};

type Props = {
  items: NavItem[]; // left + right items (center reserved if centerAction present)
  centerAction?: {
    icon?: React.ReactNode | string;
    onPress: () => void;
    size?: number;
    accessibilityLabel?: string;
  } | null;
  visible?: boolean; // show/hide
  backgroundColor?: string;
  elevation?: number;
  style?: object;
};

const { width: SCREEN_W } = Dimensions.get('window');
const MAX_WIDTH = Math.min(800, SCREEN_W - 24);

export default function FloatingBottomNav({
  items,
  centerAction = null,
  visible = true,
  backgroundColor = THEME.colors.surface,
  elevation = 10,
  style,
}: Props) {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [140, 0],
  });
  const opacity = anim;

  // split items into left/right around center
  const half = Math.ceil(items.length / 2);
  const left = items.slice(0, half);
  const right = items.slice(half);

  // small helper to render icon or fallback
  const renderIcon = (icon?: React.ReactNode | string, size = 22) => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      // allow emoji or single-character fallback
      return <Text style={{ fontSize: size, lineHeight: size }}>{icon}</Text>;
    }
    return icon;
  };

  const containerWidth = useMemo(() => MAX_WIDTH, []);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.container,
        {
          bottom: insets.bottom + 12,
          backgroundColor,
          shadowOpacity: 0.08,
          elevation,
          width: containerWidth,
          transform: [{ translateY }],
          opacity,
        },
        style,
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.side}>
          {left.map(item => (
            <NavButton key={item.id} item={item} renderIcon={renderIcon} />
          ))}
        </View>

        {centerAction ? (
          <View style={styles.centerWrap}>
            <TouchableOpacity
              onPress={centerAction.onPress}
              activeOpacity={0.8}
              accessibilityLabel={centerAction.accessibilityLabel}
              style={[
                styles.fab,
                {
                  backgroundColor: THEME.colors.primary,
                  shadowColor: THEME.colors.shadow,
                },
              ]}
            >
              {renderIcon(centerAction.icon, centerAction.size ?? 26)}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.centerSpacer} />
        )}

        <View style={styles.side}>
          {right.map(item => (
            <NavButton key={item.id} item={item} renderIcon={renderIcon} />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

function NavButton({
  item,
  renderIcon,
}: {
  item: NavItem;
  renderIcon: (i?: any, s?: number) => React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={item.onPress}
      style={styles.btn}
      activeOpacity={0.75}
      accessibilityLabel={item.accessibilityLabel ?? item.label ?? item.id}
    >
      <View style={styles.iconWrap}>
        {renderIcon(item.icon)}
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{String(item.badge)}</Text>
          </View>
        ) : null}
      </View>
      {item.label ? <Text style={styles.label}>{item.label}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    // horizontal padding + width handled via inner
    shadowOffset: { width: 0, height: 8 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    // iOS blur-like background effect: subtle
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as any,
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
  },
  centerSpacer: {
    width: 72,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: THEME.colors.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
});
