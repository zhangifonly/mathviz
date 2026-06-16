/**
 * 欧拉公式核心数学（纯函数，便于测试）
 * e^(iθ) = cosθ + i·sinθ
 */

export interface Complex {
  re: number
  im: number
}

/** 计算 e^(iθ) 在复平面上的坐标 */
export function eulerPoint(theta: number): Complex {
  return { re: Math.cos(theta), im: Math.sin(theta) }
}

/** 生成单位圆上均匀分布的点 */
export function unitCirclePoints(samples = 100): { x: number[]; y: number[] } {
  const x: number[] = []
  const y: number[] = []
  for (let i = 0; i <= samples; i++) {
    const a = (i / samples) * Math.PI * 2
    x.push(Math.cos(a))
    y.push(Math.sin(a))
  }
  return { x, y }
}

/** 生成从 0 到 theta 已扫过的弧（用于动画） */
export function arcPoints(theta: number, samples = 100): { x: number[]; y: number[] } {
  const x: number[] = []
  const y: number[] = []
  const steps = Math.max(2, Math.floor((theta / (Math.PI * 2)) * samples))
  for (let i = 0; i <= steps; i++) {
    const a = (i / samples) * Math.PI * 2
    x.push(Math.cos(a))
    y.push(Math.sin(a))
  }
  return { x, y }
}

/** 判断当前角度是否接近 π（欧拉恒等式的临界点） */
export function isAtPi(theta: number, tolerance = 0.05): boolean {
  return Math.abs(theta - Math.PI) < tolerance
}
