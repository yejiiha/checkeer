import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { List, Map, Plus } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

// BlurView - 선택적 import
let BlurView: any = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch {
  // expo-blur가 설치되지 않은 경우 무시
}

interface BroadcastFloatingTabProps {
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
  onAddPress?: () => void;
  colorScheme?: string;
  bottomInset?: number;
}

export function BroadcastFloatingTab({
  viewMode,
  onViewModeChange,
  onAddPress,
  colorScheme = 'light',
  bottomInset = 0,
}: BroadcastFloatingTabProps) {
  const hasLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const inactiveColor = '#8e8e93';
  const tabHeight = 48;
  const bottomPadding = Math.max(bottomInset, 16);

  // 탭 배경 렌더링
  const renderTabBackground = (borderRadius: number) => {
    if (hasLiquidGlass) {
      return <GlassView style={[StyleSheet.absoluteFill, { borderRadius }]} />;
    }
    if (Platform.OS === 'ios' && BlurView) {
      return (
        <View style={[StyleSheet.absoluteFill, { borderRadius, overflow: 'hidden' }]}>
          <View
            className={`absolute inset-0 ${colorScheme === 'dark' ? 'bg-[#1c1c1e]/70' : 'bg-white/70'}`}
          />
          <BlurView
            intensity={50}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        </View>
      );
    }
    return (
      <View
        className={`absolute inset-0 ${colorScheme === 'dark' ? 'bg-[#1c1c1e]/85' : 'bg-white/85'}`}
        style={{ borderRadius }}
      />
    );
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-3 shadow-lg"
      style={{ paddingBottom: bottomPadding }}>
      {/* 리스트/지도 토글 */}
      <View
        className="flex-row items-center"
        style={{ height: tabHeight, borderRadius: tabHeight / 2, overflow: 'hidden' }}>
        {renderTabBackground(tabHeight / 2)}

        {/* 리스트 버튼 */}
        <Pressable
          onPress={() => onViewModeChange('list')}
          className={cn(
            'flex-row items-center gap-2 px-5',
            viewMode === 'list' && 'rounded-full bg-gray-200/80 dark:bg-gray-600/80'
          )}
          style={{
            height: tabHeight - 8,
            marginVertical: 4,
            marginLeft: 4,
            borderRadius: (tabHeight - 8) / 2,
          }}>
          <List size={18} color={viewMode === 'list' ? iconColor : inactiveColor} />
          <Text
            className={cn(
              'text-sm font-medium',
              viewMode === 'list' ? 'text-gray-900 dark:text-white' : 'text-gray-400'
            )}>
            리스트
          </Text>
        </Pressable>

        {/* 지도 버튼 */}
        <Pressable
          onPress={() => onViewModeChange('map')}
          className={cn(
            'flex-row items-center gap-2 px-5',
            viewMode === 'map' && 'rounded-full bg-gray-200/80 dark:bg-gray-600/80'
          )}
          style={{
            height: tabHeight - 8,
            marginVertical: 4,
            marginRight: 4,
            borderRadius: (tabHeight - 8) / 2,
          }}>
          <Map size={18} color={viewMode === 'map' ? iconColor : inactiveColor} />
          <Text
            className={cn(
              'text-sm font-medium',
              viewMode === 'map' ? 'text-gray-900 dark:text-white' : 'text-gray-400'
            )}>
            지도
          </Text>
        </Pressable>
      </View>

      {/* + 버튼 */}
      <Pressable
        onPress={onAddPress}
        className="items-center justify-center"
        style={{
          width: tabHeight,
          height: tabHeight,
          borderRadius: tabHeight / 2,
          overflow: 'hidden',
        }}>
        {renderTabBackground(tabHeight / 2)}
        <Plus size={22} color={iconColor} />
      </Pressable>
    </View>
  );
}
