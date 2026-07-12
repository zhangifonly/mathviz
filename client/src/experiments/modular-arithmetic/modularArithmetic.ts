/**
 * 模运算与同余（纯函数，便于测试，不触碰 DOM）
 *
 * 模运算把整数“绕圈”到 0..n-1 之间，就像时钟到 12 点又回到 0。
 * 同余 a ≡ b (mod n) 表示 a 与 b 除以 n 的余数相同。
 * 把「乘法表」画到一个圆环上，会涌现出心形线、肾脏线等惊艳图案。
 */

/** 规范化取模，结果始终落在 [0, n)，即使 a 为负数也正确 */
export function mod(a: number, n: number): number {
  return ((a % n) + n) % n
}

/** 模加法 (a + b) mod n */
export function addMod(a: number, b: number, n: number): number {
  return mod(a + b, n)
}

/** 模乘法 (a * b) mod n */
export function mulMod(a: number, b: number, n: number): number {
  return mod(a * b, n)
}

/** 快速幂求模 base^exp mod n（平方-乘法算法，避免大数溢出） */
export function powMod(base: number, exp: number, n: number): number {
  if (n === 1) return 0
  let result = 1
  let b = mod(base, n)
  let e = exp
  while (e > 0) {
    if (e & 1) result = mulMod(result, b, n)
    b = mulMod(b, b, n)
    e = Math.floor(e / 2)
  }
  return result
}

/** 判断 a 与 b 是否模 n 同余 */
export function isCongruent(a: number, b: number, n: number): boolean {
  return mod(a, n) === mod(b, n)
}

/** 圆环上第 i 个点的坐标（单位圆，顶部为起点，顺时针） */
export function pointOnCircle(i: number, n: number, radius: number): { x: number; y: number } {
  const angle = (i / n) * Math.PI * 2 - Math.PI / 2
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
}

/** 模乘法圆环数据：把点 i 连到点 (i*k) mod n，得到乘法表图案 */
export interface CircleData {
  n: number
  k: number
  chords: [number, number][]
}

/** 构造模乘法圆环：n 个点，连线 i -> (i*k) mod n */
export function buildCircleData(n: number, k: number): CircleData {
  const chords: [number, number][] = []
  for (let i = 0; i < n; i++) chords.push([i, mulMod(i, k, n)])
  return { n, k, chords }
}

export interface MultiplierOption {
  k: number
  label: string
  note: string
}

/** 可交互的乘数选项，每个乘数对应一种经典图案 */
export const MULTIPLIER_OPTIONS: MultiplierOption[] = [
  { k: 2, label: '×2', note: '心形线 (cardioid)' },
  { k: 3, label: '×3', note: '肾脏线 (nephroid)' },
  { k: 4, label: '×4', note: '三尖瓣曲线' },
  { k: 5, label: '×5', note: '四尖瓣曲线' },
  { k: 51, label: '×51', note: '繁复的花瓣缠绕' },
  { k: 99, label: '×99', note: '近乎星芒的密网' },
]
