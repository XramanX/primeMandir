import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { useBottomNav } from '../contexts/BottomNavContext';

export function useScreenOptions(opts: {
  hideBottomNav?: boolean;
  headerShown?: boolean;
  headerTitle?: string;
}) {
  const { setVisible } = useBottomNav();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // show/hide bottom nav for this screen
      if (opts.hideBottomNav !== undefined) setVisible(!opts.hideBottomNav);

      // set header options via navigation.setOptions
      navigation.setOptions({
        headerShown: !!opts.headerShown,
        title: opts.headerTitle ?? undefined,
      } as any);

      return () => {
        // restore default (visible) when screen unfocuses
        setVisible(true);
      };
    }, [
      navigation,
      opts.hideBottomNav,
      opts.headerShown,
      opts.headerTitle,
      setVisible,
    ]),
  );
}
