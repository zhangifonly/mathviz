/**
 * 阻尼振荡核心（纯函数，便于测试）
 *
 * 阻尼弹簧振子运动方程：m x'' + c x' + k x = 0。
 * 令固有角频率 omega = sqrt(k/m)，阻尼比 zeta = c / (2 sqrt(m k))，
 * 方程化为 x'' + 2 zeta omega x' + omega^2 x = 0。
 * 初始条件取 x(0)=1, x'(0)=0，按 zeta 分三种情形给出解析解。
 */

/** 阻尼比三挡：欠阻尼 / 临界阻尼 / 过阻尼 */
export const ZETA_VALUES = [0.2, 1, 2]

/** 阻尼类型判定 */
export function dampingType(zeta: number): 'under' | 'critical' | 'over' {
  if (zeta < 1) return 'under'
  if (zeta > 1) return 'over'
  return 'critical'
}

/**
 * 位移解析解 x(t)。初始 x(0)=1, x'(0)=0。
 * - 欠阻尼(zeta<1)：衰减振荡 e^{-zeta w t}(cos wd t + (zeta w / wd) sin wd t)
 * - 临界(zeta=1)：(1 + w t) e^{-w t}
 * - 过阻尼(zeta>1)：两指数衰减的组合
 */
export function position(t: number, zeta: number, omega = 1): number {
  const zw = zeta * omega
  if (zeta < 1) {
    const wd = omega * Math.sqrt(1 - zeta * zeta)
    return (
      Math.exp(-zw * t) *
      (Math.cos(wd * t) + (zw / wd) * Math.sin(wd * t))
    )
  }
  if (zeta === 1) {
    return (1 + omega * t) * Math.exp(-omega * t)
  }
  const r = omega * Math.sqrt(zeta * zeta - 1)
  const r1 = -zw + r
  const r2 = -zw - r
  // x = A e^{r1 t} + B e^{r2 t}, 满足 x(0)=1, x'(0)=0
  const A = -r2 / (r1 - r2)
  const B = r1 / (r1 - r2)
  return A * Math.exp(r1 * t) + B * Math.exp(r2 * t)
}

/** 阻尼振荡角频率 wd（仅欠阻尼有意义，其余返回 0） */
export function dampedFrequency(zeta: number, omega = 1): number {
  if (zeta >= 1) return 0
  return omega * Math.sqrt(1 - zeta * zeta)
}

/** 采样一条位移-时间曲线，返回 [t, x] 数组 */
export function sampleCurve(
  zeta: number,
  omega = 1,
  tMax = 20,
  steps = 400,
): Array<[number, number]> {
  const pts: Array<[number, number]> = []
  for (let i = 0; i <= steps; i++) {
    const t = (tMax * i) / steps
    pts.push([t, position(t, zeta, omega)])
  }
  return pts
}
