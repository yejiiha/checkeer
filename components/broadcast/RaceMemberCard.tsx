import { StatusBadge } from '@/components/StatusBadge';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Image, Pressable, View } from 'react-native';

export interface RaceMember {
  raceId: number;
  raceMemberId: number;
  memberId: number;
  memberName: string;
  bib: string;
  status: string;
  course: string;
  thumbnailImgUrl: string;
  imgUrl: string;
  avgPace: string;
  expectedDistance: number;
  record: string;
  passingAlert: boolean;
  createdAt: string;
  targetRecord: string;
}

interface RaceMemberCardProps {
  member: RaceMember;
  isLast?: boolean;
  onPress?: (member: RaceMember) => void;
}

export function RaceMemberCard({ member, isLast = false, onPress }: RaceMemberCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(member)}
      className={cn(
        'flex-row items-center gap-3 py-3 active:bg-gray-50 dark:active:bg-gray-800/50',
        !isLast && 'border-b border-gray-100 dark:border-gray-800'
      )}>
      {/* 프로필 이미지 */}
      <Image
        source={{ uri: 'https://via.placeholder.com/40' }}
        className="h-10 w-10 rounded-full bg-gray-200"
      />

      {/* 멤버 정보 */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="font-semibold text-gray-900 dark:text-white">{member.memberName}</Text>
          <Text className="text-xs text-gray-400">#{member.bib}</Text>
        </View>
        <View className="mt-0.5 flex-row items-center gap-2">
          <Text className="text-xs text-gray-500">{member.expectedDistance}km</Text>
          <Text className="text-xs text-gray-500">{member.avgPace}</Text>
          <Text className="text-xs text-gray-500">{member.record}</Text>
        </View>
      </View>

      {/* 상태 */}
      {member.passingAlert ? (
        <View className="rounded-full bg-red-400 px-2 py-0.5">
          <Text className="text-sm text-white">진입중</Text>
        </View>
      ) : (
        <StatusBadge status={member.status} size="sm" className="px-2 py-0.5" />
      )}
    </Pressable>
  );
}
