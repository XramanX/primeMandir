import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  GestureResponderEvent,
} from 'react-native';
import { THEME } from '../styles/theme';

export type Option = { id: string; label: string };

export default function DropdownModal({
  visible,
  options,
  selectedId,
  onClose,
  onSelect,
  allowCustom = true,
  customValue,
  setCustomValue,
  onSaveCustom,
}: {
  visible: boolean;
  options: Option[];
  selectedId?: string;
  onClose: () => void;
  onSelect: (opt: Option) => void;
  allowCustom?: boolean;
  customValue?: string;
  setCustomValue?: (v: string) => void;
  onSaveCustom?: () => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Choose</Text>

          <FlatList
            data={options}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.optRow}
                onPress={() => {
                  onSelect(item);
                  // if it's custom, keep modal open so user can type (caller controls saving)
                  if (item.id !== 'custom') onClose();
                  if (item.id === 'custom') {
                    setEditing(true);
                  }
                }}
              >
                <Text style={styles.optLabel}>{item.label}</Text>
                {selectedId === item.id ? (
                  <Text style={styles.selectedMark}>✓</Text>
                ) : null}
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />

          {allowCustom && editing && (
            <>
              <TextInput
                placeholder="Type custom name"
                value={customValue}
                onChangeText={val => setCustomValue?.(val)}
                style={styles.input}
                autoFocus
              />
              <Pressable
                onPress={() => {
                  onSaveCustom?.();
                  // close only when saved
                  onClose();
                  setEditing(false);
                }}
                style={styles.saveBtn}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </>
          )}

          <Pressable onPress={onClose} style={styles.close}>
            <Text style={{ color: THEME.colors.primary }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '66%',
  },
  title: { fontWeight: '700', marginBottom: 10 },
  optRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optLabel: { fontSize: 16 },
  selectedMark: { color: THEME.colors.primary },
  sep: { height: 1, backgroundColor: '#F4F6FB' },
  input: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: THEME.colors.primary,
    padding: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700' },
  close: { marginTop: 12, alignItems: 'center' },
});
