export const COURSE_MAP = {
  FIVE: {
    name: '5K',
    color: '#3B82F6',
    distance: 5,
  },
  FULL: {
    name: 'FULL',
    color: '#EF4444',
    distance: 42.195,
  },
  THIRTY_TWO_K: {
    name: '32K',
    color: '#F97316',
    distance: 32,
  },
  HALF: {
    name: 'HALF',
    color: '#FACC15',
    distance: 21.0975,
  },
  TEN: {
    name: '10K',
    color: '#22C55E',
    distance: 10,
  },
  ELEVEN: {
    name: '11K',
    color: '#8B5CF6',
    distance: 11,
  },
} as const;

export type CourseKey = keyof typeof COURSE_MAP;

// 코스 거리 매핑 (km 단위)
export const COURSE_DISTANCES = {
  '5K': 5,
  '7K': 7,
  '10K': 10,
  '15K': 15,
  '20K': 20,
  '25K': 25,
  '30K': 30,
  '35K': 35,
  '40K': 40,
  HALF: 21.0975,
  FULL: 42.195,
} as const;
