/**
 * 模拟退火（Simulated Annealing）纯函数内核（无 DOM，便于测试）
 *
 * 灵感来自金属退火：先高温让原子自由跳动，再缓慢降温，
 * 系统逐步落入低能量的稳定态。用于在多峰函数上寻找全局最小值：
 * 高温时以一定概率接受"变坏"的一步以逃离局部最优，
 * 随温度下降接受概率减小，最终收敛。
 */

/** mulberry32 确定性伪随机数发生器，保证结果可复现、测试稳定 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Metropolis 接受概率：变好(deltaE<=0)必接受返回 1，否则返回 exp(-deltaE/T) */
export function acceptanceProbability(deltaE: number, temperature: number): number {
  if (deltaE <= 0) return 1
  if (temperature <= 0) return 0
  return Math.exp(-deltaE / temperature)
}

export type CoolingSchedule = 'geometric' | 'exponential' | 'linear'

/** 第 k 步的温度。几何:T0*alpha^k；指数:T0*exp(-rate*k)；线性:T0*(1-k/steps) */
export function temperatureAt(
  k: number,
  T0: number,
  rate: number,
  steps: number,
  schedule: CoolingSchedule,
): number {
  if (schedule === 'geometric') return T0 * Math.pow(rate, k)
  if (schedule === 'exponential') return T0 * Math.exp(-rate * k)
  // linear：夹逼到一个极小正值，避免温度为 0
  return Math.max(T0 * (1 - k / steps), 1e-6)
}

/** 对能量函数在定义域上采样，供绘制曲线用 */
export function sampleCurve(
  energy: (x: number) => number,
  domain: [number, number],
  n: number,
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = []
  const [lo, hi] = domain
  for (let i = 0; i < n; i++) {
    const x = lo + ((hi - lo) * i) / (n - 1)
    pts.push({ x, y: energy(x) })
  }
  return pts
}

export interface AnnealStep {
  step: number
  x: number
  energy: number
  candidate: number
  candidateEnergy: number
  temperature: number
  accepted: boolean
  bestX: number
  bestEnergy: number
}

export interface AnnealConfig {
  energy: (x: number) => number
  domain: [number, number]
  x0: number
  T0: number
  rate: number
  steps: number
  stepSize: number
  schedule: CoolingSchedule
  seed: number
}

export interface AnnealResult {
  trajectory: AnnealStep[]
  samples: { x: number; y: number }[]
  domain: [number, number]
  yMin: number
  yMax: number
  bestX: number
  bestEnergy: number
}

/** 把 x 反射夹逼回定义域内，保证候选点合法 */
function clampReflect(x: number, lo: number, hi: number): number {
  if (x < lo) return lo + (lo - x)
  if (x > hi) return hi - (x - hi)
  return Math.max(lo, Math.min(hi, x))
}

/** 运行一次完整的模拟退火，返回轨迹与采样曲线（确定性，由 seed 决定） */
export function runAnneal(config: AnnealConfig): AnnealResult {
  const { energy, domain, x0, T0, rate, steps, stepSize, schedule, seed } = config
  const [lo, hi] = domain
  const rng = mulberry32(seed)

  let x = clampReflect(x0, lo, hi)
  let e = energy(x)
  let bestX = x
  let bestEnergy = e
  const trajectory: AnnealStep[] = []

  for (let k = 0; k < steps; k++) {
    const temperature = temperatureAt(k, T0, rate, steps, schedule)
    // 以当前点为中心的高斯式扰动（用两次均匀近似），温度越高步幅越大
    const jump = (rng() - rng()) * stepSize * (0.3 + temperature / T0)
    const candidate = clampReflect(x + jump, lo, hi)
    const candidateEnergy = energy(candidate)
    const deltaE = candidateEnergy - e
    const p = acceptanceProbability(deltaE, temperature)
    const accepted = rng() < p
    if (accepted) {
      x = candidate
      e = candidateEnergy
      if (e < bestEnergy) {
        bestEnergy = e
        bestX = x
      }
    }
    trajectory.push({
      step: k,
      x,
      energy: e,
      candidate,
      candidateEnergy,
      temperature,
      accepted,
      bestX,
      bestEnergy,
    })
  }

  const samples = sampleCurve(energy, domain, 240)
  let yMin = Infinity
  let yMax = -Infinity
  for (const s of samples) {
    if (s.y < yMin) yMin = s.y
    if (s.y > yMax) yMax = s.y
  }

  return { trajectory, samples, domain, yMin, yMax, bestX, bestEnergy }
}

export interface EnergyOption {
  id: string
  label: string
  note: string
  energy: (x: number) => number
  domain: [number, number]
  x0: number
  /** 已知全局最小值所在的 x（用于测试与展示） */
  globalMinX: number
}

/**
 * 多峰能量函数库。都在有限区间上定义，含多个局部极小，
 * 用于展示"贪心会卡在局部最优，退火能跳出去"。
 */
export const ENERGY_OPTIONS: EnergyOption[] = [
  {
    id: 'multi-well',
    label: '多峰波浪',
    note: '正弦叠加抛物线，多个局部低谷',
    energy: (x) => Math.sin(3 * x) + 0.3 * x * x,
    domain: [-4, 4],
    x0: 3.5,
    globalMinX: -0.4956,
  },
  {
    id: 'ripple',
    label: '涟漪坑',
    note: '中心深坑外围层层小坑',
    energy: (x) => 0.15 * x * x + Math.cos(4 * x),
    domain: [-5, 5],
    x0: 4.5,
    globalMinX: 0,
  },
  {
    id: 'twin-valley',
    label: '双谷陷阱',
    note: '一浅一深两个大谷，易困浅谷',
    energy: (x) => 0.05 * (x * x - 9) * (x * x - 9) - 1.2 * x,
    domain: [-4, 4],
    x0: -3.5,
    globalMinX: 3.146,
  },
]

export type CoolingOption = {
  id: CoolingSchedule
  label: string
  note: string
}

export const COOLING_OPTIONS: CoolingOption[] = [
  { id: 'geometric', label: '几何降温', note: '每步乘以 alpha，最常用' },
  { id: 'exponential', label: '指数降温', note: '按指数衰减，前期快' },
  { id: 'linear', label: '线性降温', note: '匀速下降到接近零' },
]
