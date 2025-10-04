// src/wrapper/FloatingBottomNavWrapper.tsx
import React from 'react';
import { Text } from 'react-native';
import FloatingBottomNav, { NavItem } from '../components/FloatingBottomNav';
import { useBottomNav } from '../contexts/BottomNavContext';
import { THEME } from '../styles/theme';

type CenterAction = {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  accessibilityLabel?: string;
};

type Props = {
  items: NavItem[];
  centerAction?: CenterAction;
  backgroundColor?: string;
};

export default function FloatingBottomNavWrapper({
  items,
  centerAction,
  backgroundColor,
}: Props) {
  const { visible } = useBottomNav();
  if (!visible) return null;

  const defaultCenterAction: CenterAction = {
    icon: <Text style={{ fontSize: 28 }}>🛕</Text>,
    onPress: () => {},
    size: 28,
    accessibilityLabel: 'Center',
  };

  return (
    <FloatingBottomNav
      items={items}
      centerAction={centerAction ?? defaultCenterAction}
      backgroundColor={backgroundColor ?? THEME.colors.surface}
    />
  );
}
