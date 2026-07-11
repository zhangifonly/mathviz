/**
 * 时钟与角度（纯函数数学内核，无 DOM，便于测试）
 *
 * 时钟表盘是一个 360 度的圆，均分成 12 大格、60 小格。
 * - 分针：每分钟走 6 度（360 / 60）。
 * - 时针：每小时走 30 度（360 / 12），且每分钟额外走 0.5 度（30 / 60）。
 * 两针夹角取较小的那个（0 到 180 度之间）。
 */

/** 时针相对 12 点方向的角度（0 到 360，顺时针） */
export function hourHandAngle(hour: number, minute: number): number {
  const h = ((hour % 12) + 12) % 12
  const m = ((minute % 60) + 60) % 60
  return h * 30 + m * 0.5
}

/** 分针相对 12 点方向的角度（0 到 360，顺时针） */
export function minuteHandAngle(minute: number): number {
  const m = ((minute % 60) + 60) % 60
  return m * 6
}

/** 两针之间的较小夹角（0 到 180 度） */
export function angleBetween(hour: number, minute: number): number {
  const diff = Math.abs(hourHandAngle(hour, minute) - minuteHandAngle(minute))
  const wrapped = diff % 360
  return Math.min(wrapped, 360 - wrapped)
}

/** 判断两针夹角是否为直角（允许微小浮点误差） */
export function isRightAngle(hour: number, minute: number): boolean {
  return Math.abs(angleBetween(hour, minute) - 90) < 1e-9
}

export interface TimeOption {
  hour: number
  minute: number
  label: string
  note: string
}

/** 预设时刻，每个都带上已知的标准夹角，便于教学与测试 */
export const TIME_OPTIONS: TimeOption[] = [
  { hour: 3, minute: 0, label: '3:00', note: '整点，夹角 90 度，标准直角' },
  { hour: 6, minute: 0, label: '6:00', note: '两针相对，夹角 180 度，一条直线' },
  { hour: 12, minute: 0, label: '12:00', note: '两针重合，夹角 0 度' },
  { hour: 9, minute: 0, label: '9:00', note: '整点，夹角 90 度' },
  { hour: 3, minute: 15, label: '3:15', note: '分针到 3，时针已偏移，夹角 7.5 度' },
]
