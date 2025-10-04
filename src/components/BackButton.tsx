import React from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../styles/theme';

export default function BackButton() {
  const nav = useNavigation();
  return (
    <TouchableOpacity onPress={() => nav.goBack()} style={{ padding: 8 }}>
      <Feather name="chevron-left" size={24} color={THEME.colors.primary} />
    </TouchableOpacity>
  );
}
