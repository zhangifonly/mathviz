/**
 * 等差等比数列讲解场景配置
 * 每句口播对应一个数列选项（params.optionIndex 指向 SEQUENCE_OPTIONS）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSequencesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 6,
  isAnimating: false,
  highlightedElements: [],
}

export const sequencesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '等差等比数列', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-two', type: 'animation' }, lineState: { params: { optionIndex: 0 }, annotation: { text: '两种经典数列', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-addmul', type: 'animation' }, lineState: { params: { optionIndex: 2 }, annotation: { text: '相加 vs 相乘', position: 'bottom' } } },

  // ===== arithmetic (3) =====
  { lineId: 'arith-1', sectionId: 'arithmetic', scene: { id: 'arith-example', type: 'animation' }, lineState: { params: { optionIndex: 0 }, annotation: { text: '1,3,5,7,9', position: 'top' } } },
  { lineId: 'arith-2', sectionId: 'arithmetic', scene: { id: 'arith-diff', type: 'animation' }, lineState: { params: { optionIndex: 0 }, annotation: { text: '公差 = 2', position: 'top' } } },
  { lineId: 'arith-3', sectionId: 'arithmetic', scene: { id: 'arith-term', type: 'animation' }, lineState: { params: { optionIndex: 0 }, annotation: { text: 'a_n = a1+(n-1)d', position: 'bottom' } } },

  // ===== geometric (3) =====
  { lineId: 'geo-1', sectionId: 'geometric', scene: { id: 'geo-example', type: 'animation' }, lineState: { params: { optionIndex: 2 }, annotation: { text: '1,2,4,8,16', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geometric', scene: { id: 'geo-ratio', type: 'animation' }, lineState: { params: { optionIndex: 2 }, annotation: { text: '公比 = 2', position: 'top' } } },
  { lineId: 'geo-3', sectionId: 'geometric', scene: { id: 'geo-term', type: 'animation' }, lineState: { params: { optionIndex: 2 }, annotation: { text: 'a_n = a1·r^(n-1)', position: 'bottom' } } },

  // ===== sum (3) =====
  { lineId: 'sum-1', sectionId: 'sum', scene: { id: 'sum-intro', type: 'animation' }, lineState: { params: { optionIndex: 0 }, annotation: { text: '前 n 项求和', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'sum', scene: { id: 'sum-arith', type: 'animation' }, lineState: { params: { optionIndex: 0 }, annotation: { text: '首尾配对', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'sum', scene: { id: 'sum-geo', type: 'animation' }, lineState: { params: { optionIndex: 3 }, annotation: { text: '公比<1 收敛', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optionIndex: 2 }, annotation: { text: '切换数列', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-half', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optionIndex: 3 }, annotation: { text: '公比 0.5 逼近零', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'end-1', sectionId: 'summary', scene: { id: 'end-recap', type: 'summary' }, lineState: { annotation: { text: '相加 vs 相乘', position: 'top' } } },
  { lineId: 'end-2', sectionId: 'summary', scene: { id: 'end-formula', type: 'summary' }, lineState: { annotation: { text: '两条通项公式', position: 'bottom' } } },
  { lineId: 'end-3', sectionId: 'summary', scene: { id: 'end-bye', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
