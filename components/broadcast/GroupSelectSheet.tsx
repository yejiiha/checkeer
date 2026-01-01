import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { forwardRef, useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';

interface GroupInfo {
  broadCastKey: string;
  groupTitle: string;
  groupAdminName?: string;
}

interface GroupSelectSheetProps {
  groupList: GroupInfo[];
  selectedBroadcastKey?: string;
  onSelectGroup: (broadcastKey: string) => void;
}

export const GroupSelectSheet = forwardRef<BottomSheetModal, GroupSelectSheetProps>(
  ({ groupList, selectedBroadcastKey, onSelectGroup }, ref) => {
    const { colorScheme } = useColorScheme();
    const snapPoints = useMemo(() => ['50%', '80%'], []);

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
        <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          {/* 헤더 */}
          <View className="mb-4 flex-row items-center justify-between py-2">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">그룹 선택</Text>
          </View>

          {/* 그룹 목록 */}
          {groupList.map((group) => {
            const isSelected = group.broadCastKey === selectedBroadcastKey;
            return (
              <Pressable
                key={group.broadCastKey}
                onPress={() => onSelectGroup(group.broadCastKey)}
                className={cn(
                  'mb-2 flex-row items-center justify-between rounded-xl px-4 py-4',
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'active:bg-gray-100 dark:active:bg-gray-700'
                )}>
                <View>
                  <Text
                    className={cn(
                      'text-base font-semibold',
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    )}>
                    {group.groupTitle}
                  </Text>
                  {group.groupAdminName && (
                    <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      관리자: {group.groupAdminName}
                    </Text>
                  )}
                </View>
                {isSelected && <Check size={20} color="#3B82F6" />}
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

GroupSelectSheet.displayName = 'GroupSelectSheet';


