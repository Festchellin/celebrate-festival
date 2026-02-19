import { Lunar } from 'lunar-javascript';

export const lunarToSolar = (month: number, day: number, isLeap: boolean = false, year?: number): Date => {
  const targetYear = year || new Date().getFullYear();
  const lunar = Lunar.fromYmd(targetYear, month, day, isLeap);
  const solar = lunar.getSolar();
  return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
};

export const solarToLunar = (date: Date): { month: number; day: number; isLeap: boolean } => {
  const lunar = Lunar.fromDate(date);
  return {
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeap: lunar.isLeap(),
  };
};

export const formatLunarDate = (month: number, day: number, isLeap: boolean = false): string => {
  const months = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
  const days = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
  
  const monthStr = isLeap ? '闰' + months[month] : months[month];
  return `${monthStr}${days[day]}`;
};

export const getNextLunarDate = (lunarMonth: number, lunarDay: number, isLeap: boolean): Date => {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  let targetDate = lunarToSolar(lunarMonth, lunarDay, isLeap, currentYear);
  
  if (targetDate < now) {
    targetDate = lunarToSolar(lunarMonth, lunarDay, isLeap, currentYear + 1);
  }
  
  return targetDate;
};

export const LUNAR_MONTHS = [
  { value: 1, label: '正月' },
  { value: 2, label: '二月' },
  { value: 3, label: '三月' },
  { value: 4, label: '四月' },
  { value: 5, label: '五月' },
  { value: 6, label: '六月' },
  { value: 7, label: '七月' },
  { value: 8, label: '八月' },
  { value: 9, label: '九月' },
  { value: 10, label: '十月' },
  { value: 11, label: '冬月' },
  { value: 12, label: '腊月' },
];

export const LUNAR_DAYS = Array.from({ length: 30 }, (_, i) => ({
  value: i + 1,
  label: [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ][i]
}));
