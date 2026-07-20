/**
 * 欧几里得算法核心（纯函数）：gcd(a,b)=gcd(b, a mod b)，直到余数为 0。
 * 几何解释：a×b 矩形不断切下最大正方形，最后正方形边长即最大公约数。
 */
export interface GcdStep {
  a: number
  b: number
  q: number
  r: number
}

/** 辗转相除，返回每一步 {a,b,q,r}，其中 a=q*b+r */
export function gcdSteps(a: number, b: number): GcdStep[] {
  let x = Math.abs(Math.trunc(a))
  let y = Math.abs(Math.trunc(b))
  const steps: GcdStep[] = []
  while (y !== 0) {
    const q = Math.floor(x / y)
    const r = x - q * y
    steps.push({ a: x, b: y, q, r })
    x = y
    y = r
  }
  return steps
}

/** 最大公约数（辗转相除最后的非零除数） */
export function gcd(a: number, b: number): number {
  const steps = gcdSteps(a, b)
  return steps.length === 0 ? Math.abs(Math.trunc(a)) : steps[steps.length - 1].b
}

export interface ExtGcd {
  g: number
  x: number
  y: number
}

/** 扩展欧几里得：返回 {g,x,y} 满足 a*x + b*y = g = gcd(a,b) */
export function extendedGcd(a: number, b: number): ExtGcd {
  let oldR = Math.trunc(a)
  let r = Math.trunc(b)
  let oldS = 1
  let s = 0
  let oldT = 0
  let t = 1
  while (r !== 0) {
    const q = Math.floor(oldR / r)
    ;[oldR, r] = [r, oldR - q * r]
    ;[oldS, s] = [s, oldS - q * s]
    ;[oldT, t] = [t, oldT - q * t]
  }
  return { g: oldR, x: oldS, y: oldT }
}

const PALETTE = [
  '#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24',
  '#f87171', '#34d399', '#a78bfa', '#fb923c', '#38bdf8',
]

export interface Square {
  x: number
  y: number
  size: number
  color: string
  step: number
}

/** 正方形切割（几何辗转相除）：在 a×b 矩形内不断切下最大正方形 */
export function squareTiling(a: number, b: number): Square[] {
  let w = Math.abs(Math.trunc(a))
  let h = Math.abs(Math.trunc(b))
  let ox = 0
  let oy = 0
  const squares: Square[] = []
  let step = 0
  while (w > 0 && h > 0) {
    const side = Math.min(w, h)
    const color = PALETTE[step % PALETTE.length]
    if (w >= h) {
      const count = Math.floor(w / h)
      for (let i = 0; i < count; i++) {
        squares.push({ x: ox + i * side, y: oy, size: side, color, step })
      }
      ox += count * side
      w -= count * side
    } else {
      const count = Math.floor(h / w)
      for (let i = 0; i < count; i++) {
        squares.push({ x: ox, y: oy + i * side, size: side, color, step })
      }
      oy += count * side
      h -= count * side
    }
    step++
  }
  return squares
}

export const SAMPLES: number[][] = [[48, 36], [1071, 462], [17, 5]]
