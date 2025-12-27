import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/src/stores/auth-store';

/**
 * 앱 시작점 - 인증 상태에 따라 적절한 화면으로 리다이렉트
 */
export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
