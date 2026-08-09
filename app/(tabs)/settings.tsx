import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { Screen } from '@/src/components/ui/Screen';
import { SectionHeader } from '@/src/components/ui/SectionHeader';
import { useApplyBackup } from '@/src/features/backup/hooks/useApplyBackup';
import { useExportBackup } from '@/src/features/backup/hooks/useExportBackup';
import { usePickBackupFile } from '@/src/features/backup/hooks/usePickBackupFile';
import { ThemeSelector } from '@/src/features/settings/components/ThemeSelector';
import { useClearAllCalendar } from '@/src/features/shifts/hooks/useClearAllCalendar';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function SettingsScreen() {
  const { colors, spacing } = useTheme();
  const clearAllCalendar = useClearAllCalendar();
  const exportBackup = useExportBackup();
  const pickBackupFile = usePickBackupFile();
  const applyBackup = useApplyBackup();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  function confirmClearEverything() {
    Alert.alert(
      'Clear everything?',
      "This will permanently remove every shift and every event across the whole calendar — not just one range. Patterns you've saved are kept. This can't be undone.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear everything', style: 'destructive', onPress: clearAllCalendar },
      ],
    );
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportBackup();
    } catch {
      Alert.alert('Export failed', "Couldn't create the backup file. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const result = await pickBackupFile();
      if (result.status === 'canceled') return;
      if (result.status === 'error') {
        Alert.alert('Import failed', result.message);
        return;
      }

      const { data } = result;
      Alert.alert(
        'Import backup?',
        `This will replace everything currently in Shiftly with the backup from ${new Date(data.exportedAt).toLocaleDateString()}: ${data.shiftTypes.length} shift types, ${data.patterns.length} patterns, ${data.shifts.length} shifts, ${data.events.length} events. This can't be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: () => {
              applyBackup(data);
              Alert.alert('Import complete', 'Your data has been restored.');
            },
          },
        ],
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionHeader style={{ marginBottom: spacing.sm }}>Appearance</SectionHeader>
        <ThemeSelector />

        <SectionHeader style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
          Shift types
        </SectionHeader>
        <Button variant="secondary" onPress={() => router.push('/shift-types')}>
          Manage shift types…
        </Button>

        <SectionHeader style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
          Backup
        </SectionHeader>
        <Text
          style={[styles.sectionHint, { color: colors.textSecondary, marginBottom: spacing.sm }]}
        >
          Save a copy of everything — shift types, patterns, shifts, and events — to a file, or
          restore from one.
        </Text>
        <View style={{ gap: spacing.sm }}>
          <Button variant="secondary" loading={exporting} onPress={handleExport}>
            Export data…
          </Button>
          <Button variant="secondary" loading={importing} onPress={handleImport}>
            Import data…
          </Button>
        </View>

        <SectionHeader style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
          Data
        </SectionHeader>
        <Text
          style={[styles.sectionHint, { color: colors.textSecondary, marginBottom: spacing.sm }]}
        >
          To clear a single month, use the clear icon on the Calendar tab. Use these for a specific
          custom range, or to reset everything at once.
        </Text>
        <View style={{ gap: spacing.sm }}>
          <Button variant="secondary" onPress={() => router.push('/clear-calendar')}>
            Clear a date range…
          </Button>
          <Button variant="danger" onPress={confirmClearEverything}>
            Clear everything
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHint: {
    fontSize: 13,
  },
});
