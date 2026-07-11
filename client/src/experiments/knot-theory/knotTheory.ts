/**
 * 纽结理论（Knot Theory）纯函数数学内核（无 DOM，便于测试）
 *
 * 纽结是嵌入三维空间中的闭合曲线。为区分不同纽结，数学家定义了各种
 * "纽结不变量"：交叉数、亏格、琼斯多项式等。本内核提供：
 *  - 环面纽结 T(p,q) 的几何参数化与不变量公式
 *  - 八字结的经典参数化
 *  - 劳伦多项式（琼斯多项式）的求值
 *  - 常见纽结的目录（含已知不变量）
 */

/** 三维向量（用于纽结曲线采样点，z 用于绘制时判断上下穿越） */
export interface Vec3 {
  x: number
  y: number
  z: number
}

/** 劳伦多项式：指数 -> 系数（如琼斯多项式 t^-3 项即 {-3: 1}） */
export type Laurent = Record<number, number>

/** 最大公约数（辗转相除法） */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/**
 * 环面纽结 T(p,q) 的亏格（seifert genus）。
 * 当 gcd(p,q)=1 时，g = (p-1)(q-1)/2。
 */
export function torusKnotGenus(p: number, q: number): number {
  return ((Math.abs(p) - 1) * (Math.abs(q) - 1)) / 2
}

/**
 * 环面纽结 T(p,q) 的交叉数（最小交叉数）。
 * 当 gcd(p,q)=1 时，c = min(p(q-1), q(p-1))。
 */
export function torusKnotCrossingNumber(p: number, q: number): number {
  const a = Math.abs(p)
  const b = Math.abs(q)
  return Math.min(a * (b - 1), b * (a - 1))
}

/**
 * 环面纽结 T(p,q) 的三维参数化采样点。
 * 曲线缠绕在环面表面：绕主圆 p 圈、绕管圈 q 圈。
 */
export function torusKnotPoints(p: number, q: number, samples: number): Vec3[] {
  const pts: Vec3[] = []
  const R = 2
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2
    const r = R + Math.cos(q * t)
    pts.push({
      x: r * Math.cos(p * t),
      y: r * Math.sin(p * t),
      z: Math.sin(q * t),
    })
  }
  return pts
}

/**
 * 八字结（figure-eight, 4_1）的经典参数化。
 * 它不是环面纽结，需专门的利萨茹式方程。
 */
export function figureEightPoints(samples: number): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2
    pts.push({
      x: (2 + Math.cos(2 * t)) * Math.cos(3 * t),
      y: (2 + Math.cos(2 * t)) * Math.sin(3 * t),
      z: Math.sin(4 * t),
    })
  }
  return pts
}

/** 在给定 t 处对劳伦多项式求值 */
export function evalLaurent(poly: Laurent, t: number): number {
  let sum = 0
  for (const key in poly) {
    const e = Number(key)
    sum += poly[key] * Math.pow(t, e)
  }
  return sum
}

/** 纽结目录条目 */
export interface KnotInfo {
  id: string
  symbol: string
  name: string
  /** 环面纽结的 (p,q)，非环面纽结为 null */
  p: number | null
  q: number | null
  crossingNumber: number
  genus: number
  jones: Laurent
  note: string
}

/**
 * 常见纽结目录。琼斯多项式取自 Knot Atlas 标准数据。
 * 数学恒等式：任意纽结的琼斯多项式在 t=1 处求值恒等于 1。
 */
export const KNOT_OPTIONS: KnotInfo[] = [
  { id: 'unknot', symbol: '0_1', name: '平凡结', p: 1, q: 2, crossingNumber: 0, genus: 0, jones: { 0: 1 }, note: '一个普通圆环，没有真正打结' },
  { id: 'trefoil', symbol: '3_1', name: '三叶结', p: 2, q: 3, crossingNumber: 3, genus: 1, jones: { '-4': -1, '-3': 1, '-1': 1 }, note: '最简单的非平凡纽结，等于环面纽结 T(2,3)' },
  { id: 'figure-eight', symbol: '4_1', name: '八字结', p: null, q: null, crossingNumber: 4, genus: 1, jones: { '-2': 1, '-1': -1, 0: 1, 1: -1, 2: 1 }, note: '唯一的四交叉纽结，与自身镜像相同' },
  { id: 'cinquefoil', symbol: '5_1', name: '五叶结', p: 2, q: 5, crossingNumber: 5, genus: 2, jones: { '-2': 1, '-4': 1, '-5': -1, '-6': 1, '-7': -1 }, note: '环面纽结 T(2,5)，五重对称' },
]

/**
 * 按纽结 id 生成其三维曲线采样点。
 * 环面纽结用 T(p,q) 参数化，八字结用专门方程。
 */
export function knotCurve(id: string, samples = 400): Vec3[] {
  const info = KNOT_OPTIONS.find((k) => k.id === id) ?? KNOT_OPTIONS[1]
  if (info.p !== null && info.q !== null) {
    return torusKnotPoints(info.p, info.q, samples)
  }
  return figureEightPoints(samples)
}
