// src/components/TempleFrame.tsx
import React, { useEffect, useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { THEME } from '../styles/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface TempleFrameProps {
  frameSrc: ImageSourcePropType;
  maxTopRatio?: number; // fraction of screen height the frame may occupy
  onMeasure?: (width: number, height: number) => void;
}

export default function TempleFrame({
  frameSrc,
  maxTopRatio = 0.6,
  onMeasure,
}: TempleFrameProps) {
  const [aspect, setAspect] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    try {
      // local require(...)
      // @ts-ignore
      const resolved = Image.resolveAssetSource?.(frameSrc);
      if (resolved?.width && resolved?.height) {
        if (mounted) setAspect(resolved.width / resolved.height);
        return () => {
          mounted = false;
        };
      }
    } catch {
      // fallthrough
    }

    const uri = (frameSrc as any)?.uri;
    if (uri) {
      Image.getSize(
        uri,
        (w, h) => {
          if (!mounted) return;
          setAspect(w / h);
        },
        () => {
          if (!mounted) return;
          setAspect(16 / 9);
        },
      );
    } else {
      setAspect(16 / 9);
    }

    return () => {
      mounted = false;
    };
  }, [frameSrc]);

  const finalAspect = aspect ?? 16 / 9;
  const frameWidth = Math.round(SCREEN_W);
  const rawHeight = Math.round(frameWidth / finalAspect);
  const maxHeight = Math.round(SCREEN_H * maxTopRatio);
  const frameHeight = Math.min(rawHeight, maxHeight);

  useEffect(() => {
    if (aspect && typeof onMeasure === 'function') {
      onMeasure(frameWidth, frameHeight);
    }
  }, [aspect, frameWidth, frameHeight, onMeasure]);

  return (
    <View
      style={[styles.container, { height: frameHeight }]}
      pointerEvents="none"
    >
      <Image
        source={frameSrc}
        style={[styles.frame, { width: frameWidth, height: frameHeight }]}
        resizeMode="contain"
      />
      <View style={styles.glowOverlay} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_W,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 20,
    overflow: 'hidden',
  },
  frame: {
    // dynamic width/height
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: THEME.colors.templeAmber,
    opacity: 0.06,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
});
