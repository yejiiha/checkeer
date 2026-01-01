import { CourseBadge } from '@/components/CourseBadge';
import { GlassCard, GlassSelectCard } from '@/components/ui/GlassCard';
import { Text } from '@/components/ui/text';
import { mockRaceDetail } from '@/src/lib/mock-data';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Calendar,
  ChevronRight,
  ClipboardCopy,
  ExternalLink,
  MapPin,
  Megaphone,
  PersonStanding,
  Share2,
  Users,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import {
  Linking,
  Pressable,
  Image as RNImage,
  ScrollView,
  Share,
  useWindowDimensions,
  View,
} from 'react-native';

type UserRole = 'none' | 'runner' | 'supporter';

export default function RaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const raceId = Number(id);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // TODO: 실제 API 호출로 변경
  const data = mockRaceDetail;
  const { raceInfo, raceMemberInfo, groupInfo } = data;

  // 상태 관리
  const [userRole, setUserRole] = useState<UserRole>(raceMemberInfo ? 'runner' : 'none');
  const [codeCopied, setCodeCopied] = useState(false);

  // 이미지 높이 계산 (13:7 비율)
  const imageHeight = (width * 7) / 13;

  // 역할 선택 핸들러
  const handleSelectRole = useCallback((role: UserRole) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUserRole(role);
  }, []);

  // 고유 코드 복사
  const handleCopyCode = useCallback(async () => {
    // TODO: 실제 Clipboard API 사용
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }, []);

  // 코드 공유
  const handleShareCode = useCallback(async () => {
    try {
      await Share.share({
        message: `A7K2로 저를 찾아주세요! ${raceInfo.raceTitle}에서 응원해주세요 🏃‍♂️`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  }, [raceInfo.raceTitle]);

  const iconColor = isDark ? '#9CA3AF' : '#6B7280';

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
        <RNImage
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
        {/* 그라데이션 오버레이 */}
        <LinearGradient
          colors={['transparent', isDark ? '#111827' : '#F9FAFB']}
          style={{
            position: 'absolute',
            top: imageHeight - 80,
            left: 0,
            right: 0,
            height: 80,
          }}
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
                <Calendar size={20} color={iconColor} />
                <Text className="text-gray-700 dark:text-gray-300">
                  {raceInfo.raceDate} {raceInfo.raceTime}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <MapPin size={20} color={iconColor} />
                <Text className="text-gray-700 dark:text-gray-300">{raceInfo.racePlace}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <ExternalLink size={20} color={iconColor} />
                <Pressable onPress={() => Linking.openURL(raceInfo.pageUrl)}>
                  <Text className="text-blue-500 underline">{raceInfo.pageUrl}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="bg-gray-50 px-5 dark:bg-gray-900">
            {/* 역할 선택 (첫 방문 시) */}
            {userRole === 'none' && (
              <GlassCard containerClassName="mt-6" className="p-5">
                <Text className="text-center text-lg font-semibold text-gray-900 dark:text-white">
                  나의 참여 방식을 선택하세요
                </Text>
                <Text className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                  언제든지 변경할 수 있어요
                </Text>

                <View className="mt-5 flex-row gap-3">
                  {/* 주자 선택 */}
                  <Pressable onPress={() => handleSelectRole('runner')} className="flex-1">
                    <GlassSelectCard className="items-center p-5">
                      <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-blue-500/20">
                        <PersonStanding size={28} color="#3B82F6" />
                      </View>
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        🏃 주자
                      </Text>
                      <Text className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                        대회에 참가해요
                      </Text>
                    </GlassSelectCard>
                  </Pressable>

                  {/* 응원자 선택 */}
                  <Pressable onPress={() => handleSelectRole('supporter')} className="flex-1">
                    <GlassSelectCard className="items-center p-5">
                      <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-orange-500/20">
                        <Megaphone size={28} color="#F97316" />
                      </View>
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        📣 응원자
                      </Text>
                      <Text className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                        응원하러 왔어요
                      </Text>
                    </GlassSelectCard>
                  </Pressable>
                </View>
              </GlassCard>
            )}

            {/* 주자 뷰 - 배번 미등록 상태 */}
            {userRole === 'runner' && !raceMemberInfo && (
              <GlassCard containerClassName="mt-6" className="p-5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    🎽 내 참가 정보
                  </Text>
                </View>

                <View className="mt-4 items-center py-4">
                  <Text className="text-base text-gray-600 dark:text-gray-300">
                    아직 배번을 등록하지 않았어요
                  </Text>
                  <Text className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    배번을 등록하면:{'\n'}• 실시간 기록을 확인할 수 있어요{'\n'}• 응원단에게 위치를
                    공유해요{'\n'}• 고유 코드를 받을 수 있어요
                  </Text>
                </View>

                <Pressable
                  onPress={() => router.push(`/race/${raceId}/register-bib` as any)}
                  className="mt-4 items-center rounded-xl bg-blue-500 py-4 active:bg-blue-600">
                  <Text className="text-base font-semibold text-white">🎽 배번 등록하기</Text>
                </Pressable>

                {/* 역할 전환 링크 */}
                <View className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <Pressable
                    onPress={() => handleSelectRole('supporter')}
                    className="flex-row items-center justify-center gap-2">
                    <Megaphone size={16} color="#F97316" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      대회에 뛰지 않고 응원만 하시나요?
                    </Text>
                    <Text className="text-sm font-medium text-orange-500">전환하기 →</Text>
                  </Pressable>
                </View>
              </GlassCard>
            )}

            {/* 주자 뷰 - 배번 등록 완료 상태 */}
            {userRole === 'runner' && raceMemberInfo && (
              <>
                <GlassCard containerClassName="mt-6" className="p-5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                      🎽 내 참가 정보
                    </Text>
                    <Pressable
                      onPress={() => router.push(`/race/${raceId}/register-bib?edit=true` as any)}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600">
                      <Text className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        수정
                      </Text>
                    </Pressable>
                  </View>

                  {/* 착장 사진 + 정보 */}
                  <View className="mt-4 flex-row gap-4">
                    {/* 착장 사진 */}
                    {raceMemberInfo.imgUrl && (
                      <View className="overflow-hidden rounded-xl">
                        <Image
                          source={{ uri: raceMemberInfo.imgUrl }}
                          style={{ width: 100, height: 133 }}
                          contentFit="cover"
                        />
                      </View>
                    )}

                    {/* 정보 */}
                    <View className="flex-1 gap-2.5">
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

                  {/* 고유 코드 섹션 */}
                  <View className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      📋 내 고유 코드
                    </Text>
                    <Pressable
                      onPress={handleCopyCode}
                      className="mt-3 flex-row items-center justify-between rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-5 py-4 dark:from-blue-500/20 dark:to-purple-500/20">
                      <Text className="text-3xl font-bold tracking-widest text-blue-600 dark:text-blue-400">
                        A7K2
                      </Text>
                      <View className="flex-row">
                        <Pressable
                          onPress={handleCopyCode}
                          className="h-10 w-10 items-center justify-center rounded-full bg-white/50 active:bg-white/70 dark:bg-gray-800/50 dark:active:bg-gray-800/70">
                          <ClipboardCopy
                            size={18}
                            color={codeCopied ? '#10B981' : isDark ? '#9CA3AF' : '#6B7280'}
                          />
                        </Pressable>
                        <Pressable
                          onPress={handleShareCode}
                          className="h-10 w-10 items-center justify-center rounded-full bg-white/50 active:bg-white/70 dark:bg-gray-800/50 dark:active:bg-gray-800/70">
                          <Share2 size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
                        </Pressable>
                      </View>
                    </Pressable>
                    <Text className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                      {codeCopied ? '✅ 복사되었습니다!' : '이 코드를 응원단에게 공유하세요!'}
                    </Text>
                  </View>

                  {/* 역할 전환 링크 */}
                  <View className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <Pressable
                      onPress={() => handleSelectRole('supporter')}
                      className="flex-row items-center justify-center gap-2">
                      <Megaphone size={16} color="#F97316" />
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        대회에 뛰지 않고 응원만 하시나요?
                      </Text>
                      <Text className="text-sm font-medium text-orange-500">전환하기 →</Text>
                    </Pressable>
                  </View>
                </GlassCard>

                {/* 내 기록 보기 */}
                <GlassCard containerClassName="mt-4" className="p-4">
                  <Pressable
                    onPress={() => {
                      if (groupInfo && groupInfo.length > 0) {
                        router.push(`/broadcast/${groupInfo[0].broadCastKey}` as any);
                      }
                    }}
                    className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                        <MapPin size={20} color="#3B82F6" />
                      </View>
                      <Text className="text-base font-medium text-gray-900 dark:text-white">
                        📍 내 실시간 현황 보기
                      </Text>
                    </View>
                    <ChevronRight size={20} color={iconColor} />
                  </Pressable>
                </GlassCard>
              </>
            )}

            {/* 응원자 뷰 */}
            {userRole === 'supporter' && (
              <>
                <GlassCard containerClassName="mt-6" className="p-5">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    📣 응원 현황
                  </Text>
                  <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    실시간으로 주자들을 응원하세요!
                  </Text>

                  {/* 역할 전환 링크 */}
                  <View className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <Pressable
                      onPress={() => handleSelectRole('runner')}
                      className="flex-row items-center justify-center gap-2">
                      <PersonStanding size={16} color="#3B82F6" />
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        직접 대회에 참가하시나요?
                      </Text>
                      <Text className="text-sm font-medium text-blue-500">전환하기 →</Text>
                    </Pressable>
                  </View>
                </GlassCard>

                {/* 내 응원 그룹 */}
                <GlassCard containerClassName="mt-4" className="p-5">
                  <View className="flex-row items-center gap-2">
                    <Users size={20} color={iconColor} />
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                      내 응원 그룹
                    </Text>
                  </View>

                  <View className="mt-4 gap-3">
                    {/* 공식 그룹 */}
                    {groupInfo &&
                      groupInfo.map((group) => (
                        <Pressable
                          key={group.broadCastKey}
                          onPress={() => router.push(`/broadcast/${group.broadCastKey}` as any)}
                          className="flex-row items-center justify-between rounded-xl bg-gray-100 p-4 active:bg-gray-200 dark:bg-gray-800 dark:active:bg-gray-700">
                          <View className="flex-1">
                            <View className="flex-row items-center gap-2">
                              <Text className="font-medium text-gray-900 dark:text-white">
                                🏢 {group.groupTitle}
                              </Text>
                              <View className="rounded-md bg-blue-100 px-2 py-0.5 dark:bg-blue-900">
                                <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                  공식
                                </Text>
                              </View>
                            </View>
                            <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              관리자: {group.groupAdminName}
                            </Text>
                          </View>
                          <ChevronRight size={20} color={iconColor} />
                        </Pressable>
                      ))}

                    {/* 개별 그룹 예시 (TODO: 실제 데이터로 교체) */}
                    {/* <Pressable
                      className="flex-row items-center justify-between rounded-xl bg-gray-100 p-4 active:bg-gray-200 dark:bg-gray-800 dark:active:bg-gray-700">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text className="font-medium text-gray-900 dark:text-white">
                            💙 우리 가족 응원단
                          </Text>
                          <View className="rounded-md bg-orange-100 px-2 py-0.5 dark:bg-orange-900">
                            <Text className="text-xs font-medium text-orange-700 dark:text-orange-300">
                              개별
                            </Text>
                          </View>
                        </View>
                        <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          3명 응원 중
                        </Text>
                      </View>
                      <ChevronRight size={20} color={iconColor} />
                    </Pressable> */}

                    {/* 새 응원 그룹 만들기 */}
                    <Pressable
                      onPress={() => router.push(`/race/${raceId}/create-cheer-group` as any)}
                      className="flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-4 active:border-gray-400 dark:border-gray-600 dark:active:border-gray-500">
                      <Text className="text-base font-medium text-gray-500 dark:text-gray-400">
                        ＋ 새 응원 그룹 만들기
                      </Text>
                    </Pressable>
                  </View>
                </GlassCard>

                {/* 개별 주자 검색 */}
                <View className="mt-6 items-center">
                  <View className="mb-4 flex-row items-center">
                    <View className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                    <Text className="px-4 text-sm text-gray-500 dark:text-gray-400">또는</Text>
                    <View className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                  </View>
                </View>

                <GlassCard className="p-5">
                  <Text className="text-base font-semibold text-gray-900 dark:text-white">
                    🔍 개별 주자 검색
                  </Text>
                  <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    그룹 없이 특정 주자를 바로 찾아보세요
                  </Text>
                  <Pressable
                    onPress={() => router.push(`/race/${raceId}/search-runner` as any)}
                    className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 active:bg-gray-200 dark:bg-gray-800 dark:active:bg-gray-700">
                    <Text className="font-medium text-gray-700 dark:text-gray-300">
                      주자 검색하기 →
                    </Text>
                  </Pressable>
                </GlassCard>
              </>
            )}

            {/* 참여 그룹 (주자용 - 역할 선택 완료 후) */}
            {userRole === 'runner' && groupInfo && groupInfo.length > 0 && (
              <GlassCard containerClassName="mt-4" className="p-5">
                <View className="flex-row items-center gap-2">
                  <Users size={20} color={iconColor} />
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    참여 그룹
                  </Text>
                </View>
                <View className="mt-4 gap-3">
                  {groupInfo.map((group) => (
                    <Pressable
                      key={group.broadCastKey}
                      onPress={() => router.push(`/broadcast/${group.broadCastKey}` as any)}
                      className="flex-row items-center justify-between rounded-lg bg-gray-100 p-3 active:bg-gray-200 dark:bg-gray-800 dark:active:bg-gray-700">
                      <Text className="font-medium text-gray-900 dark:text-white">
                        {group.groupTitle}
                      </Text>
                      <ChevronRight size={20} color={iconColor} />
                    </Pressable>
                  ))}
                </View>
              </GlassCard>
            )}
          </View>

          {/* 하단 여백 */}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </>
  );
}
