/**
 * Catmull-Rom 样条核心算法（纯函数，便于测试）
 *
 * Catmull-Rom 是一种插值样条：曲线会精确穿过每一个中间控制点，
 * 这点与 B 样条(逼近，不过点)不同。它的关键在于对每个控制点用
 * 相邻两点估计切线：tangent(i) = (P(i+1) - P(i-1)) / 2，
 * 再用三次 Hermite 基在两点之间平滑插值。因此只需给出一串点，
 * 就能自动得到一条过点且光滑的曲线，常用于动画路径与轨迹平滑。
 */

export interface Point {
  x: number
  y: number
}

/** 演示用控制点（可拖动的初始布局，与 B 样条同布局便于对比） */
export const CONTROL_POINTS: Point[] = [
  { x: 60, y: 380 },
  { x: 150, y: 120 },
  { x: 260, y: 300 },
  { x: 370, y: 90 },
  { x: 480, y: 320 },
  { x: 560, y: 140 },
]

/** 每两个控制点之间的采样段数选项 */
export const SEGMENT_SAMPLES = [8, 16, 32]

/** 中心差分估计控制点 i 处的切线：(P(i+1) - P(i-1)) / 2 */
export function tangent(points: Point[], i: number): Point {
  const prev = points[Math.max(0, i - 1)]
  const next = points[Math.min(points.length - 1, i + 1)]
  return { x: (next.x - prev.x) / 2, y: (next.y - prev.y) / 2 }
}

/**
 * 在段 [P1, P2] 上用 Catmull-Rom 基求 t∈[0,1] 处的点。
 * p0/p3 为相邻点，用来估计端点切线。
 */
export function catmullRomPoint(
  p0: Point, p1: Point, p2: Point, p3: Point, t: number,
): Point {
  const t2 = t * t
  const t3 = t2 * t
  // 标准 Catmull-Rom 基矩阵展开（张力 0.5）
  const b0 = -0.5 * t3 + t2 - 0.5 * t
  const b1 = 1.5 * t3 - 2.5 * t2 + 1
  const b2 = -1.5 * t3 + 2 * t2 + 0.5 * t
  const b3 = 0.5 * t3 - 0.5 * t2
  return {
    x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
  }
}

/**
 * 生成过所有中间控制点的 Catmull-Rom 样条采样点。
 * @param samples 每段的采样数，越大越平滑
 */
export function catmullRomCurve(points: Point[], samples: number): Point[] {
  const n = points.length
  if (n < 2) return points.slice()
  const curve: Point[] = []
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(n - 1, i + 2)]
    for (let s = 0; s < samples; s++) {
      curve.push(catmullRomPoint(p0, p1, p2, p3, s / samples))
    }
  }
  curve.push(points[n - 1]) // 收尾，保证过最后一点
  return curve
}
