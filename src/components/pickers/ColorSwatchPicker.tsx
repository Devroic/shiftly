import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { SHIFT_COLOR_PRESETS } from '@/src/features/shiftTypes/constants';

interface ColorSwatchPickerProps {
  value: string;
  onChange: (color: string) => void;
}

/** A curated palette grid — no free-text hex entry, every preset is already picked to be distinguishable. */
export function ColorSwatchPicker({ value, onChange }: ColorSwatchPickerProps) {
  return (
    <View style={styles.grid}>
      {SHIFT_COLOR_PRESETS.map((preset) => {
        const selected = preset.toLowerCase() === value.toLowerCase();
        return (
          <Pressable
            key={preset}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(preset)}
            style={[styles.swatch, { backgroundColor: preset }]}
          >
            {selected ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
