// src/components/Incense.tsx
import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { THEME } from '../styles/theme';

export default function Incense({ intensity = 3 }: { intensity?: number }) {
  const anims = useRef(
    Array.from({ length: intensity }).map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const loops = anims.map((a, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(idx * 300),
          Animated.timing(a, {
            toValue: 1,
            duration: 2600 + idx * 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(a, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(300),
        ]),
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop && l.stop());
  }, [anims]);

  return (
    <View style={styles.container} pointerEvents="none">
      {anims.map((a, i) => {
        const translateY = a.interpolate({
          inputRange: [0, 1],
          outputRange: [6, -56 - i * 10],
        });
        const scale = a.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1.15],
        });
        const opacity = a.interpolate({
          inputRange: [0, 0.6, 1],
          outputRange: [0, 0.9, 0],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.smoke,
              {
                left: 6 + i * 8,
                transform: [{ translateY }, { scale }],
                opacity,
              },
            ]}
          />
        );
      })}
      <View style={styles.stick} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  smoke: {
    position: 'absolute',
    width: 24,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.colors.incenseSmoke,
  },
  stick: { width: 6, height: 44, backgroundColor: '#4A2E17', borderRadius: 4 },
});
