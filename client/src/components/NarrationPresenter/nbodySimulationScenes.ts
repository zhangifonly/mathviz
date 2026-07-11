/**
 * N 体引力仿真讲解场景配置
 * 每句口播对应一个预设（params.preset）与标注
 * lineId / sectionId 必须与 narrations/scripts/nbody-simulation.ts 完全一致
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNbodySimulationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const nbodySimulationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-sky', type: 'title' }, lineState: { annotation: { text: 'N 体引力仿真', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pull', type: 'animation' }, lineState: { params: { preset: 'binary' }, annotation: { text: '彼此牵引', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-complex', type: 'animation' }, lineState: { params: { preset: 'figure-eight' }, annotation: { text: '简单规则,复杂结果', position: 'bottom' } } },

  // ===== law (3) =====
  { lineId: 'law-1', sectionId: 'law', scene: { id: 'law-inverse', type: 'animation' }, lineState: { params: { preset: 'star-planet' }, annotation: { text: '引力反比于距离平方', position: 'top' } } },
  { lineId: 'law-2', sectionId: 'law', scene: { id: 'law-sum', type: 'animation' }, lineState: { params: { preset: 'figure-eight' }, annotation: { text: '合力是向量叠加', position: 'top' } } },
  { lineId: 'law-3', sectionId: 'law', scene: { id: 'law-integrate', type: 'animation' }, lineState: { params: { preset: 'star-planet' }, annotation: { text: '加速度推进运动', position: 'bottom' } } },

  // ===== twobody (3) =====
  { lineId: 'two-1', sectionId: 'twobody', scene: { id: 'two-solvable', type: 'animation' }, lineState: { params: { preset: 'binary' }, annotation: { text: '两体可解', position: 'top' } } },
  { lineId: 'two-2', sectionId: 'twobody', scene: { id: 'two-orbit', type: 'animation' }, lineState: { params: { preset: 'binary' }, annotation: { text: '绕质心的椭圆轨道', position: 'bottom' } } },
  { lineId: 'two-3', sectionId: 'twobody', scene: { id: 'two-planet', type: 'animation' }, lineState: { params: { preset: 'star-planet' }, annotation: { text: '行星绕恒星', position: 'bottom' } } },

  // ===== chaos (4) =====
  { lineId: 'chaos-1', sectionId: 'chaos', scene: { id: 'chaos-third', type: 'animation' }, lineState: { params: { preset: 'figure-eight' }, annotation: { text: '加入第三体', position: 'top' } } },
  { lineId: 'chaos-2', sectionId: 'chaos', scene: { id: 'chaos-nosol', type: 'animation' }, lineState: { params: { preset: 'figure-eight' }, annotation: { text: '无一般解析解', position: 'top' } } },
  { lineId: 'chaos-3', sectionId: 'chaos', scene: { id: 'chaos-sensitive', type: 'animation' }, lineState: { params: { preset: 'figure-eight' }, annotation: { text: '对初值极度敏感', position: 'bottom' } } },
  { lineId: 'chaos-4', sectionId: 'chaos', scene: { id: 'chaos-periodic', type: 'animation' }, lineState: { params: { preset: 'figure-eight' }, annotation: { text: '八字周期解', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-preset', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'binary' }, annotation: { text: '切换预设', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-energy', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'star-planet' }, annotation: { text: '关注总能量守恒', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '两体优雅,三体混沌', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-conserve', type: 'summary' }, lineState: { annotation: { text: '守恒律是标尺', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '探索引力之美!', position: 'bottom' } } },
]
