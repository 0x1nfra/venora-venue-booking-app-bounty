import {
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export function getMonthGrid(monthDate: Date): CalendarDay[][] {
  const monthStart = startOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });

  const weeks: CalendarDay[][] = [];
  for (let week = 0; week < 6; week++) {
    const days: CalendarDay[] = [];
    for (let day = 0; day < 7; day++) {
      const date = addDays(gridStart, week * 7 + day);
      days.push({ date, isCurrentMonth: isSameMonth(date, monthDate) });
    }
    weeks.push(days);
  }
  return weeks;
}
