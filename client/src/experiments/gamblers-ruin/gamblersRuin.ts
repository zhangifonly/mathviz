/**
 * 赌徒破产核心算法（纯函数，便于测试）
 *
 * 赌徒初始资金 i，目标 N（钱到 N 收手，到 0 破产）。每局以概率 p 赢 1 元、
 * 1-p 输 1 元。这是一维随机游走带两个吸收壁的经典模型。
 * ruinProbability 给出理论破产概率，simulate 用伪随机种子模拟一整局。
 */

export interface WalkResult {
  path: number[]   // 资金随时间的轨迹（含起点）
  ruined: boolean  // true=触 0 破产, false=触 N 达标
  steps: number    // 总步数
}

/**
 * 理论破产概率：从资金 i 出发（0<i<N）最终破产（先到 0）的概率。
 * p=0.5 时为 (N-i)/N；否则 r=(1-p)/p，公式 (r^i - r^N)/(1 - r^N)。
 */
export function ruinProbability(i: number, N: number, p: number): number {
  if (N <= 0) return 0
  if (i <= 0) return 1
  if (i >= N) return 0
  if (Math.abs(p - 0.5) < 1e-9) return (N - i) / N
  const r = (1 - p) / p
  return (Math.pow(r, i) - Math.pow(r, N)) / (1 - Math.pow(r, N))
}

/** 达标概率（先到 N），与破产概率互补。 */
export function reachProbability(i: number, N: number, p: number): number {
  return 1 - ruinProbability(i, N, p)
}

/** 模拟一整局到吸收（0 或 N）。maxSteps 防止极端参数下不停机。 */
export function simulate(
  i: number,
  N: number,
  p: number,
  seed = 1,
  maxSteps = 20000,
): WalkResult {
  let s = seed >>> 0
  const rand = () => {
    // 线性同余伪随机，保证可复现
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  let money = Math.max(0, Math.min(N, Math.floor(i)))
  const path = [money]
  let steps = 0
  while (money > 0 && money < N && steps < maxSteps) {
    money += rand() < p ? 1 : -1
    path.push(money)
    steps++
  }
  return { path, ruined: money <= 0, steps }
}

/** 场景预设：初始本金 i、目标 N、单局胜率 p。 */
export interface Scenario {
  label: string
  i: number
  N: number
  p: number
}

export const SCENARIOS: Scenario[] = [
  { label: '公平赌局', i: 10, N: 20, p: 0.5 },
  { label: '略微不利', i: 10, N: 20, p: 0.48 },
  { label: '赌场优势', i: 20, N: 40, p: 0.45 },
  { label: '以小博大', i: 5, N: 50, p: 0.5 },
]
