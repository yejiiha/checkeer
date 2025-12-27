/**
 * Mock 데이터 - 서버 API가 준비되기 전 개발용
 * 서버가 준비되면 이 파일은 삭제해도 됩니다.
 */

import type { HomeResponseDto } from '../api/models';

// 홈 화면 Mock 데이터
export const mockHomeData: HomeResponseDto = {
  memberId: 1,
  memberName: '테스트 유저',
  bestFullRecord: {
    raceId: 1,
    bestRecord: '03:45:30',
    courseType: 'FULL',
  },
  bestHalfRecord: {
    raceId: 2,
    bestRecord: '01:45:20',
    courseType: 'HALF',
  },
  bestTenRecord: {
    raceId: 3,
    bestRecord: '00:48:30',
    courseType: 'TEN',
  },
  raceInfos: [
    {
      raceId: 1,
      raceTitle: '2025 서울 마라톤',
      raceDate: '2025-03-16',
      raceTime: '08:00',
      raceImgUrl: 'https://via.placeholder.com/300x200',
      raceCourses: ['FULL', 'HALF', 'TEN'],
      racePlace: '서울 광화문',
      pageUrl: 'https://example.com',
    },
    {
      raceId: 2,
      raceTitle: '2025 대구 마라톤',
      raceDate: '2025-04-06',
      raceTime: '08:00',
      raceImgUrl: 'https://via.placeholder.com/300x200',
      raceCourses: ['FULL', 'HALF'],
      racePlace: '대구 스타디움',
      pageUrl: 'https://example.com',
    },
  ],
  recordInfos: [
    {
      raceId: 1,
      raceTitle: '2024 서울 마라톤',
      raceDate: '2024-03-17',
      raceImgUrl: 'https://via.placeholder.com/300x200',
      course: 'FULL',
      record: '03:45:30',
      recordImg: 'https://via.placeholder.com/300x400',
      racePlace: '서울 광화문',
    },
    {
      raceId: 2,
      raceTitle: '2024 춘천 마라톤',
      raceDate: '2024-10-27',
      raceImgUrl: 'https://via.placeholder.com/300x200',
      course: 'HALF',
      record: '01:45:20',
      recordImg: 'https://via.placeholder.com/300x400',
      racePlace: '춘천',
    },
  ],
};

// Mock 사용자 데이터
export const mockUser = {
  memberId: 1,
  memberName: '테스트 유저',
};

// Mock 크루 데이터
export const mockCrews = [
  {
    crewId: 1,
    crewName: '여의도 러닝크루',
    crewImgUrl: 'https://via.placeholder.com/100',
    crewColor: '#FF6B6B',
  },
  {
    crewId: 2,
    crewName: '한강 러너스',
    crewImgUrl: 'https://via.placeholder.com/100',
    crewColor: '#4ECDC4',
  },
  {
    crewId: 3,
    crewName: '새벽런 크루',
    crewImgUrl: 'https://via.placeholder.com/100',
    crewColor: '#45B7D1',
  },
];

// Mock API 응답을 반환하는 유틸리티
export const mockApi = {
  delay: (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms)),

  async getHome(): Promise<HomeResponseDto> {
    await this.delay();
    return mockHomeData;
  },

  async getCrews() {
    await this.delay();
    return mockCrews;
  },
};
