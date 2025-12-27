import { View, Image, Pressable, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

// 로고 이미지 (나중에 실제 로고로 교체)
const LOGO_PLACEHOLDER = require('@/assets/images/react-native-reusables-light.png');

export default function LoginScreen() {
  const { loginWithKakao, mockLogin } = useAuth();
  const hasLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-10 px-6">
        {/* 로고 영역 - Glass 효과 */}
        {hasLiquidGlass ? (
          <GlassView
            style={{
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              minWidth: 280,
            }}>
            <LogoContent />
          </GlassView>
        ) : (
          <View className="min-w-[280px] items-center rounded-3xl bg-gray-50 p-8">
            <LogoContent />
          </View>
        )}

        {/* 로그인 버튼 영역 */}
        <View className="w-full gap-3">
          {/* 카카오 로그인 버튼 */}
          <Pressable
            onPress={loginWithKakao}
            className="items-center rounded-xl bg-[#FEE500] px-6 py-4 active:opacity-80">
            <Text className="text-base font-semibold text-black">카카오로 시작하기</Text>
          </Pressable>

          {/* 개발용 Mock 로그인 버튼 - Glass 효과 */}
          {__DEV__ &&
            (hasLiquidGlass ? (
              <Pressable onPress={mockLogin}>
                <GlassView
                  style={{
                    borderRadius: 14,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  glassEffectStyle="regular"
                  isInteractive>
                  <Text className="text-[15px] font-medium text-gray-700">[DEV] Mock 로그인</Text>
                </GlassView>
              </Pressable>
            ) : (
              <Pressable
                onPress={mockLogin}
                className="items-center rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 active:opacity-80">
                <Text className="text-[15px] font-medium text-gray-600">[DEV] Mock 로그인</Text>
              </Pressable>
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

// 로고 콘텐츠 컴포넌트 분리
function LogoContent() {
  return (
    <View className="items-center gap-3">
      <Image source={LOGO_PLACEHOLDER} style={{ width: 100, height: 100 }} resizeMode="contain" />
      <Text className="text-[28px] font-bold text-gray-900">Checkeer</Text>
      <Text className="text-center text-[15px] leading-6 text-gray-500">
        마라톤 기록을 관리하고{'\n'}실시간으로 응원하세요
      </Text>
    </View>
  );
}
