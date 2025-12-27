import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';

export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* 알림이 없을 때 */}
        <View className="flex-1 items-center justify-center px-5 py-20">
          <View className="mb-4 rounded-full bg-gray-200 p-6 dark:bg-gray-700">
            <Bell size={48} color="#9CA3AF" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            알림이 없습니다
          </Text>
          <Text className="mt-2 text-center text-gray-500 dark:text-gray-400">
            새로운 알림이 도착하면{'\n'}여기에 표시됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
