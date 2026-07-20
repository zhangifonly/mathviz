/**
 * 完全数与亲和数讲解场景配置
 * 每句口播对应要展示的数字（params.n）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPerfectNumbersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const perfectNumbersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '完全数与亲和数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-six', type: 'animation' }, lineState: { params: { n: 6 }, annotation: { text: '6 = 1 + 2 + 3', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-perfect', type: 'animation' }, lineState: { params: { n: 6 }, annotation: { text: '和 = 自身', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-divisors', type: 'animation' }, lineState: { params: { n: 28 }, annotation: { text: '真因数', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-perfect', type: 'animation' }, lineState: { params: { n: 28 }, annotation: { text: '28 也是完全数', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-rare', type: 'animation' }, lineState: { params: { n: 496 }, annotation: { text: '越来越稀少', position: 'bottom' } } },

  // ===== balance (3) =====
  { lineId: 'bal-1', sectionId: 'balance', scene: { id: 'bal-abundant', type: 'animation' }, lineState: { params: { n: 12 }, annotation: { text: '盈数 12', position: 'top' } } },
  { lineId: 'bal-2', sectionId: 'balance', scene: { id: 'bal-deficient', type: 'animation' }, lineState: { params: { n: 8 }, annotation: { text: '亏数 8', position: 'bottom' } } },
  { lineId: 'bal-3', sectionId: 'balance', scene: { id: 'bal-balance', type: 'animation' }, lineState: { params: { n: 6 }, annotation: { text: '完全数居中', position: 'bottom' } } },

  // ===== amicable (2) =====
  { lineId: 'ami-1', sectionId: 'amicable', scene: { id: 'ami-220', type: 'animation' }, lineState: { params: { n: 220 }, annotation: { text: '220 → 284', position: 'top' } } },
  { lineId: 'ami-2', sectionId: 'amicable', scene: { id: 'ami-284', type: 'animation' }, lineState: { params: { n: 284 }, annotation: { text: '284 → 220', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 12 }, annotation: { text: '输入数字', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-classify', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 28 }, annotation: { text: '看它的分类', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '完全·盈·亏', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-amicable', type: 'summary' }, lineState: { annotation: { text: '亲和数成对', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
