/**
 * 赠券收集问题讲解场景配置
 * 每句口播对应赠券种类数（params.count）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCouponCollectorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const couponCollectorScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '赠券收集问题', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-slow', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '越到后面越慢', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '经典数学问题', position: 'bottom' } } },

  // ===== setup (3) =====
  { lineId: 'def-1', sectionId: 'setup', scene: { id: 'def-n', type: 'animation' }, lineState: { params: { count: 6 }, annotation: { text: 'n 种·等概率', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'setup', scene: { id: 'def-ask', type: 'animation' }, lineState: { params: { count: 6 }, annotation: { text: '集齐要多少次？', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'setup', scene: { id: 'def-step', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '阶梯=集齐进度', position: 'bottom' } } },

  // ===== expect (3) =====
  { lineId: 'exp-1', sectionId: 'expect', scene: { id: 'exp-kth', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '第 k 张要 n/(n−k+1)', position: 'top' } } },
  { lineId: 'exp-2', sectionId: 'expect', scene: { id: 'exp-sum', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '相加 = n·H(n)', position: 'bottom' } } },
  { lineId: 'exp-3', sectionId: 'expect', scene: { id: 'exp-harmonic', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: 'H(n)=1+½+…+1/n', position: 'bottom' } } },

  // ===== tail (2) =====
  { lineId: 'tail-1', sectionId: 'tail', scene: { id: 'tail-ln', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '约 n·ln n', position: 'top' } } },
  { lineId: 'tail-2', sectionId: 'tail', scene: { id: 'tail-last', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '最后一张要抽 n 次', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 24 }, annotation: { text: '调整种类数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-resim', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 12 }, annotation: { text: '重复模拟', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '期望 = n·H(n)', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-tail', type: 'summary' }, lineState: { annotation: { text: '收尾格外漫长', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
