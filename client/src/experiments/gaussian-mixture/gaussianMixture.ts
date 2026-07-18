// 一维高斯混合模型 (GMM) 与 EM 算法（纯函数）
// E 步算责任度，M 步用责任度加权更新 μ/σ/权重，迭代至对数似然收敛。

export interface Component { mu: number; sigma: number; weight: number }

// 一维高斯概率密度
export function gaussianPdf(x: number, mu: number, sigma: number): number {
  const s = Math.max(sigma, 1e-6)
  const z = (x - mu) / s
  return Math.exp(-0.5 * z * z) / (s * Math.sqrt(2 * Math.PI))
}

/** 真实分量（用于合成数据）：三个可分辨的簇 */
export const COMPONENTS: Component[] = [
  { mu: 2.0, sigma: 0.6, weight: 0.35 },
  { mu: 5.5, sigma: 0.8, weight: 0.4 },
  { mu: 9.0, sigma: 0.5, weight: 0.25 },
]

/** 可复现的随机种子集合 */
export const SEEDS = [1, 7, 42, 99]

/** 线性同余伪随机，返回 [0,1) */
function makeRand(seed: number): () => number {
  let s = seed & 0x7fffffff
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
}

/** Box-Muller：由均匀随机生成标准正态 */
function gaussSample(rand: () => number): number {
  return Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-9))) * Math.cos(2 * Math.PI * rand())
}

/** 依据分量按权重合成 n 个数据点 */
export function makeData(n: number, seed = 1, comps: Component[] = COMPONENTS): number[] {
  const rand = makeRand(seed)
  const cum: number[] = []
  let acc = 0
  for (const c of comps) { acc += c.weight; cum.push(acc) }
  const data: number[] = []
  for (let i = 0; i < n; i++) {
    const r = rand() * acc
    let k = 0
    while (k < cum.length - 1 && r > cum[k]) k++
    data.push(comps[k].mu + gaussSample(rand) * comps[k].sigma)
  }
  return data
}

/** 初始猜测：把数据范围等分成 K 段作为初始均值 */
export function initParams(data: number[], k: number): Component[] {
  const lo = Math.min(...data)
  const span = (Math.max(...data) - lo) || 1
  return Array.from({ length: k }, (_, i) => ({
    mu: lo + (span * (i + 0.5)) / k, sigma: span / (2 * k), weight: 1 / k,
  }))
}

// 对数似然，用于判断收敛
export function logLikelihood(data: number[], params: Component[]): number {
  return data.reduce((ll, x) => {
    const p = params.reduce((a, c) => a + c.weight * gaussianPdf(x, c.mu, c.sigma), 0)
    return ll + Math.log(Math.max(p, 1e-300))
  }, 0)
}

// 执行一次 EM 迭代：E 步算责任度(resp) + M 步更新参数
export function emStep(data: number[], params: Component[]): Component[] {
  const n = data.length
  const resp: number[][] = data.map((x) => {
    const w = params.map((c) => c.weight * gaussianPdf(x, c.mu, c.sigma))
    const sum = w.reduce((a, b) => a + b, 0) || 1
    return w.map((v) => v / sum)
  })
  // M 步：责任度加权重估 μ/σ/权重
  return params.map((_, j) => {
    let nk = 0, mu = 0
    for (let i = 0; i < n; i++) { nk += resp[i][j]; mu += resp[i][j] * data[i] }
    nk = Math.max(nk, 1e-9)
    mu /= nk
    let varc = 0
    for (let i = 0; i < n; i++) varc += resp[i][j] * (data[i] - mu) ** 2
    return { mu, sigma: Math.sqrt(Math.max(varc / nk, 1e-6)), weight: nk / n }
  })
}

/** 迭代至收敛，返回每一步的参数快照序列 */
export function fitEM(data: number[], k: number, maxIter = 40, tol = 1e-4): Component[][] {
  let params = initParams(data, k)
  const history: Component[][] = [params]
  let prev = logLikelihood(data, params)
  for (let it = 0; it < maxIter; it++) {
    params = emStep(data, params)
    history.push(params)
    const ll = logLikelihood(data, params)
    if (Math.abs(ll - prev) < tol) break
    prev = ll
  }
  return history
}
