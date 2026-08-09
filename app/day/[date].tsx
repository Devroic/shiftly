import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Screen } from '@/src/components/ui/Screen';
import { SectionHeader } from '@/src/components/ui/SectionHeader';
import { formatDisplayDate } from '@/src/features/calendar/utils/dateKey';
import { EventForm } from '@/src/features/events/components/EventForm';
import { EventListItem } from '@/src/features/events/components/EventListItem';
import { useEventMutations } from '@/src/features/events/hooks/useEventMutations';
import { useEventsForDate } from '@/src/features/events/hooks/useEventsForDate';
import type { EventFormValues, EventRecord } from '@/src/features/events/types';
import { ShiftTypePicker } from '@/src/features/shifts/components/ShiftTypePicker';
import { useShiftForDate } from '@/src/features/shifts/hooks/useShiftForDate';
import { useUpsertShift } from '@/src/features/shifts/hooks/useUpsertShift';
import { useShiftTypes } from '@/src/features/shiftTypes/hooks/useShiftTypes';
import { useTheme } from '@/src/theme/ThemeProvider';

type EditingEvent = EventRecord | 'new' | null;

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { colors, spacing } = useTheme();

  const shiftTypes = useShiftTypes();
  const shiftType = useShiftForDate(date);
  const upsertShift = useUpsertShift();

  const dayEvents = useEventsForDate(date);
  const { createEvent, updateEvent, deleteEvent, clearEventsForDate } = useEventMutations();
  const [editingEvent, setEditingEvent] = useState<EditingEvent>(null);

  async function handleEventSubmit(values: EventFormValues) {
    if (editingEvent === 'new') {
      await createEvent(date, values);
    } else if (editingEvent) {
      await updateEvent(editingEvent.id, values);
    }
    setEditingEvent(null);
  }

  function confirmDeleteEvent(event: EventRecord) {
    Alert.alert('Delete event?', "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void deleteEvent(event.id) },
    ]);
  }

  function confirmClearAllEvents() {
    Alert.alert(
      'Clear all events?',
      `This will delete all ${dayEvents.length} event${dayEvents.length === 1 ? '' : 's'} on this day. This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear all',
          style: 'destructive',
          onPress: () => void clearEventsForDate(date),
        },
      ],
    );
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: formatDisplayDate(date) }} />
      <ScrollView contentContainerStyle={{ gap: spacing.lg }} showsVerticalScrollIndicator={false}>
        <View>
          <SectionHeader style={{ marginBottom: 8 }}>Shift</SectionHeader>
          <ShiftTypePicker
            shiftTypes={shiftTypes}
            value={shiftType}
            onChange={(type) => void upsertShift(date, type)}
          />
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Tap a selected shift again to clear it.
          </Text>
        </View>

        <View>
          <View style={styles.sectionHeader}>
            <SectionHeader>Events</SectionHeader>
            {editingEvent ? null : (
              <View style={[styles.headerActions, { gap: spacing.sm }]}>
                {dayEvents.length > 0 ? (
                  <Button variant="dangerGhost" onPress={confirmClearAllEvents}>
                    Clear all
                  </Button>
                ) : null}
                <Button variant="ghost" onPress={() => setEditingEvent('new')}>
                  + Add event
                </Button>
              </View>
            )}
          </View>

          {editingEvent ? (
            <EventForm
              initialValues={editingEvent !== 'new' ? editingEvent : undefined}
              onSubmit={handleEventSubmit}
              onCancel={() => setEditingEvent(null)}
            />
          ) : dayEvents.length === 0 ? (
            <EmptyState message="No events for this day" icon="calendar-outline" />
          ) : (
            dayEvents.map((event) => (
              <EventListItem
                key={event.id}
                event={event}
                onPress={() => setEditingEvent(event)}
                onDelete={() => confirmDeleteEvent(event)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
});
