import { Stack, router } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { ShiftTypeForm } from '@/src/features/shiftTypes/components/ShiftTypeForm';
import { SHIFT_COLOR_PRESETS } from '@/src/features/shiftTypes/constants';
import { useCreateShiftType } from '@/src/features/shiftTypes/hooks/useCreateShiftType';
import { useShiftTypes } from '@/src/features/shiftTypes/hooks/useShiftTypes';
import type { ShiftTypeFormValues } from '@/src/features/shiftTypes/types';

export default function NewShiftTypeScreen() {
  const shiftTypes = useShiftTypes();
  const createShiftType = useCreateShiftType();

  async function handleSubmit(values: ShiftTypeFormValues) {
    await createShiftType(values);
    router.back();
  }

  const nextPresetColor = SHIFT_COLOR_PRESETS[shiftTypes.length % SHIFT_COLOR_PRESETS.length];

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'New shift type' }} />
      <ShiftTypeForm
        initialValues={{ label: '', color: nextPresetColor }}
        existingLabels={shiftTypes.map((type) => type.label)}
        submitLabel="Create"
        onSubmit={(values) => void handleSubmit(values)}
      />
    </Screen>
  );
}
