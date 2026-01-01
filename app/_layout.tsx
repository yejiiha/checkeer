import '@/global.css';
import 'react-native-reanimated';

import { NAV_THEME } from '@/lib/theme';
import { useAuthStore } from '@/src/stores/auth-store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// TanStack Query 클라이언트
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
});

function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { isLoading, checkAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="notifications"
                options={{
                  headerShown: true,
                  title: '알림',
                  headerBackButtonDisplayMode: 'minimal',
                }}
              />
              <Stack.Screen
                name="race/[id]"
                options={{
                  headerShown: true,
                  title: '',
                  headerTransparent: true,
                  headerBackButtonDisplayMode: 'minimal',
                }}
              />
              <Stack.Screen
                name="broadcast/[broadcastKey]"
                options={{
                  headerShown: true,
                  title: '',
                  headerBackButtonDisplayMode: 'minimal',
                }}
              />
            </Stack>
            <PortalHost />
          </ThemeProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
