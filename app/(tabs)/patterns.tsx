import { router } from 'expo-router';
import { Alert, FlatList, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Screen } from '@/src/components/ui/Screen';
import { PatternListItem } from '@/src/features/patterns/components/PatternListItem';
import { useDeletePattern } from '@/src/features/patterns/hooks/useDeletePattern';
import { usePatterns } from '@/src/features/patterns/hooks/usePatterns';
import type { PatternRecord } from '@/src/features/patterns/types';
import { useShiftTypeMap } from '@/src/features/shiftTypes/hooks/useShiftTypeMap';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function PatternsScreen() {
  const { spacing } = useTheme();
  const patterns = usePatterns();
  const deletePattern = useDeletePattern();
  const shiftTypeMap = useShiftTypeMap();

  function confirmDelete(pattern: PatternRecord) {
    Alert.alert(
      'Delete pattern?',
      'Shifts already generated from this pattern will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => void deletePattern(pattern.id),
        },
      ],
    );
  }

  return (
    <Screen>
      <FlatList
        data={patterns}
        keyExtractor={(item) => String(item.id)}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <PatternListItem
            pattern={item}
            shiftTypeMap={shiftTypeMap}
            onPress={() =>
              router.push({ pathname: '/pattern/[id]/apply', params: { id: String(item.id) } })
            }
            onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="repeat-outline"
            message="No patterns yet. Create one to quickly fill in repeating shift cycles."
          />
        }
        // Part of the scrollable content, not a fixed sibling below it — otherwise a short
        // list leaves the button stranded at the very bottom of the screen instead of right
        // after the last item.
        ListFooterComponent={
          <View style={{ marginTop: spacing.md, marginBottom: spacing.xs }}>
            <Button onPress={() => router.push('/pattern/new')}>+ New pattern</Button>
          </View>
        }
      />
    </Screen>
  );
}
