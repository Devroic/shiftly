import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { ColorSwatchPicker } from '@/src/components/pickers/ColorSwatchPicker';
import { FieldLabel } from '@/src/components/ui/FieldLabel';
import { useTheme } from '@/src/theme/ThemeProvider';
import type { ShiftTypeFormValues } from '../types';

interface ShiftTypeFormProps {
  initialValues: ShiftTypeFormValues;
  /** Other shift types' labels, for a case-insensitive duplicate check — excludes the one being edited. */
  existingLabels: string[];
  submitLabel: string;
  onSubmit: (values: ShiftTypeFormValues) => void;
}

export function ShiftTypeForm({
  initialValues,
  existingLabels,
  submitLabel,
  onSubmit,
}: ShiftTypeFormProps) {
  const { colors, spacing } = useTheme();

  const [label, setLabel] = useState(initialValues.label);
  const [color, setColor] = useState(initialValues.color);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      setError('Name is required');
      return;
    }
    const isDuplicate = existingLabels.some(
      (existing) => existing.toLowerCase() === trimmedLabel.toLowerCase(),
    );
    if (isDuplicate) {
      setError('A shift type with this name already exists');
      return;
    }
    onSubmit({ label: trimmedLabel, color });
  }

  return (
    <View style={{ gap: spacing.lg }}>
      <View>
        <FieldLabel>Name</FieldLabel>
        <TextInput
          value={label}
          onChangeText={(value) => {
            setLabel(value);
            if (error) setError(null);
          }}
          placeholder="e.g. On call"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
          ]}
        />
        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      </View>

      <View>
        <FieldLabel>Color</FieldLabel>
        <ColorSwatchPicker value={color} onChange={setColor} />
      </View>

      <Button onPress={handleSubmit}>{submitLabel}</Button>
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
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
