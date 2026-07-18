/**
 * 佩尔方程讲解场景配置
 * 每句口播对应参数 N（params.n），驱动双曲线与解点绘制。
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPellEquationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pellEquationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '佩尔方程', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pearl', type: 'animation' }, lineState: { params: { n: 2 }, annotation: { text: '整数天地的明珠', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-form', type: 'animation' }, lineState: { params: { n: 2 }, annotation: { text: 'x²-Ny²=1', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-nonsquare', type: 'animation' }, lineState: { params: { n: 2 }, annotation: { text: 'N 非完全平方', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-intpair', type: 'animation' }, lineState: { params: { n: 3 }, annotation: { text: '寻整数对 (x,y)', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-history', type: 'animation' }, lineState: { params: { n: 3 }, annotation: { text: '千年难题', position: 'bottom' } } },

  // ===== cf (3) =====
  { lineId: 'cf-1', sectionId: 'cf', scene: { id: 'cf-key', type: 'animation' }, lineState: { params: { n: 5 }, annotation: { text: '√N 的连分数', position: 'top' } } },
  { lineId: 'cf-2', sectionId: 'cf', scene: { id: 'cf-period', type: 'animation' }, lineState: { params: { n: 5 }, annotation: { text: '周期渐近分数', position: 'bottom' } } },
  { lineId: 'cf-3', sectionId: 'cf', scene: { id: 'cf-base', type: 'animation' }, lineState: { params: { n: 5 }, annotation: { text: '首个即基本解', position: 'bottom' } } },

  // ===== recur (3) =====
  { lineId: 'rec-1', sectionId: 'recur', scene: { id: 'rec-door', type: 'animation' }, lineState: { params: { n: 7 }, annotation: { text: '握住基本解', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recur', scene: { id: 'rec-power', type: 'animation' }, lineState: { params: { n: 7 }, annotation: { text: '(x+y√N)^k', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recur', scene: { id: 'rec-infinite', type: 'animation' }, lineState: { params: { n: 7 }, annotation: { text: '无穷多解', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-selectn', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 13 }, annotation: { text: '选 N 看基本解', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-curve', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 13 }, annotation: { text: '解落在双曲线上', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '整数解', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-method', type: 'summary' }, lineState: { annotation: { text: '连分数+递推', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
