import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { FieldLabel } from '@/src/components/ui/FieldLabel';
import { TimeField } from '@/src/components/pickers/TimeField';
import { useTheme } from '@/src/theme/ThemeProvider';

import type { EventFormValues } from '../types';

interface EventFormProps {
  initialValues?: EventFormValues;
  onSubmit: (values: EventFormValues) => void;
  onCancel: () => void;
}

export function EventForm({ initialValues, onSubmit, onCancel }: EventFormProps) {
  const { colors, spacing } = useTheme();

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [time, setTime] = useState<string | null>(initialValues?.time ?? null);
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [titleError, setTitleError] = useState<string | null>(null);

  const inputStyle = [
    styles.input,
    { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
  ];

  function handleSubmit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Title is required');
      return;
    }
    onSubmit({
      title: trimmedTitle,
      time,
      notes: notes.trim() || null,
    });
  }

  return (
    <View style={{ gap: spacing.md }}>
      <View>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            if (titleError) setTitleError(null);
          }}
          placeholder="e.g. Dentist appointment"
          placeholderTextColor={colors.textSecondary}
          style={inputStyle}
        />
        {titleError ? (
          <Text style={[styles.error, { color: colors.danger }]}>{titleError}</Text>
        ) : null}
      </View>

      <TimeField label="Time (optional)" value={time} onChange={setTime} />

      <View>
        <FieldLabel>Notes (optional)</FieldLabel>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any details…"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          style={[inputStyle, styles.multiline]}
        />
      </View>

      <View style={[styles.actions, { gap: spacing.sm }]}>
        <View style={styles.actionButton}>
          <Button variant="secondary" onPress={onCancel}>
            Cancel
          </Button>
        </View>
        <View style={styles.actionButton}>
          <Button onPress={handleSubmit}>Save</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  multiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
  },
});
