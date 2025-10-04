import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  Animated,
  TouchableOpacity,
  ListRenderItemInfo,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import DeityCard from '../components/DeityCard';
import Feather from 'react-native-vector-icons/Feather';
import { THEME } from '../styles/theme';
import SearchBar from '../components/SearchBar';
import QuickActions, { QuickAction } from '../components/QuickActions';
import RecentStrip from '../components/RecentStrip';

const SAMPLE = [
  { id: 'd1', name: 'Shiva', subtitle: 'Destroyer', img: '' },
  { id: 'd2', name: 'Ganesha', subtitle: 'Remover of Obstacles', img: '' },
  { id: 'd3', name: 'Lakshmi', subtitle: 'Goddess of Wealth', img: '' },
  { id: 'd4', name: 'Saraswati', subtitle: 'Goddess of Knowledge', img: '' },
  { id: 'd5', name: 'Hanuman', subtitle: 'Devotion & Strength', img: '' },
];

const QUICK: QuickAction[] = [
  { id: 'q1', label: 'Play All', icon: 'play-circle' },
  { id: 'q2', label: 'Shuffle', icon: 'shuffle' },
  { id: 'q3', label: 'Favorites', icon: 'heart' },
  { id: 'q4', label: 'Downloads', icon: 'download' },
];

const RECENT = [
  { id: 'r1', name: 'Om Namah Shivaya', sub: 'Shiva' },
  { id: 'r2', name: 'Shri Ganeshaya Namah', sub: 'Ganesha' },
];

const { width: SCREEN_W } = Dimensions.get('window');
// Single source of truth for horizontal padding used by the list content
const H_PAD = THEME.space.md;
// space between two columns (will match columnWrapper spacing)
const COLUMN_GAP = THEME.space.md;

export default function DeityList({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const greetingTranslate = useMemo(() => new Animated.Value(0), []);
  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(greetingTranslate, {
        toValue: -6,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(greetingTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [greetingTranslate]);

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }

  function handleQuick(id: string) {
    console.log('Quick Action:', id);
    if (id === 'q3') navigation.navigate('Profile');
  }

  const filtered = SAMPLE.filter(s => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      (s.subtitle || '').toLowerCase().includes(q)
    );
  });

  const featured = filtered[0];

  const ListHeader = (
    <>
      <Animated.View
        style={[
          styles.hero,
          { transform: [{ translateY: greetingTranslate }] },
        ]}
      >
        <View>
          <Text style={styles.heroTitle}>Connect with your devotion</Text>
          <Text style={styles.heroSub}>Quick access to mantras and arti</Text>
        </View>

        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => console.log('notifications')}
          accessibilityRole="button"
        >
          <Feather name="bell" size={18} color={THEME.colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      <SearchBar value={query} onChange={setQuery} />
      <QuickActions
        actions={QUICK.map(q => ({ ...q, onPress: () => handleQuick(q.id) }))}
      />
      <RecentStrip
        items={RECENT.map(r => ({
          ...r,
          onPress: () =>
            navigation.navigate('DeityDetail', { id: 'd1', name: r.sub }),
        }))}
      />

      {featured ? (
        <View style={styles.featuredWrap}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('DeityDetail', {
                id: featured.id,
                name: featured.name,
              })
            }
            style={styles.featuredTouchable}
          >
            <View style={styles.featured}>
              <View style={styles.featuredLeft}>
                <Text style={styles.featuredTitle}>
                  Featured: {featured.name}
                </Text>
                <Text style={styles.featuredSub}>{featured.subtitle}</Text>
              </View>
              <Feather
                name="play-circle"
                size={36}
                color={THEME.colors.primary}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );

  function renderItem({ item }: ListRenderItemInfo<any>) {
    return (
      <DeityCard
        deity={item}
        onPress={() =>
          navigation.navigate('DeityDetail', { id: item.id, name: item.name })
        }
        // pass layout hints
        itemWidth={Math.floor((SCREEN_W - H_PAD * 2 - COLUMN_GAP) / 2)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="PrimeTemple" />
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: THEME.space.md,
        }}
        // single source of horizontal padding applied here
        contentContainerStyle={{
          paddingHorizontal: H_PAD,
          paddingBottom: 140,
          paddingTop: 0,
        }}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptySub}>
              Try a different name or quick action
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },

  // NOTE: NO horizontal padding here — FlatList provides it
  hero: {
    paddingTop: THEME.space.sm,
    paddingBottom: THEME.space.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.black as any,
    color: THEME.colors.primary,
  },
  heroSub: { marginTop: 4, color: THEME.colors.muted },

  actionIcon: {
    height: 40,
    width: 40,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.shadow,
    elevation: 2,
  },

  featuredWrap: { marginTop: 12, marginBottom: 8 },
  featuredTouchable: { borderRadius: THEME.radius.md, overflow: 'hidden' },
  featured: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: THEME.colors.shadow,
    elevation: 3,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  featuredLeft: { flex: 1, paddingRight: 12 },
  featuredTitle: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.bold as any,
  },
  featuredSub: { marginTop: 6, color: THEME.colors.muted },

  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: THEME.fontWeight.black as any },
  emptySub: { marginTop: 6, color: THEME.colors.muted },
});
