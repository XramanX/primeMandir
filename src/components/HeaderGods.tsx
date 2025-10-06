// src/components/HeaderGods.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../styles/theme';

export type Deity = {
  id: string;
  name: string;
  src: { uri: string };
};

interface HeaderGodsProps {
  deities: Deity[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function HeaderGods({
  deities,
  selectedId,
  onSelect,
}: HeaderGodsProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'ios' ? insets.top + 8 : insets.top + 6;

  return (
    <View style={[styles.container, { paddingTop }]}>
      <Text style={styles.title}>🕉️ Choose Your Deity</Text>

      <FlatList
        data={deities}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        keyExtractor={d => d.id}
        renderItem={({ item }) => {
          const active = item.id === selectedId;
          return (
            <Pressable
              onPress={() => onSelect(item.id)}
              style={[styles.avatarWrap, active && styles.activeWrap]}
              accessibilityLabel={`Select ${item.name}`}
              accessibilityState={{ selected: active }}
            >
              <Image
                source={item.src}
                style={[styles.avatar, active && styles.avatarActive]}
                resizeMode="cover"
              />
              <Text
                style={[styles.name, active && styles.activeText]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.templeGold,
    paddingBottom: 10,
    // borderBottomLeftRadius: 18,
    // borderBottomRightRadius: 18,
    shadowColor: THEME.colors.templeShadow,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 30,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.templeHighlight,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  avatarWrap: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 4,
    width: 72,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarActive: {
    borderColor: THEME.colors.templeAmber,
  },
  activeWrap: {
    shadowColor: THEME.colors.templeAmber,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  name: {
    color: THEME.colors.surface,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  activeText: {
    color: THEME.colors.templeAmber,
    fontWeight: '700',
  },
});
