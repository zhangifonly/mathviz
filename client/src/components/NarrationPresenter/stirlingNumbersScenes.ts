/**
 * 斯特林数讲解场景配置
 * params.kind = 'first'|'second'，params.hn/hk 为高亮格子坐标
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultStirlingNumbersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const stirlingNumbersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '斯特林数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { kind: 'second', hn: 4, hk: 2 }, annotation: { text: '分组有几种？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { kind: 'second', hn: 5, hk: 3 }, annotation: { text: '斯特林数登场', position: 'bottom' } } },

  // ===== second (3) =====
  { lineId: 'def-1', sectionId: 'second', scene: { id: 'def-snk', type: 'animation' }, lineState: { params: { kind: 'second', hn: 4, hk: 2 }, annotation: { text: 'S(n,k): 划分成k个子集', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'second', scene: { id: 'def-order', type: 'animation' }, lineState: { params: { kind: 'second', hn: 4, hk: 2 }, annotation: { text: '只看分组不看顺序', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'second', scene: { id: 'def-tri', type: 'animation' }, lineState: { params: { kind: 'second', hn: 6, hk: 3 }, annotation: { text: '排成斯特林三角', position: 'bottom' } } },

  // ===== recur (3) =====
  { lineId: 'rec-1', sectionId: 'recur', scene: { id: 'rec-new', type: 'animation' }, lineState: { params: { kind: 'second', hn: 5, hk: 3 }, annotation: { text: '独立成新组 S(n-1,k-1)', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recur', scene: { id: 'rec-join', type: 'animation' }, lineState: { params: { kind: 'second', hn: 5, hk: 3 }, annotation: { text: '加入已有组 k·S(n-1,k)', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recur', scene: { id: 'rec-sum', type: 'animation' }, lineState: { params: { kind: 'second', hn: 6, hk: 3 }, annotation: { text: '两式相加得递推', position: 'bottom' } } },

  // ===== first (3) =====
  { lineId: 'fir-1', sectionId: 'first', scene: { id: 'fir-cycle', type: 'animation' }, lineState: { params: { kind: 'first', hn: 5, hk: 2 }, annotation: { text: '第一类: 排成k个圆圈', position: 'top' } } },
  { lineId: 'fir-2', sectionId: 'first', scene: { id: 'fir-coef', type: 'animation' }, lineState: { params: { kind: 'first', hn: 5, hk: 3 }, annotation: { text: '递推系数变成 n-1', position: 'bottom' } } },
  { lineId: 'fir-3', sectionId: 'first', scene: { id: 'fir-fact', type: 'animation' }, lineState: { params: { kind: 'first', hn: 6, hk: 3 }, annotation: { text: '行和等于 n!', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'second', hn: 6, hk: 4 }, annotation: { text: '选格子看拼合', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'first', hn: 7, hk: 3 }, annotation: { text: '切换两类比较', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '划分与循环', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-connect', type: 'summary' }, lineState: { annotation: { text: '组合计数核心', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
