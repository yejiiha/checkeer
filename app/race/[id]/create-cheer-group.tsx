import { GlassCard } from '@/components/ui/GlassCard';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Search, UserPlus, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';

// 검색된 주자 타입
interface SearchedRunner {
  raceMemberId: number;
  memberName: string;
  bib: string;
  course: string;
  thumbnailImgUrl?: string;
  uniqueCode?: string;
}

// Mock 검색 결과
const mockSearchResults: SearchedRunner[] = [
  {
    raceMemberId: 2029,
    memberName: '장신석',
    bib: '21919',
    course: 'HALF',
    thumbnailImgUrl:
      'https://api.checkmy.run/image/race/139/dressup/thumbnail/F6nW5gePb8B0mLk-.jpg',
    uniqueCode: 'A7K2',
  },
  {
    raceMemberId: 2052,
    memberName: '윤호정',
    bib: '21857',
    course: 'HALF',
    thumbnailImgUrl:
      'https://api.checkmy.run/image/race/139/dressup/thumbnail/u-Gil1pkWlZYVnLD.jpg',
    uniqueCode: 'B3X9',
  },
  {
    raceMemberId: 2049,
    memberName: '이승민',
    bib: '21986',
    course: 'HALF',
    thumbnailImgUrl:
      'https://api.checkmy.run/image/race/139/dressup/thumbnail/4jA5znksE8By3uRO.jpg',
    uniqueCode: 'C5M1',
  },
];

type SearchType = 'name' | 'bib' | 'code';

