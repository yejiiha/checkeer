import { View, ScrollView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

const hasLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

export default function RacesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: hasLiquidGlass ? 100 : 20 }}>
        <View className="flex-1 items-center justify-center py-20">
          <Calendar size={64} color="#d1d5db" />
          <Text className="mt-4 text-lg font-semibold text-gray-400">대회 목록</Text>
          <Text className="mt-2 text-center text-gray-400">곧 업데이트 예정입니다</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

