import { GlassCard } from '@/components/ui/GlassCard';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react-native';
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
  status?: string;
  avgPace?: string;
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
    status: 'FINISH',
    avgPace: '03:52',
  },
  {
    raceMemberId: 2052,
    memberName: '윤호정',
    bib: '21857',
    course: 'HALF',
    thumbnailImgUrl:
      'https://api.checkmy.run/image/race/139/dressup/thumbnail/u-Gil1pkWlZYVnLD.jpg',
    uniqueCode: 'B3X9',
    status: 'RUNNING',
    avgPace: '04:05',
  },
  {
    raceMemberId: 2049,
    memberName: '이승민',
    bib: '21986',
    course: 'HALF',
    thumbnailImgUrl:
      'https://api.checkmy.run/image/race/139/dressup/thumbnail/4jA5znksE8By3uRO.jpg',
    uniqueCode: 'C5M1',
    status: 'RUNNING',
    avgPace: '04:08',
  },
  {
    raceMemberId: 2025,
    memberName: '문영조',
    bib: '21346',
    course: 'HALF',
    thumbnailImgUrl:
      'https://api.checkmy.run/image/race/139/dressup/thumbnail/BzIo9ho803dFcFO6.jpg',
    uniqueCode: 'D9P4',
    status: 'FINISH',
    avgPace: '04:19',
  },
];

type SearchType = 'name' | 'bib' | 'code';

export default function SearchRunnerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const raceId = Number(id);
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // 상태
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedRunner[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  // 주자 상세 페이지로 이동 (TODO: 실제 구현)
  const handleSelectRunner = useCallback(
    (runner: SearchedRunner) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // TODO: 개별 주자 상세 페이지로 이동
      console.log('Selected runner:', runner);
    },
    []
  );

  // 상태 배지 색상
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'FINISH':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'RUNNING':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'DNS':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'FINISH':
        return '완주';
      case 'RUNNING':
        return '진행 중';
      case 'DNS':
        return '미출발';
      default:
        return status || '대기';
    }
  };

  // 검색 결과 렌더링
  const renderSearchResult = useCallback(
    ({ item }: { item: SearchedRunner }) => {
      return (
        <Pressable
          onPress={() => handleSelectRunner(item)}
          className={cn(
            'mb-3 flex-row items-center rounded-xl p-4',
            isDark ? 'bg-gray-800 active:bg-gray-700' : 'bg-white active:bg-gray-50'
          )}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}>
          {item.thumbnailImgUrl ? (
            <Image
              source={{ uri: item.thumbnailImgUrl }}
              style={{ width: 56, height: 56, borderRadius: 28 }}
              contentFit="cover"
            />
          ) : (
            <View
              className={cn(
                'h-14 w-14 items-center justify-center rounded-full',
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              )}>
              <Text className="text-xl font-bold text-gray-500">{item.memberName.charAt(0)}</Text>
            </View>
          )}

          <View className="ml-4 flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                {item.memberName}
              </Text>
              <View className={cn('rounded-full px-2 py-0.5', getStatusColor(item.status))}>
                <Text className={cn('text-xs font-medium', getStatusColor(item.status))}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
            <View className="mt-1 flex-row items-center gap-3">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                배번 {item.bib}
              </Text>
              <Text className="text-sm text-gray-400 dark:text-gray-500">|</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">{item.course}</Text>
              {item.avgPace && (
                <>
                  <Text className="text-sm text-gray-400 dark:text-gray-500">|</Text>
                  <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {item.avgPace}/km
                  </Text>
                </>
              )}
            </View>
          </View>

          <ChevronRight size={20} color={iconColor} />
        </Pressable>
      );
    },
    [isDark, handleSelectRunner, iconColor]
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '주자 검색',
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
        <View className="flex-1 p-5">
          {/* 안내 메시지 */}
          <GlassCard containerClassName="mb-4" className="p-4">
            <Text className="text-sm text-gray-600 dark:text-gray-300">
              응원하고 싶은 주자를 검색하세요.{'\n'}
              이름, 배번, 또는 주자의 고유코드로 찾을 수 있어요.
            </Text>
          </GlassCard>

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
            <>
              <Text className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                검색 결과 {searchResults.length}명
              </Text>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.raceMemberId.toString()}
                renderItem={renderSearchResult}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </>
          ) : (
            <View className="flex-1 items-center justify-center">
              {isSearching ? (
                <Text className="text-gray-500 dark:text-gray-400">검색 중...</Text>
              ) : searchQuery ? (
                <View className="items-center">
                  <Text className="text-base text-gray-500 dark:text-gray-400">
                    검색 결과가 없어요
                  </Text>
                  <Text className="mt-2 text-center text-sm text-gray-400 dark:text-gray-500">
                    다른 검색어로 다시 시도해보세요
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Search size={64} color={iconColor} />
                  <Text className="mt-4 text-center text-base text-gray-500 dark:text-gray-400">
                    {searchType === 'name' && '주자의 이름을 검색하세요'}
                    {searchType === 'bib' && '배번으로 검색하세요'}
                    {searchType === 'code' && '주자에게 받은 고유코드를\n입력하세요'}
                  </Text>
                  <Text className="mt-2 text-center text-sm text-gray-400 dark:text-gray-500">
                    {searchType === 'code' && '고유코드는 4자리 영문+숫자 조합이에요'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

