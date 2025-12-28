import { CourseBadge } from '@/components/CourseBadge';
import { Text } from '@/components/ui/text';
import { mockRaceDetail } from '@/src/lib/mock-data';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, ChevronRight, ExternalLink, MapPin, Users } from 'lucide-react-native';
import { Image, Linking, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

export default function RaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const raceId = Number(id);
  const router = useRouter();
  const { width } = useWindowDimensions();

  // TODO: 실제 API 호출로 변경
  const data = mockRaceDetail;
  const { raceInfo, raceMemberInfo, groupInfo } = data;

  // 이미지 높이 계산 (13:7 비율)
  const imageHeight = (width * 7) / 13;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerBackButtonDisplayMode: 'minimal',
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerShadowVisible: false,
        }}
      />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* 배경 이미지 (고정) */}
        <Image
          source={{ uri: raceInfo.raceImgUrl }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: width,
            height: imageHeight,
            backgroundColor: '#e5e7eb',
          }}
          resizeMode="cover"
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}>
          {/* 이미지 영역만큼 빈 공간 */}
          <View style={{ height: imageHeight - 24 }} />

          {/* 대회 정보 (이미지 위로 덮이는 콘텐츠) */}
          <View className="rounded-t-3xl bg-gray-50 px-5 pt-6 dark:bg-gray-900">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {raceInfo.raceTitle}
            </Text>

            {/* 코스 태그 */}
            <View className="mt-3 flex-row gap-2">
              {raceInfo.raceCourses.map((course) => (
                <CourseBadge key={course} course={course} size="sm" />
              ))}
            </View>

            {/* 상세 정보 */}
            <View className="mt-6 gap-3">
              <View className="flex-row items-center gap-3">
                <Calendar size={20} color="#6B7280" />
                <Text className="text-gray-700 dark:text-gray-300">
                  {raceInfo.raceDate} {raceInfo.raceTime}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <MapPin size={20} color="#6B7280" />
                <Text className="text-gray-700 dark:text-gray-300">{raceInfo.racePlace}</Text>
              </View>

              <View className="flex-row items-center gap-3">
                <ExternalLink size={20} color="#6B7280" />
                <Pressable onPress={() => Linking.openURL(raceInfo.pageUrl)}>
                  <Text className="text-blue-500 underline">{raceInfo.pageUrl}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="bg-gray-50">
            {/* 내 참가 정보 */}
            {raceMemberInfo && (
              <View className="mx-5 mt-6 rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  내 참가 정보
                </Text>
                <View className="mt-4 gap-3">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500 dark:text-gray-400">배번</Text>
                    <Text className="font-medium text-gray-900 dark:text-white">
                      {raceMemberInfo.bib}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500 dark:text-gray-400">코스</Text>
                    <Text className="font-medium text-gray-900 dark:text-white">
                      {raceMemberInfo.course}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500 dark:text-gray-400">목표 기록</Text>
                    <Text className="font-medium text-gray-900 dark:text-white">
                      {raceMemberInfo.targetRecord}
                    </Text>
                  </View>
                  {raceMemberInfo.record && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500 dark:text-gray-400">완주 기록</Text>
                      <Text className="font-bold text-blue-600">{raceMemberInfo.record}</Text>
                    </View>
                  )}
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500 dark:text-gray-400">상태</Text>
                    <View className="rounded-full bg-green-100 px-2 py-0.5 dark:bg-green-900">
                      <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                        {raceMemberInfo.status === 'FINISH' ? '완주' : raceMemberInfo.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* 참여 그룹 */}
            {groupInfo && groupInfo.length > 0 && (
              <View className="mx-5 mt-6 rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                <View className="flex-row items-center gap-2">
                  <Users size={20} color="#6B7280" />
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    참여 그룹
                  </Text>
                </View>
                <View className="mt-4 gap-3">
                  {groupInfo.map((group) => (
                    <Pressable
                      key={group.broadCastKey}
                      onPress={() => router.push(`/broadcast/${group.broadCastKey}` as any)}
                      className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                      <Text className="font-medium text-gray-900 dark:text-white">
                        {group.groupTitle}
                      </Text>
                      <ChevronRight size={20} color="#6B7280" />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* 하단 여백 */}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </>
  );
}
