/**
 * 抛物线与光学（纯函数数学内核，无 DOM，便于测试）
 *
 * 标准抛物线 x^2 = 4 p y（开口向上），焦点 F=(0, p)，准线 y=-p。
 * 反射性质：任何平行于对称轴（y 轴）射入的光线，
 * 经抛物面反射后都汇聚到焦点 F。这正是探照灯、卫星天线的原理。
 *
 * 本内核提供：抛物线取点、焦点/准线、切线斜率与法线、
 * 竖直入射光线的反射方向，以及「反射线是否过焦点」的验证。
 */

/** 抛物线在横坐标 x 处的纵坐标：y = x^2 / (4p) */
export function parabolaY(x: number, p: number): number {
  return (x * x) / (4 * p)
}

/** 焦点坐标 (0, p) */
export function focus(p: number): { x: number; y: number } {
  return { x: 0, y: p }
}

/** 准线的 y 值：y = -p */
export function directrixY(p: number): number {
  return -p
}

/** 抛物线上点 (x, y) 到焦点的距离 */
export function distanceToFocus(x: number, p: number): number {
  const y = parabolaY(x, p)
  const f = focus(p)
  return Math.hypot(x - f.x, y - f.y)
}

/**
 * 抛物线的准线定义：曲线上任意点到焦点的距离，等于它到准线的距离。
 * 到准线（水平线 y=-p）的距离即 y - (-p) = y + p。
 */
export function distanceToDirectrix(x: number, p: number): number {
  return parabolaY(x, p) + p
}

/** 切线斜率 dy/dx = x / (2p) */
export function tangentSlope(x: number, p: number): number {
  return x / (2 * p)
}

/**
 * 竖直向下入射（方向向量 (0,-1)）的光线在点 (x, y) 处反射后的单位方向向量。
 * 法线方向由曲线切线旋转 90 度得到；反射公式 r = d - 2(d·n)n。
 */
export function reflectVertical(x: number, p: number): { x: number; y: number } {
  const m = tangentSlope(x, p)
  // 切线方向 (1, m)，法线方向 (-m, 1) 归一化
  const nlen = Math.hypot(-m, 1)
  const nx = -m / nlen
  const ny = 1 / nlen
  // 入射方向（竖直向下）
  const dx = 0
  const dy = -1
  const dot = dx * nx + dy * ny
  const rx = dx - 2 * dot * nx
  const ry = dy - 2 * dot * ny
  const rlen = Math.hypot(rx, ry)
  return { x: rx / rlen, y: ry / rlen }
}

/**
 * 验证反射线是否经过焦点：从反射点沿反射方向的射线，
 * 计算焦点到该射线的垂直距离，越接近 0 越说明汇聚于焦点。
 */
export function reflectionPassesFocusError(x: number, p: number): number {
  if (x === 0) return 0
  const y = parabolaY(x, p)
  const r = reflectVertical(x, p)
  const f = focus(p)
  // 焦点相对反射点的向量
  const fx = f.x - x
  const fy = f.y - y
  // 该向量在垂直于 r 方向的分量长度 = |fx*ry - fy*rx|
  return Math.abs(fx * r.y - fy * r.x)
}

export interface ParabolaOption {
  p: number
  label: string
  note: string
}

/** 可选的焦准距 p（决定抛物线开口宽窄与焦点高度） */
export const PARABOLA_OPTIONS: ParabolaOption[] = [
  { p: 0.5, label: 'p = 0.5', note: '开口较窄，焦点靠近顶点' },
  { p: 1, label: 'p = 1', note: '标准开口，焦点在 (0, 1)' },
  { p: 2, label: 'p = 2', note: '开口较宽，焦点较高' },
]
