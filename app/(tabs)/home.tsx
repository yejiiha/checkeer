import { Text } from '@/components/ui/text';
import { useGetHomeInfos } from '@/src/api/generated/02-homecontroller/02-homecontroller';
import { mockHomeData } from '@/src/lib/mock-data';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const hasLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

// 배경 이미지
const BACKGROUND_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=1400&fit=crop',
};

// Glass 카드 래퍼 컴포넌트
function GlassCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: any;
}) {
  if (hasLiquidGlass) {
    return <GlassView style={[{ borderRadius: 16, padding: 16 }, style]}>{children}</GlassView>;
  }
  return <View className={className}>{children}</View>;
}

// 개인 최고 기록 카드
function PersonalBestCard({
  title,
  record,
  label,
}: {
  title: string;
  record: string | null;
  label: string;
}) {
  if (hasLiquidGlass) {
    return (
      <GlassView style={{ flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' }}>
        <Text className="text-xs text-gray-600">{title}</Text>
        <Text className="mt-1 text-xl font-bold text-gray-900">{record || '-'}</Text>
        <Text className="text-xs text-gray-500">{label}</Text>
      </GlassView>
    );
  }
  return (
    <View className="flex-1 items-center rounded-xl bg-white/90 p-4 shadow-sm">
      <Text className="text-xs text-gray-500">{title}</Text>
      <Text className="mt-1 text-xl font-bold text-gray-900">{record || '-'}</Text>
      <Text className="text-xs text-gray-400">{label}</Text>
    </View>
  );
}

// 다가오는 대회 카드
function UpcomingRaceCard({
  raceId,
  title,
  date,
  place,
  onPress,
}: {
  raceId: number;
  title: string;
  date: string;
  place: string;
  onPress?: () => void;
}) {
  if (hasLiquidGlass) {
    return (
      <Pressable onPress={onPress}>
        <GlassView
          style={{ width: 240, borderRadius: 16, padding: 16, marginRight: 12 }}
          glassEffectStyle="clear">
          <Text className="text-sm font-semibold text-blue-900">{title}</Text>
          <Text className="mt-1 text-xs text-blue-700">{date}</Text>
          <Text className="text-xs text-blue-600">{place}</Text>
        </GlassView>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress}>
      <View className="mr-3 w-60 rounded-xl bg-blue-50/90 p-4 shadow-sm">
        <Text className="text-sm font-semibold text-blue-900">{title}</Text>
        <Text className="mt-1 text-xs text-blue-600">{date}</Text>
        <Text className="text-xs text-blue-500">{place}</Text>
      </View>
    </Pressable>
  );
}

// 기록 히스토리 카드
function RecordHistoryCard({
  title,
  date,
  record,
  course,
}: {
  title: string;
  date: string;
  record: string;
  course: string;
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-200/50 py-4">
      <View className="flex-1">
        <Text className="text-sm font-medium text-gray-900">{title}</Text>
        <Text className="text-xs text-gray-500">{date}</Text>
      </View>
      <View className="items-end">
        <Text className="text-sm font-bold text-blue-600">{record}</Text>
        <Text className="text-xs text-gray-400">{course}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // API 호출 (에러 시 mock 데이터 사용)
  const { data, refetch, isLoading, isError } = useGetHomeInfos();

  // 에러 시 mock 데이터 사용
  const homeData = isError || !data ? mockHomeData : data;

  // 대회 상세 페이지로 이동
  const handleRacePress = (raceId: number) => {
    router.push(`/race/${raceId}` as any);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Liquid Glass가 있으면 배경 이미지 사용
  if (hasLiquidGlass) {
    return (
      <View className="flex-1">
        <SafeAreaView className="flex-1" edges={['left', 'right']}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {/* 다가오는 대회 */}
            <View className="mt-8">
              <View className="flex-row items-center justify-between px-5">
                <Text className="text-lg font-semibold text-gray-900">다가오는 대회</Text>
                <Text className="text-sm text-blue-600">더보기</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
                contentContainerStyle={{ paddingHorizontal: 20 }}>
                {homeData.raceInfos?.map((race) => (
                  <UpcomingRaceCard
                    key={race.raceId}
                    raceId={race.raceId || 0}
                    title={race.raceTitle || ''}
                    date={race.raceDate || ''}
                    place={race.racePlace || ''}
                    onPress={() => race.raceId && handleRacePress(race.raceId)}
                  />
                ))}
                {(!homeData.raceInfos || homeData.raceInfos.length === 0) && (
                  <GlassView
                    style={{
                      width: 240,
                      borderRadius: 16,
                      padding: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text className="text-gray-500">예정된 대회가 없습니다</Text>
                  </GlassView>
                )}
              </ScrollView>
            </View>

            {/* 레이스 히스토리 */}
            <View className="mt-8 px-5">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">최근 기록</Text>
                <Text className="text-sm text-blue-600">전체보기</Text>
              </View>
              <GlassView style={{ borderRadius: 16, padding: 16, marginTop: 12 }}>
                {homeData.recordInfos?.map((record) => (
                  <RecordHistoryCard
                    key={record.raceId}
                    title={record.raceTitle || ''}
                    date={record.raceDate || ''}
                    record={record.record || ''}
                    course={record.course || ''}
                  />
                ))}
                {(!homeData.recordInfos || homeData.recordInfos.length === 0) && (
                  <View className="items-center justify-center py-8">
                    <Text className="text-gray-500">기록이 없습니다</Text>
                  </View>
                )}
              </GlassView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Liquid Glass 없을 때 기본 UI
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* 인사말 */}
        <View className="px-5 pt-4">
          <Text className="text-2xl font-bold text-gray-900">
            안녕하세요, {homeData.memberName}님 👋
          </Text>
        </View>

        {/* 개인 최고 기록 */}
        <View className="mt-6 px-5">
          <Text className="mb-3 text-lg font-semibold text-gray-900">개인 최고 기록</Text>
          <View className="flex-row gap-2">
            <PersonalBestCard
              title="풀코스"
              record={homeData.bestFullRecord?.bestRecord || null}
              label="42.195km"
            />
            <PersonalBestCard
              title="하프"
              record={homeData.bestHalfRecord?.bestRecord || null}
              label="21.0975km"
            />
            <PersonalBestCard
              title="10K"
              record={homeData.bestTenRecord?.bestRecord || null}
              label="10km"
            />
          </View>
        </View>

        {/* 다가오는 대회 */}
        <View className="mt-8">
          <View className="flex-row items-center justify-between px-5">
            <Text className="text-lg font-semibold text-gray-900">다가오는 대회</Text>
            <Text className="text-sm text-blue-600">더보기</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerStyle={{ paddingHorizontal: 20 }}>
            {homeData.raceInfos?.map((race) => (
              <UpcomingRaceCard
                key={race.raceId}
                raceId={race.raceId || 0}
                title={race.raceTitle || ''}
                date={race.raceDate || ''}
                place={race.racePlace || ''}
                onPress={() => race.raceId && handleRacePress(race.raceId)}
              />
            ))}
            {(!homeData.raceInfos || homeData.raceInfos.length === 0) && (
              <View className="w-60 items-center justify-center rounded-xl bg-gray-100 p-8">
                <Text className="text-gray-400">예정된 대회가 없습니다</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* 레이스 히스토리 */}
        <View className="mt-8 px-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">최근 기록</Text>
            <Text className="text-sm text-blue-600">전체보기</Text>
          </View>
          <View className="mt-3 rounded-xl bg-white p-4 shadow-sm">
            {homeData.recordInfos?.map((record) => (
              <RecordHistoryCard
                key={record.raceId}
                title={record.raceTitle || ''}
                date={record.raceDate || ''}
                record={record.record || ''}
                course={record.course || ''}
              />
            ))}
            {(!homeData.recordInfos || homeData.recordInfos.length === 0) && (
              <View className="items-center justify-center py-8">
                <Text className="text-gray-400">기록이 없습니다</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

