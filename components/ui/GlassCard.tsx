import { cn } from '@/lib/utils';
import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import { Platform, View, type ViewProps } from 'react-native';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  /** 내부 콘텐츠에 적용될 className (padding 등) */
  className?: string;
  /** 외부 컨테이너에 적용될 className (margin 등) */
  containerClassName?: string;
  children: React.ReactNode;
}

/**
 * Liquid Glass 효과를 적용한 카드 컴포넌트
 * iOS에서는 BlurView를 사용하고, Android/Web에서는 반투명 배경을 사용합니다.
 *
 * @param className - 내부 콘텐츠 영역에 적용 (padding, gap 등)
 * @param containerClassName - 외부 컨테이너에 적용 (margin, width 등)
 */
export function GlassCard({
  intensity = 60,
  className,
  containerClassName,
  children,
  style,
  ...props
}: GlassCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // iOS에서만 BlurView 사용 (Android에서는 성능 이슈)
  if (Platform.OS === 'ios') {
    return (
      <View
        className={cn('overflow-hidden rounded-2xl', containerClassName)}
        style={style}
        {...props}>
        <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'}>
          <View
            className={cn(
              'rounded-2xl border',
              isDark ? 'border-white/10 bg-gray-900/70' : 'border-black/5 bg-white/70',
              className
            )}>
            {children}
          </View>
        </BlurView>
      </View>
    );
  }

  // Android/Web fallback
  return (
    <View
      className={cn(
        'overflow-hidden rounded-2xl border shadow-lg',
        isDark ? 'border-white/10 bg-gray-800/90' : 'border-black/5 bg-white/90',
        containerClassName
      )}
      style={style}
      {...props}>
      <View className={className}>{children}</View>
    </View>
  );
}

/**
 * Glass 효과가 적용된 선택 카드 (주자/응원자 선택용)
 */
interface GlassSelectCardProps extends ViewProps {
  selected?: boolean;
  /** 내부 콘텐츠에 적용될 className (padding 등) */
  className?: string;
  /** 외부 컨테이너에 적용될 className (margin 등) */
  containerClassName?: string;
  children: React.ReactNode;
}

export function GlassSelectCard({
  selected = false,
  className,
  containerClassName,
  children,
  style,
  ...props
}: GlassSelectCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (Platform.OS === 'ios') {
    return (
      <View
        className={cn('overflow-hidden rounded-2xl', containerClassName)}
        style={style}
        {...props}>
        <BlurView intensity={selected ? 80 : 40} tint={isDark ? 'dark' : 'light'}>
          <View
            className={cn(
              'flex-1 rounded-2xl',
              selected
                ? 'border-2 border-blue-500 bg-blue-500/20'
                : isDark
                  ? 'border border-white/10 bg-gray-900/50'
                  : 'border border-black/5 bg-white/50',
              className
            )}>
            {children}
          </View>
        </BlurView>
      </View>
    );
  }

  // Android/Web fallback
  return (
    <View
      className={cn(
        'overflow-hidden rounded-2xl shadow-md',
        selected
          ? 'border-2 border-blue-500 bg-blue-500/10 shadow-blue-500/20'
          : isDark
            ? 'border border-white/10 bg-gray-800/70'
            : 'border border-black/5 bg-white/70',
        containerClassName
      )}
      style={style}
      {...props}>
      <View className={className}>{children}</View>
    </View>
  );
}
