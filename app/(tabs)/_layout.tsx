import { Tabs } from 'expo-router';
import { Home, User, Trophy, Calendar } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Platform, StyleSheet, Pressable, View, LayoutChangeEvent } from 'react-native';
import { Text } from '@/components/ui/text';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// 햅틱 - 선택적 import
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch {
  // expo-haptics가 설치되지 않은 경우 무시
}

// BlurView - 선택적 import
let BlurView: any = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch {
  // expo-blur가 설치되지 않은 경우 무시
}

// 탭 아이콘 매핑
const TAB_ICONS: Record<string, typeof Home> = {
  home: Home,
  races: Calendar,
  records: Trophy,
  my: User,
};

const TAB_LABELS: Record<string, string> = {
  home: '홈',
  races: '대회',
  records: '기록',
  my: '마이',
};

// 탭 레이아웃 정보 타입
type TabLayout = {
  x: number;
  width: number;
};

// 스프링 설정
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 180,
  mass: 0.8,
};

const FAST_SPRING = {
  damping: 20,
  stiffness: 300,
  mass: 0.5,
};

// 커스텀 플로팅 탭바 컴포넌트
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colorScheme } = useColorScheme();
  const hasLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
  const insets = useSafeAreaInsets();

  const inactiveColor = '#8e8e93';

  const tabBarHeight = 60;
  const bottomPadding = Math.max(insets.bottom, 16);

  // 각 탭의 레이아웃 정보 저장
  const [tabLayouts, setTabLayouts] = useState<TabLayout[]>([]);
  const [layoutsReady, setLayoutsReady] = useState(false);

  // 현재 press 중인 탭 인덱스 (-1이면 없음)
  const [pressedIndex, setPressedIndex] = useState(-1);

  // 마지막으로 press한 탭 인덱스 (pressOut 시 사용)
  const lastPressedIndexRef = useRef(state.index);

  // 인디케이터 애니메이션 값
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorScale = useSharedValue(1);
  const indicatorHeight = useSharedValue(48); // 기본 높이: 탭바 60px - 상하 여백 12px
  const indicatorTop = useSharedValue(6); // 기본 top: 6px
  const indicatorRadius = useSharedValue(24); // 기본: 완전히 둥근 (높이/2)

  // 햅틱 트리거
  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web' && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  // 탭 레이아웃 측정
  const handleTabLayout = useCallback(
    (index: number, event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      setTabLayouts((prev) => {
        const newLayouts = [...prev];
        newLayouts[index] = { x, width };

        // 모든 탭의 레이아웃이 측정되었는지 확인
        if (newLayouts.filter(Boolean).length === state.routes.length) {
          setLayoutsReady(true);
        }
        return newLayouts;
      });
    },
    [state.routes.length]
  );

  // 인디케이터를 특정 탭으로 이동
  const moveIndicatorTo = useCallback(
    (index: number, isPress: boolean = false) => {
      if (layoutsReady && tabLayouts[index]) {
        const layout = tabLayouts[index];
        indicatorX.value = withSpring(layout.x, SPRING_CONFIG);
        indicatorWidth.value = withSpring(layout.width, SPRING_CONFIG);
        indicatorScale.value = withSpring(isPress ? 1.1 : 1, FAST_SPRING);
        // press 시 높이 64px, 기본 48px
        indicatorHeight.value = withSpring(isPress ? 64 : 48, FAST_SPRING);
        // 중앙 정렬: press 시 top = (60-64)/2 = -2, 기본 top = (60-48)/2 = 6
        indicatorTop.value = withSpring(isPress ? -2 : 6, FAST_SPRING);
        // 완전히 둥글게: 높이의 절반 (press: 64/2=32, 기본: 48/2=24)
        indicatorRadius.value = withSpring(isPress ? 32 : 24, FAST_SPRING);
      }
    },
    [layoutsReady, tabLayouts]
  );

  // Press 상태 변경 시 인디케이터 이동
  useEffect(() => {
    if (pressedIndex >= 0) {
      // press 상태: 해당 탭으로 이동 (높이 64px)
      moveIndicatorTo(pressedIndex, true);
    } else {
      // pressOut 시: 마지막으로 press한 탭으로 이동 (state.index가 아직 업데이트 안 됐을 수 있음)
      moveIndicatorTo(lastPressedIndexRef.current, false);
    }
  }, [pressedIndex, moveIndicatorTo]);

  // 활성 탭이 변경되면 인디케이터 이동 (navigation 완료 후)
  useEffect(() => {
    if (pressedIndex === -1) {
      moveIndicatorTo(state.index, false);
      lastPressedIndexRef.current = state.index;
    }
  }, [state.index, layoutsReady, tabLayouts, pressedIndex, moveIndicatorTo]);

  // 인디케이터 애니메이션 스타일
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }, { scale: indicatorScale.value }],
    width: indicatorWidth.value,
    height: indicatorHeight.value,
    top: indicatorTop.value,
    borderRadius: indicatorRadius.value,
  }));

  // 탭바 배경 렌더링 (흰색 기반 블러 - 뒤 내용이 살짝 보임)
  const renderBackground = () => {
    if (hasLiquidGlass) {
      return <GlassView style={[StyleSheet.absoluteFill, { borderRadius: tabBarHeight / 2 }]} />;
    }
    if (Platform.OS === 'ios' && BlurView) {
      return (
        <View
          style={[StyleSheet.absoluteFill, { borderRadius: tabBarHeight / 2, overflow: 'hidden' }]}>
          {/* 흰색 반투명 배경 */}
          <View
            className={`absolute inset-0 ${colorScheme === 'dark' ? 'bg-[#1c1c1e]/70' : 'bg-white/70'}`}
          />
          {/* 블러 효과 */}
          <BlurView
            intensity={50}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        </View>
      );
    }
    // Android 또는 BlurView 없을 때 - 반투명 흰색 배경
    return (
      <View
        className={`absolute inset-0 ${colorScheme === 'dark' ? 'bg-[#1c1c1e]/85' : 'bg-white/85'}`}
        style={{ borderRadius: tabBarHeight / 2 }}
      />
    );
  };

  // 슬라이딩 인디케이터 (물방울) 렌더링
  // - press 중: liquid glass (투명한 물방울)
  // - pressout 후 활성 탭: 회색 배경
  const isPressed = pressedIndex >= 0;

  const renderIndicator = () => {
    if (!layoutsReady) return null;

    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            overflow: 'hidden',
          },
          indicatorStyle,
        ]}>
        {/* press 중일 때: liquid glass (투명한 물방울) */}
        {isPressed && hasLiquidGlass ? (
          <GlassView style={StyleSheet.absoluteFill} glassEffectStyle="clear" isInteractive />
        ) : isPressed ? (
          // press 중 + liquid glass 없을 때: 투명한 배경
          <View
            className={`absolute inset-0 rounded-full ${
              colorScheme === 'dark' ? 'bg-white/15' : 'bg-black/08'
            }`}
          />
        ) : (
          // pressout 후 활성 탭: 회색 배경
          <View
            className={`absolute inset-0 rounded-full ${
              colorScheme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 items-center"
      style={{ paddingBottom: bottomPadding }}>
      {/* 플로팅 탭바 */}
      <View
        className="flex-row items-center shadow-lg"
        style={{
          height: tabBarHeight,
          borderRadius: tabBarHeight / 2,
          paddingHorizontal: 8,
        }}>
        {/* 탭바 배경 (블러) */}
        {renderBackground()}

        {/* 슬라이딩 인디케이터 (물방울) */}
        {renderIndicator()}

        {/* 탭 아이템들 */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isPressed = pressedIndex === index;

          const IconComponent = TAB_ICONS[route.name] || Home;
          const label = TAB_LABELS[route.name] || route.name;

          const onPressIn = () => {
            setPressedIndex(index);
            lastPressedIndexRef.current = index; // 마지막 press 탭 저장
            triggerHaptic();
          };

          const onPressOut = () => {
            setPressedIndex(-1);
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={onPress}
              onLongPress={onLongPress}
              onLayout={(e) => handleTabLayout(index, e)}
              // 레이아웃 고정 - 탭 영역 크기 변하지 않음
              className="items-center justify-center px-6 py-2">
              {/* 아이콘과 텍스트만 시각적으로 커짐 (레이아웃 영향 없음) */}
              <Animated.View
                className="items-center justify-center"
                style={{
                  transform: [{ scale: isPressed ? 1.15 : 1 }],
                }}>
                <IconComponent
                  size={20}
                  color={
                    isFocused || isPressed
                      ? colorScheme === 'dark'
                        ? '#ffffff'
                        : '#000000'
                      : inactiveColor
                  }
                />
                <Text
                  className={cn('mt-1 text-[10px]', {
                    'font-semibold': isFocused || isPressed,
                    'font-medium text-gray-400': !isFocused && !isPressed,
                    'text-black dark:text-white': isFocused || isPressed,
                  })}>
                  {label}
                </Text>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const hasLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
  const insets = useSafeAreaInsets();

  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const headerHeight = 44 + insets.top;

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerTransparent: hasLiquidGlass,
        headerStyle: hasLiquidGlass
          ? {}
          : {
              backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
            },
        headerBackground: () =>
          hasLiquidGlass ? (
            <GlassView style={StyleSheet.absoluteFill} />
          ) : Platform.OS === 'ios' && BlurView ? (
            <BlurView
              intensity={80}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerTintColor: hasLiquidGlass
          ? colorScheme === 'dark'
            ? '#ffffff'
            : '#000000'
          : iconColor,
        sceneStyle: hasLiquidGlass ? { paddingTop: headerHeight } : undefined,
      }}>
      <Tabs.Screen name="home" options={{ title: '홈' }} />
      <Tabs.Screen name="races" options={{ title: '대회' }} />
      <Tabs.Screen name="records" options={{ title: '기록' }} />
      <Tabs.Screen name="my" options={{ title: '마이' }} />
    </Tabs>
  );
}
