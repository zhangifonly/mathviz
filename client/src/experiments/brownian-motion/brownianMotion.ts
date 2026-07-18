/**
 * 布朗运动核心算法（纯函数，便于测试）
 *
 * 布朗运动是连续时间的随机漫步：每一步位移是均值 0、方差 dt 的
 * 高斯随机变量，逐步累加得到轨迹。由独立增量可推出位置方差随时间
 * 线性增长，即 Var(X_t) = t。
 *
 * 高斯增量用 Box-Muller 变换从均匀分布生成，配可复现的线性同余种子。
 */

/** 二维点 */
export interface Vec2 {
  x: number
  y: number
}

/** 可复现的线性同余伪随机数生成器，返回 [0,1) 均匀分布 */
export function makeRng(seed = 1): () => number {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/**
 * Box-Muller 变换：由两个均匀随机数生成一个标准正态 N(0,1) 样本。
 * 公式 z = sqrt(-2 ln u1) * cos(2π u2)。
 */
export function gaussian(rand: () => number): number {
  let u1 = rand()
  const u2 = rand()
  if (u1 < 1e-12) u1 = 1e-12 // 避免 ln(0)
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

/**
 * 一维布朗运动路径。返回长度 steps+1 的位置数组（含起点 0）。
 * 每步增量 = sqrt(dt) * N(0,1)，故 Var(X_t)=t。
 */
export function brownianPath1D(steps: number, dt = 1, seed = 1): number[] {
  const rand = makeRng(seed)
  const path: number[] = [0]
  const sd = Math.sqrt(dt)
  let x = 0
  for (let i = 0; i < steps; i++) {
    x += sd * gaussian(rand)
    path.push(x)
  }
  return path
}

/**
 * 二维布朗运动路径。x、y 两个方向各自独立做一维布朗运动。
 * 返回长度 steps+1 的点数组（含起点原点）。
 */
export function brownianPath2D(steps: number, dt = 1, seed = 1): Vec2[] {
  const rand = makeRng(seed)
  const path: Vec2[] = [{ x: 0, y: 0 }]
  const sd = Math.sqrt(dt)
  let x = 0
  let y = 0
  for (let i = 0; i < steps; i++) {
    x += sd * gaussian(rand)
    y += sd * gaussian(rand)
    path.push({ x, y })
  }
  return path
}

/** 理论方差：布朗运动在时刻 t 的位置方差等于 t（此处 t = step*dt）。 */
export function theoreticalVariance(step: number, dt = 1): number {
  return step * dt
}

/** 可选步数档位 */
export const STEP_COUNTS = [200, 500, 1000]

/** 演示模式：一维 / 二维 */
export const MODES = ['1d', '2d'] as const
export type Mode = (typeof MODES)[number]
