/**
 * 反函数核心算法（纯函数，便于测试）
 *
 * 若 f 是可逆的（单调），则存在反函数 inv，使 inv(f(x)) = x。
 * 从几何看，y=f(x) 与 y=inv(x) 的图象关于直线 y=x 对称：
 * 点 (a,b) 在原函数上，则 (b,a) 必在反函数上。
 */

export interface FnDef {
  key: string
  label: string
  fn: (x: number) => number
  inv: (x: number) => number
  domain: [number, number]
}

export interface Pt {
  x: number
  y: number
}

/** 把平面上一点关于直线 y=x 对称：(x,y) -> (y,x) */
export function reflectPoint(p: Pt): Pt {
  return { x: p.y, y: p.x }
}

/** 在 [domain] 上等距采样 fn 的曲线点集 */
export function sampleCurve(
  fn: (x: number) => number,
  domain: [number, number],
  n = 120,
): Pt[] {
  const [a, b] = domain
  const pts: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n
    const y = fn(x)
    if (Number.isFinite(y)) pts.push({ x, y })
  }
  return pts
}

/** 由原函数采样点，逐点关于 y=x 反射得到反函数曲线点集 */
export function reflectCurve(pts: Pt[]): Pt[] {
  return pts.map(reflectPoint)
}

/** 可逆函数及其反函数对 */
export const FUNCTIONS: FnDef[] = [
  {
    key: 'linear',
    label: 'f(x) = 2x + 1',
    fn: (x) => 2 * x + 1,
    inv: (x) => (x - 1) / 2,
    domain: [-3, 3],
  },
  {
    key: 'exp',
    label: 'f(x) = eˣ',
    fn: (x) => Math.exp(x),
    inv: (x) => Math.log(x),
    domain: [-2, 1.6],
  },
  {
    key: 'cube',
    label: 'f(x) = x³',
    fn: (x) => x * x * x,
    inv: (x) => Math.cbrt(x),
    domain: [-1.8, 1.8],
  },
  {
    key: 'sqrt',
    label: 'f(x) = √x',
    fn: (x) => Math.sqrt(x),
    inv: (x) => x * x,
    domain: [0, 5],
  },
]

/** 按 key 取出函数定义 */
export function getFunction(key: string): FnDef {
  return FUNCTIONS.find((f) => f.key === key) ?? FUNCTIONS[0]
}
