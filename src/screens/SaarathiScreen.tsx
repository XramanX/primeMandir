// src/screens/SaarathiScreen.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../styles/theme';
import { useScreenOptions } from '../utils/useScreenOptions';
import { useSaarathi } from '../hooks/useSaarathi';

import Clipboard from '@react-native-clipboard/clipboard';

type MsgRole = 'user' | 'saarathi';
type Msg = {
  id: string;
  role: MsgRole;
  text: string;
  time?: string;
};

const SUGGESTIONS = [
  'How to handle anger?',
  'How to focus in life?',
  'Advice for failure',
  'Detachment meaning',
];

/**
 * SaarathiScreen
 * - polished, theme-driven UI
 * - safe Clipboard via @react-native-clipboard/clipboard
 * - animated typing indicator
 * - memoized message row for performance
 */
export default function SaarathiScreen() {
  useScreenOptions({
    hideBottomNav: true,
    headerShown: false, // custom header in component
  });

  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Msg> | null>(null);
  const [query, setQuery] = useState<string>('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const { askSaarathi, loading, typing } = useSaarathi();
  const sendingRef = useRef(false);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'saarathi',
        text: 'Welcome to Saarathi — your inner charioteer. Ask a question and receive guidance from the Gītā.',
        time: new Date().toISOString(),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 120);
  }, []);

  const appendMessage = useCallback(
    (m: Msg) => {
      setMessages(prev => {
        const next = [...prev, m];
        return next;
      });
      scrollToBottom();
    },
    [scrollToBottom],
  );

  const handleAsk = useCallback(
    async (text?: string) => {
      const q = (text ?? query).trim();
      if (!q || loading || sendingRef.current) return;
      sendingRef.current = true;

      const userMsg: Msg = {
        id: `${Date.now()}_u`,
        role: 'user',
        text: q,
        time: new Date().toISOString(),
      };
      appendMessage(userMsg);
      setQuery('');

      try {
        const aiMsg = await askSaarathi(q);
        const finalAiMsg: Msg = {
          id: aiMsg?.id ?? `${Date.now()}_a`,
          role: 'saarathi',
          text: aiMsg?.text ?? '—',
          time: aiMsg?.time ?? new Date().toISOString(),
        };
        appendMessage(finalAiMsg);
      } catch (err) {
        appendMessage({
          id: `${Date.now()}_err`,
          role: 'saarathi',
          text: 'I could not fetch guidance right now. Please try again.',
          time: new Date().toISOString(),
        });
      } finally {
        sendingRef.current = false;
      }
    },
    [appendMessage, askSaarathi, loading, query],
  );

  const onMessageLongPress = useCallback(async (msg: Msg) => {
    try {
      Clipboard.setString(msg.text);
      Alert.alert('Copied', 'Message copied to clipboard');
    } catch {
      Alert.alert('Copy failed', 'Could not copy to clipboard');
    }
  }, []);

  // memoized MessageRow for performance
  const MessageRow = useMemo(() => {
    const Row: React.FC<{ item: Msg }> = ({ item }) => {
      const isUser = item.role === 'user';
      return (
        <Pressable
          onLongPress={() => onMessageLongPress(item)}
          style={[
            styles.msgRow,
            isUser ? styles.msgRowUser : styles.msgRowSaarathi,
          ]}
          accessibilityLabel={isUser ? 'Your message' : 'Saarathi message'}
          testID={`msg-${item.id}`}
        >
          <View style={styles.avatarWrap}>
            {isUser ? (
              <View style={styles.userAvatar}>
                <Feather name="user" size={16} color={THEME.colors.userText} />
              </View>
            ) : (
              <View style={styles.krishnaAvatarWrap}>
                <View style={styles.haloBg} />
                <View style={styles.aiAvatar}>
                  <Feather name="book" size={18} color="#fff" />
                </View>
              </View>
            )}
          </View>

          <View
            style={[
              styles.msgBubble,
              isUser ? styles.userBubble : styles.saarathiBubble,
            ]}
          >
            <Text
              style={[
                styles.msgText,
                isUser ? styles.userText : styles.saarathiText,
                !isUser && styles.shlokaText,
              ]}
            >
              {item.text}
            </Text>

            {item.time && (
              <Text style={styles.msgTime}>
                {new Date(item.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>
        </Pressable>
      );
    };
    return React.memo(Row);
  }, [onMessageLongPress]);

  const renderItem = useCallback(
    ({ item }: { item: Msg }) => <MessageRow item={item} />,
    [MessageRow],
  );

  const keyExtractor = useCallback((i: Msg) => i.id, []);

  const suggestionChips = useMemo(
    () =>
      SUGGESTIONS.map(s => (
        <Pressable
          key={s}
          onPress={() => handleAsk(s)}
          style={({ pressed }) => [
            styles.chip,
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
          ]}
          accessibilityLabel={`Suggestion: ${s}`}
          testID={`suggestion-${s}`}
        >
          <Text style={styles.chipText}>{s}</Text>
        </Pressable>
      )),
    [handleAsk],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME.colors.krishnaBlue}
      />
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: THEME.colors.krishnaBlue,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatarWrap}>
              <View style={styles.headerHalo} />
              <View style={styles.headerAvatar}>
                <Feather
                  name="feather"
                  size={18}
                  color={THEME.colors.krishnaBlue}
                />
              </View>
            </View>

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.title}>Saarathi</Text>
              <Text style={styles.subtitle}>
                Ask the Gītā • Guidance in Shloka
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                Alert.alert('Saved', 'Feature: Save to Journal (TBD)')
              }
            >
              <Feather
                name="bookmark"
                size={16}
                color={THEME.colors.krishnaBlue}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.suggestionsWrap}>{suggestionChips}</View>
      </View>

      <View style={styles.decorativeCircle} pointerEvents="none" />

      {/* Chat */}
      <View style={styles.chatWrap}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {typing && <TypingIndicator />}
      </View>

      {/* Input */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 12 }]}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Type a question for Saarathi..."
            placeholderTextColor={THEME.colors.muted}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => !loading && handleAsk()}
            accessibilityLabel="Message input"
            testID="input-message"
          />
          <Pressable
            onPress={() => handleAsk()}
            style={({ pressed }) => [
              styles.sendBtn,
              (loading || !query.trim()) && { opacity: 0.6 },
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
            disabled={loading || !query.trim()}
            accessibilityLabel="Send message"
            testID="send-button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Feather name="send" size={18} color="#fff" />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* Typing indicator with animated dots using native driver for smoothness */
function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 350,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      );

    const l1 = createLoop(dot1, 0);
    const l2 = createLoop(dot2, 150);
    const l3 = createLoop(dot3, 300);

    l1.start();
    l2.start();
    l3.start();

    return () => {
      l1.stop();
      l2.stop();
      l3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingRow}>
      <View style={styles.aiAvatarSmall}>
        <Feather name="book" size={14} color="#fff" />
      </View>

      <View style={styles.typingBubble}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2, marginLeft: 6 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3, marginLeft: 6 }]} />
      </View>
    </View>
  );
}

