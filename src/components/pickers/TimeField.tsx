import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';

import { Button } from '../ui/Button';

interface TimeFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

function timeStringToDate(time: string | null): Date {
  const date = new Date();
  date.setSeconds(0, 0);
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes);
  }
  return date;
}

function dateToTimeString(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** Time-only field backed by the native picker — a spinner sheet on iOS, the system dialog on Android. */
export function TimeField({ label, value, onChange }: TimeFieldProps) {
  const { colors, spacing, scheme } = useTheme();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(() => timeStringToDate(value));

  function openPicker() {
    setDraftDate(timeStringToDate(value));
    setPickerVisible(true);
  }

  function handleAndroidChange(event: DateTimePickerEvent, selectedDate?: Date) {
    setPickerVisible(false);
    if (event.type === 'set' && selectedDate) {
      onChange(dateToTimeString(selectedDate));
    }
  }

  function handleIosChange(_event: DateTimePickerEvent, selectedDate?: Date) {
    if (selectedDate) setDraftDate(selectedDate);
  }

  function confirmIos() {
    onChange(dateToTimeString(draftDate));
    setPickerVisible(false);
  }

  return (
    <View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.fieldRow, { gap: spacing.sm }]}>
        <Pressable
          accessibilityRole="button"
          onPress={openPicker}
          style={[styles.field, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={{ color: value ? colors.text : colors.textSecondary, fontSize: 15 }}>
            {value ?? 'Add time'}
          </Text>
        </Pressable>
        {value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear time"
            onPress={() => onChange(null)}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      {pickerVisible && Platform.OS === 'android' ? (
        <DateTimePicker mode="time" value={draftDate} is24Hour onChange={handleAndroidChange} />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={pickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPickerVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { backgroundColor: colors.surfaceElevated }]}>
              <DateTimePicker
                mode="time"
                value={draftDate}
                display="spinner"
                is24Hour
                onChange={handleIosChange}
                themeVariant={scheme}
              />
              <View style={[styles.modalActions, { gap: spacing.sm }]}>
                <View style={{ flex: 1 }}>
                  <Button variant="secondary" onPress={() => setPickerVisible(false)}>
                    Cancel
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button onPress={confirmIos}>Done</Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  field: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
});
