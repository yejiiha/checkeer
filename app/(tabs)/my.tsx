import { View, ScrollView, Pressable, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/stores/auth-store';
import { 
  User, 
  ChevronRight, 
  Users, 
  HelpCircle, 
  FileText, 
  LogOut 
} from 'lucide-react-native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

const hasLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

// 메뉴 아이템 컴포넌트
function MenuItem({ 
  icon: Icon, 
  title, 
  onPress 
}: { 
  icon: typeof User; 
  title: string; 
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between border-b border-gray-100 py-4 active:bg-gray-50"
    >
      <View className="flex-row items-center gap-3">
        <Icon size={20} color="#6b7280" />
        <Text className="text-base text-gray-900">{title}</Text>
      </View>
      <ChevronRight size={20} color="#d1d5db" />
    </Pressable>
  );
}

export default function MyScreen() {
  const { logout } = useAuth();
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: hasLiquidGlass ? 100 : 20 }}
      >
        {/* 프로필 섹션 */}
        <View className="items-center border-b border-gray-100 px-5 py-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            <User size={40} color="#9ca3af" />
          </View>
          <Text className="mt-4 text-xl font-bold text-gray-900">
            {user?.memberName || '사용자'}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            마라톤 러너
          </Text>
        </View>

        {/* 메뉴 리스트 */}
        <View className="px-5 pt-4">
          <Text className="mb-2 text-xs font-semibold uppercase text-gray-400">
            계정
          </Text>
          <MenuItem icon={User} title="프로필 수정" />
          <MenuItem icon={Users} title="크루 관리" />
        </View>

        <View className="px-5 pt-6">
          <Text className="mb-2 text-xs font-semibold uppercase text-gray-400">
            지원
          </Text>
          <MenuItem icon={HelpCircle} title="자주 묻는 질문" />
          <MenuItem icon={FileText} title="개인정보처리방침" />
        </View>

        <View className="px-5 pt-6">
          <Text className="mb-2 text-xs font-semibold uppercase text-gray-400">
            기타
          </Text>
          <MenuItem 
            icon={LogOut} 
            title="로그아웃" 
            onPress={logout}
          />
        </View>

        {/* 앱 버전 */}
        <View className="items-center py-8">
          <Text className="text-xs text-gray-400">
            버전 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

