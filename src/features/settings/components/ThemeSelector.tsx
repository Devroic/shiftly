import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme, type ThemeOverride } from '@/src/theme/ThemeProvider';

const OPTIONS: { value: ThemeOverride; label: string }[] = [
  { value: null, label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeSelector() {
  const { colors, spacing, override, setOverride } = useTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      {OPTIONS.map((option) => {
        const selected = override === option.value;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => setOverride(option.value)}
            style={[
              styles.row,
              {
                borderColor: colors.border,
                backgroundColor: selected ? colors.surface : 'transparent',
                padding: spacing.md,
              },
            ]}
          >
            <Text style={[styles.label, { color: colors.text }]}>{option.label}</Text>
            {selected ? <Ionicons name="checkmark" size={20} color={colors.tint} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
