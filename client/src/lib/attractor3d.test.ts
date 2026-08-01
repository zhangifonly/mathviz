import { describe, it, expect } from 'vitest'
import {
  rk4Step, orbit, isFinite3, lyapunovExponent, orbitExtent, divergence,
  type Field3D,
} from './attractor3d'
import type { Vec3 } from './proj3d'

/** 洛伦兹系统。λ₁ 的公认值 ≈0.9056, 散度恒为 −(σ+1+β) */
const lorenz: Field3D = ([x, y, z]) => [
  10 * (y - x), x * (28 - z) - y, x * y - (8 / 3) * z,
]

/** 罗斯勒系统。λ₁ 的公认值 ≈0.0714 */
const rossler: Field3D = ([x, y, z]) => [-y - z, x + 0.2 * y, 0.2 + z * (x - 5.7)]

/** 阻尼振子: 非混沌, λ₁ 应为负 */
const damped: Field3D = ([x, y, z]) => [y, -x - 0.3 * y, -z]

describe('attractor3d - RK4 积分', () => {
  it('对常向量场给出精确直线运动', () => {
    const constant: Field3D = () => [1, 2, 3]
    const p = rk4Step(constant, [0, 0, 0], 0.1)
    expect(p[0]).toBeCloseTo(0.1, 12)
    expect(p[1]).toBeCloseTo(0.2, 12)
    expect(p[2]).toBeCloseTo(0.3, 12)
  })

  it('对线性衰减 dx/dt=−x 逼近解析解 e^(−t)', () => {
    const decay: Field3D = ([x, y, z]) => [-x, -y, -z]
    let p: Vec3 = [1, 1, 1]
    const dt = 0.01
    for (let i = 0; i < 100; i++) p = rk4Step(decay, p, dt)
    // t=1 时解析解为 e^(-1)
    expect(p[0]).toBeCloseTo(Math.exp(-1), 6)
  })

  it('RK4 精度高于欧拉法(同样步长下误差更小)', () => {
    const decay: Field3D = ([x, y, z]) => [-x, -y, -z]
    const dt = 0.1
    let rk: Vec3 = [1, 1, 1]
    let euler: Vec3 = [1, 1, 1]
    for (let i = 0; i < 10; i++) {
      rk = rk4Step(decay, rk, dt)
      euler = [euler[0] - dt * euler[0], euler[1], euler[2]]
    }
    const want = Math.exp(-1)
    expect(Math.abs(rk[0] - want)).toBeLessThan(Math.abs(euler[0] - want))
  })

  it('简谐振子的能量近乎守恒', () => {
    const sho: Field3D = ([x, y]) => [y, -x, 0]
    let p: Vec3 = [1, 0, 0]
    for (let i = 0; i < 1000; i++) p = rk4Step(sho, p, 0.01)
    // 能量 x²+y² 应保持为 1
    expect(p[0] * p[0] + p[1] * p[1]).toBeCloseTo(1, 6)
  })
})

describe('attractor3d - 轨道生成', () => {
  it('生成指定步数的轨道', () => {
    const pts = orbit(lorenz, { start: [1, 1, 1], dt: 0.005, steps: 500 })
    expect(pts.length).toBe(500)
    for (const p of pts) expect(isFinite3(p)).toBe(true)
  })

  it('skip 丢弃暂态后轨道落在吸引子上', () => {
    const withSkip = orbit(lorenz, { start: [20, 20, 20], dt: 0.005, steps: 200, skip: 2000 })
    expect(withSkip.length).toBe(200)
    // 洛伦兹吸引子的轨道有界, 尺度约几十
    expect(orbitExtent(withSkip)).toBeLessThan(100)
  })

  it('发散的系统返回空数组或提前截断', () => {
    const blowUp: Field3D = ([x, y, z]) => [x * x * x + 1e6, y, z]
    const pts = orbit(blowUp, { start: [10, 0, 0], dt: 0.1, steps: 1000 })
    expect(pts.length).toBeLessThan(1000)
  })

  it('isFinite3 能识别 NaN 与 Infinity', () => {
    expect(isFinite3([1, 2, 3])).toBe(true)
    expect(isFinite3([NaN, 0, 0])).toBe(false)
    expect(isFinite3([0, Infinity, 0])).toBe(false)
  })
})

describe('attractor3d - 混沌诊断', () => {
  it('洛伦兹系统的 λ₁ 接近公认值 0.906', () => {
    const l = lyapunovExponent(lorenz, [1, 1, 1], 0.005, 20000)
    expect(l).toBeGreaterThan(0.7)
    expect(l).toBeLessThan(1.1)
  })

  it('罗斯勒系统的 λ₁ 为正但明显小于洛伦兹', () => {
    const lr = lyapunovExponent(rossler, [1, 1, 1], 0.005, 20000)
    const ll = lyapunovExponent(lorenz, [1, 1, 1], 0.005, 20000)
    expect(lr).toBeGreaterThan(0)
    expect(lr).toBeLessThan(ll)
  })

  it('非混沌系统的 λ₁ 为负 —— 这才让正值有意义', () => {
    expect(lyapunovExponent(damped, [1, 1, 1], 0.005, 10000)).toBeLessThan(0)
  })

  it('散度与解析值一致: 洛伦兹恒为 −(σ+1+β)', () => {
    const want = -(10 + 1 + 8 / 3)
    for (const p of [[1, 2, 3], [-5, 10, 20], [0, 0, 0]] as Vec3[]) {
      expect(divergence(lorenz, p)).toBeCloseTo(want, 4)
    }
  })

  it('耗散系统的散度为负(存在吸引子的必要条件)', () => {
    expect(divergence(lorenz, [1, 1, 1])).toBeLessThan(0)
    expect(divergence(rossler, [1, 1, 1])).toBeLessThan(0)
  })

  it('保守系统的散度为零', () => {
    const sho: Field3D = ([x, y]) => [y, -x, 0]
    expect(Math.abs(divergence(sho, [1, 2, 3]))).toBeLessThan(1e-6)
  })

  it('orbitExtent 给出包围盒对角长', () => {
    const pts: Vec3[] = [[0, 0, 0], [3, 4, 0]]
    expect(orbitExtent(pts)).toBeCloseTo(5, 10)
    expect(orbitExtent([])).toBe(0)
  })
})
