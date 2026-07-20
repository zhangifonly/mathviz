/**
 * 对数螺线讲解场景配置
 * 每句口播对应松紧参数 b（params.b）与是否对比（params.compare）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLogarithmSpiralState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const logarithmSpiralScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '对数螺线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-shape', type: 'animation' }, lineState: { params: { b: 0.2 }, annotation: { text: '越转越大，形状不变', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { b: 0.2 }, annotation: { text: '自然界的螺线', position: 'bottom' } } },

  // ===== equation (3) =====
  { lineId: 'eq-1', sectionId: 'equation', scene: { id: 'eq-formula', type: 'animation' }, lineState: { params: { b: 0.2 }, annotation: { text: 'r = a·e^(b·θ)', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equation', scene: { id: 'eq-grow', type: 'animation' }, lineState: { params: { b: 0.25 }, annotation: { text: '半径指数增长', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equation', scene: { id: 'eq-ab', type: 'animation' }, lineState: { params: { b: 0.35 }, annotation: { text: 'b 控制松紧', position: 'bottom' } } },

  // ===== equiangular (2) =====
  { lineId: 'ang-1', sectionId: 'equiangular', scene: { id: 'ang-tangent', type: 'animation' }, lineState: { params: { b: 0.2 }, annotation: { text: '切线与径向', position: 'top' } } },
  { lineId: 'ang-2', sectionId: 'equiangular', scene: { id: 'ang-const', type: 'animation' }, lineState: { params: { b: 0.2 }, annotation: { text: '定角 = arctan(1/b)', position: 'bottom' } } },

  // ===== selfsimilar (3) =====
  { lineId: 'self-1', sectionId: 'selfsimilar', scene: { id: 'self-grow', type: 'animation' }, lineState: { params: { b: 0.2 }, annotation: { text: '每圈放大 e^(2πb)', position: 'top' } } },
  { lineId: 'self-2', sectionId: 'selfsimilar', scene: { id: 'self-scale', type: 'animation' }, lineState: { params: { b: 0.2 }, annotation: { text: '放缩后完全一样', position: 'bottom' } } },
  { lineId: 'self-3', sectionId: 'selfsimilar', scene: { id: 'self-compare', type: 'comparison' }, lineState: { params: { b: 0.2, compare: 1 }, annotation: { text: '对比阿基米德螺线', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-b', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { b: 0.35 }, annotation: { text: '调整 b 看松紧', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { b: 0.2, compare: 1 }, annotation: { text: '指数 vs 线性', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '指数增长的半径', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-props', type: 'summary' }, lineState: { annotation: { text: '等角且自相似', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
