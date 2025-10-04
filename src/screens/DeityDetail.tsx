// src/screens/DeityDetail.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { THEME } from '../styles/theme';
import AudioPlayer from '../components/AudioPlayer';
import Feather from 'react-native-vector-icons/Feather';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

// Use RouteProp to get typed params (optional)
type DeityRouteProp = RouteProp<RootStackParamList, 'DeityDetail'>;

export default function DeityDetail() {
  // useRoute is safer than expecting route prop to be present
  const route = useRoute<DeityRouteProp>();
  const params = route?.params ?? { id: undefined, name: undefined };

  const id = params?.id;
  const name = params?.name ?? 'Deity';
  const [fav, setFav] = useState(false);

  const deity = {
    id,
    name,
    img: '',
    description:
      'Short introduction about the deity. Chanting mantras help focus and bring peace.',
    audios: [{ id: 'a1', title: 'Om Namah Shivaya', duration: 210 }],
    offerings: [
      { id: 'o1', name: 'Flowers', price: 51 },
      { id: 'o2', name: 'Prasad', price: 31 },
    ],
  };

  async function onDonate() {
    Alert.alert('Donate', `Thank you — you chose to donate for ${deity.name}.`);
  }

  function onToggleFav() {
    setFav(v => !v);
    Alert.alert(!fav ? 'Added to favorites' : 'Removed from favorites');
  }

  async function onShare() {
    try {
      await Share.share({
        message: `Check out ${deity.name} on PrimeTemple — listen to mantras and more.`,
      });
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={name} />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          backgroundColor: THEME.colors.bg,
        }}
      >
        <View style={styles.hero}>
          <View style={styles.heroInner}>
            {deity.img ? (
              <Image source={{ uri: deity.img }} style={styles.heroImg} />
            ) : (
              <View style={styles.heroPlaceholder}>
                <Text style={styles.heroInitial}>
                  {deity.name ? deity.name[0] : 'D'}
                </Text>
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.heroName}>{deity.name}</Text>
              <Text style={styles.heroDesc}>{deity.description}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.actionBtnPrimary} onPress={onDonate}>
              <Text style={styles.ctaText}>
                Donate • ₹{deity.offerings[0].price}
              </Text>
            </Pressable>

            <View style={{ width: 10 }} />

            <Pressable style={styles.iconBtn} onPress={onToggleFav}>
              <Feather
                name="heart"
                size={22}
                color={fav ? THEME.colors.accent : THEME.colors.primary}
              />
            </Pressable>

            <View style={{ width: 10 }} />

            <Pressable style={styles.iconBtn} onPress={onShare}>
              <Feather name="share-2" size={20} color={THEME.colors.primary} />
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={{ fontWeight: '800', marginBottom: 10 }}>
            Mantras & Aartis
          </Text>
          {deity.audios.map(a => (
            <AudioPlayer key={a.id} title={a.title} duration={a.duration} />
          ))}
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={{ fontWeight: '800', marginBottom: 10 }}>Offerings</Text>
          {deity.offerings.map(o => (
            <View key={o.id} style={styles.offeringRow}>
              <Text style={{ fontWeight: '700' }}>{o.name}</Text>
              <Text style={{ color: THEME.colors.muted }}>₹ {o.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: THEME.radius.md,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 8,
  },
  heroInner: { flexDirection: 'row', alignItems: 'center' },
  heroImg: { width: 92, height: 92, borderRadius: 12, backgroundColor: '#eee' },
  heroPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 12,
    backgroundColor: '#F0E9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInitial: { fontSize: 36, fontWeight: '900', color: THEME.colors.primary },
  heroName: { fontSize: 20, fontWeight: '900' },
  heroDesc: { marginTop: 6, color: THEME.colors.muted },
  actionRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center' },
  actionBtnPrimary: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  ctaText: { color: '#fff', fontWeight: '800' },
  iconBtn: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offeringRow: {
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
