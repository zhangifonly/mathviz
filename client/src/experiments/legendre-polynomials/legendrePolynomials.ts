/**
 * 勒让德多项式核心算法（纯函数，便于测试）
 *
 * 勒让德多项式 P_n(x) 是区间 [-1,1] 上关于权重 1 的正交多项式族。
 * 递推关系（Bonnet 递推）：
 *   P_0(x) = 1
 *   P_1(x) = x
 *   (n+1) P_{n+1}(x) = (2n+1) x P_n(x) - n P_{n-1}(x)
 * 正交性：∫_{-1}^{1} P_m(x) P_n(x) dx = 0  (m != n)
 *                                    = 2/(2n+1)  (m == n)
 */

/** 用 Bonnet 递推计算 P_n(x) */
export function legendreP(n: number, x: number): number {
  if (n < 0) return 0
  if (n === 0) return 1
  if (n === 1) return x
  let pPrev = 1 // P_0
  let pCurr = x // P_1
  for (let k = 1; k < n; k++) {
    const pNext = ((2 * k + 1) * x * pCurr - k * pPrev) / (k + 1)
    pPrev = pCurr
    pCurr = pNext
  }
  return pCurr
}

/** 在 [-1,1] 上用 steps 段复合辛普森法数值积分 f */
export function integrate(f: (x: number) => number, steps = 2000): number {
  const n = steps % 2 === 0 ? steps : steps + 1
  const h = 2 / n // 区间长度 2，从 -1 到 1
  let sum = f(-1) + f(1)
  for (let i = 1; i < n; i++) {
    const x = -1 + i * h
    sum += (i % 2 === 1 ? 4 : 2) * f(x)
  }
  return (sum * h) / 3
}

/** 数值计算内积 <P_m, P_n> = ∫_{-1}^1 P_m P_n dx */
export function innerProduct(m: number, n: number, steps = 2000): number {
  return integrate((x) => legendreP(m, x) * legendreP(n, x), steps)
}

/** 正交性矩阵：对 degrees 中各阶两两求内积，对角非零、其余近零 */
export function orthogonalityMatrix(degrees: number[], steps = 2000): number[][] {
  return degrees.map((m) => degrees.map((n) => innerProduct(m, n, steps)))
}

/** 采样一条 P_n 曲线，返回 [-1,1] 上的 (x,y) 点数组 */
export function sampleCurve(n: number, samples = 200): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i <= samples; i++) {
    const x = -1 + (2 * i) / samples
    pts.push({ x, y: legendreP(n, x) })
  }
  return pts
}

/** 演示用阶数集合 */
export const DEGREES = [1, 2, 3, 4]
