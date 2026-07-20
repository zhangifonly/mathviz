import { describe, it, expect } from 'vitest'
import {
  rotX, rotY, rotZ, matMul3, eulerRotation, rotatePoint, project,
  CUBE_VERTICES, CUBE_EDGES,
} from './rotation3d'
import type { Vec3, Mat3 } from './rotation3d'

const HALF_PI = Math.PI / 2
const I: Mat3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]

function near(a: number, b: number, eps = 1e-9) {
  return Math.abs(a - b) < eps
}

describe('三维旋转矩阵', () => {
  it('theta=0 时三种旋转都是单位矩阵', () => {
    for (const m of [rotX(0), rotY(0), rotZ(0)]) {
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
          expect(near(m[i][j], I[i][j])).toBe(true)
    }
  })

  it('绕 Z 轴 90 度把 X 轴单位向量转到 Y 轴', () => {
    const p = rotatePoint(rotZ(HALF_PI), [1, 0, 0])
    expect(near(p[0], 0)).toBe(true)
    expect(near(p[1], 1)).toBe(true)
    expect(near(p[2], 0)).toBe(true)
  })

  it('旋转矩阵保持向量长度（正交性）', () => {
    const v: Vec3 = [1, 2, 3]
    const len = Math.hypot(...v)
    const r = rotatePoint(eulerRotation(0.7, -1.1, 0.3), v)
    expect(near(Math.hypot(...r), len)).toBe(true)
  })

  it('matMul3 与单位矩阵相乘不变', () => {
    const m = rotX(0.5)
    expect(matMul3(m, I)).toEqual(m)
    expect(matMul3(I, m)).toEqual(m)
  })

  it('eulerRotation 等于 Rz·Ry·Rx 的乘积', () => {
    const combined = eulerRotation(0.3, 0.4, 0.5)
    const manual = matMul3(rotZ(0.5), matMul3(rotY(0.4), rotX(0.3)))
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        expect(near(combined[i][j], manual[i][j])).toBe(true)
  })

  it('project 正交投影到画布中心（y 轴翻转）', () => {
    expect(project([0, 0, 5], 40, 300, 270)).toEqual([300, 270])
    expect(project([1, 1, 0], 40, 300, 270)).toEqual([340, 230])
  })

  it('立方体几何：8 顶点 12 棱，索引合法', () => {
    expect(CUBE_VERTICES.length).toBe(8)
    expect(CUBE_EDGES.length).toBe(12)
    for (const [a, b] of CUBE_EDGES) {
      expect(a).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThan(8)
    }
  })
})
