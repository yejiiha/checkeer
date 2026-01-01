import { StatusBadge } from '@/components/StatusBadge';
import { Text } from '@/components/ui/text';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { forwardRef, useCallback, useMemo } from 'react';
import { Image, View } from 'react-native';
import type { RaceMember } from './RaceMemberCard';

interface MemberDetailSheetProps {
  member: RaceMember | null;
}

export const MemberDetailSheet = forwardRef<BottomSheetModal, MemberDetailSheetProps>(
  ({ member }, ref) => {
    const { colorScheme } = useColorScheme();
    const snapPoints = useMemo(() => ['80%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === 'dark' ? '#6B7280' : '#D1D5DB',
          width: 40,
        }}>
        <BottomSheetView style={{ flex: 1 }}>
          {member && (
            <View className="flex-1">
              {/* 전신 사진 */}
              <View className="items-center px-4 pb-4">
                <View
                  className="items-center justify-center overflow-hidden rounded-2xl"
                  style={{ width: '100%', aspectRatio: 3 / 4 }}>
                  <Image
                    source={{
                      uri: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
                    }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* 프로필 정보 */}
              <View className="flex-row items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                {/* 이름 및 정보 */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                      {member.memberName}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">#{member.bib}</Text>
                  </View>
                  <View className="mt-0.5 flex-row items-center gap-2">
                    <View className="rounded-md bg-blue-500 px-2 py-0.5">
                      <Text className="text-xs font-semibold text-white">{member.course}</Text>
                    </View>
                    <StatusBadge status={member.status} size="sm" />
                  </View>
                </View>
              </View>

              {/* 현재 기록 */}
              <View className="px-5 py-5">
                <Text className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  현재 기록
                </Text>

                <View className="flex-row">
                  {/* 거리 */}
                  <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                      {member.expectedDistance?.toFixed(1) || '0.0'}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-400">km</Text>
                  </View>

                  {/* 구분선 */}
                  <View className="w-px bg-gray-200 dark:bg-gray-700" />

                  {/* 페이스 */}
                  <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                      {member.avgPace || '--:--'}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-400">min/km</Text>
                  </View>

                  {/* 구분선 */}
                  <View className="w-px bg-gray-200 dark:bg-gray-700" />

                  {/* 경과 시간 */}
                  <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                      {member.record || '--:--:--'}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-400">경과 시간</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

MemberDetailSheet.displayName = 'MemberDetailSheet';
