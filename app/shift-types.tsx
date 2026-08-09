import { Stack, router } from 'expo-router';
import { FlatList, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { Screen } from '@/src/components/ui/Screen';
import { ShiftTypeListItem } from '@/src/features/shiftTypes/components/ShiftTypeListItem';
import { useShiftTypes } from '@/src/features/shiftTypes/hooks/useShiftTypes';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function ShiftTypesScreen() {
  const { spacing } = useTheme();
  const shiftTypes = useShiftTypes();

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Shift types' }} />
      <FlatList
        data={shiftTypes}
        keyExtractor={(item) => String(item.id)}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <ShiftTypeListItem
            shiftType={item}
            onPress={() =>
              router.push({ pathname: '/shift-type/[id]', params: { id: String(item.id) } })
            }
          />
        )}
        // Part of the scrollable content, not a fixed sibling below it — otherwise a short
        // list leaves the button stranded at the very bottom of the screen instead of right
        // after the last item.
        ListFooterComponent={
          <View style={{ marginTop: spacing.md }}>
            <Button onPress={() => router.push('/shift-type/new')}>+ New shift type</Button>
          </View>
        }
      />
    </Screen>
  );
}
