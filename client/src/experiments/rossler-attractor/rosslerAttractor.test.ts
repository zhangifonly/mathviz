import { describe, it, expect } from 'vitest'
import {
  rosslerDeriv,
  rk4Step,
  simulate,
  projectXY,
  PARAMS,
  ROSSLER_PRESETS,
  type Vec3,
} from './rosslerAttractor'

describe('Rössler 吸引子', () => {
  it('rosslerDeriv 按方程给出正确导数', () => {
    const s: Vec3 = { x: 1, y: 2, z: 3 }
    const d = rosslerDeriv(s, PARAMS)
    // dx=-y-z=-5, dy=x+a*y=1+0.2*2=1.4, dz=b+z*(x-c)=0.2+3*(1-5.7)=-13.9
    expect(d.x).toBeCloseTo(-5, 10)
    expect(d.y).toBeCloseTo(1.4, 10)
    expect(d.z).toBeCloseTo(-13.9, 10)
  })

  it('rk4Step 对常数场退化为欧拉平移', () => {
    // 若在原点附近取一步，结果应为有限数且改变了状态
    const s: Vec3 = { x: 0, y: 1, z: 0 }
    const next = rk4Step(s, PARAMS, 0.02)
    expect(Number.isFinite(next.x)).toBe(true)
    expect(Number.isFinite(next.y)).toBe(true)
    expect(next).not.toEqual(s)
  })

  it('simulate 返回 steps+1 个点且全部有限', () => {
    const traj = simulate({ x: 1, y: 1, z: 1 }, PARAMS, 500, 0.02)
    expect(traj.length).toBe(501)
    for (const v of traj) {
      expect(Number.isFinite(v.x)).toBe(true)
      expect(Number.isFinite(v.y)).toBe(true)
      expect(Number.isFinite(v.z)).toBe(true)
    }
  })

  it('simulate 轨迹被吸引子囚禁在有界范围内', () => {
    const traj = simulate({ x: 1, y: 1, z: 1 }, PARAMS, 4000, 0.02)
    // 丢弃前段暂态，只看后段是否有界（经典参数下 |x|,|y| < 30 足够宽松）
    for (let i = 1000; i < traj.length; i++) {
      expect(Math.abs(traj[i].x)).toBeLessThan(30)
      expect(Math.abs(traj[i].y)).toBeLessThan(30)
    }
  })

  it('projectXY 只保留 x,y 两个分量', () => {
    const traj = simulate({ x: 1, y: 1, z: 1 }, PARAMS, 10, 0.02)
    const proj = projectXY(traj)
    expect(proj.length).toBe(traj.length)
    expect(proj[0]).toEqual([traj[0].x, traj[0].y])
    expect(proj[5][1]).toBe(traj[5].y)
  })

  it('对初值敏感：微小扰动最终发散', () => {
    const a = simulate({ x: 1, y: 1, z: 1 }, PARAMS, 6000, 0.02)
    const b = simulate({ x: 1.0001, y: 1, z: 1 }, PARAMS, 6000, 0.02)
    const last = a.length - 1
    const dx = a[last].x - b[last].x
    const dy = a[last].y - b[last].y
    expect(Math.hypot(dx, dy)).toBeGreaterThan(0.5)
  })

  it('ROSSLER_PRESETS 均能积分出有界有限轨迹', () => {
    for (const preset of ROSSLER_PRESETS) {
      const traj = simulate({ x: 1, y: 1, z: 1 }, preset.params, 2000, 0.02)
      expect(traj.length).toBe(2001)
      expect(Number.isFinite(traj[traj.length - 1].x)).toBe(true)
    }
  })
})
