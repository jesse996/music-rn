import { useColorScheme } from '@/hooks/useColorScheme';
import { config } from '@tamagui/config/v3';
import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'expo-dev-client';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";
import AudioPlayer from '@/components/AudioPlayer';
import Toastable from 'react-native-toastable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tamaguiConfig = createTamagui(config)
// TypeScript types across all Tamagui APIs
type Conf = typeof tamaguiConfig
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf { }
}


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient()

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { top } = useSafeAreaInsets();
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <TamaguiProvider config={tamaguiConfig}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="playlist/[id]" options={{ title: '歌单' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <AudioPlayer />
        <Toastable
          statusMap={{
            success: 'red',
            danger: 'yellow',
            warning: 'green',
            info: 'blue',
          }}
          offset={top}
        />
      </QueryClientProvider>
    </TamaguiProvider>

    // </ThemeProvider>

  );
}
