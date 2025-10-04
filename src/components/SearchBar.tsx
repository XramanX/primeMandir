import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { THEME } from '../styles/theme';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onFocus,
  onBlur,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.box,
          value !== '' && { borderColor: THEME.colors.primary },
        ]}
      >
        <Feather name="search" size={16} color={THEME.colors.muted} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#A6AFC0"
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType="search"
        />
        {value ? (
          <TouchableOpacity
            onPress={() => onChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={16} color={THEME.colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // NO horizontal padding here — parent (FlatList) controls horizontal alignment
  wrap: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  } as any,
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: THEME.fontSize.md,
    color: '#222',
    padding: 0,
  },
});
