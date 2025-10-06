// src/components/Prasad.tsx
import React, { useCallback, useRef } from 'react';
import { Pressable, Animated, Easing, Image, StyleSheet } from 'react-native';

type PrasadProps = { src: any; onPress?: () => void; size?: number };

/**
 * Prasad plate — small pop animation on press
 */
export default function Prasad({ src, onPress, size = 92 }: PrasadProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pop = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.12,
        duration: 140,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
    onPress?.();
  }, [onPress, scale]);

  return (
    <Pressable onPress={pop} accessibilityLabel="Prasad plate">
      <Animated.Image
        source={src}
        style={[
          styles.img,
          { width: size, height: size, transform: [{ scale }] },
        ]}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  img: { borderRadius: 6 },
});