export default function CreateCheerGroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const raceId = Number(id);
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // 상태
  const [step, setStep] = useState<'info' | 'search'>('info');
  const [groupName, setGroupName] = useState('');
  const [selectedRunners, setSelectedRunners] = useState<SearchedRunner[]>([]);
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedRunner[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconColor = isDark ? '#9CA3AF' : '#6B7280';

  // 검색 실행
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // TODO: 실제 API 호출
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock: 검색 결과 필터링
    const filtered = mockSearchResults.filter((runner) => {
      const query = searchQuery.toLowerCase();
      switch (searchType) {
        case 'name':
          return runner.memberName.toLowerCase().includes(query);
        case 'bib':
          return runner.bib.includes(query);
        case 'code':
          return runner.uniqueCode?.toLowerCase().includes(query);
        default:
          return false;
      }
    });

    setSearchResults(filtered);
    setIsSearching(false);
  }, [searchQuery, searchType]);

  // 주자 추가/제거
  const toggleRunner = useCallback((runner: SearchedRunner) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRunners((prev) => {
      const exists = prev.find((r) => r.raceMemberId === runner.raceMemberId);
      if (exists) {
        return prev.filter((r) => r.raceMemberId !== runner.raceMemberId);
      }
      return [...prev, runner];
    });
  }, []);

  // 주자 제거
  const removeRunner = useCallback((raceMemberId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRunners((prev) => prev.filter((r) => r.raceMemberId !== raceMemberId));
  }, []);

  // 그룹 생성
  const handleCreateGroup = useCallback(async () => {
    if (!groupName.trim() || selectedRunners.length === 0) return;

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // TODO: 실제 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSubmitting(false);

    // 생성된 그룹의 broadcast 페이지로 이동 (TODO: 실제 broadcastKey 사용)
    router.replace(`/race/${raceId}` as any);
  }, [groupName, selectedRunners, raceId, router]);

  const isFormValid = groupName.trim() !== '' && selectedRunners.length > 0;

  // 검색 결과 렌더링
  const renderSearchResult = useCallback(
    ({ item }: { item: SearchedRunner }) => {
      const isSelected = selectedRunners.some((r) => r.raceMemberId === item.raceMemberId);

      return (
        <Pressable
          onPress={() => toggleRunner(item)}
          className={cn(
            'mb-3 flex-row items-center rounded-xl border-2 p-3',
            isSelected
              ? 'border-blue-500 bg-blue-500/10'
              : isDark
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-white'
          )}>
          {item.thumbnailImgUrl ? (
            <Image
              source={{ uri: item.thumbnailImgUrl }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
              contentFit="cover"
            />
          ) : (
            <View
              className={cn(
                'h-12 w-12 items-center justify-center rounded-full',
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              )}>
              <Text className="text-lg font-bold text-gray-500">{item.memberName.charAt(0)}</Text>
            </View>
          )}

          <View className="ml-3 flex-1">
            <Text className="font-medium text-gray-900 dark:text-white">{item.memberName}</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              배번: {item.bib} | {item.course}
            </Text>
          </View>

          <View
            className={cn(
              'h-6 w-6 items-center justify-center rounded-full',
              isSelected ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
            )}>
            {isSelected && <Text className="text-xs font-bold text-white">✓</Text>}
          </View>
        </Pressable>
      );
    },
    [selectedRunners, isDark, toggleRunner]
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: step === 'info' ? '새 응원 그룹' : '주자 검색',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                if (step === 'search') {
                  setStep('info');
                } else {
                  router.back();
                }
              }}
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
        {step === 'info' ? (
          // Step 1: 그룹 정보 입력
          <View className="flex-1 p-5">
            {/* 그룹 이름 */}
            <GlassCard containerClassName="mb-4" className="p-5">
              <Text className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                그룹 이름 <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={groupName}
                onChangeText={setGroupName}
                placeholder="예: 우리 가족 응원단"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={cn(
                  'rounded-xl border px-4 py-4 text-base',
                  isDark
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-200 bg-white text-gray-900'
                )}
              />
            </GlassCard>

            {/* 선택된 주자 목록 */}
            <GlassCard containerClassName="flex-1" className="p-5">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  응원할 주자 ({selectedRunners.length}명)
                </Text>
              </View>

              {selectedRunners.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {selectedRunners.map((runner) => (
                    <View
                      key={runner.raceMemberId}
                      className="flex-row items-center rounded-full bg-blue-100 py-2 pl-3 pr-2 dark:bg-blue-900/50">
                      <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {runner.memberName}
                      </Text>
                      <Pressable
                        onPress={() => removeRunner(runner.raceMemberId)}
                        className="ml-2 h-5 w-5 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800">
                        <X size={12} color={isDark ? '#93C5FD' : '#1E40AF'} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="flex-1 items-center justify-center py-8">
                  <UserPlus size={48} color={iconColor} />
                  <Text className="mt-3 text-center text-gray-500 dark:text-gray-400">
                    아직 추가된 주자가 없어요
                  </Text>
                </View>
              )}

              {/* 주자 추가 버튼 */}
              <Pressable
                onPress={() => setStep('search')}
                className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-4 active:border-gray-400 dark:border-gray-600 dark:active:border-gray-500">
                <UserPlus size={20} color={iconColor} />
                <Text className="font-medium text-gray-500 dark:text-gray-400">주자 추가하기</Text>
              </Pressable>
            </GlassCard>

            {/* 그룹 만들기 버튼 */}
            <Pressable
              onPress={handleCreateGroup}
              disabled={!isFormValid || isSubmitting}
              className={cn(
                'mt-4 items-center rounded-xl py-4',
                isFormValid && !isSubmitting
                  ? 'bg-blue-500 active:bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-700'
              )}>
              <Text
                className={cn(
                  'text-base font-semibold',
                  isFormValid && !isSubmitting ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                )}>
                {isSubmitting ? '생성 중...' : '그룹 만들기'}
              </Text>
            </Pressable>
          </View>
        ) : (
          // Step 2: 주자 검색
          <View className="flex-1 p-5">
            {/* 검색 타입 선택 */}
            <View className="mb-4 flex-row gap-2">
              {[
                { type: 'name' as SearchType, label: '이름' },
                { type: 'bib' as SearchType, label: '배번' },
                { type: 'code' as SearchType, label: '고유코드' },
              ].map(({ type, label }) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    setSearchType(type);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className={cn(
                    'flex-1 items-center rounded-xl py-3',
                    searchType === type
                      ? 'bg-blue-500'
                      : isDark
                        ? 'bg-gray-800'
                        : 'bg-gray-200'
                  )}>
                  <Text
                    className={cn(
                      'text-sm font-semibold',
                      searchType === type ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                    )}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 검색 입력 */}
            <GlassCard containerClassName="mb-4" className="flex-row items-center gap-3 p-4">
              <Search size={20} color={iconColor} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                placeholder={
                  searchType === 'name'
                    ? '이름으로 검색'
                    : searchType === 'bib'
                      ? '배번으로 검색'
                      : '고유코드로 검색 (예: A7K2)'
                }
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                returnKeyType="search"
                autoCapitalize="none"
                className="flex-1 text-base text-gray-900 dark:text-white"
              />
              {searchQuery && (
                <Pressable
                  onPress={handleSearch}
                  className="rounded-lg bg-blue-500 px-4 py-2 active:bg-blue-600">
                  <Text className="text-sm font-semibold text-white">검색</Text>
                </Pressable>
              )}
            </GlassCard>

            {/* 검색 결과 */}
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.raceMemberId.toString()}
                renderItem={renderSearchResult}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                {isSearching ? (
                  <Text className="text-gray-500 dark:text-gray-400">검색 중...</Text>
                ) : searchQuery ? (
                  <Text className="text-gray-500 dark:text-gray-400">검색 결과가 없어요</Text>
                ) : (
                  <View className="items-center">
                    <Search size={48} color={iconColor} />
                    <Text className="mt-3 text-center text-gray-500 dark:text-gray-400">
                      {searchType === 'name' && '주자의 이름을 검색하세요'}
                      {searchType === 'bib' && '배번으로 검색하세요'}
                      {searchType === 'code' && '주자에게 받은 고유코드를 입력하세요'}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* 선택 완료 버튼 */}
            {selectedRunners.length > 0 && (
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
                  onPress={() => setStep('info')}
                  className="items-center rounded-xl bg-blue-500 py-4 active:bg-blue-600">
                  <Text className="text-base font-semibold text-white">
                    선택 완료 ({selectedRunners.length}명)
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

