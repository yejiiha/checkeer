import { Text } from '@/components/ui/text';
import { tokenUtils } from '@/src/lib/api-client';
import { mockMapData } from '@/src/lib/mock-data';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

interface MapData {
  polylines: [number, number, number][];
  markers?: Array<{
    point: [number, number];
    label: string | number;
  }>;
}

interface RaceMember {
  raceMemberId: number;
  memberName: string;
  thumbnailImgUrl: string;
  expectedDistance: number;
  status: string;
  avgPace: string;
}

interface BroadcastMapViewProps {
  mapUrl: string;
  raceMembers?: RaceMember[];
  onMemberPress?: (raceMemberId: number) => void;
}

// Map 데이터 fetch 함수
const fetchMapData = async (mapUrl: string): Promise<MapData> => {
  console.log('📍 fetchMapData called with:', mapUrl);

  // Mock URL인 경우 mock 데이터 반환
  if (mapUrl.startsWith('mock://')) {
    console.log('✅ Using mock data');
    await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    console.log('✅ Mock data returned:', { polylines: mockMapData.polylines.length });
    return mockMapData;
  }

  // 실제 API 호출
  console.log('🌐 Fetching from API:', mapUrl);
  const response = await fetch(mapUrl);
  if (!response.ok) {
    console.error('❌ API fetch failed:', response.status);
    throw new Error('지도 데이터를 불러올 수 없습니다.');
  }
  const data = await response.json();
  console.log('✅ API data returned:', data);
  return data;
};

