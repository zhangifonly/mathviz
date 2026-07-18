/**
 * 法里数列讲解场景配置
 * 每句口播对应阶数（params.order）与是否显示福特圆（params.circles）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFareySequenceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const fareySequenceScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '法里数列', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pick', type: 'animation' }, lineState: { params: { order: 5, circles: false }, annotation: { text: '分母有界的既约分数', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-order', type: 'animation' }, lineState: { params: { order: 5, circles: false }, annotation: { text: '从小到大排队', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-fn', type: 'animation' }, lineState: { params: { order: 5, circles: false }, annotation: { text: 'F5：分母 ≤ 5', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-list', type: 'animation' }, lineState: { params: { order: 5, circles: false }, annotation: { text: '0/1 … 1/1', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-dense', type: 'animation' }, lineState: { params: { order: 7, circles: false }, annotation: { text: '阶数越大越密', position: 'bottom' } } },

  // ===== mediant (3) =====
  { lineId: 'med-1', sectionId: 'mediant', scene: { id: 'med-gap', type: 'animation' }, lineState: { params: { order: 5, circles: false }, annotation: { text: '新项从哪来？', position: 'top' } } },
  { lineId: 'med-2', sectionId: 'mediant', scene: { id: 'med-add', type: 'animation' }, lineState: { params: { order: 6, circles: false }, annotation: { text: '分子分母各相加', position: 'bottom' } } },
  { lineId: 'med-3', sectionId: 'mediant', scene: { id: 'med-mid', type: 'animation' }, lineState: { params: { order: 5, circles: false }, annotation: { text: '2/5 夹在中间', position: 'bottom' } } },

  // ===== neighbor (3) =====
  { lineId: 'nei-1', sectionId: 'neighbor', scene: { id: 'nei-eq', type: 'animation' }, lineState: { params: { order: 5, circles: true }, annotation: { text: 'bc − ad = 1', position: 'top' } } },
  { lineId: 'nei-2', sectionId: 'neighbor', scene: { id: 'nei-ford', type: 'animation' }, lineState: { params: { order: 6, circles: true }, annotation: { text: '福特圆贴数轴', position: 'bottom' } } },
  { lineId: 'nei-3', sectionId: 'neighbor', scene: { id: 'nei-tangent', type: 'animation' }, lineState: { params: { order: 7, circles: true }, annotation: { text: '相邻圆相切', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-order', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 7, circles: false }, annotation: { text: '调整阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-circles', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 6, circles: true }, annotation: { text: '打开福特圆', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '有序既约分数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-props', type: 'summary' }, lineState: { annotation: { text: '中位数与邻居', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
