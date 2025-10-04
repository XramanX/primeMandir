import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { THEME } from '../styles/theme';

export default function AudioPlayer({
  title,
  duration,
}: {
  title: string;
  duration?: number;
}) {
  const [playing, setPlaying] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;

    if (playing && duration) {
      progress.setValue(0);
      anim = Animated.timing(progress, {
        toValue: 1,
        duration: (duration || 30) * 1000,
        useNativeDriver: false,
      });
      anim.start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      progress.stopAnimation();
      pulse.stopAnimation();
    }

    return () => {
      if (anim) anim.stop();
    };
  }, [playing, duration, progress, pulse]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {duration
            ? `${Math.floor((duration || 0) / 60)}:${(
                '0' +
                ((duration || 0) % 60)
              ).slice(-2)}`
            : ''}
        </Text>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, { width }]} />
        </View>
      </View>

      <TouchableOpacity onPress={() => setPlaying(p => !p)}>
        <Animated.View style={[styles.playBtn, { transform: [{ scale }] }]}>
          <Icon name={playing ? 'pause' : 'play'} size={18} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 6,
  },
  title: { fontWeight: '700' },
  meta: { color: '#666', fontSize: 12, marginTop: 4 },
  playBtn: {
    backgroundColor: THEME.colors.primary,
    height: 46,
    width: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  progressBg: {
    height: 6,
    backgroundColor: '#F0F3FF',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { height: 6, backgroundColor: THEME.colors.accent },
});
