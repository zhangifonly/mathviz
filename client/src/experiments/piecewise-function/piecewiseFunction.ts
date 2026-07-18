/** 分段函数核心算法（纯函数）：evalPiecewise 按区间求值，checkContinuity 比较左右极限判断连续/跳跃间断。 */

export interface Piece {
  lo: number
  hi: number
  loIncl: boolean
  hiIncl: boolean
  fn: (x: number) => number
  label: string
}

export interface PiecewiseDef {
  name: string
  pieces: Piece[]
  domain: [number, number]
  breakpoints: number[]
}

/** 判断 x 是否落在某段区间内 */
export function inPiece(p: Piece, x: number): boolean {
  const okLo = p.loIncl ? x >= p.lo : x > p.lo
  const okHi = p.hiIncl ? x <= p.hi : x < p.hi
  return okLo && okHi
}

/** 在分段函数上求值，落不到任何区间返回 NaN */
export function evalPiecewise(def: PiecewiseDef, x: number): number {
  for (const p of def.pieces) {
    if (inPiece(p, x)) return p.fn(x)
  }
  return NaN
}

/** 数值逼近左极限：从左侧趋近 b */
export function leftLimit(def: PiecewiseDef, b: number, eps = 1e-6): number {
  return evalPiecewise(def, b - eps)
}

/** 数值逼近右极限：从右侧趋近 b */
export function rightLimit(def: PiecewiseDef, b: number, eps = 1e-6): number {
  return evalPiecewise(def, b + eps)
}

export interface ContinuityResult {
  breakpoint: number
  left: number
  right: number
  jump: number
  kind: 'continuous' | 'jump'
}

/** 比较分段点左右极限，判断连续或跳跃间断 */
export function checkContinuity(def: PiecewiseDef, breakpoint: number, tol = 1e-4): ContinuityResult {
  const left = leftLimit(def, breakpoint)
  const right = rightLimit(def, breakpoint)
  const jump = right - left
  const kind = Math.abs(jump) < tol ? 'continuous' : 'jump'
  return { breakpoint, left, right, jump, kind }
}

/** 采样整条曲线用于绘制：NaN 处断开 */
export function sampleCurve(def: PiecewiseDef, n = 400): [number, number][] {
  const [a, b] = def.domain
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n
    pts.push([x, evalPiecewise(def, x)])
  }
  return pts
}

export const SAMPLES: PiecewiseDef[] = [
  {
    name: '绝对值 |x|', domain: [-4, 4], breakpoints: [0], pieces: [
      { lo: -4, hi: 0, loIncl: true, hiIncl: false, fn: (x) => -x, label: '-x, x<0' },
      { lo: 0, hi: 4, loIncl: true, hiIncl: true, fn: (x) => x, label: 'x, x>=0' },
    ],
  },
  {
    name: '符号函数 sgn(x)', domain: [-4, 4], breakpoints: [0], pieces: [
      { lo: -4, hi: 0, loIncl: true, hiIncl: false, fn: () => -1, label: '-1, x<0' },
      { lo: 0, hi: 0, loIncl: true, hiIncl: true, fn: () => 0, label: '0, x=0' },
      { lo: 0, hi: 4, loIncl: false, hiIncl: true, fn: () => 1, label: '1, x>0' },
    ],
  },
  {
    name: '取整函数 floor(x)', domain: [-3, 3], breakpoints: [-2, -1, 0, 1, 2],
    pieces: [-3, -2, -1, 0, 1, 2].map((k) => ({
      lo: k, hi: k + 1, loIncl: true, hiIncl: false, fn: () => k, label: `${k}, ${k}<=x<${k + 1}`,
    })),
  },
  {
    name: '自定义 抛物线接直线', domain: [-3, 3], breakpoints: [0], pieces: [
      { lo: -3, hi: 0, loIncl: true, hiIncl: false, fn: (x) => x * x, label: 'x^2, x<0' },
      { lo: 0, hi: 3, loIncl: true, hiIncl: true, fn: (x) => x + 1, label: 'x+1, x>=0' },
    ],
  },
]
