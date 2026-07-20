/**
 * 黎曼和讲解场景配置
 * 每句口播对应分段数 n 与取样方式 mode（params.n / params.mode）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRiemannSumState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const riemannSumScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '黎曼和', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-area', type: 'animation' }, lineState: { params: { n: 4, mode: 'mid' }, annotation: { text: '弯曲的面积', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { n: 8, mode: 'mid' }, annotation: { text: '用矩形拼出来', position: 'bottom' } } },

  // ===== split (3) =====
  { lineId: 'def-1', sectionId: 'split', scene: { id: 'def-cut', type: 'animation' }, lineState: { params: { n: 8, mode: 'left' }, annotation: { text: '切成 n 段', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'split', scene: { id: 'def-height', type: 'animation' }, lineState: { params: { n: 8, mode: 'left' }, annotation: { text: '同宽·取样定高', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'split', scene: { id: 'def-sum', type: 'animation' }, lineState: { params: { n: 8, mode: 'left' }, annotation: { text: '面积相加=黎曼和', position: 'bottom' } } },

  // ===== sample (3) =====
  { lineId: 'samp-1', sectionId: 'sample', scene: { id: 'samp-lr', type: 'animation' }, lineState: { params: { n: 8, mode: 'right' }, annotation: { text: '左和·右和', position: 'top' } } },
  { lineId: 'samp-2', sectionId: 'sample', scene: { id: 'samp-bound', type: 'animation' }, lineState: { params: { n: 8, mode: 'right' }, annotation: { text: '一低估一高估', position: 'bottom' } } },
  { lineId: 'samp-3', sectionId: 'sample', scene: { id: 'samp-mid', type: 'animation' }, lineState: { params: { n: 8, mode: 'mid' }, annotation: { text: '中点误差最小', position: 'bottom' } } },

  // ===== limit (3) =====
  { lineId: 'lim-1', sectionId: 'limit', scene: { id: 'lim-narrow', type: 'animation' }, lineState: { params: { n: 16, mode: 'mid' }, annotation: { text: '越窄越贴合', position: 'top' } } },
  { lineId: 'lim-2', sectionId: 'limit', scene: { id: 'lim-converge', type: 'animation' }, lineState: { params: { n: 32, mode: 'mid' }, annotation: { text: 'n→∞ 收敛', position: 'bottom' } } },
  { lineId: 'lim-3', sectionId: 'limit', scene: { id: 'lim-integral', type: 'animation' }, lineState: { params: { n: 32, mode: 'mid' }, annotation: { text: '极限=定积分', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-n', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 16, mode: 'mid' }, annotation: { text: '增大 n', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-mode', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 8, mode: 'left' }, annotation: { text: '切换取样', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '矩形逼近面积', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-precise', type: 'summary' }, lineState: { annotation: { text: '越细越准', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '化作定积分！', position: 'bottom' } } },
]
