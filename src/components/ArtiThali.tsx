import React, { useRef, useState } from 'react';
import { View, Animated, Image, PanResponder, StyleSheet } from 'react-native';

export default function ArtiThali({ src }: { src: any }) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const [isDragging, setIsDragging] = useState(false);
  const lastOffset = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset(lastOffset.current);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gesture) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gesture);
      },
      onPanResponderRelease: (evt, gesture) => {
        setIsDragging(false);
        lastOffset.current.x += gesture.dx;
        lastOffset.current.y += gesture.dy;
        pan.flattenOffset();

        // Return to original position smoothly
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          bounciness: 8,
        }).start(() => {
          lastOffset.current = { x: 0, y: 0 };
        });
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Image source={src} style={styles.img} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 160,
    height: 160,
  },
});
