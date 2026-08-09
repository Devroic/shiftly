import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';

interface MigrationErrorScreenProps {
  error: Error;
}

export function MigrationErrorScreen({ error }: MigrationErrorScreenProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
      <Text style={[styles.title, { color: colors.danger, marginTop: spacing.sm }]}>
        Database error
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary, marginTop: spacing.xs }]}>
        {error.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
  },
});
