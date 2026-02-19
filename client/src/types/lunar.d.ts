declare module 'lunar-javascript' {
  export class Lunar {
    static fromYmd(year: number, month: number, day: number, isLeap?: boolean): Lunar;
    static fromDate(date: Date): Lunar;
    getSolar(): Solar;
    getMonth(): number;
    getDay(): number;
    isLeap(): boolean;
  }

  export class Solar {
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
  }
}
