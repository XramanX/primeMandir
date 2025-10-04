import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Animated,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { THEME } from '../styles/theme';

export default function DeityCard({
  deity,
  onPress,
  itemWidth = 0,
}: {
  deity: any;
  onPress: () => void;
  itemWidth?: number;
}) {
  const lift = useRef(new Animated.Value(0)).current;
  const [fav, setFav] = useState(false);

  function onPressIn() {
    Animated.spring(lift, {
      toValue: -6,
      useNativeDriver: true,
      stiffness: 220,
      damping: 16,
    } as any).start();
  }
  function onPressOut() {
    Animated.spring(lift, {
      toValue: 0,
      useNativeDriver: true,
      stiffness: 220,
      damping: 16,
    } as any).start();
  }

  function onToggleFav(e?: GestureResponderEvent) {
    e?.stopPropagation?.();
    setFav(v => !v);
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      android_ripple={{ color: 'rgba(0,0,0,0.03)' }}
      style={[styles.wrapper, itemWidth ? { width: itemWidth } : undefined]}
    >
      <Animated.View
        style={[styles.card, { transform: [{ translateY: lift }] }]}
      >
        <Pressable
          onPress={onToggleFav}
          android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          style={styles.favWrap}
        >
          <Feather
            name={fav ? 'heart' : 'heart'}
            size={18}
            color={fav ? THEME.colors.accent : 'rgba(0,0,0,0.18)'}
          />
        </Pressable>

        <View style={styles.avatarWrap}>
          {deity.img ? (
            <Image source={{ uri: deity.img }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{(deity.name || 'D')[0]}</Text>
            </View>
          )}
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {deity.name}
        </Text>
        <Text style={styles.sub} numberOfLines={2}>
          {deity.subtitle}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // width controlled by parent via itemWidth prop; fallback keeps two-column layout
    width: '48%',
    marginBottom: THEME.space.md,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    paddingVertical: THEME.space.sm,
    paddingHorizontal: THEME.space.md,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.12,
    shadowRadius: 16,
    elevation: 4,
    position: 'relative',
  },
  favWrap: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  avatarWrap: { marginBottom: THEME.space.sm, marginTop: 6 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: THEME.radius.full ?? 999,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: THEME.radius.full ?? 999,
    backgroundColor: '#F0E9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: THEME.fontSize.xl,
    fontWeight: THEME.fontWeight.black as any,
    color: THEME.colors.primary,
  },
  name: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.bold as any,
    marginTop: 6,
    color: '#111',
  },
  sub: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.muted,
    textAlign: 'center',
    marginTop: 6,
  },
});
