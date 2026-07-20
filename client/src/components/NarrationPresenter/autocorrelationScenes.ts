/**
 * 自相关讲解场景配置
 * 每句口播对应一个预置信号（params.preset）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultAutocorrelationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const autocorrelationScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '自相关', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-hidden', type: 'animation' }, lineState: { params: { preset: 'noisy' }, annotation: { text: '藏着周期', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-eye', type: 'animation' }, lineState: { params: { preset: 'noisy' }, annotation: { text: '肉眼难辨', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { preset: 'clean' }, annotation: { text: '用自相关揪出它', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-copy', type: 'animation' }, lineState: { params: { preset: 'clean' }, annotation: { text: '和延迟副本比较', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-lag', type: 'animation' }, lineState: { params: { preset: 'clean' }, annotation: { text: 'lag = 错开距离', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-similar', type: 'animation' }, lineState: { params: { preset: 'clean' }, annotation: { text: '越像值越高', position: 'bottom' } } },

  // ===== compute (3) =====
  { lineId: 'com-1', sectionId: 'compute', scene: { id: 'com-mul', type: 'animation' }, lineState: { params: { preset: 'clean' }, annotation: { text: '错位相乘', position: 'top' } } },
  { lineId: 'com-2', sectionId: 'compute', scene: { id: 'com-sum', type: 'animation' }, lineState: { params: { preset: 'clean' }, annotation: { text: '乘积求和', position: 'bottom' } } },
  { lineId: 'com-3', sectionId: 'compute', scene: { id: 'com-curve', type: 'animation' }, lineState: { params: { preset: 'fast' }, annotation: { text: '得到自相关曲线', position: 'bottom' } } },

  // ===== peak (3) =====
  { lineId: 'peak-1', sectionId: 'peak', scene: { id: 'peak-align', type: 'animation' }, lineState: { params: { preset: 'clean' }, annotation: { text: '峰对峰谷对谷', position: 'top' } } },
  { lineId: 'peak-2', sectionId: 'peak', scene: { id: 'peak-high', type: 'animation' }, lineState: { params: { preset: 'clean' }, annotation: { text: '累出高峰值', position: 'bottom' } } },
  { lineId: 'peak-3', sectionId: 'peak', scene: { id: 'peak-find', type: 'animation' }, lineState: { params: { preset: 'fast' }, annotation: { text: '首个显著峰=周期', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'noisy' }, annotation: { text: '切换信号', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'noisy' }, annotation: { text: '峰始终锁定', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '延迟相乘求和', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-freq', type: 'summary' }, lineState: { annotation: { text: '峰值提取基频', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