/* Styles powered by THEME tokens */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: THEME.colors.bg },

  header: {
    paddingHorizontal: THEME.space.md,
    paddingBottom: THEME.space.sm,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    ...THEME.shadowDepth.medium,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerHalo: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: THEME.colors.gold,
    opacity: 0.12,
    top: -3,
    left: -3,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: THEME.colors.gold,
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold as any,
  },
  subtitle: {
    color: '#D6E2FF',
    marginTop: 2,
    fontSize: THEME.fontSize.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    ...THEME.shadowDepth.soft,
  },

  suggestionsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  chip: {
    backgroundColor: THEME.colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    marginRight: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadowDepth.soft,
  },
  chipText: {
    color: THEME.colors.krishnaBlue ?? '#071A52',
    fontSize: THEME.fontSize.sm,
    fontWeight: THEME.fontWeight.medium as any,
  },

  decorativeCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: THEME.colors.gold,
    opacity: 0.06,
    right: -80,
    top: 120,
  },

  chatWrap: {
    flex: 1,
    paddingHorizontal: THEME.space.md,
    paddingTop: THEME.space.md + 4,
  },

  messagesList: { paddingBottom: 12 },

  msgRow: {
    marginBottom: THEME.space.sm + 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowSaarathi: { justifyContent: 'flex-start' },

  avatarWrap: { width: 56, alignItems: 'center', marginRight: 12 },

  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.userBubble,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6F1FB',
  },

  krishnaAvatarWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloBg: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.gold,
    opacity: 0.16,
    top: 0,
    left: 0,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.krishnaBlue,
    borderWidth: 2,
    borderColor: THEME.colors.gold,
    ...THEME.shadowDepth.medium,
  },

  aiAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.krishnaBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  msgBubble: {
    maxWidth: '78%',
    paddingVertical: THEME.space.sm + 2,
    paddingHorizontal: THEME.space.md,
    borderRadius: THEME.radius.lg,
    ...THEME.shadowDepth.soft,
  },

  saarathiBubble: {
    backgroundColor: THEME.colors.deepIndigo,
    borderTopLeftRadius: 6,
    borderTopRightRadius: THEME.radius.lg,
    borderBottomRightRadius: THEME.radius.lg,
  },
  userBubble: {
    backgroundColor: THEME.colors.userBubble,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: THEME.radius.lg,
  },

  msgText: { fontSize: THEME.fontSize.md, lineHeight: 22 },
  saarathiText: { color: THEME.colors.surface },
  userText: { color: THEME.colors.userText },

  shlokaText: {
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },

  msgTime: {
    marginTop: 8,
    fontSize: 11,
    color: THEME.colors.subtleText,
    alignSelf: 'flex-end',
  },

  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.space.md,
    marginBottom: 12,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.krishnaBlue,
  },

  footer: {
    paddingHorizontal: THEME.space.md,
    paddingTop: THEME.space.sm,
    backgroundColor: THEME.colors.bg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...THEME.shadowDepth.soft,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    color: THEME.colors.userText,
    fontSize: THEME.fontSize.md,
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: THEME.colors.krishnaBlue,
    padding: 10,
    borderRadius: THEME.radius.full,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadowDepth.medium,
  },
});
