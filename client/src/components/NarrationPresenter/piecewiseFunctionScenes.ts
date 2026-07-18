/**
 * 分段函数讲解场景配置
 * 每句口播对应一个样例索引（params.sample）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPiecewiseFunctionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const piecewiseFunctionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '分段函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-piece', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '各段各的规则', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-life', type: 'animation' }, lineState: { params: { sample: 2 }, annotation: { text: '阶梯计价', position: 'bottom' } } },

  // ===== concept-a (3) =====
  { lineId: 'def-1', sectionId: 'concept-a', scene: { id: 'def-abs', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '绝对值 |x|', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'concept-a', scene: { id: 'def-v', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: 'V 字接得上', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'concept-a', scene: { id: 'def-sign', type: 'animation' }, lineState: { params: { sample: 1 }, annotation: { text: '符号函数跳变', position: 'top' } } },

  // ===== concept-b (3) =====
  { lineId: 'con-1', sectionId: 'concept-b', scene: { id: 'con-break', type: 'animation' }, lineState: { params: { sample: 1 }, annotation: { text: '断没断开？', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'concept-b', scene: { id: 'con-cont', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '原点连续', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'concept-b', scene: { id: 'con-jump', type: 'animation' }, lineState: { params: { sample: 1 }, annotation: { text: '跳跃间断', position: 'top' } } },

  // ===== concept-c (3) =====
  { lineId: 'lim-1', sectionId: 'concept-c', scene: { id: 'lim-lr', type: 'animation' }, lineState: { params: { sample: 3 }, annotation: { text: '左极限·右极限', position: 'top' } } },
  { lineId: 'lim-2', sectionId: 'concept-c', scene: { id: 'lim-eq', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '相等即连续', position: 'bottom' } } },
  { lineId: 'lim-3', sectionId: 'concept-c', scene: { id: 'lim-dot', type: 'animation' }, lineState: { params: { sample: 3 }, annotation: { text: '实心·空心', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-floor', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sample: 2 }, annotation: { text: '取整阶梯', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-custom', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sample: 3 }, annotation: { text: '找断点', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '切段各规则', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-limit', type: 'summary' }, lineState: { annotation: { text: '左右极限判断', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
