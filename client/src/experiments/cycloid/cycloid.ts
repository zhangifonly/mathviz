/**
 * 旋轮线家族参数方程（纯函数，便于测试）
 *
 * 一个圆沿直线或沿另一个圆滚动，圆周上一点描出的轨迹：
 * - 摆线 cycloid：圆沿直线滚动
 * - 内摆线 hypocycloid：圆在大圆内部滚动（星形线是其特例）
 * - 外摆线 epicycloid：圆在大圆外部滚动（心脏线是其特例）
 */

export interface Point {
  x: number
  y: number
}

export type CurveKind = 'cycloid' | 'hypocycloid' | 'epicycloid' | 'astroid' | 'cardioid'

/** 摆线：半径 r 的圆沿 x 轴滚动，θ∈[0, turns·2π] */
export function cycloid(r = 1, turns = 2, steps = 400): Point[] {
  const pts: Point[] = []
  const max = turns * 2 * Math.PI
  for (let i = 0; i <= steps; i++) {
    const t = (max * i) / steps
    pts.push({ x: r * (t - Math.sin(t)), y: r * (1 - Math.cos(t)) })
  }
  return pts
}

/** 内摆线：大圆半径 R，动圆半径 r，在内部滚动 */
export function hypocycloid(R = 5, r = 1, steps = 600): Point[] {
  const pts: Point[] = []
  const k = R / r
  const loops = r / gcd(Math.round(R), Math.round(r)) // 闭合所需圈数
  const max = loops * 2 * Math.PI
  for (let i = 0; i <= steps; i++) {
    const t = (max * i) / steps
    const x = (R - r) * Math.cos(t) + r * Math.cos((k - 1) * t)
    const y = (R - r) * Math.sin(t) - r * Math.sin((k - 1) * t)
    pts.push({ x, y })
  }
  return pts
}

/** 外摆线：动圆半径 r 在大圆半径 R 外部滚动 */
export function epicycloid(R = 4, r = 1, steps = 600): Point[] {
  const pts: Point[] = []
  const k = R / r
  const loops = r / gcd(Math.round(R), Math.round(r))
  const max = loops * 2 * Math.PI
  for (let i = 0; i <= steps; i++) {
    const t = (max * i) / steps
    const x = (R + r) * Math.cos(t) - r * Math.cos((k + 1) * t)
    const y = (R + r) * Math.sin(t) - r * Math.sin((k + 1) * t)
    pts.push({ x, y })
  }
  return pts
}

/** 最大公约数（用于计算闭合圈数） */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a || 1
}

export interface CurveInfo {
  kind: CurveKind
  label: string
  formula: string
}

export const CURVE_INFO: CurveInfo[] = [
  { kind: 'cycloid', label: '摆线', formula: 'x=r(t−sin t), y=r(1−cos t)' },
  { kind: 'astroid', label: '星形线', formula: 'R=4, r=1 的内摆线' },
  { kind: 'cardioid', label: '心脏线', formula: 'R=r 的外摆线' },
  { kind: 'hypocycloid', label: '内摆线', formula: '动圆在大圆内滚动' },
  { kind: 'epicycloid', label: '外摆线', formula: '动圆在大圆外滚动' },
]

/** 按曲线类型生成点集 */
export function buildCurve(kind: CurveKind): Point[] {
  switch (kind) {
    case 'astroid':
      return hypocycloid(4, 1)
    case 'cardioid':
      return epicycloid(1, 1)
    case 'hypocycloid':
      return hypocycloid(5, 1)
    case 'epicycloid':
      return epicycloid(4, 1)
    case 'cycloid':
    default:
      return cycloid(1, 2)
  }
}
