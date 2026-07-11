/**
 * SIR 传染病模型（纯函数，便于测试，不触碰 DOM）
 *
 * 把人群分成三类：易感者 S、感染者 I、康复者 R。
 * 微分方程（用人群比例 s + i + r = 1 表示）：
 *   ds/dt = -beta * s * i
 *   di/dt =  beta * s * i - gamma * i
 *   dr/dt =  gamma * i
 * 其中 beta 是有效接触传染率，gamma 是康复率。
 * 基本再生数 R0 = beta / gamma，决定疫情是否爆发。
 */

/** 单个时刻的人群比例（占总人口的份额，三者之和恒为 1） */
export interface SIRPoint {
  t: number // 天
  s: number // 易感比例
  i: number // 感染比例
  r: number // 康复比例
}

/** 模拟参数 */
export interface SIRParams {
  beta: number // 传染率
  gamma: number // 康复率
  i0: number // 初始感染比例（0~1）
  days: number // 模拟总天数
  dt: number // 积分步长（天）
}

/** SIR 微分方程右端项（导数），输入输出均为比例 */
export function sirDerivatives(
  s: number,
  i: number,
  beta: number,
  gamma: number,
): { ds: number; di: number; dr: number } {
  const newInfections = beta * s * i
  const recoveries = gamma * i
  return { ds: -newInfections, di: newInfections - recoveries, dr: recoveries }
}

/**
 * 用四阶龙格库塔法（RK4）积分 SIR 方程，返回逐日比例序列。
 * RK4 比欧拉法精度高很多，能保证 s+i+r 高度守恒。
 */
export function simulateSIR(params: SIRParams): SIRPoint[] {
  const { beta, gamma, i0, days, dt } = params
  const steps = Math.max(1, Math.round(days / dt))
  let s = 1 - i0
  let i = i0
  let r = 0
  const out: SIRPoint[] = [{ t: 0, s, i, r }]

  const step = (cs: number, ci: number) => sirDerivatives(cs, ci, beta, gamma)

  for (let n = 1; n <= steps; n++) {
    const k1 = step(s, i)
    const k2 = step(s + (dt / 2) * k1.ds, i + (dt / 2) * k1.di)
    const k3 = step(s + (dt / 2) * k2.ds, i + (dt / 2) * k2.di)
    const k4 = step(s + dt * k3.ds, i + dt * k3.di)
    s += (dt / 6) * (k1.ds + 2 * k2.ds + 2 * k3.ds + k4.ds)
    i += (dt / 6) * (k1.di + 2 * k2.di + 2 * k3.di + k4.di)
    r += (dt / 6) * (k1.dr + 2 * k2.dr + 2 * k3.dr + k4.dr)
    // 数值兜底，防止微小负值
    s = Math.max(0, s)
    i = Math.max(0, i)
    r = Math.max(0, r)
    out.push({ t: n * dt, s, i, r })
  }
  return out
}

/** 基本再生数 R0 = beta / gamma */
export function computeR0(beta: number, gamma: number): number {
  if (gamma <= 0) return Infinity
  return beta / gamma
}

/**
 * 群体免疫阈值：当免疫比例超过 1 - 1/R0 时疫情无法持续扩散。
 * R0 <= 1 时无需群体免疫，返回 0。
 */
export function herdImmunityThreshold(r0: number): number {
  if (r0 <= 1) return 0
  return 1 - 1 / r0
}

/** 找到感染比例峰值及其出现的天数 */
export function peakInfection(series: SIRPoint[]): { day: number; value: number } {
  let day = 0
  let value = -1
  for (const p of series) {
    if (p.i > value) {
      value = p.i
      day = p.t
    }
  }
  return { day, value }
}

/** 疫情结束时的累计感染规模（最终康复比例 = 曾被感染的总比例） */
export function finalEpidemicSize(series: SIRPoint[]): number {
  return series.length ? series[series.length - 1].r : 0
}

/** 预设情景选项，供 UI 快速切换 */
export interface ScenarioOption {
  key: string
  label: string
  beta: number
  gamma: number
  note: string
}

export const SCENARIO_OPTIONS: ScenarioOption[] = [
  { key: 'mild', label: '温和流行', beta: 0.3, gamma: 0.1, note: 'R0 = 3，普通季节性流感量级' },
  { key: 'severe', label: '猛烈爆发', beta: 0.6, gamma: 0.1, note: 'R0 = 6，高传染性疫情' },
  { key: 'contained', label: '有效防控', beta: 0.12, gamma: 0.1, note: 'R0 = 1.2，接近可控临界' },
  { key: 'suppressed', label: '成功压制', beta: 0.08, gamma: 0.1, note: 'R0 = 0.8，疫情自然消退' },
]
