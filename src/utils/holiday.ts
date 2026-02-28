// 2026 대한민국 공휴일 (대체공휴일 포함)
export const HOLIDAYS_2026: Record<string, string> = {
  "2026-01-01": "신정",
  "2026-02-16": "설날 연휴",
  "2026-02-17": "설날",
  "2026-02-18": "설날 연휴",
  "2026-03-01": "삼일절 (일→대체)",
  "2026-03-02": "삼일절 대체공휴일",
  "2026-05-05": "어린이날",
  "2026-05-24": "부처님오신날 (일→대체)",
  "2026-05-25": "부처님오신날 대체공휴일",
  "2026-06-03": "전국동시지방선거",
  "2026-06-06": "현충일",
  "2026-08-15": "광복절 (토→대체)",
  "2026-08-17": "광복절 대체공휴일",
  "2026-09-24": "추석 연휴",
  "2026-09-25": "추석",
  "2026-09-26": "추석 연휴 (토→대체)",
  "2026-09-28": "추석 대체공휴일",
  "2026-10-03": "개천절 (토→대체)",
  "2026-10-05": "개천절 대체공휴일",
  "2026-10-09": "한글날",
  "2026-12-25": "성탄절",
  "2027-01-01": "신정",
};

export const DAY_KR = ["일", "월", "화", "수", "목", "금", "토"];

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isWeekend(date: Date) { 
  const d = date.getDay(); 
  return d === 0 || d === 6; 
}

export function isHoliday(date: Date) { 
  return !!HOLIDAYS_2026[toDateKey(date)]; 
}

export function isNonWorking(date: Date) { 
  return isWeekend(date) || isHoliday(date); 
}

export function addDays(date: Date, n: number) { 
  const d = new Date(date); 
  d.setDate(d.getDate() + n); 
  return d; 
}

export function formatShort(date: Date) { 
  return `${date.getMonth() + 1}/${date.getDate()}(${DAY_KR[date.getDay()]})`; 
}

export function formatFull(date: Date) { 
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${DAY_KR[date.getDay()]})`; 
}

export function calcBlock(firstLeaveDay: Date, leaveDays: number) {
  let current = new Date(firstLeaveDay);
  let counted = 0;
  while (counted < leaveDays) {
    if (!isNonWorking(current)) counted++;
    if (counted < leaveDays) current = addDays(current, 1);
  }
  const leaveEnd = new Date(current);
  let blockStart = new Date(firstLeaveDay);
  while (isNonWorking(addDays(blockStart, -1))) blockStart = addDays(blockStart, -1);
  let blockEnd = new Date(leaveEnd);
  while (isNonWorking(addDays(blockEnd, 1))) blockEnd = addDays(blockEnd, 1);
  const totalDays = Math.round((blockEnd.getTime() - blockStart.getTime()) / 86400000) + 1;
  const bonus = totalDays - leaveDays;
  return { blockStart, blockEnd, leaveStart: new Date(firstLeaveDay), leaveEnd, totalDays, usedLeave: leaveDays, bonus };
}

export function findOptimal(leaveDays: number, topN = 5) {
  const results = [];
  const seen = new Set();
  let d = new Date("2026-01-01T00:00:00");
  const end = new Date("2026-12-31T00:00:00");
  while (d <= end) {
    if (!isNonWorking(d)) {
      const block = calcBlock(d, leaveDays);
      const key = toDateKey(block.blockStart);
      if (!seen.has(key)) { seen.add(key); results.push(block); }
    }
    d = addDays(d, 1);
  }
  results.sort((a, b) => b.totalDays - a.totalDays || a.blockStart.getTime() - b.blockStart.getTime());
  return results.slice(0, topN);
}

export function analyzeRange(start: Date, end: Date) {
  const days = [];
  let cur = new Date(start);
  while (cur <= end) {
    const key = toDateKey(cur);
    const weekend = isWeekend(cur);
    const holiday = isHoliday(cur);
    days.push({ 
      date: new Date(cur), 
      key, 
      weekend, 
      holiday, 
      holidayName: HOLIDAYS_2026[key] || null, 
      isNonWorking: weekend || holiday 
    });
    cur = addDays(cur, 1);
  }
  return days;
}
