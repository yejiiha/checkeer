import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { RACE_STATUS_MAP, type RaceStatus } from '@/src/constants/race-status';
import React, { useMemo } from 'react';
import { View } from 'react-native';

interface StatusBadgeProps {
  status: RaceStatus | string;
  size?: 'sm' | 'lg';
  className?: string;
}

export const StatusBadge = React.memo<StatusBadgeProps>(({ status, size = 'sm', className }) => {
  const statusInfo = useMemo(() => {
    const info = RACE_STATUS_MAP[status as RaceStatus];
    if (!info) {
      // 기본값 반환 (알 수 없는 상태)
      return {
        name: status,
        color: '#6B7280', // gray-500
      };
    }
    return info;
  }, [status]);

  return (
    <View
      className={cn('items-center justify-center rounded-full px-2', className)}
      style={{ backgroundColor: statusInfo.color, paddingVertical: size === 'sm' ? 3 : 4 }}>
      <Text
        className={cn('font-semibold text-white', size === 'sm' ? 'text-xs' : 'text-sm')}
        style={{ includeFontPadding: false }}>
        {statusInfo.name}
      </Text>
    </View>
  );
});

StatusBadge.displayName = 'StatusBadge';
