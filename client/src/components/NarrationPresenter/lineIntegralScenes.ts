/**
 * 曲线积分讲解场景配置
 * 每句口播对应向量场 (params.field) 与路径 (params.path)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLineIntegralState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lineIntegralScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '曲线积分', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-wind', type: 'animation' }, lineState: { params: { field: 'uniform', path: 'line' }, annotation: { text: '风是向量场', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-help', type: 'animation' }, lineState: { params: { field: 'uniform', path: 'line' }, annotation: { text: '顺风省力·逆风费力', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-sum', type: 'animation' }, lineState: { params: { field: 'uniform', path: 'parabola' }, annotation: { text: '一路做功累加', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-fr', type: 'animation' }, lineState: { params: { field: 'rotation', path: 'line' }, annotation: { text: '场 F 与路径 r(t)', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-formula', type: 'animation' }, lineState: { params: { field: 'rotation', path: 'arc' }, annotation: { text: '∫F·dr', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-dr', type: 'animation' }, lineState: { params: { field: 'rotation', path: 'arc' }, annotation: { text: 'dr 是一小段位移', position: 'bottom' } } },

  // ===== dot (3) =====
  { lineId: 'dot-1', sectionId: 'dot', scene: { id: 'dot-proj', type: 'animation' }, lineState: { params: { field: 'rotation', path: 'arc' }, annotation: { text: 'F 点乘切向', position: 'top' } } },
  { lineId: 'dot-2', sectionId: 'dot', scene: { id: 'dot-pos', type: 'animation' }, lineState: { params: { field: 'rotation', path: 'arc' }, annotation: { text: '同向=正功(红)', position: 'bottom' } } },
  { lineId: 'dot-3', sectionId: 'dot', scene: { id: 'dot-neg', type: 'animation' }, lineState: { params: { field: 'uniform', path: 'arc' }, annotation: { text: '反向=负功(蓝)', position: 'bottom' } } },

  // ===== accum (2) =====
  { lineId: 'acc-1', sectionId: 'accum', scene: { id: 'acc-slice', type: 'animation' }, lineState: { params: { field: 'rotation', path: 'parabola' }, annotation: { text: '切段求和', position: 'top' } } },
  { lineId: 'acc-2', sectionId: 'accum', scene: { id: 'acc-fine', type: 'animation' }, lineState: { params: { field: 'rotation', path: 'parabola' }, annotation: { text: '越细越精确', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'radial', path: 'line' }, annotation: { text: '换场换路径', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-zero', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'radial', path: 'arc' }, annotation: { text: '径向配圆弧=0', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '沿路径累加做功', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-dot', type: 'summary' }, lineState: { annotation: { text: '正负看点乘', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
