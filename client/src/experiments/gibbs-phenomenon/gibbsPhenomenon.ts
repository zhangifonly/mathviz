/**
 * 吉布斯现象核心算法（纯函数，便于测试）
 *
 * 方波的傅里叶级数在跳变点附近，其部分和会产生固定约 9% 的过冲，
 * 且过冲幅度不随项数增加而消失，只是振铃越挤越窄，这就是吉布斯现象。
 *
 * 目标方波（周期 2π）：在 (0,π) 取 +π/4，在 (-π,0) 取 -π/4，跳变量 π/2。
 * 其傅里叶部分和为 Σ_{k=1}^{n} sin((2k-1)x)/(2k-1)。
 */

/** 方波在 (0,π) 上的目标电平 π/4 */
export const TARGET_AMP = Math.PI / 4

/** 跳变点 x=0 处的总跳变量 π/2 */
export const JUMP = Math.PI / 2

/**
 * 方波傅里叶部分和：S_n(x) = Σ_{k=1}^{nTerms} sin((2k-1)x)/(2k-1)
 * 只用奇次谐波，是奇函数，收敛到目标方波。
 */
export function squarePartialSum(x: number, nTerms: number): number {
  let s = 0
  for (let k = 1; k <= nTerms; k++) {
    const m = 2 * k - 1
    s += Math.sin(m * x) / m
  }
  return s
}

/** 理想目标方波（周期 2π），跳变点处取 0 */
export function squareTarget(x: number): number {
  let t = x % (2 * Math.PI)
  if (t < 0) t += 2 * Math.PI
  if (Math.abs(t) < 1e-12 || Math.abs(t - Math.PI) < 1e-12 || Math.abs(t - 2 * Math.PI) < 1e-12) {
    return 0
  }
  return t < Math.PI ? TARGET_AMP : -TARGET_AMP
}

/**
 * 跳变点 x=0 右侧最靠近的过冲峰。
 * 部分和导数 Σcos((2k-1)x)=sin(2nx)/(2 sinx)，第一个极大在 x=π/(2n)。
 */
export function overshootPeak(nTerms: number): { x: number; value: number } {
  const x = Math.PI / (2 * nTerms)
  return { x, value: squarePartialSum(x, nTerms) }
}

/** 过冲量占跳变量的比例，n→∞ 时趋于约 0.0895（吉布斯常数） */
export function overshootFraction(nTerms: number): number {
  const peak = overshootPeak(nTerms).value
  return (peak - TARGET_AMP) / JUMP
}

/** 三档演示项数 */
export const TERM_COUNTS = [5, 15, 50]
