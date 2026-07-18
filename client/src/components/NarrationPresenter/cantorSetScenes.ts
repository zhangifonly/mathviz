/**
 * 康托三分集讲解场景配置
 * 每句口播对应迭代层数（params.levels）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCantorSetState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const cantorSetScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '康托三分集', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-cut', type: 'animation' }, lineState: { params: { levels: 1 }, annotation: { text: '挖掉中间三分之一', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-repeat', type: 'animation' }, lineState: { params: { levels: 2 }, annotation: { text: '对每段重复', position: 'bottom' } } },

  // ===== iterate (3) =====
  { lineId: 'iter-1', sectionId: 'iterate', scene: { id: 'iter-count', type: 'animation' }, lineState: { params: { levels: 3 }, annotation: { text: '第 n 层剩 2^n 段', position: 'top' } } },
  { lineId: 'iter-2', sectionId: 'iterate', scene: { id: 'iter-len', type: 'animation' }, lineState: { params: { levels: 4 }, annotation: { text: '每段长 (1/3)^n', position: 'bottom' } } },
  { lineId: 'iter-3', sectionId: 'iterate', scene: { id: 'iter-comb', type: 'animation' }, lineState: { params: { levels: 5 }, annotation: { text: '越来越稀疏', position: 'bottom' } } },

  // ===== measure (3) =====
  { lineId: 'mea-1', sectionId: 'measure', scene: { id: 'mea-total', type: 'animation' }, lineState: { params: { levels: 5 }, annotation: { text: '总长 (2/3)^n', position: 'top' } } },
  { lineId: 'mea-2', sectionId: 'measure', scene: { id: 'mea-shrink', type: 'animation' }, lineState: { params: { levels: 6 }, annotation: { text: '趋于零', position: 'bottom' } } },
  { lineId: 'mea-3', sectionId: 'measure', scene: { id: 'mea-zero', type: 'animation' }, lineState: { params: { levels: 7 }, annotation: { text: '测度为零', position: 'bottom' } } },

  // ===== uncountable (3) =====
  { lineId: 'unc-1', sectionId: 'uncountable', scene: { id: 'unc-many', type: 'animation' }, lineState: { params: { levels: 6 }, annotation: { text: '点多得数不清', position: 'top' } } },
  { lineId: 'unc-2', sectionId: 'uncountable', scene: { id: 'unc-ternary', type: 'animation' }, lineState: { params: { levels: 6 }, annotation: { text: '只含 0 和 2', position: 'bottom' } } },
  { lineId: 'unc-3', sectionId: 'uncountable', scene: { id: 'unc-inf', type: 'animation' }, lineState: { params: { levels: 7 }, annotation: { text: '不可数的无穷', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-levels', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { levels: 7 }, annotation: { text: '调整层数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-length', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { levels: 5 }, annotation: { text: '看长度滑向零', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '挖中间三分之一', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-paradox', type: 'summary' }, lineState: { annotation: { text: '长度零却不可数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
