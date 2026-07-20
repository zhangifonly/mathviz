/**
 * 卢卡斯数讲解场景配置
 * 每句口播对应显示项数（params.terms）与是否叠加斐波那契（params.showFib）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLucasNumbersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 12,
  isAnimating: false,
  highlightedElements: [],
}

export const lucasNumbersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '卢卡斯数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-rule', type: 'animation' }, lineState: { params: { terms: 8 }, annotation: { text: '相同规则,不同起点', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-seed', type: 'animation' }, lineState: { params: { terms: 8 }, annotation: { text: '从 2 和 1 起步', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-add', type: 'animation' }, lineState: { params: { terms: 8 }, annotation: { text: '前两项之和', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-grow', type: 'animation' }, lineState: { params: { terms: 8 }, annotation: { text: '3,4,7,11,18,29', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-seq', type: 'animation' }, lineState: { params: { terms: 12 }, annotation: { text: '数列一路生长', position: 'bottom' } } },

  // ===== golden (3) =====
  { lineId: 'gold-1', sectionId: 'golden', scene: { id: 'gold-ratio', type: 'animation' }, lineState: { params: { terms: 12 }, annotation: { text: '相邻比趋近 phi', position: 'top' } } },
  { lineId: 'gold-2', sectionId: 'golden', scene: { id: 'gold-conv', type: 'animation' }, lineState: { params: { terms: 16 }, annotation: { text: '奔向黄金比', position: 'bottom' } } },
  { lineId: 'gold-3', sectionId: 'golden', scene: { id: 'gold-fate', type: 'animation' }, lineState: { params: { terms: 16 }, annotation: { text: '殊途同归', position: 'bottom' } } },

  // ===== link (3) =====
  { lineId: 'link-1', sectionId: 'link', scene: { id: 'link-formula', type: 'animation' }, lineState: { params: { terms: 12, showFib: true }, annotation: { text: '一行公式', position: 'top' } } },
  { lineId: 'link-2', sectionId: 'link', scene: { id: 'link-identity', type: 'animation' }, lineState: { params: { terms: 12, showFib: true }, annotation: { text: 'Ln = Fn-1 + Fn+1', position: 'bottom' } } },
  { lineId: 'link-3', sectionId: 'link', scene: { id: 'link-secret', type: 'animation' }, lineState: { params: { terms: 16, showFib: true }, annotation: { text: '互藏秘密', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-terms', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { terms: 16 }, annotation: { text: '调整项数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { terms: 16, showFib: true }, annotation: { text: '汇聚同一金线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '同宗同源', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-link', type: 'summary' }, lineState: { annotation: { text: '公式相连', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
