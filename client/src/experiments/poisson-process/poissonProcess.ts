/**
 * 泊松过程核心算法（纯函数，便于测试）
 *
 * 泊松过程描述随机独立到达的计数：顾客到店、粒子衰变、网站请求。
 * 关键性质：相邻两次到达的时间间隔服从参数为 λ 的指数分布。
 * 这里用逆变换采样 gap = -ln(u)/λ 生成到达时刻，再由此累计计数 N(t)。
 */

/** 可选的到达速率 λ（单位：次/单位时间） */
export const RATES = [0.5, 1, 2]

/** 线性同余伪随机，返回开区间 (0,1)，保证可复现 */
function makeRng(seed: number): () => number {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return (s + 1) / (0x7fffffff + 2)
  }
}

/**
 * 模拟泊松过程的到达时刻序列。
 * 用指数间隔逆变换：gap = -ln(u)/λ，累加直到超过时间上限 T。
 * @returns 升序排列的到达时刻数组（均 <= T）
 */
export function simulateArrivals(rate: number, T: number, seed = 1): number[] {
  if (rate <= 0 || T <= 0) return []
  const rand = makeRng(seed)
  const arrivals: number[] = []
  let t = 0
  for (let i = 0; i < 100000; i++) {
    const u = rand()
    const gap = -Math.log(u) / rate
    t += gap
    if (t > T) break
    arrivals.push(t)
  }
  return arrivals
}

/** 计数过程 N(t)：统计时刻 t 之前（含 t）已发生的到达次数 */
export function countProcess(arrivals: number[], t: number): number {
  let n = 0
  for (const a of arrivals) {
    if (a <= t) n++
    else break
  }
  return n
}

/** 阶乘（k 为非负整数） */
export function factorial(k: number): number {
  let f = 1
  for (let i = 2; i <= k; i++) f *= i
  return f
}

/**
 * 泊松分布理论概率质量：P(N=k) = e^{-λt} (λt)^k / k!
 * @param lambdaT 期望到达数 λ·t
 */
export function poissonPmf(k: number, lambdaT: number): number {
  if (k < 0 || !Number.isInteger(k) || lambdaT < 0) return 0
  return (Math.exp(-lambdaT) * Math.pow(lambdaT, k)) / factorial(k)
}
