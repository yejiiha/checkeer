import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';
import { RaceMemberCard, type RaceMember } from './RaceMemberCard';

export interface RaceReport {
  courseTitle: string;
  passStatus: string;
  hasNotification: boolean;
  isFirstNetTime: boolean;
  point: number;
  latitude: number | null;
  longitude: number | null;
  zoneId: string;
  raceMembers: RaceMember[];
  firstNetTime: boolean;
  isCheerZone: boolean;
}

interface CheckpointSectionProps {
  report: RaceReport;
  onMemberPress?: (member: RaceMember) => void;
}

export function CheckpointSection({ report, onMemberPress }: CheckpointSectionProps) {
  return (
    <View className="border-b border-gray-100 dark:border-gray-800">
      {/* 체크포인트 헤더 */}
      <View className="flex-row items-center justify-between bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
        <View className="flex-row items-center gap-2">
          <View
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              report.raceMembers.length > 0 ? 'bg-green-500' : 'bg-gray-300'
            )}
          />
          <Text className="text-sm font-semibold text-gray-900 dark:text-white">
            {report.courseTitle}
          </Text>
          <Text className="text-xs text-gray-500">({report.point}km)</Text>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400">{report.passStatus}</Text>
      </View>

      {/* 멤버 리스트 */}
      {report.raceMembers.length > 0 && (
        <View className="bg-white px-4 py-2 dark:bg-gray-900">
          {report.raceMembers.map((member, idx) => (
            <RaceMemberCard
              key={member.raceMemberId}
              member={member}
              isLast={idx === report.raceMembers.length - 1}
              onPress={onMemberPress}
            />
          ))}
        </View>
      )}
    </View>
  );
}