export function BroadcastMapView({
  mapUrl,
  raceMembers = [],
  onMemberPress,
}: BroadcastMapViewProps) {
  const mapRef = useRef<MapView>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const {
    data: mapData,
    isLoading,
    error,
    isError,
    status,
  } = useQuery({
    queryKey: ['mapData', mapUrl],
    queryFn: () => fetchMapData(mapUrl),
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분 후 가비지 컬렉션
  });

  // 토큰 가져오기
  useEffect(() => {
    const loadToken = async () => {
      const token = await tokenUtils.getAccessToken();
      setAccessToken(token);
    };
    loadToken();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-300">지도 로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Text className="text-gray-600 dark:text-gray-300">
          {error instanceof Error ? error.message : '지도 데이터를 불러올 수 없습니다.'}
        </Text>
      </View>
    );
  }

  if (!mapData || !mapData.polylines || mapData.polylines.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Text className="text-gray-600 dark:text-gray-300">지도 데이터가 없습니다.</Text>
      </View>
    );
  }

  // polyline 좌표를 react-native-maps 형식으로 변환
  // [lat, lng, elevation?] -> { latitude, longitude }
  const coordinates = mapData.polylines.map((point) => ({
    latitude: point[0],
    longitude: point[1],
  }));

  // 지도 초기 영역 계산 (전체 경로가 보이도록)
  const initialRegion = {
    latitude: coordinates[0].latitude,
    longitude: coordinates[0].longitude,
    latitudeDelta: 0.05, // 더 넓게 보이도록
    longitudeDelta: 0.05,
  };

  // 마커 색상 결정
  const getMarkerColor = (label: string | number) => {
    if (label === 'START') return '#22C55E'; // 초록색
    if (label === 'FINISH') return '#EF4444'; // 빨간색
    return '#3B82F6'; // 파란색
  };

  // polyline 상의 특정 거리에 해당하는 좌표 찾기
  const getCoordinateAtDistance = (targetDistance: number) => {
    let accumulatedDistance = 0;

    for (let i = 0; i < mapData.polylines.length - 1; i++) {
      const point1 = mapData.polylines[i];
      const point2 = mapData.polylines[i + 1];

      // 두 점 사이의 거리 계산 (간단한 유클리드 거리)
      const segmentDistance =
        Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2)) * 111; // 대략적으로 km로 변환 (위도 1도 ≈ 111km)

      if (accumulatedDistance + segmentDistance >= targetDistance) {
        // 이 구간에서 목표 거리를 찾음
        const ratio = (targetDistance - accumulatedDistance) / segmentDistance;
        return {
          latitude: point1[0] + (point2[0] - point1[0]) * ratio,
          longitude: point1[1] + (point2[1] - point1[1]) * ratio,
        };
      }

      accumulatedDistance += segmentDistance;
    }

    // 마지막 지점 반환
    const lastPoint = mapData.polylines[mapData.polylines.length - 1];
    return {
      latitude: lastPoint[0],
      longitude: lastPoint[1],
    };
  };

  // 주자 상태에 따른 좌표 계산
  const getRaceMemberCoordinate = (member: RaceMember) => {
    // FINISH 상태: FINISH 마커 위치로
    if (member.status === 'FINISH') {
      const finishMarker = mapData.markers?.find((m) => m.label === 'FINISH');
      if (finishMarker) {
        return {
          latitude: finishMarker.point[0],
          longitude: finishMarker.point[1],
        };
      }
      // FINISH 마커가 없으면 마지막 polyline 지점
      const lastPoint = mapData.polylines[mapData.polylines.length - 1];
      return {
        latitude: lastPoint[0],
        longitude: lastPoint[1],
      };
    }

    // READY 상태: START 마커 위치로
    if (member.status === 'READY' || member.status === 'REGISTERED') {
      const startMarker = mapData.markers?.find((m) => m.label === 'START');
      if (startMarker) {
        return {
          latitude: startMarker.point[0],
          longitude: startMarker.point[1],
        };
      }
      // START 마커가 없으면 첫 번째 polyline 지점
      const firstPoint = mapData.polylines[0];
      return {
        latitude: firstPoint[0],
        longitude: firstPoint[1],
      };
    }

    // RUNNING 등 다른 상태: expectedDistance로 계산
    return getCoordinateAtDistance(member.expectedDistance);
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
        toolbarEnabled={false}
        loadingEnabled={false}
        mapType="standard"
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={true}
        zoomEnabled={true}
        zoomTapEnabled={false}
        zoomControlEnabled={false}>
        {/* 경로 표시 */}
        <Polyline
          coordinates={coordinates}
          strokeColor="#3B82F6"
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />

        {/* 마커 표시 (체크포인트) - 원형 커스텀 마커 */}
        {mapData.markers?.map((marker, index) => {
          const markerColor = getMarkerColor(marker.label);
          const isTextMarker = typeof marker.label === 'string';

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.point[0],
                longitude: marker.point[1],
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              flat>
              <View
                className="items-center justify-center border-[3px] border-transparent shadow-lg"
                style={{
                  backgroundColor: markerColor,
                  width: isTextMarker ? 60 : 32,
                  height: isTextMarker ? 32 : 32,
                  borderRadius: isTextMarker ? 16 : 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 6,
                }}>
                <Text
                  className="text-center text-white"
                  style={{
                    fontSize: isTextMarker ? 10 : 14,
                    fontWeight: isTextMarker ? '600' : '700',
                  }}>
                  {marker.label}
                </Text>
              </View>
            </Marker>
          );
        })}

        {/* 주자 마커 */}
        {raceMembers.map((member) => {
          const coordinate = getRaceMemberCoordinate(member);

          return (
            <Marker
              key={member.raceMemberId}
              coordinate={coordinate}
              anchor={{ x: 0.5, y: 1 }}
              tracksViewChanges={false}
              onPress={() => onMemberPress?.(member.raceMemberId)}>
              <View className="items-center">
                {/* 마커 핀 */}
                <View style={{ position: 'relative' }}>
                  {/* 원형 부분 */}
                  <View
                    className="overflow-hidden bg-purple-600 shadow-lg"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      className="overflow-hidden bg-gray-300"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                      }}>
                      <Image
                        source={{
                          uri: member.thumbnailImgUrl,
                          headers: accessToken
                            ? {
                                Cookie: `accessToken=${accessToken}`,
                              }
                            : undefined,
                        }}
                        placeholder={{
                          uri:
                            'https://via.placeholder.com/36/D1D5DB/9CA3AF?text=' +
                            member.memberName.charAt(0),
                        }}
                        className="h-full w-full"
                        contentFit="cover"
                        transition={200}
                        cachePolicy="none"
                        onLoad={() => {
                          console.log('✅ Image loaded successfully for:', member.memberName);
                        }}
                        onError={(error) => {
                          console.log(
                            '⚠️ Image load failed, using placeholder for:',
                            member.memberName
                          );
                        }}
                      />
                    </View>
                  </View>

                  {/* 아래 뾰족한 부분 */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -5,
                      left: '50%',
                      marginLeft: -10,
                      width: 0,
                      height: 0,
                      backgroundColor: 'transparent',
                      borderStyle: 'solid',
                      borderLeftWidth: 10,
                      borderRightWidth: 10,
                      borderTopWidth: 9,
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderTopColor: '#9333EA',
                    }}
                  />

                  {/* 아래 뾰족한 부분 - 내부 (흰색) */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -4,
                      left: '50%',
                      marginLeft: -8,
                      width: 0,
                      height: 0,
                      backgroundColor: 'transparent',
                      borderStyle: 'solid',
                      borderLeftWidth: 8,
                      borderRightWidth: 8,
                      borderTopWidth: 8,
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderTopColor: '#9333EA',
                    }}
                  />
                </View>

                {/* 이름 라벨 */}
                <View
                  className="mt-1 rounded-full bg-purple-600 px-2 py-0.5 shadow-md"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 3,
                  }}>
                  <Text
                    className="text-center text-white"
                    style={{ fontSize: 10, fontWeight: '600' }}
                    numberOfLines={1}>
                    {member.memberName}
                  </Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
