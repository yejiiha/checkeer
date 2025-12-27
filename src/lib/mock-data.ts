/**
 * Mock 데이터 - 서버 API가 준비되기 전 개발용
 * 서버가 준비되면 이 파일은 삭제해도 됩니다.
 */

import type { HomeResponseDto } from '../api/models';

// 홈 화면 Mock 데이터
export const mockHomeData: HomeResponseDto = {
  memberId: 1,
  memberName: '하예지2',
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
    {
      raceId: 139,
      raceTitle: 'MBN SEOUL MARATHON',
      raceDate: '2025-11-16',
      raceTime: '08:00',
      raceImgUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
      raceCourses: ['HALF', 'TEN'],
      racePlace: '광화문광장',
      pageUrl: 'https://mbn-seoulmarathon.com/ko/',
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
  memberName: '하예지2',
};

// Mock 레이스 상세 데이터 (GET /api/v1/race/{raceId}/detail)
export const mockRaceDetail = {
  raceInfo: {
    raceId: 139,
    raceTitle: 'MBN SEOUL MARATHON',
    raceDate: '2025.11.16',
    raceTime: '08:00 ~ 11:00',
    racePlace: '광화문광장',
    raceImgUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80', // 마라톤 이미지
    raceCourses: ['HALF', 'TEN'],
    pageUrl: 'https://mbn-seoulmarathon.com/ko/',
    recordType: 'SMARTCHIP',
  },
  raceMemberInfo: {
    raceId: 139,
    raceMemberId: 2024,
    memberId: 123,
    memberName: '하예지2',
    bib: '22977',
    status: 'FINISH',
    course: 'HALF',
    thumbnailImgUrl:
      'https://api.checkmy.run/image/race/139/dressup/thumbnail/Ep_RdwAKefBnBkTe.jpg',
    imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/Ep_RdwAKefBnBkTe.jpg',
    avgPace: '06:05',
    expectedDistance: 21.1,
    record: '02:08:33',
    passingAlert: false,
    createdAt: '2025-11-15T18:30:56',
    targetRecord: '02:10:00',
  },
  groupInfo: [
    {
      crewGroup: true,
      groupTitle: '여의도러닝크루',
      broadCastKey: '6HuubhufTiRnSiC2TxX7dXktJnHKFiA0WDh4gfpXCI7',
      groupAdminName: '여의도러닝크루',
    },
    {
      crewGroup: true,
      groupTitle: '소란스런',
      broadCastKey: 'xTRRLH5avGzgxMHx1sEWnKkv49REQRLV9456vqimI4A',
      groupAdminName: '소란스런',
    },
    {
      crewGroup: true,
      groupTitle: '아라온러닝',
      broadCastKey: 'VpmTRP6nfK2xSPwFQId95XRe6EAzv1JxMA1IRP5CfdA',
      groupAdminName: '아라온러닝',
    },
  ],
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

  async getRaceDetail(raceId: number) {
    await this.delay();
    // 현재는 raceId 139만 mock 데이터가 있음
    if (raceId === 139) {
      return mockRaceDetail;
    }
    // 다른 raceId는 기본 데이터 반환
    return {
      ...mockRaceDetail,
      raceInfo: { ...mockRaceDetail.raceInfo, raceId },
      raceMemberInfo: { ...mockRaceDetail.raceMemberInfo, raceId },
    };
  },
};
