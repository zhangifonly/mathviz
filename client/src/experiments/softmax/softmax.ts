/**
 * Softmax 函数核心算法（纯函数，便于测试）
 *
 * softmax 把一组任意实数分数(logits)归一化成一个概率分布：
 *   softmax(z_i) = exp(z_i / T) / Σ_j exp(z_j / T)
 * 输出全为正且总和为 1。这里用数值稳定版：先减去最大值再取指数，
 * 避免 exp 溢出。温度 T 控制分布的尖锐程度：T 越小越尖锐，T 越大越均匀。
 */

/** 数值稳定的 softmax。temperature 默认为 1。 */
export function softmax(logits: number[], temperature = 1): number[] {
  if (logits.length === 0) return []
  const t = temperature <= 0 ? 1e-6 : temperature
  const scaled = logits.map((z) => z / t)
  const maxZ = Math.max(...scaled)
  const exps = scaled.map((z) => Math.exp(z - maxZ))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

/** 概率分布之和（理论上恒为 1，用于验证与展示）。 */
export function probSum(probs: number[]): number {
  return probs.reduce((a, b) => a + b, 0)
}

/** 取概率最大项的下标（argmax）。 */
export function argmax(values: number[]): number {
  let best = 0
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[best]) best = i
  }
  return best
}

/** 分布的香农熵（以 e 为底），温度越高熵越大，衡量均匀程度。 */
export function entropy(probs: number[]): number {
  let h = 0
  for (const p of probs) {
    if (p > 0) h -= p * Math.log(p)
  }
  return h
}

/** 示例 logits：一组未归一化的原始分数。 */
export const SAMPLE_LOGITS = [2.0, 1.0, 0.1, -0.5, 1.5]

/** 可选的温度档位。 */
export const TEMPERATURES = [0.5, 1, 2, 5]
