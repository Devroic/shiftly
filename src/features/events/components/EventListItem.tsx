import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';

import type { EventRecord } from '../types';

interface EventListItemProps {
  event: EventRecord;
  onPress: () => void;
  onDelete: () => void;
}

export function EventListItem({ event, onPress, onDelete }: EventListItemProps) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border, padding: spacing.md },
      ]}
    >
      <View style={styles.textColumn}>
        {event.time ? (
          <Text style={[styles.time, { color: colors.tint }]}>{event.time}</Text>
        ) : null}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {event.title}
        </Text>
        {event.notes ? (
          <Text style={[styles.notes, { color: colors.textSecondary }]} numberOfLines={2}>
            {event.notes}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete"
        onPress={onDelete}
        hitSlop={8}
      >
        <Ionicons name="close" size={20} color={colors.textSecondary} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  textColumn: {
    flex: 1,
    marginRight: 12,
  },
  time: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  notes: {
    fontSize: 13,
    marginTop: 2,
  },
});
