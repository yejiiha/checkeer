import { GlassCard } from '@/components/ui/GlassCard';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { mockRaceDetail } from '@/src/lib/mock-data';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, ChevronLeft, ImagePlus, Info, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

export default function RegisterBibScreen() {
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();
  const raceId = Number(id);
  const isEditMode = edit === 'true';
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Mock 데이터
  const { raceInfo, raceMemberInfo } = mockRaceDetail;

  // 폼 상태
  const [bibNumber, setBibNumber] = useState(isEditMode && raceMemberInfo ? raceMemberInfo.bib : '');
  const [selectedCourse, setSelectedCourse] = useState<string>(
    isEditMode && raceMemberInfo ? raceMemberInfo.course : ''
  );
  const [targetHour, setTargetHour] = useState(
    isEditMode && raceMemberInfo ? raceMemberInfo.targetRecord.split(':')[0] : ''
  );
  const [targetMin, setTargetMin] = useState(
    isEditMode && raceMemberInfo ? raceMemberInfo.targetRecord.split(':')[1] : ''
  );
  const [targetSec, setTargetSec] = useState(
    isEditMode && raceMemberInfo ? raceMemberInfo.targetRecord.split(':')[2] : ''
  );
  const [outfitImage, setOutfitImage] = useState<string | null>(
    isEditMode && raceMemberInfo ? raceMemberInfo.imgUrl : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconColor = isDark ? '#9CA3AF' : '#6B7280';
  const isFormValid = bibNumber.trim() !== '' && selectedCourse !== '';

  // 코스 선택 핸들러
  const handleSelectCourse = useCallback((course: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCourse(course);
  }, []);

  // 이미지 선택 핸들러
  const handlePickImage = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 선택하려면 갤러리 접근 권한이 필요해요.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setOutfitImage(result.assets[0].uri);
    }
  }, []);

  // 카메라로 촬영
  const handleTakePhoto = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 권한 요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 촬영하려면 카메라 접근 권한이 필요해요.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setOutfitImage(result.assets[0].uri);
    }
  }, []);

  // 이미지 삭제
  const handleRemoveImage = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOutfitImage(null);
  }, []);

  // 제출 핸들러
  const handleSubmit = useCallback(async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // TODO: 실제 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSubmitting(false);
    router.back();
  }, [isFormValid, router]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: isEditMode ? '배번 수정' : '배번 등록',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              className="mr-2 h-9 w-9 items-center justify-center rounded-full">
              <ChevronLeft size={26} color={isDark ? '#ffffff' : '#000000'} />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: isDark ? '#111827' : '#F9FAFB',
          },
          headerTitleStyle: {
            color: isDark ? '#ffffff' : '#000000',
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* 안내 메시지 */}
          <GlassCard containerClassName="mb-6" className="flex-row items-start gap-3 p-4">
            <Info size={20} color="#3B82F6" />
            <View className="flex-1">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                대회에서 받은 배번 정보를 입력해주세요.{'\n'}
                착장 사진을 등록하면 응원단이 쉽게 찾을 수 있어요!
              </Text>
            </View>
          </GlassCard>

          {/* 대회 정보 */}
          <View className="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/30">
            <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {raceInfo.raceTitle}
            </Text>
            <Text className="mt-1 text-xs text-blue-600 dark:text-blue-300">
              {raceInfo.raceDate} | {raceInfo.racePlace}
            </Text>
          </View>

          {/* 착장 사진 */}
          <GlassCard containerClassName="mb-4" className="p-5">
            <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              착장 사진 <Text className="text-xs text-gray-400">(권장)</Text>
            </Text>
            <Text className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              대회 당일 착용할 옷을 찍어두면 응원단이 쉽게 찾을 수 있어요
            </Text>

            {outfitImage ? (
              // 이미지가 있을 때
              <View className="items-center">
                <View className="relative">
                  <Image
                    source={{ uri: outfitImage }}
                    style={{
                      width: 180,
                      height: 240,
                      borderRadius: 16,
                    }}
                    contentFit="cover"
                  />
                  {/* 삭제 버튼 */}
                  <Pressable
                    onPress={handleRemoveImage}
                    className="absolute -right-2 -top-2 h-8 w-8 items-center justify-center rounded-full bg-red-500 shadow-lg active:bg-red-600">
                    <X size={18} color="#ffffff" />
                  </Pressable>
                </View>
                <Pressable
                  onPress={handlePickImage}
                  className="mt-3 rounded-lg bg-gray-100 px-4 py-2 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600">
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    다른 사진 선택
                  </Text>
                </Pressable>
              </View>
            ) : (
              // 이미지가 없을 때
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handlePickImage}
                  className={cn(
                    'flex-1 items-center rounded-xl border-2 border-dashed py-8',
                    isDark
                      ? 'border-gray-600 active:border-gray-500 active:bg-gray-800'
                      : 'border-gray-300 active:border-gray-400 active:bg-gray-50'
                  )}>
                  <ImagePlus size={32} color={iconColor} />
                  <Text className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    갤러리에서 선택
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleTakePhoto}
                  className={cn(
                    'flex-1 items-center rounded-xl border-2 border-dashed py-8',
                    isDark
                      ? 'border-gray-600 active:border-gray-500 active:bg-gray-800'
                      : 'border-gray-300 active:border-gray-400 active:bg-gray-50'
                  )}>
                  <Camera size={32} color={iconColor} />
                  <Text className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    사진 촬영
                  </Text>
                </Pressable>
              </View>
            )}
          </GlassCard>

          {/* 배번 입력 */}
          <GlassCard containerClassName="mb-4" className="p-5">
            <Text className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              배번 <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={bibNumber}
              onChangeText={setBibNumber}
              placeholder="배번을 입력하세요 (예: 1234)"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              keyboardType="number-pad"
              className={cn(
                'rounded-xl border px-4 py-4 text-base',
                isDark
                  ? 'border-gray-700 bg-gray-800 text-white'
                  : 'border-gray-200 bg-white text-gray-900'
              )}
            />
          </GlassCard>

          {/* 코스 선택 */}
          <GlassCard containerClassName="mb-4" className="p-5">
            <Text className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              코스 <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {raceInfo.raceCourses.map((course) => (
                <Pressable
                  key={course}
                  onPress={() => handleSelectCourse(course)}
                  className={cn(
                    'rounded-xl border-2 px-5 py-3',
                    selectedCourse === course
                      ? 'border-blue-500 bg-blue-500/10'
                      : isDark
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  )}>
                  <Text
                    className={cn(
                      'text-sm font-semibold',
                      selectedCourse === course
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300'
                    )}>
                    {course}
                  </Text>
                </Pressable>
              ))}
            </View>
          </GlassCard>

          {/* 목표 기록 */}
          <GlassCard containerClassName="mb-4" className="p-5">
            <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              목표 기록 <Text className="text-xs text-gray-400">(선택)</Text>
            </Text>
            <Text className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              목표 기록을 설정하면 실시간으로 페이스를 비교할 수 있어요
            </Text>

            <View className="flex-row items-center justify-center gap-2">
              <View className="items-center">
                <TextInput
                  value={targetHour}
                  onChangeText={(text) => {
                    const num = text.replace(/[^0-9]/g, '');
                    if (num.length <= 2) setTargetHour(num);
                  }}
                  placeholder="00"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  keyboardType="number-pad"
                  maxLength={2}
                  className={cn(
                    'w-16 rounded-xl border px-3 py-3 text-center text-xl font-bold',
                    isDark
                      ? 'border-gray-700 bg-gray-800 text-white'
                      : 'border-gray-200 bg-white text-gray-900'
                  )}
                />
                <Text className="mt-1 text-xs text-gray-500">시간</Text>
              </View>

              <Text className="text-2xl font-bold text-gray-400">:</Text>

              <View className="items-center">
                <TextInput
                  value={targetMin}
                  onChangeText={(text) => {
                    const num = text.replace(/[^0-9]/g, '');
                    if (num.length <= 2 && Number(num) < 60) setTargetMin(num);
                  }}
                  placeholder="00"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  keyboardType="number-pad"
                  maxLength={2}
                  className={cn(
                    'w-16 rounded-xl border px-3 py-3 text-center text-xl font-bold',
                    isDark
                      ? 'border-gray-700 bg-gray-800 text-white'
                      : 'border-gray-200 bg-white text-gray-900'
                  )}
                />
                <Text className="mt-1 text-xs text-gray-500">분</Text>
              </View>

              <Text className="text-2xl font-bold text-gray-400">:</Text>

              <View className="items-center">
                <TextInput
                  value={targetSec}
                  onChangeText={(text) => {
                    const num = text.replace(/[^0-9]/g, '');
                    if (num.length <= 2 && Number(num) < 60) setTargetSec(num);
                  }}
                  placeholder="00"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  keyboardType="number-pad"
                  maxLength={2}
                  className={cn(
                    'w-16 rounded-xl border px-3 py-3 text-center text-xl font-bold',
                    isDark
                      ? 'border-gray-700 bg-gray-800 text-white'
                      : 'border-gray-200 bg-white text-gray-900'
                  )}
                />
                <Text className="mt-1 text-xs text-gray-500">초</Text>
              </View>
            </View>
          </GlassCard>
        </ScrollView>

        {/* 하단 버튼 */}
        <View
          className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50 px-5 pb-10 pt-4 dark:border-gray-700 dark:bg-gray-900"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 10,
          }}>
          <Pressable
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={cn(
              'items-center rounded-xl py-4',
              isFormValid && !isSubmitting
                ? 'bg-blue-500 active:bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-700'
            )}>
            <Text
              className={cn(
                'text-base font-semibold',
                isFormValid && !isSubmitting ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              )}>
              {isSubmitting ? '등록 중...' : isEditMode ? '수정하기' : '등록하기'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
