import { addDays } from 'date-fns';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fromISODateKey, toISODateKey } from '@/src/features/calendar/utils/dateKey';
import { useTheme } from '@/src/theme/ThemeProvider';

import { DateRangePicker } from './DateRangePicker';

/** How far ahead an "open-ended" range reaches — a practical stand-in for "forever". */
export const OPEN_ENDED_DAYS = 730;

export type DateRangeMode = 'auto' | 'custom';

interface DateRangeModeSelectorProps {
  mode: DateRangeMode;
  onChangeMode: (mode: DateRangeMode) => void;
  startDate: string;
  endDate: string;
  onChangeRange: (startDate: string, endDate: string) => void;
  autoModeLabel?: string;
  customModeLabel?: string;
  /** Hint shown under the date picker in auto mode, given the current start date. */
  autoHint: (startDate: string) => string;
}

/** Lets the caller either pick a single open-ended start date, or a custom start/end range. */
export function DateRangeModeSelector({
  mode,
  onChangeMode,
  startDate,
  endDate,
  onChangeRange,
  autoModeLabel = 'From a date onward',
  customModeLabel = 'Custom range',
  autoHint,
}: DateRangeModeSelectorProps) {
  const { colors, spacing } = useTheme();

  // Self-heal on mount (and whenever startDate/mode change): the caller's initial `endDate`
  // has no way to know the auto-continue math ahead of time, so without this, confirming before
  // ever touching the calendar would silently apply whatever stale endDate the screen started
  // with instead of startDate + OPEN_ENDED_DAYS.
  useEffect(() => {
    if (mode !== 'auto') return;
    const computedEnd = toISODateKey(addDays(fromISODateKey(startDate), OPEN_ENDED_DAYS));
    if (computedEnd !== endDate) {
      onChangeRange(startDate, computedEnd);
    }
  }, [mode, startDate, endDate, onChangeRange]);

  function selectMode(nextMode: DateRangeMode) {
    onChangeMode(nextMode);
    if (nextMode === 'auto') {
      onChangeRange(startDate, toISODateKey(addDays(fromISODateKey(startDate), OPEN_ENDED_DAYS)));
    }
  }

  function handleAutoStartChange(start: string) {
    onChangeRange(start, toISODateKey(addDays(fromISODateKey(start), OPEN_ENDED_DAYS)));
  }

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={[styles.modeRow, { borderColor: colors.border }]}>
        <ModeButton
          label={autoModeLabel}
          active={mode === 'auto'}
          onPress={() => selectMode('auto')}
        />
        <ModeButton
          label={customModeLabel}
          active={mode === 'custom'}
          onPress={() => selectMode('custom')}
        />
      </View>

      {mode === 'auto' ? (
        <>
          <DateRangePicker
            startDate={startDate}
            endDate={startDate}
            singleDate
            onChangeRange={handleAutoStartChange}
          />
          <Text style={[styles.hint, { color: colors.textSecondary }]}>{autoHint(startDate)}</Text>
        </>
      ) : (
        <DateRangePicker startDate={startDate} endDate={endDate} onChangeRange={onChangeRange} />
      )}
    </View>
  );
}

function ModeButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.modeButton, { backgroundColor: active ? colors.tint : 'transparent' }]}
    >
      <Text style={[styles.modeLabel, { color: active ? '#FFFFFF' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
  },
});
