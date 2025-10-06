// src/screens/ArtiScreen.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderGods, { Deity } from '../components/HeaderGods';
import ArtiThali from '../components/ArtiThali';
import Prasad from '../components/Prasad';
import TempleFrame from '../components/TempleFrame';
import LeftToolbar from '../components/LeftToolbar';
import { THEME } from '../styles/theme';
import { DEITIES, RITUAL_ITEMS, ASSETS } from '../assets/images';
import { useScreenOptions } from '../utils/useScreenOptions';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export default function ArtiScreen() {
  useScreenOptions({ hideBottomNav: true, headerShown: false });
  const insets = useSafeAreaInsets();

  const [selectedId, setSelectedId] = useState<Deity['id']>(DEITIES[0].id);
  const [frameSize, setFrameSize] = useState<{ w: number; h: number } | null>(
    null,
  );

  // small fade when switching gods
  const bgAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(bgAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedId]);

  const deity = DEITIES.find(d => d.id === selectedId)!;
  const fade = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  // Fit deity inside frame area (full-bleed inside arch, not circular)
  const deityWidth = frameSize
    ? Math.round(frameSize.w * 0.86)
    : Math.round(SCREEN_W * 0.74);
  const deityHeight = frameSize
    ? Math.round(frameSize.h)
    : Math.round(SCREEN_H * 0.36);
  const deityTopInFrame = frameSize
    ? Math.round(frameSize.h * 0.08)
    : Math.round(SCREEN_H * 0.06);

  // left toolbar
  const leftItems = [
    {
      id: 'thali',
      src: (ASSETS as any).iconThali ?? RITUAL_ITEMS.thali.src,
      onPress: () => {},
    },
  ];

  // altar height (leave space for nav)
  const bottomPad = Math.max(insets.bottom, 16);
  const altarHeight = Math.max(Math.round(SCREEN_H * 0.3), 140) + bottomPad;

  const onFrameMeasured = useCallback(
    (w: number, h: number) => setFrameSize({ w, h }),
    [],
  );

  return (
    <View style={styles.root}>
      <HeaderGods
        deities={DEITIES}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <AnimatedImageBackground
        source={(ASSETS as any).backdrop ?? undefined}
        style={[styles.bg, { opacity: fade }]}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={[styles.stage, { paddingTop: insets.top + 6 }]}>
          {/* top frame */}
          <TempleFrame
            frameSrc={ASSETS.templeFrame}
            onMeasure={onFrameMeasured}
          />

          {frameSize && (
            <AnimatedView
              pointerEvents="none"
              style={[
                styles.deityHolder,
                {
                  width: deityWidth,
                  height: deityHeight,
                },
              ]}
            >
              <Image
                source={deity.src}
                style={styles.deityImage}
                resizeMode="cover"
              />
            </AnimatedView>
          )}

          {/* halo */}
          {frameSize && (
            <AnimatedView
              pointerEvents="none"
              style={[
                styles.halo,
                {
                  width: Math.round(deityWidth * 1.08),
                  height: Math.round(deityWidth * 1.08),
                  top:
                    deityTopInFrame +
                    (Platform.OS === 'ios' ? insets.top : insets.top) -
                    Math.round(deityWidth * 0.08),
                },
              ]}
            />
          )}

          {/* left toolbar */}
          <LeftToolbar items={leftItems} />

          {/* altar / carpet — using the temple_floor image with perspective transform */}
          <View style={[styles.altar, { height: altarHeight }]}>
            {/* Perspective image: the image is slightly larger than screen width, anchored at the top of altar,
                rotated on X to give a receding (3D) perspective toward the frame. */}
            <ImageBackground
              source={ASSETS.templeFloor}
              style={styles.floorImageWrap}
              imageStyle={styles.floorImage}
            >
              {/* <View style={styles.goldBand}>
                <View style={styles.goldBandInner} />
              </View> */}

              {/* altar row (interactive items) */}
              <View style={styles.altarRow}>
                <View style={styles.altSide} />

                <View style={styles.altSide}>
                  <Prasad src={RITUAL_ITEMS.prasad.src} />
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>
      </AnimatedImageBackground>
      <View style={styles.thaliFloating}>
        <ArtiThali src={RITUAL_ITEMS.thali.src} />
      </View>
    </View>
  );
}

/* ---------- styles (carpet replaced with perspective floor image) ---------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.templeBackground },
  bg: { flex: 1, width: '100%' },

  stage: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },

  halo: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 6,
    borderRadius: 999,
    backgroundColor: THEME.colors.templeAmber,
    opacity: 0.1,
    ...THEME.shadowDepth.soft,
  },

  deityHolder: {
    position: 'absolute',
    zIndex: 8,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 6,

    ...THEME.shadowDepth.medium,
  },
  deityImage: { width: '100%', height: '100%' },
  thaliFloating: {
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    zIndex: 999,
    elevation: 999,
  },

  prasadWrapper: {
    position: 'absolute',
    bottom: '10%',
    right: 50,
    zIndex: 20,
  },
  altar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 4,
  },

  floorImageWrap: {
    width: SCREEN_W,
    height: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  floorImage: {
    width: '130%', // widen base so bottom extends beyond screen edges
    height: '100%',
    resizeMode: 'stretch',
    transform: [{ rotateX: '250deg' }, { scale: 2.5 }, { translateY: 40 }],
    alignSelf: 'center',
    opacity: 0.98,
  },

  /* Gold band (keeps existing decorative anchor for thali) */
  goldBand: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: Math.round(32 + (Platform.OS === 'ios' ? 0 : 0)),
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 7,
  },
  goldBandInner: {
    width: '78%',
    height: 48,
    borderRadius: 32,
    backgroundColor: THEME.colors.carpetAccent,
    borderWidth: 2,
    borderColor: THEME.colors.templeHighlight,
    opacity: 0.98,
    ...Platform.select({
      ios: {
        shadowColor: THEME.colors.templeShadow,
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 8 },
    }),
  },

  altarRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 18,
    zIndex: 40,
  },

  altSide: { width: 96, alignItems: 'center', justifyContent: 'flex-end' },
  altCenter: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
});
