import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { Screen } from '@/src/components/ui/Screen';
import { ShiftTypeForm } from '@/src/features/shiftTypes/components/ShiftTypeForm';
import { useDeleteShiftType } from '@/src/features/shiftTypes/hooks/useDeleteShiftType';
import { useShiftType } from '@/src/features/shiftTypes/hooks/useShiftType';
import { useShiftTypes } from '@/src/features/shiftTypes/hooks/useShiftTypes';
import { useUpdateShiftType } from '@/src/features/shiftTypes/hooks/useUpdateShiftType';
import type { ShiftTypeFormValues } from '@/src/features/shiftTypes/types';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function EditShiftTypeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spacing } = useTheme();

  const shiftType = useShiftType(Number(id));
  const shiftTypes = useShiftTypes();
  const updateShiftType = useUpdateShiftType();
  const deleteShiftType = useDeleteShiftType();

  if (!shiftType) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Shift type' }} />
      </Screen>
    );
  }

  async function handleSubmit(values: ShiftTypeFormValues) {
    if (!shiftType) return;
    await updateShiftType(shiftType.id, values);
    router.back();
  }

  async function handleDelete() {
    if (!shiftType) return;
    const result = await deleteShiftType(shiftType.id, shiftType.key);
    if (result.blocked) {
      Alert.alert("Can't delete this shift type", result.reason);
      return;
    }
    router.back();
  }

  function confirmDelete() {
    Alert.alert(`Delete "${shiftType?.label}"?`, "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void handleDelete() },
    ]);
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: shiftType.label }} />
      <ScrollView contentContainerStyle={{ gap: spacing.lg }} showsVerticalScrollIndicator={false}>
        <ShiftTypeForm
          initialValues={{ label: shiftType.label, color: shiftType.color }}
          existingLabels={shiftTypes
            .filter((type) => type.id !== shiftType.id)
            .map((type) => type.label)}
          submitLabel="Save"
          onSubmit={(values) => void handleSubmit(values)}
        />
        <Button variant="danger" onPress={confirmDelete}>
          Delete shift type
        </Button>
      </ScrollView>
    </Screen>
  );
}
