/**
 * 沿空间曲线生成管面（纯函数，共享给纽结类实验）
 *
 * 纽结必须画成管面才看得清穿插关系 —— 细线在交叉处分不出前后。
 * 截面朝向用 Frenet 标架确定, 保证圆截面始终垂直于曲线且不突然扭转。
 *
 * ⚠️ Frenet 标架在曲率为零处无定义(N 的分母归零)。纽结类曲线一般处处
 * 有正曲率, 不受影响; 若曲线含直线段, 需改用 Bishop 标架。
 */

import type { Vec3 } from './proj3d'

function diff(fn: (t: number) => Vec3, at: number, h: number): Vec3 {
  const a = fn(at - h)
  const b = fn(at + h)
  return [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h)]
}

function unit(v: Vec3): Vec3 {
  const n = Math.hypot(v[0], v[1], v[2])
  if (n < 1e-12) return [0, 0, 1]
  return [v[0] / n, v[1] / n, v[2] / n]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

export interface Frame {
  T: Vec3
  N: Vec3
  B: Vec3
}

/** 曲线在 t 处的 Frenet 标架 */
export function frenetAt(curve: (t: number) => Vec3, t: number, h = 1e-4): Frame {
  const T = unit(diff(curve, t, h))
  const dT = diff((s) => unit(diff(curve, s, h)), t, h)
  const N = unit(dT)
  return { T, N, B: cross(T, N) }
}

/**
 * 沿曲线生成管面网格。
 * 返回 (steps+1) × (segments+1) 的点阵，行沿曲线、列绕截面。
 */
export function buildTubeGrid(
  curve: (t: number) => Vec3,
  tRange: [number, number],
  radius: number,
  steps = 240,
  segments = 16,
): Vec3[][] {
  const grid: Vec3[][] = []
  for (let i = 0; i <= steps; i++) {
    const t = tRange[0] + ((tRange[1] - tRange[0]) * i) / steps
    const c = curve(t)
    const { N, B } = frenetAt(curve, t)
    const row: Vec3[] = []
    for (let j = 0; j <= segments; j++) {
      const th = (2 * Math.PI * j) / segments
      const cs = Math.cos(th)
      const sn = Math.sin(th)
      row.push([
        c[0] + radius * (cs * N[0] + sn * B[0]),
        c[1] + radius * (cs * N[1] + sn * B[1]),
        c[2] + radius * (cs * N[2] + sn * B[2]),
      ])
    }
    grid.push(row)
  }
  return grid
}
