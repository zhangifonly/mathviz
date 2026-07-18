/**
 * 抛体运动核心算法（纯函数，便于测试）
 *
 * 忽略空气阻力的理想抛体：以初速 v0、发射角 angle(度) 斜抛，
 * 水平匀速、竖直匀加速。真实物理公式：
 *   x = v0 cosθ · t,  y = v0 sinθ · t - ½ g t²
 *   飞行时间 T = 2 v0 sinθ / g
 *   射程 R = v0² sin(2θ) / g   （θ=45° 时最远）
 *   最大高度 H = (v0 sinθ)² / (2g)
 */

export interface Point {
  x: number
  y: number
}

const DEG = Math.PI / 180

/** 飞行时间：竖直方向上抛再落回同一高度所需时间 */
export function flightTime(v0: number, angle: number, g = 9.8): number {
  return (2 * v0 * Math.sin(angle * DEG)) / g
}

/** 射程：R = v0² sin(2θ) / g，θ=45° 取最大值 */
export function range(v0: number, angle: number, g = 9.8): number {
  return (v0 * v0 * Math.sin(2 * angle * DEG)) / g
}

/** 最大高度：H = (v0 sinθ)² / (2g) */
export function maxHeight(v0: number, angle: number, g = 9.8): number {
  const vy = v0 * Math.sin(angle * DEG)
  return (vy * vy) / (2 * g)
}

/** 生成抛物线轨迹点（steps 段，从发射到落地） */
export function trajectory(
  v0: number,
  angle: number,
  g = 9.8,
  steps = 60,
): Point[] {
  const T = flightTime(v0, angle, g)
  const vx = v0 * Math.cos(angle * DEG)
  const vy = v0 * Math.sin(angle * DEG)
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (T * i) / steps
    pts.push({ x: vx * t, y: vy * t - 0.5 * g * t * t })
  }
  return pts
}

export const ANGLES = [30, 45, 60]
