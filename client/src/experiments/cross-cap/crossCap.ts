/**
 * 交叉帽（纯函数，便于测试）
 *
 * 实射影平面 RP² 在三维空间中最简单的浸入。构造思路：取一个圆盘，
 * 把边界上每一对对径点粘合 —— 这在三维里无法无自交地完成，
 * 于是必然出现一条自交线段，线段两端各有一个「分支点」(pinch point)。
 *
 * 参数方程（u∈[0,2π] 经度, v∈[0,π/2] 纬度）：
 *   x = cos u · sin 2v
 *   y = sin u · sin 2v
 *   z = cos²v − cos²u · sin²v
 *
 * ⚠️ 常见错误：Wolfram 图示里那个 z = −tanh(u−π)·sin v 的式子在 u 方向
 * 不是 2π 周期的（u=0 与 u=2π 处 z 反号），画出来并不闭合，也没有真正的
 * 自交。要闭合必须用上面这个三角多项式版本。
 *
 * 三种 RP² 浸入的对比：
 *   交叉帽    1 条自交线, 2 个分支点        —— 最简单
 *   罗马曲面  3 条自交线, 6 个分支点, 1 三重点
 *   博伊曲面  自交线呈三叶状, 0 个分支点    —— 最光滑
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [0, 2 * Math.PI]
export const V_RANGE: [number, number] = [0, Math.PI / 2]

/** 交叉帽参数方程。height 纵向拉伸, 便于看清自交段 */
export function crossCap(u: number, v: number, height = 1): Vec3 {
  const cu = Math.cos(u)
  const su = Math.sin(u)
  const sv = Math.sin(v)
  const cv = Math.cos(v)
  return [
    cu * Math.sin(2 * v),
    su * Math.sin(2 * v),
    height * (cv * cv - cu * cu * sv * sv),
  ]
}

/**
 * u 方向是 2π 周期的 —— 这是曲面闭合的前提。
 * 返回同一 v 上 u 与 u+2π 两点的距离，理论上恒为 0。
 */
export function periodGap(u: number, v: number, height = 1): number {
  const a = crossCap(u, v, height)
  const b = crossCap(u + 2 * Math.PI, v, height)
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/**
 * 自交来源：u 与 u+π 在 v=π/2 时映到同一点。
 * v=π/2 时 sin2v=0 故 x=y=0，而 z = −cos²u 只依赖 cos²u，
 * 于是 u 与 u+π 给出完全相同的点 —— 那条 z 轴上的线段就是自交线。
 */
export function antipodalGap(u: number, height = 1): number {
  const a = crossCap(u, Math.PI / 2, height)
  const b = crossCap(u + Math.PI, Math.PI / 2, height)
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/** 自交线段的采样点（z 轴上从 −height 到 0） */
export function selfIntersection(steps = 30, height = 1): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    const u = (Math.PI / 2) * (i / steps)
    pts.push(crossCap(u, Math.PI / 2, height))
  }
  return pts
}

/**
 * 两个分支点：自交线段的两个端点。
 * u=0 与 u=π/2 在 v=π/2 处分别给出 z=−height 与 z=0。
 */
export function branchPoints(height = 1): Vec3[] {
  return [crossCap(0, Math.PI / 2, height), crossCap(Math.PI / 2, Math.PI / 2, height)]
}

/** 欧拉示性数 χ(RP²)=1。球面 2、环面 0、射影平面 1，奇数说明不可定向 */
export const EULER_CHARACTERISTIC = 1

/** 射影平面不可定向 */
export const ORIENTABLE = false

export const PRESETS = [
  { height: 0.6, label: '压扁', note: '自交段变短' },
  { height: 1, label: '标准', note: '经典交叉帽' },
  { height: 1.8, label: '拉高', note: '自交段拉长' },
] as const
