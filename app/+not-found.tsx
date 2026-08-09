import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';

export default function NotFoundScreen() {
  const { colors, spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.container, { padding: spacing.xl, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text, marginBottom: spacing.md }]}>
          This screen doesn&apos;t exist.
        </Text>
        <Link href="/" style={[styles.link, { color: colors.tint }]}>
          Go to the calendar
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
});
