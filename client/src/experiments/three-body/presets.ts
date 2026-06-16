/**
 * 三体模拟 - 经典初始构型预设
 */

import type { Body } from './physics'

export interface Preset {
  name: string
  label: string
  G: number
  bodies: Body[]
}

export const PRESETS: Preset[] = [
  {
    name: 'figure8',
    label: '8字稳定解',
    G: 1,
    // Chenciner-Montgomery 著名周期解，三体等质量沿 8 字轨道追逐
    bodies: [
      { x: 0.97000436, y: -0.24308753, vx: 0.466203685, vy: 0.43236573, mass: 1 },
      { x: -0.97000436, y: 0.24308753, vx: 0.466203685, vy: 0.43236573, mass: 1 },
      { x: 0, y: 0, vx: -0.93240737, vy: -0.86473146, mass: 1 },
    ],
  },
  {
    name: 'chaos',
    label: '混沌三体',
    G: 1,
    bodies: [
      { x: -1, y: 0, vx: 0.1, vy: 0.3, mass: 1 },
      { x: 1, y: 0, vx: 0, vy: -0.3, mass: 1 },
      { x: 0, y: 0.8, vx: -0.1, vy: 0, mass: 1 },
    ],
  },
  {
    name: 'sunEarthMoon',
    label: '恒星双行星',
    G: 1,
    // 中心大质量恒星 + 两颗内外圆轨道行星，速度取圆轨道速度 v=√(GM/r)，长期有界
    bodies: [
      { x: 0, y: 0, vx: 0, vy: 0, mass: 80 },
      { x: 1.5, y: 0, vx: 0, vy: Math.sqrt(80 / 1.5), mass: 0.5 },
      { x: -2.6, y: 0, vx: 0, vy: -Math.sqrt(80 / 2.6), mass: 0.5 },
    ],
  },
  {
    name: 'binary',
    label: '双星捕获',
    G: 1,
    // 两颗等质量恒星互绕（圆双星），外加一颗小行星绕系统公转，长期有界
    bodies: [
      { x: -0.45, y: 0, vx: 0, vy: -Math.sqrt(6 / 0.9) / 2, mass: 6 },
      { x: 0.45, y: 0, vx: 0, vy: Math.sqrt(6 / 0.9) / 2, mass: 6 },
      { x: 0, y: 2.2, vx: Math.sqrt(12 / 2.2), vy: 0, mass: 0.15 },
    ],
  },
]

/** 深拷贝预设的天体数组（避免模拟修改原始数据） */
export function clonePreset(preset: Preset): Body[] {
  return preset.bodies.map((b) => ({ ...b }))
}

// 天体显示颜色
export const BODY_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7']
