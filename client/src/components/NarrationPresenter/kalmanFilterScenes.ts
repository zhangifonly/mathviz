/**
 * 卡尔曼滤波讲解场景配置
 * 每句口播对应一档噪声预设（params.preset 索引 NOISE_OPTIONS）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKalmanFilterState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const kalmanFilterScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '卡尔曼滤波', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-noise', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '带噪声的测量', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-track', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '追踪真实轨迹', position: 'bottom' } } },

  // ===== predict (3) =====
  { lineId: 'predict-1', sectionId: 'predict', scene: { id: 'predict-step', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '先预测位置', position: 'top' } } },
  { lineId: 'predict-2', sectionId: 'predict', scene: { id: 'predict-drift', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '把握逐渐下降', position: 'bottom' } } },
  { lineId: 'predict-3', sectionId: 'predict', scene: { id: 'predict-var', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '方差加过程噪声', position: 'bottom' } } },

  // ===== update (3) =====
  { lineId: 'update-1', sectionId: 'update', scene: { id: 'update-meas', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '新测量到达', position: 'top' } } },
  { lineId: 'update-2', sectionId: 'update', scene: { id: 'update-innov', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '计算新息', position: 'top' } } },
  { lineId: 'update-3', sectionId: 'update', scene: { id: 'update-fuse', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '加权融合', position: 'bottom' } } },

  // ===== gain (3) =====
  { lineId: 'gain-1', sectionId: 'gain', scene: { id: 'gain-k', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '增益在 0 到 1 之间', position: 'top' } } },
  { lineId: 'gain-2', sectionId: 'gain', scene: { id: 'gain-trust', type: 'animation' }, lineState: { params: { preset: 2 }, annotation: { text: '越信任测量', position: 'top' } } },
  { lineId: 'gain-3', sectionId: 'gain', scene: { id: 'gain-shrink', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '置信带收窄', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-small-q', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 0 }, annotation: { text: '过程噪声小 → 平滑', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-large-q', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 2 }, annotation: { text: '过程噪声大 → 紧跟', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '融合预测与测量', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-shrink', type: 'summary' }, lineState: { annotation: { text: '方差不断收缩', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
