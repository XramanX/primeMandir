// src/components/MalaCounter.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Feather from 'react-native-vector-icons/Feather';

import { THEME } from '../styles/theme';
import DropdownModal, { Option } from './DropdownModal';

const { width: SCREEN_W } = Dimensions.get('window');

// Config (change these to scale)
const RING_OUTER = Math.min(SCREEN_W - 64, 320); // max 320 or screen minus padding
const RADIUS = (RING_OUTER - 32) / 2; // inner circle radius (ring thickness 16)
const STROKE = 12; // ring stroke width
const CIRC = 2 * Math.PI * RADIUS;

const DEFAULT_OPTIONS: Option[] = [
  { id: 'ram', label: 'Ram' },
  { id: 'radha', label: 'Radha' },
  { id: 'custom', label: 'Custom...' },
];
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function MalaCounter({
  initialName,
  beadsPerMala = 108,
  onCompleteMala,
}: {
  initialName?: string;
  beadsPerMala?: number;
  onCompleteMala?: (count: number, malasCompleted: number) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(
    initialName ? 'custom' : 'ram',
  );
  const [name, setName] = useState<string>(initialName ?? 'Ram');
  const [customName, setCustomName] = useState<string>(initialName ?? '');
  const [count, setCount] = useState<number>(0);
  const [showPicker, setShowPicker] = useState(false);

  // Animated value for progress 0..1
  const progress = useRef(new Animated.Value(0)).current;
  // Animated value for tap ripple spawn - we manage multiple ripples via state
  const [ripples, setRipples] = useState<
    { id: string; anim: Animated.Value }[]
  >([]);
  // small pop animation when complete
  const completeAnim = useRef(new Animated.Value(0)).current;

  // update ring whenever count changes
  useEffect(() => {
    const remainder = count % beadsPerMala;
    const pct = beadsPerMala > 0 ? remainder / beadsPerMala : 0;
    Animated.timing(progress, {
      toValue: pct,
      duration: 220,
      useNativeDriver: true,
    }).start();

    if (remainder === 0 && count !== 0) {
      // brief completion pop
      Animated.sequence([
        Animated.timing(completeAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(completeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      onCompleteMala?.(count, Math.floor(count / beadsPerMala));
    }
  }, [count, beadsPerMala, progress, completeAnim, onCompleteMala]);

  // strokeDashoffset derived from progress (Animated)
  const dashOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRC, 0],
  });

  // tap handler (entire container)
  function handleTap() {
    // spawn ripple
    const id = String(Date.now());
    const anim = new Animated.Value(0);
    setRipples(prev => [...prev, { id, anim }]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      // remove ripple after animation
      setRipples(prev => prev.filter(r => r.id !== id));
    });

    // small scale/pop handled by completeAnim for combined effect
    setCount(prev => prev + 1);
  }

  // dropdown callbacks
  function onSelect(opt: Option) {
    setSelectedId(opt.id);
    if (opt.id !== 'custom') {
      setName(opt.label);
      setCustomName('');
      setShowPicker(false);
    } else {
      // keep modal open so user types and presses Save (DropdownModal handles that)
    }
  }

  function onSaveCustom() {
    if (customName.trim().length > 0) {
      setName(customName.trim());
      setSelectedId('custom');
    }
  }

  const completed = Math.floor(count / beadsPerMala);
  const remainder = count % beadsPerMala;

  // animated styles derived from completion pop
  const popScale = completeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const popOpacity = completeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });

  return (
    <>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.container}>
          {/* top row (picker + mala count) */}
          <View style={styles.topRow}>
            <Pressable
              onPress={() => setShowPicker(true)}
              style={styles.pickerBtn}
            >
              <Text style={styles.pickerText}>
                {selectedId === 'custom' ? name || 'Custom' : name}
              </Text>
              <Feather
                name="chevron-down"
                size={18}
                color={THEME.colors.muted}
              />
            </Pressable>

            <View style={styles.malaBadge}>
              <Text style={styles.malaCount}>{completed}</Text>
              <Text style={styles.malaLabel}>
                mala{completed !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* center ring + ripples */}
          <View style={styles.center}>
            {ripples.map(r => {
              const scale = r.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 2.8],
              });
              const opacity = r.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.28, 0],
              });
              return (
                <Animated.View
                  key={r.id}
                  style={[styles.ripple, { transform: [{ scale }], opacity }]}
                  pointerEvents="none"
                />
              );
            })}

            <Animated.View
              style={[styles.ringWrap, { transform: [{ scale: popScale }] }]}
            >
              <Svg width={RING_OUTER} height={RING_OUTER}>
                <Circle
                  stroke={THEME.colors.glass}
                  strokeWidth={STROKE}
                  cx={RING_OUTER / 2}
                  cy={RING_OUTER / 2}
                  r={RADIUS}
                  fill="none"
                />

                <AnimatedCircle
                  stroke={THEME.colors.accent}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  cx={RING_OUTER / 2}
                  cy={RING_OUTER / 2}
                  r={RADIUS}
                  fill="none"
                  strokeDasharray={`${CIRC}`}
                  strokeDashoffset={dashOffset as any}
                />
              </Svg>

              {/* inner tappable circle */}
              <View style={styles.innerCircle}>
                <Feather name="prayer" size={40} color="#fff" />
                <Text style={styles.innerName}>{name}</Text>
                <Text style={styles.innerCount}>
                  {remainder}/{beadsPerMala}
                </Text>
              </View>

              {/* subtle glow overlay when complete */}
              <Animated.View
                style={[styles.completeGlow, { opacity: popOpacity }]}
                pointerEvents="none"
              />
            </Animated.View>
          </View>

          <View style={styles.hintRow}>
            <Text style={styles.hintText}>
              Tap anywhere on the area above to count • 1 mala = {beadsPerMala}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <DropdownModal
        visible={showPicker}
        options={DEFAULT_OPTIONS}
        selectedId={selectedId}
        onClose={() => setShowPicker(false)}
        onSelect={onSelect}
        customValue={customName}
        setCustomValue={setCustomName}
        onSaveCustom={() => {
          onSaveCustom();
          setShowPicker(false);
        }}
      />
    </>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: THEME.space.md,
  },
  topRow: {
    width: '100%',
    paddingHorizontal: THEME.space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerBtn: {
    flex: 1,
    marginRight: 12,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  pickerText: { fontWeight: THEME.fontWeight.bold as any, color: '#111' },

  malaBadge: {
    width: 92,
    height: 52,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  malaCount: {
    fontSize: 18,
    fontWeight: THEME.fontWeight.black as any,
    color: THEME.colors.primary,
  },
  malaLabel: { color: THEME.colors.muted },

  center: { marginTop: 18, alignItems: 'center', justifyContent: 'center' },

  ripple: {
    position: 'absolute',
    width: RING_OUTER,
    height: RING_OUTER,
    borderRadius: RING_OUTER / 2,
    backgroundColor: THEME.colors.accent,
  },

  ringWrap: {
    display: 'flex',
    width: RING_OUTER,
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerCircle: {
    position: 'absolute',
    width: RING_OUTER - STROKE * 2 - 24,
    height: RING_OUTER - STROKE * 2 - 24,
    borderRadius: (RING_OUTER - STROKE * 2 - 24) / 2,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
  },
  innerName: {
    color: '#fff',
    marginTop: 12,
    fontWeight: THEME.fontWeight.bold as any,
    fontSize: THEME.fontSize.md,
  },
  innerCount: {
    color: '#fff',
    marginTop: 6,
    fontWeight: THEME.fontWeight.bold as any,
  },
  completeGlow: {
    position: 'absolute',
    width: RING_OUTER + 20,
    height: RING_OUTER + 20,
    borderRadius: (RING_OUTER + 20) / 2,
    backgroundColor: THEME.colors.accent,
  },
  hintRow: { marginTop: 14, paddingHorizontal: THEME.space.md },
  hintText: { color: THEME.colors.muted, textAlign: 'center' },
});
