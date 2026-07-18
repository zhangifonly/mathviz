/**
 * 大数定律讲解场景配置
 * 每句口播对应分布(dist)与样本量(n)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLawLargeNumbersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lawLargeNumbersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '大数定律', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-avg', type: 'animation' }, lineState: { params: { dist: 'dice', n: 50 }, annotation: { text: '藏在平均里', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { dist: 'dice', n: 200 }, annotation: { text: '最著名的定律', position: 'bottom' } } },

  // ===== mean (3) =====
  { lineId: 'def-1', sectionId: 'mean', scene: { id: 'def-record', type: 'animation' }, lineState: { params: { dist: 'dice', n: 50 }, annotation: { text: '记下每次结果', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'mean', scene: { id: 'def-formula', type: 'animation' }, lineState: { params: { dist: 'dice', n: 50 }, annotation: { text: '和 ÷ n', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'mean', scene: { id: 'def-unstable', type: 'animation' }, lineState: { params: { dist: 'dice', n: 50 }, annotation: { text: '开头很不稳', position: 'bottom' } } },

  // ===== law (3) =====
  { lineId: 'law-1', sectionId: 'law', scene: { id: 'law-converge', type: 'animation' }, lineState: { params: { dist: 'dice', n: 200 }, annotation: { text: '稳稳靠向一个数', position: 'top' } } },
  { lineId: 'law-2', sectionId: 'law', scene: { id: 'law-expect', type: 'animation' }, lineState: { params: { dist: 'dice', n: 200 }, annotation: { text: '期望 = 3.5', position: 'bottom' } } },
  { lineId: 'law-3', sectionId: 'law', scene: { id: 'law-theorem', type: 'animation' }, lineState: { params: { dist: 'dice', n: 1000 }, annotation: { text: 'n→∞ 必收敛', position: 'bottom' } } },

  // ===== fluctuation (2) =====
  { lineId: 'flu-1', sectionId: 'fluctuation', scene: { id: 'flu-shrink', type: 'animation' }, lineState: { params: { dist: 'dice', n: 1000 }, annotation: { text: '摆动越来越小', position: 'top' } } },
  { lineId: 'flu-2', sectionId: 'fluctuation', scene: { id: 'flu-average', type: 'animation' }, lineState: { params: { dist: 'uniform', n: 1000 }, annotation: { text: '偏差被摊薄', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-dist', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { dist: 'bernoulli', n: 200 }, annotation: { text: '换个分布', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-n', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { dist: 'uniform', n: 1000 }, annotation: { text: '调大样本量', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '越多越贴近期望', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-law', type: 'summary' }, lineState: { annotation: { text: '偶然中的必然', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
