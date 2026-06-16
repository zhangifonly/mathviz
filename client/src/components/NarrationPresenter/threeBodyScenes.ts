/**
 * 三体引力轨道讲解场景配置
 * 每句口播对应精确的动画状态（preset 选择构型）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultThreeBodyState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const threeBodyScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '三体引力轨道', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-twobody', type: 'animation' }, lineState: { params: { preset: 'sunEarthMoon' }, annotation: { text: '两体：完美椭圆', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-threebody', type: 'animation' }, lineState: { params: { preset: 'chaos' }, annotation: { text: '三体：意外的困难', position: 'top' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-chaos', type: 'title' }, lineState: { annotation: { text: '困扰三百年的难题', position: 'bottom' } } },

  // ===== gravity (4) =====
  { lineId: 'grav-1', sectionId: 'gravity', scene: { id: 'grav-law', type: 'formula' }, lineState: { annotation: { text: 'F = G·m₁m₂/r²', position: 'top' } } },
  { lineId: 'grav-2', sectionId: 'gravity', scene: { id: 'grav-explain', type: 'formula' }, lineState: { annotation: { text: '正比质量，反比距离²', position: 'bottom' } } },
  { lineId: 'grav-3', sectionId: 'gravity', scene: { id: 'grav-superpose', type: 'animation' }, lineState: { params: { preset: 'chaos' }, annotation: { text: '引力叠加 → 加速度', position: 'top' } } },
  { lineId: 'grav-4', sectionId: 'gravity', scene: { id: 'grav-integrate', type: 'animation' }, lineState: { params: { preset: 'chaos' }, annotation: { text: '数值积分逐步推进', position: 'bottom' } } },

  // ===== chaos (4) =====
  { lineId: 'chaos-1', sectionId: 'chaos', scene: { id: 'chaos-dance', type: 'animation' }, lineState: { params: { preset: 'chaos' }, annotation: { text: '错综复杂的轨迹', position: 'top' } } },
  { lineId: 'chaos-2', sectionId: 'chaos', scene: { id: 'chaos-nosolution', type: 'animation' }, lineState: { params: { preset: 'chaos' }, annotation: { text: '没有解析解', position: 'bottom' } } },
  { lineId: 'chaos-3', sectionId: 'chaos', scene: { id: 'chaos-sensitive', type: 'animation' }, lineState: { params: { preset: 'chaos' }, annotation: { text: '对初值极度敏感', position: 'bottom' } } },
  { lineId: 'chaos-4', sectionId: 'chaos', scene: { id: 'chaos-butterfly', type: 'animation' }, lineState: { params: { preset: 'chaos' }, annotation: { text: '蝴蝶效应', position: 'top' } } },

  // ===== figure8 (3) =====
  { lineId: 'fig-1', sectionId: 'figure8', scene: { id: 'fig-periodic', type: 'animation' }, lineState: { params: { preset: 'figure8' }, annotation: { text: '罕见的周期解', position: 'top' } } },
  { lineId: 'fig-2', sectionId: 'figure8', scene: { id: 'fig-eight', type: 'animation' }, lineState: { params: { preset: 'figure8' }, annotation: { text: '8 字轨道追逐', position: 'bottom' } } },
  { lineId: 'fig-3', sectionId: 'figure8', scene: { id: 'fig-history', type: 'animation' }, lineState: { params: { preset: 'figure8' }, annotation: { text: '1993 发现 · 2000 证明', position: 'bottom' } } },

  // ===== interaction (3) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'binary' }, annotation: { text: '切换初始构型', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'figure8' }, annotation: { text: '秩序 vs 混沌', position: 'bottom' } } },
  { lineId: 'int-3', sectionId: 'interaction', scene: { id: 'int-energy', type: 'interactive', interactive: { allowAnimation: true } }, lineState: { params: { preset: 'figure8' }, annotation: { text: '关注能量守恒', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-gravity', type: 'summary' }, lineState: { annotation: { text: '万有引力驱动', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-chaos', type: 'summary' }, lineState: { annotation: { text: '混沌与 8 字解', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
