/**
 * 圆的几何（纯函数，便于测试）
 *
 * 圆由圆心和半径决定。本内核提供周长、面积、弧长、扇形面积、
 * 弦长的计算，以及圆周角定理相关的角度关系。
 * 所有函数不依赖 DOM，可直接单测。
 */

/** 圆的周长 C = 2 * π * r */
export function circumference(radius: number): number {
  return 2 * Math.PI * radius
}

/** 圆的面积 S = π * r^2 */
export function area(radius: number): number {
  return Math.PI * radius * radius
}

/**
 * 弧长 L = r * θ（θ 为圆心角，单位弧度）
 */
export function arcLength(radius: number, angleRad: number): number {
  return radius * angleRad
}

/**
 * 扇形面积 S = 0.5 * r^2 * θ（θ 为圆心角，单位弧度）
 */
export function sectorArea(radius: number, angleRad: number): number {
  return 0.5 * radius * radius * angleRad
}

/**
 * 弦长：圆心角为 θ 时，弦长 = 2 * r * sin(θ / 2)
 */
export function chordLength(radius: number, angleRad: number): number {
  return 2 * radius * Math.sin(angleRad / 2)
}

/**
 * 圆周角定理：同一段弧所对的圆周角是圆心角的一半。
 * 输入圆心角（弧度），返回对应圆周角（弧度）。
 */
export function inscribedAngle(centralAngleRad: number): number {
  return centralAngleRad / 2
}

/** 角度转弧度 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** 弧度转角度 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

/**
 * 判断一个点是否落在以 (cx, cy) 为圆心、r 为半径的圆内（含边界）。
 */
export function isPointInside(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number,
): boolean {
  const dx = px - cx
  const dy = py - cy
  return dx * dx + dy * dy <= radius * radius
}

export interface CircleMeasures {
  circumference: number
  area: number
  arcLength: number
  sectorArea: number
  chordLength: number
  inscribedAngle: number
}

/**
 * 综合计算：给定半径与圆心角（弧度），一次性得到各项度量。
 */
export function circleMeasures(radius: number, angleRad: number): CircleMeasures {
  return {
    circumference: circumference(radius),
    area: area(radius),
    arcLength: arcLength(radius, angleRad),
    sectorArea: sectorArea(radius, angleRad),
    chordLength: chordLength(radius, angleRad),
    inscribedAngle: inscribedAngle(angleRad),
  }
}

export interface CircleTopic {
  id: string
  label: string
  note: string
  /** 演示用的圆心角（角度） */
  angleDeg: number
}

/** 可切换的讲解主题（对应不同的几何量） */
export const CIRCLE_TOPICS: CircleTopic[] = [
  { id: 'circumference', label: '周长与面积', note: 'C = 2πr，S = πr²', angleDeg: 360 },
  { id: 'arc', label: '弧长与扇形', note: 'L = rθ，S = ½r²θ', angleDeg: 90 },
  { id: 'chord', label: '弦与圆心角', note: '弦长 = 2r·sin(θ/2)', angleDeg: 120 },
  { id: 'inscribed', label: '圆周角定理', note: '圆周角 = 圆心角的一半', angleDeg: 100 },
]
