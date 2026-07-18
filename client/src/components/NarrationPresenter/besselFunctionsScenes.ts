/**
 * 贝塞尔函数讲解场景配置
 * 每句口播对应要显示的阶数集合（params.orders）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBesselFunctionsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const besselFunctionsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '贝塞尔函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-drum', type: 'animation' }, lineState: { params: { orders: [0] }, annotation: { text: '圆膜在平面上起伏', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-need', type: 'animation' }, lineState: { params: { orders: [0, 1] }, annotation: { text: '需要新的函数', position: 'bottom' } } },

  // ===== equation (3) =====
  { lineId: 'eq-1', sectionId: 'equation', scene: { id: 'eq-radial', type: 'animation' }, lineState: { params: { orders: [0] }, annotation: { text: '极坐标分离变量', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equation', scene: { id: 'eq-form', type: 'animation' }, lineState: { params: { orders: [0] }, annotation: { text: '贝塞尔方程', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equation', scene: { id: 'eq-order', type: 'animation' }, lineState: { params: { orders: [0, 1, 2] }, annotation: { text: '阶数 n', position: 'bottom' } } },

  // ===== series (3) =====
  { lineId: 'ser-1', sectionId: 'series', scene: { id: 'ser-def', type: 'animation' }, lineState: { params: { orders: [0] }, annotation: { text: '幂级数展开', position: 'top' } } },
  { lineId: 'ser-2', sectionId: 'series', scene: { id: 'ser-coef', type: 'animation' }, lineState: { params: { orders: [0, 1] }, annotation: { text: '系数含阶乘', position: 'bottom' } } },
  { lineId: 'ser-3', sectionId: 'series', scene: { id: 'ser-sum', type: 'animation' }, lineState: { params: { orders: [0, 1, 2] }, annotation: { text: '逐项相加收敛', position: 'bottom' } } },

  // ===== zeros (3) =====
  { lineId: 'zero-1', sectionId: 'zeros', scene: { id: 'zero-osc', type: 'animation' }, lineState: { params: { orders: [0] }, annotation: { text: '衰减振荡', position: 'top' } } },
  { lineId: 'zero-2', sectionId: 'zeros', scene: { id: 'zero-node', type: 'animation' }, lineState: { params: { orders: [0, 1] }, annotation: { text: '零点 = 节圆', position: 'bottom' } } },
  { lineId: 'zero-3', sectionId: 'zeros', scene: { id: 'zero-mode', type: 'animation' }, lineState: { params: { orders: [0, 1, 2] }, annotation: { text: '决定音高', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { orders: [0, 1, 2] }, annotation: { text: '切换阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-zeros', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { orders: [0, 1, 2] }, annotation: { text: '观察零点', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '来自圆膜振动', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-zeros', type: 'summary' }, lineState: { annotation: { text: '零点标出节圆', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
