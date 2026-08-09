import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MigrationErrorScreen } from '@/src/components/system/MigrationErrorScreen';
import { SplashLoadingScreen } from '@/src/components/system/SplashLoadingScreen';
import { db } from '@/src/db/client';
import migrations from '@/src/db/migrations/migrations';
import { ThemeProvider, useTheme } from '@/src/theme/ThemeProvider';

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        {error ? (
          <MigrationErrorScreen error={error} />
        ) : !success ? (
          <SplashLoadingScreen />
        ) : (
          <RootNavigator />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// A plain <Stack> with no screenOptions falls back to React Navigation's default (white) header —
// fine for the tabs layout below it (which sets its own), but every modal route lives directly on
// this root Stack, so without this it always showed a white title bar even in dark mode.
function RootNavigator() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surfaceElevated },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="day/[date]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="pattern/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="pattern/[id]/apply" options={{ presentation: 'modal' }} />
      <Stack.Screen name="clear-calendar" options={{ presentation: 'modal' }} />
      <Stack.Screen name="shift-types" options={{ presentation: 'modal' }} />
      <Stack.Screen name="shift-type/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="shift-type/[id]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
