/**
 * 奈奎斯特采样讲解场景配置
 * 每句口播对应一组信号频率与采样率（params.freq / params.fs）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNyquistSamplingState: SceneState = {
  waveType: 'sine',
  frequency: 2,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const nyquistSamplingScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '奈奎斯特采样', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-dots', type: 'animation' }, lineState: { params: { freq: 2, fs: 10 }, annotation: { text: '离散点还原连续波', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { freq: 2, fs: 6 }, annotation: { text: '几个点够吗？', position: 'bottom' } } },

  // ===== theorem (3) =====
  { lineId: 'thm-1', sectionId: 'theorem', scene: { id: 'thm-rule', type: 'animation' }, lineState: { params: { freq: 2, fs: 10 }, annotation: { text: 'fs > 2f', position: 'top' } } },
  { lineId: 'thm-2', sectionId: 'theorem', scene: { id: 'thm-twopts', type: 'animation' }, lineState: { params: { freq: 2, fs: 10 }, annotation: { text: '一周期取两点以上', position: 'bottom' } } },
  { lineId: 'thm-3', sectionId: 'theorem', scene: { id: 'thm-lossless', type: 'animation' }, lineState: { params: { freq: 2, fs: 12 }, annotation: { text: '信息无丢失', position: 'bottom' } } },

  // ===== reconstruct (3) =====
  { lineId: 'rec-1', sectionId: 'reconstruct', scene: { id: 'rec-sinc', type: 'animation' }, lineState: { params: { freq: 2, fs: 10 }, annotation: { text: '每点一个 sinc 波', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'reconstruct', scene: { id: 'rec-zero', type: 'animation' }, lineState: { params: { freq: 2, fs: 10 }, annotation: { text: '本点为1，他点为0', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'reconstruct', scene: { id: 'rec-sum', type: 'animation' }, lineState: { params: { freq: 2, fs: 12 }, annotation: { text: '叠加=完美重建', position: 'bottom' } } },

  // ===== critical (3) =====
  { lineId: 'crit-1', sectionId: 'critical', scene: { id: 'crit-edge', type: 'animation' }, lineState: { params: { freq: 2, fs: 4 }, annotation: { text: '临界 fs = 2f', position: 'top' } } },
  { lineId: 'crit-2', sectionId: 'critical', scene: { id: 'crit-under', type: 'animation' }, lineState: { params: { freq: 2, fs: 3 }, annotation: { text: '欠采样偏离', position: 'bottom' } } },
  { lineId: 'crit-3', sectionId: 'critical', scene: { id: 'crit-lost', type: 'animation' }, lineState: { params: { freq: 4, fs: 5 }, annotation: { text: '信息补不回', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { freq: 2, fs: 10 }, annotation: { text: '拖动采样率', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-under', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { freq: 2, fs: 3 }, annotation: { text: '试试欠采样', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'fs > 2f 无损', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-sinc', type: 'summary' }, lineState: { annotation: { text: 'sinc 插值重建', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
