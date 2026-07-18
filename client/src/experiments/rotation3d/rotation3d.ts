/**
 * 三维旋转矩阵核心（纯函数，便于测试）
 *
 * 提供绕 X/Y/Z 轴的基本旋转矩阵、矩阵乘法、欧拉角组合、
 * 旋转点以及正交投影到 2D 平面。均为无 DOM 依赖的纯计算。
 */

export type Vec3 = [number, number, number]
export type Mat3 = [Vec3, Vec3, Vec3]

/** 绕 X 轴旋转 theta（弧度）的旋转矩阵 */
export function rotX(theta: number): Mat3 {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [1, 0, 0],
    [0, c, -s],
    [0, s, c],
  ]
}

/** 绕 Y 轴旋转 theta（弧度）的旋转矩阵 */
export function rotY(theta: number): Mat3 {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [c, 0, s],
    [0, 1, 0],
    [-s, 0, c],
  ]
}

/** 绕 Z 轴旋转 theta（弧度）的旋转矩阵 */
export function rotZ(theta: number): Mat3 {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ]
}

/** 3x3 矩阵相乘 A·B */
export function matMul3(a: Mat3, b: Mat3): Mat3 {
  const r: Mat3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let sum = 0
      for (let k = 0; k < 3; k++) sum += a[i][k] * b[k][j]
      r[i][j] = sum
    }
  }
  return r
}

/** 欧拉角组合：先绕 X，再绕 Y，最后绕 Z（Rz·Ry·Rx） */
export function eulerRotation(ax: number, ay: number, az: number): Mat3 {
  return matMul3(rotZ(az), matMul3(rotY(ay), rotX(ax)))
}

/** 用旋转矩阵变换一个三维点 */
export function rotatePoint(m: Mat3, p: Vec3): Vec3 {
  return [
    m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2],
    m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2],
    m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2],
  ]
}

/** 正交投影到 2D：丢弃 z，按 scale 缩放并平移到画布中心 */
export function project(p: Vec3, scale: number, cx: number, cy: number): [number, number] {
  return [cx + p[0] * scale, cy - p[1] * scale]
}

/** 单位立方体的 8 个顶点（边长 2，中心在原点） */
export const CUBE_VERTICES: Vec3[] = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
]

/** 立方体 12 条棱（顶点索引对） */
export const CUBE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
]

export const ANGLE_PRESETS = [0, 30, 45, 60, 90]
