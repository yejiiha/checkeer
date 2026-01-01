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
    thumbnailImgUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=200&q=80',
    imgUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80',
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

// Mock 브로드캐스트 정보 (GET /api/v1/broadcast/{broadcastKey})
export const mockBroadcastInfo = {
  raceGroupInfo: {
    groupTitle: '여의도러닝크루',
    raceId: 139,
    raceTitle: 'MBN SEOUL MARATHON',
    raceCourse: ['HALF', 'TEN'],
  },
  mapUrl: 'mock://map-data', // Mock URL로 변경
};

// Mock 지도 데이터는 별도 파일로 분리 (용량이 커서)
export { mockMapData } from './mock-data-map';

// Mock 브로드캐스트 실시간 데이터 (GET /api/v1/broadcast/{broadcastKey}/live?course=HALF)
export const mockBroadcastLive = {
  raceReports: [
    {
      courseTitle: 'FINISH',
      passStatus: '13/14',
      hasNotification: false,
      isFirstNetTime: false,
      point: 21.1,
      latitude: null,
      longitude: null,
      zoneId: '411',
      raceMembers: [
        {
          raceId: 139,
          raceMemberId: 2029,
          memberId: 131,
          memberName: '장신석',
          bib: '21919',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/F6nW5gePb8B0mLk-.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/F6nW5gePb8B0mLk-.jpg',
          avgPace: '03:52',
          expectedDistance: 21.1,
          record: '01:21:53',
          passingAlert: false,
          createdAt: '2025-11-15T20:22:24',
          targetRecord: '01:22:59',
        },
        {
          raceId: 139,
          raceMemberId: 2052,
          memberId: 53,
          memberName: '윤호정',
          bib: '21857',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/u-Gil1pkWlZYVnLD.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/u-Gil1pkWlZYVnLD.jpg',
          avgPace: '04:05',
          expectedDistance: 21.1,
          record: '01:26:16',
          passingAlert: false,
          createdAt: '2025-11-15T22:42:47',
          targetRecord: '01:22:59',
        },
        {
          raceId: 139,
          raceMemberId: 2049,
          memberId: 259,
          memberName: '이승민2',
          bib: '21986',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/4jA5znksE8By3uRO.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/4jA5znksE8By3uRO.jpg',
          avgPace: '04:08',
          expectedDistance: 21.1,
          record: '01:27:13',
          passingAlert: false,
          createdAt: '2025-11-15T21:53:38',
          targetRecord: '01:30:00',
        },
        {
          raceId: 139,
          raceMemberId: 2025,
          memberId: 45,
          memberName: '문영조',
          bib: '21346',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/BzIo9ho803dFcFO6.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/BzIo9ho803dFcFO6.jpg',
          avgPace: '04:19',
          expectedDistance: 21.1,
          record: '01:31:25',
          passingAlert: false,
          createdAt: '2025-11-15T18:38:39',
          targetRecord: '01:33:59',
        },
        {
          raceId: 139,
          raceMemberId: 2071,
          memberId: 25,
          memberName: '이동민',
          bib: '10166',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/RrvXKJ92E-xDsk7S.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/RrvXKJ92E-xDsk7S.jpg',
          avgPace: '04:26',
          expectedDistance: 21.1,
          record: '01:33:37',
          passingAlert: false,
          createdAt: '2025-11-16T07:34:46',
          targetRecord: '01:30:00',
        },
        {
          raceId: 139,
          raceMemberId: 2026,
          memberId: 28,
          memberName: '홍승의',
          bib: '26095',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/TrdRnIDmFq2xY6yM.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/TrdRnIDmFq2xY6yM.jpg',
          avgPace: '04:27',
          expectedDistance: 21.1,
          record: '01:34:10',
          passingAlert: false,
          createdAt: '2025-11-15T18:49:28',
          targetRecord: '01:35:59',
        },
        {
          raceId: 139,
          raceMemberId: 2050,
          memberId: 32,
          memberName: '김재휘',
          bib: '21244',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/oxNE1sLqfah8J8o5.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/oxNE1sLqfah8J8o5.jpg',
          avgPace: '04:31',
          expectedDistance: 21.1,
          record: '01:35:33',
          passingAlert: false,
          createdAt: '2025-11-15T21:57:16',
          targetRecord: '01:30:00',
        },
        {
          raceId: 139,
          raceMemberId: 2034,
          memberId: 156,
          memberName: '박혜원',
          bib: '32281',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/r3o8Zim9KovGGGsk.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/r3o8Zim9KovGGGsk.jpg',
          avgPace: '04:37',
          expectedDistance: 21.1,
          record: '01:37:25',
          passingAlert: false,
          createdAt: '2025-11-15T20:41:34',
          targetRecord: '01:39:00',
        },
        {
          raceId: 139,
          raceMemberId: 2058,
          memberId: 30,
          memberName: '강희일',
          bib: '32405',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/Y1Gaq3nUFQrPXuci.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/Y1Gaq3nUFQrPXuci.jpg',
          avgPace: '05:03',
          expectedDistance: 21.1,
          record: '01:46:51',
          passingAlert: false,
          createdAt: '2025-11-15T23:32:23',
          targetRecord: '01:45:00',
        },
        {
          raceId: 139,
          raceMemberId: 2059,
          memberId: 118,
          memberName: '권빛나',
          bib: '46386',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/UQOfLiWY0intO0Hw.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/UQOfLiWY0intO0Hw.jpg',
          avgPace: '05:10',
          expectedDistance: 21.1,
          record: '01:49:13',
          passingAlert: false,
          createdAt: '2025-11-15T23:38:17',
          targetRecord: '01:55:00',
        },
        {
          raceId: 139,
          raceMemberId: 2027,
          memberId: 64,
          memberName: '김기준',
          bib: '41929',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/7EtBd8grVQirHVDT.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/7EtBd8grVQirHVDT.jpg',
          avgPace: '05:34',
          expectedDistance: 21.1,
          record: '01:57:29',
          passingAlert: false,
          createdAt: '2025-11-15T19:38:59',
          targetRecord: '02:15:00',
        },
        {
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
        {
          raceId: 139,
          raceMemberId: 2033,
          memberId: 24,
          memberName: '김지연',
          bib: '33082',
          status: 'FINISH',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/3podHoEUz6d-p5AW.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/3podHoEUz6d-p5AW.jpg',
          avgPace: '06:07',
          expectedDistance: 21.1,
          record: '02:09:11',
          passingAlert: false,
          createdAt: '2025-11-15T20:32:05',
          targetRecord: '20:00:00',
        },
      ],
      firstNetTime: false,
      isCheerZone: false,
    },
    {
      courseTitle: '15.6K',
      passStatus: '14/14',
      hasNotification: false,
      isFirstNetTime: false,
      point: 15.6,
      latitude: null,
      longitude: null,
      zoneId: '410',
      raceMembers: [
        {
          raceId: 139,
          raceMemberId: 2022,
          memberId: 290,
          memberName: '박상언',
          bib: '35915',
          status: 'RUNNING',
          course: 'HALF',
          thumbnailImgUrl:
            'https://api.checkmy.run/image/race/139/dressup/thumbnail/93hqo856PthOoQRY.jpg',
          imgUrl: 'https://api.checkmy.run/image/race/139/dressup/press/93hqo856PthOoQRY.jpg',
          avgPace: '08:07',
          expectedDistance: 19.0,
          record: '02:51:31',
          passingAlert: false,
          createdAt: '2025-11-15T18:10:49',
          targetRecord: '02:09:59',
        },
      ],
      firstNetTime: false,
      isCheerZone: false,
    },
    {
      courseTitle: '10K',
      passStatus: '14/14',
      hasNotification: false,
      isFirstNetTime: false,
      point: 10.0,
      latitude: null,
      longitude: null,
      zoneId: '409',
      raceMembers: [],
      firstNetTime: false,
      isCheerZone: false,
    },
    {
      courseTitle: '5K',
      passStatus: '14/14',
      hasNotification: false,
      isFirstNetTime: false,
      point: 5.0,
      latitude: null,
      longitude: null,
      zoneId: '408',
      raceMembers: [],
      firstNetTime: false,
      isCheerZone: false,
    },
    {
      courseTitle: '2.6K',
      passStatus: '14/14',
      hasNotification: false,
      isFirstNetTime: false,
      point: 2.6,
      latitude: null,
      longitude: null,
      zoneId: '407',
      raceMembers: [],
      firstNetTime: false,
      isCheerZone: false,
    },
    {
      courseTitle: 'START',
      passStatus: '14/14',
      hasNotification: false,
      isFirstNetTime: true,
      point: 0.0,
      latitude: null,
      longitude: null,
      zoneId: '406',
      raceMembers: [],
      firstNetTime: true,
      isCheerZone: false,
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

  // GET /api/v1/broadcast/{broadcastKey}
  async getBroadcastInfo(_broadcastKey: string) {
    await this.delay();
    return mockBroadcastInfo;
  },

  // GET /api/v1/broadcast/{broadcastKey}/live?course={course}
  async getBroadcastLive(_broadcastKey: string, _course: string) {
    await this.delay();
    return mockBroadcastLive;
  },
};
