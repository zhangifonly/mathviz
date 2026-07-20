/**
 * 斐波那契与自然核心算法（纯函数，便于测试）
 *
 * 斐波那契数列 F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)。
 * 相邻两项之比趋近黄金比 phi=1.618...，对应的黄金角约 137.5 度。
 * 向日葵种子按黄金角螺旋排布（phyllotaxis），得到最均匀的填充。
 */

export const GOLDEN_ANGLE = 137.5
/** 可选发散角：黄金角、略偏、以及 90 度对照 */
export const ANGLES = [137.5, 137.3, 90]

/** 斐波那契数列前 n 项（n>=0），返回长度为 n 的数组 */
export function fibonacci(n: number): number[] {
  const out: number[] = []
  let a = 0
  let b = 1
  for (let i = 0; i < n; i++) {
    out.push(a)
    const next = a + b
    a = b
    b = next
  }
  return out
}

/** 相邻两项之比 F(i+1)/F(i)，趋近黄金比。跳过除零，返回长度约 n-2 的数组 */
export function ratios(n: number): number[] {
  const fib = fibonacci(n)
  const out: number[] = []
  for (let i = 1; i < fib.length - 1; i++) {
    if (fib[i] === 0) continue
    out.push(fib[i + 1] / fib[i])
  }
  return out
}

export interface Seed {
  x: number
  y: number
}

/**
 * 向日葵种子排布：第 i 个种子极坐标 r=sqrt(i)，theta=i*角度。
 * @param count 种子数量
 * @param angleDeg 相邻种子的发散角（度），默认黄金角 137.5
 * @returns 直角坐标 {x, y} 数组，中心在原点
 */
export function phyllotaxis(count: number, angleDeg = GOLDEN_ANGLE): Seed[] {
  const seeds: Seed[] = []
  const step = (angleDeg * Math.PI) / 180
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(i)
    const theta = i * step
    seeds.push({ x: r * Math.cos(theta), y: r * Math.sin(theta) })
  }
  return seeds
}

export const SEED_COUNTS = [200, 500, 1000]
