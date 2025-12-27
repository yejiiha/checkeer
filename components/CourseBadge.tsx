import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { COURSE_MAP, type CourseKey } from '@/src/constants/course';
import { cn } from '@/lib/utils';

interface CourseBadgeProps {
  course: CourseKey | string;
  size?: 'sm' | 'lg';
  className?: string;
}

export const CourseBadge = React.memo<CourseBadgeProps>(({ course, size = 'sm', className }) => {
  const courseInfo = useMemo(() => {
    const info = COURSE_MAP[course as CourseKey];
    if (!info) {
      // 기본값 반환 (알 수 없는 코스)
      return {
        name: course,
        color: '#6B7280', // 회색
        distance: 0,
      };
    }
    return info;
  }, [course]);

  return (
    <View
      className={cn('items-center justify-center rounded-full px-2', className)}
      style={{ backgroundColor: courseInfo.color, paddingVertical: size === 'sm' ? 3 : 4 }}>
      <Text
        className={cn('font-semibold text-white', size === 'sm' ? 'text-xs' : 'text-sm')}
        style={{ includeFontPadding: false }}>
        {courseInfo.name}
      </Text>
    </View>
  );
});

CourseBadge.displayName = 'CourseBadge';
