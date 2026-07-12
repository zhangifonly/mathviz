/**
 * 绝对值函数讲解场景配置
 * 每句口播对应一组参数 (a, h, k)，驱动渲染器绘制对应 V 形
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultAbsoluteValueState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const absoluteValueScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '绝对值函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-vshape', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 0 }, annotation: { text: '尖尖的 V 形', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-start', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 0 }, annotation: { text: '从绝对值说起', position: 'bottom' } } },

  // ===== concept-abs (3) =====
  { lineId: 'abs-1', sectionId: 'concept-abs', scene: { id: 'abs-distance', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 0 }, annotation: { text: '到零的距离', position: 'top' } } },
  { lineId: 'abs-2', sectionId: 'concept-abs', scene: { id: 'abs-nonneg', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 0 }, annotation: { text: '距离非负', position: 'bottom' } } },
  { lineId: 'abs-3', sectionId: 'concept-abs', scene: { id: 'abs-symmetry', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 0 }, annotation: { text: '两侧对称上翘', position: 'bottom' } } },

  // ===== concept-shape (3) =====
  { lineId: 'shape-1', sectionId: 'concept-shape', scene: { id: 'shape-basic', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 0 }, annotation: { text: 'y = |x|', position: 'top' } } },
  { lineId: 'shape-2', sectionId: 'concept-shape', scene: { id: 'shape-vertex', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 0 }, annotation: { text: '顶点在原点', position: 'bottom' } } },
  { lineId: 'shape-3', sectionId: 'concept-shape', scene: { id: 'shape-axis', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 0 }, annotation: { text: '关于竖直线对称', position: 'bottom' } } },

  // ===== concept-transform (3) =====
  { lineId: 'trans-1', sectionId: 'concept-transform', scene: { id: 'trans-right', type: 'animation' }, lineState: { params: { a: 1, h: 2, k: 0 }, annotation: { text: '向右平移', position: 'top' } } },
  { lineId: 'trans-2', sectionId: 'concept-transform', scene: { id: 'trans-up', type: 'animation' }, lineState: { params: { a: 1, h: 0, k: 1 }, annotation: { text: '向上抬升', position: 'top' } } },
  { lineId: 'trans-3', sectionId: 'concept-transform', scene: { id: 'trans-scale', type: 'animation' }, lineState: { params: { a: -1, h: 0, k: 3 }, annotation: { text: '倒 V 开口向下', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-explore', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 2, h: 0, k: 0 }, annotation: { text: '切换参数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-roots', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1, h: 0, k: -2 }, annotation: { text: '零点即交点', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '距离 → V 形', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-params', type: 'summary' }, lineState: { annotation: { text: '平移与缩放', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
