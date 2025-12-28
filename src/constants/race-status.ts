export const RACE_STATUS_MAP = {
  RUNNING: {
    name: 'RUNNING',
    color: '#22C55E', // green-500
  },
  FINISH: {
    name: 'FINISH',
    color: '#3B82F6', // blue-500
  },
  DNF: {
    name: 'DNF',
    color: '#EF4444', // red-500
  },
  DNS: {
    name: 'DNS',
    color: '#6B7280', // gray-500
  },
  WAITING: {
    name: '대기',
    color: '#F59E0B', // amber-500
  },
  REGISTERED: {
    name: '등록',
    color: '#8B5CF6', // purple-500
  },
} as const;

export type RaceStatus = keyof typeof RACE_STATUS_MAP;
