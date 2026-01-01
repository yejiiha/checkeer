import {
  BroadcastFloatingTab,
  BroadcastMapView,
  CheckpointSection,
  GroupSelectSheet,
  MemberDetailSheet,
  type RaceMember,
} from '@/components/broadcast';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { mockBroadcastInfo, mockBroadcastLive, mockRaceDetail } from '@/src/lib/mock-data';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, ChevronLeft, RefreshCw, Share2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, Share, View } from 'react-native';

export default function BroadcastScreen() {
  const { broadcastKey } = useLocalSearchParams<{ broadcastKey: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const memberDetailSheetRef = useRef<BottomSheetModal>(null);

  // 상태
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('HALF');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMember, setSelectedMember] = useState<RaceMember | null>(null);

  // Mock 데이터
  const [broadcastInfo] = useState(mockBroadcastInfo);
  const [liveData, setLiveData] = useState(mockBroadcastLive);
  const groupList = mockRaceDetail.groupInfo;

  // Refresh 애니메이션
  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // 데이터 새로고침
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLiveData(mockBroadcastLive);

    spinAnim.stopAnimation();
    spinAnim.setValue(0);
    setIsLoading(false);
  }, [spinAnim]);

  // 공유하기
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${broadcastInfo.raceGroupInfo.groupTitle} - ${broadcastInfo.raceGroupInfo.raceTitle} 실시간 현황`,
        url: `https://checkmy.run/broadcast/${broadcastKey}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  }, [broadcastKey, broadcastInfo]);

  // 코스 변경
  const handleCourseChange = useCallback(
    async (course: string) => {
      setSelectedCourse(course);
      setIsLoading(true);

      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();

      await new Promise((resolve) => setTimeout(resolve, 500));
      setLiveData(mockBroadcastLive);

      spinAnim.stopAnimation();
      spinAnim.setValue(0);
      setIsLoading(false);
    },
    [spinAnim]
  );

  // Modal 열기
  const openGroupModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // 주자 선택 핸들러 (RaceMemberCard에서 호출)
  const handleMemberPress = useCallback((member: RaceMember) => {
    setSelectedMember(member);
    memberDetailSheetRef.current?.present();
  }, []);

  // 주자 선택 핸들러 (BroadcastMapView에서 호출 - raceMemberId로 찾기)
  const handleMapMemberPress = useCallback(
    (raceMemberId: number) => {
      // 모든 raceReports에서 해당 멤버 찾기
      const member = liveData.raceReports
        .flatMap((report) => report.raceMembers)
        .find((m) => m.raceMemberId === raceMemberId);

      if (member) {
        setSelectedMember(member);
        memberDetailSheetRef.current?.present();
      }
    },
    [liveData.raceReports]
  );

  // 그룹 선택 핸들러
  const handleSelectGroup = useCallback(
    (broadcastKeyToSelect: string) => {
      bottomSheetModalRef.current?.dismiss();
      if (broadcastKeyToSelect !== broadcastKey) {
        setTimeout(() => {
          router.replace(`/broadcast/${broadcastKeyToSelect}` as any);
        }, 300);
      }
    },
    [broadcastKey, router]
  );

  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerBackVisible: false,
          headerLeft: () => (
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="mr-2 h-9 w-9 items-center justify-center rounded-full">
                <ChevronLeft size={26} color={iconColor} />
              </Pressable>
              <Pressable
                onPress={openGroupModal}
                className="flex-row items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-700">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {broadcastInfo.raceGroupInfo.groupTitle}
                </Text>
                <ChevronDown size={16} color={iconColor} />
              </Pressable>
            </View>
          ),
          headerRight: () => (
            <View className="flex-row items-center gap-1">
              <Pressable
                onPress={handleRefresh}
                disabled={isLoading}
                className="h-9 w-9 items-center justify-center rounded-full">
                <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
                  <RefreshCw size={20} color={isLoading ? '#3B82F6' : iconColor} />
                </Animated.View>
              </Pressable>
              <Pressable
                onPress={handleShare}
                className="h-9 w-9 items-center justify-center rounded-full">
                <Share2 size={20} color={iconColor} />
              </Pressable>
            </View>
          ),
        }}
      />

      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* 상단: 대회 이름 + 코스 필터 (같은 행) */}
        <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          {/* 대회 이름 */}
          <Text className="mr-3 flex-1 text-base font-bold text-gray-900 dark:text-white">
            {broadcastInfo.raceGroupInfo.raceTitle}
          </Text>
          {/* 코스 선택 (가로 스크롤) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            style={{ flexShrink: 0, maxWidth: '35%' }}>
            {broadcastInfo.raceGroupInfo.raceCourse.map((course) => (
              <Pressable
                key={course}
                onPress={() => handleCourseChange(course)}
                className={cn(
                  'rounded-md px-3 py-1.5',
                  selectedCourse === course
                    ? 'bg-blue-500'
                    : 'bg-gray-100 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600'
                )}>
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    selectedCourse === course ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                  )}>
                  {course}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* 리스트 뷰 */}
        {viewMode === 'list' && (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}>
            {liveData.raceReports.map((report) => (
              <CheckpointSection
                key={report.zoneId}
                report={report}
                onMemberPress={handleMemberPress}
              />
            ))}
          </ScrollView>
        )}

        {/* 지도 뷰 */}
        {viewMode === 'map' && (
          <BroadcastMapView
            mapUrl={broadcastInfo.mapUrl}
            raceMembers={liveData.raceReports
              .flatMap((report) => report.raceMembers)
              .filter((member) => member.status !== 'DNS') // DNS만 제외
              .map((member) => ({
                raceMemberId: member.raceMemberId,
                memberName: member.memberName,
                thumbnailImgUrl: member.thumbnailImgUrl,
                expectedDistance: member.expectedDistance,
                status: member.status,
                avgPace: member.avgPace,
              }))}
            onMemberPress={handleMapMemberPress}
          />
        )}

        {/* 하단 플로팅 탭 */}
        <BroadcastFloatingTab
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddPress={() => console.log('Add member')}
          colorScheme={colorScheme}
          bottomInset={Platform.OS === 'ios' ? 34 : 16}
        />
      </View>

      {/* 그룹 선택 Modal */}
      <GroupSelectSheet
        ref={bottomSheetModalRef}
        groupList={groupList}
        selectedBroadcastKey={broadcastKey}
        onSelectGroup={handleSelectGroup}
      />

      {/* 주자 상세 정보 Modal */}
      <MemberDetailSheet ref={memberDetailSheetRef} member={selectedMember} />
    </>
  );
}
