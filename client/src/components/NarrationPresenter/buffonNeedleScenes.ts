/**
 * 蒲丰投针讲解场景配置
 * 每句口播对应投针数量（params.count），随讲解逐步增大以展示收敛。
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBuffonNeedleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const buffonNeedleScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '蒲丰投针', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-drop', type: 'animation' }, lineState: { params: { count: 200 }, annotation: { text: '把针抛向平行线', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-count', type: 'animation' }, lineState: { params: { count: 200 }, annotation: { text: '数压线的次数', position: 'bottom' } } },

  // ===== setup (3) =====
  { lineId: 'def-1', sectionId: 'setup', scene: { id: 'def-spacing', type: 'animation' }, lineState: { params: { count: 200 }, annotation: { text: '线距=针长', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'setup', scene: { id: 'def-pose', type: 'animation' }, lineState: { params: { count: 200 }, annotation: { text: '位置+角度', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'setup', scene: { id: 'def-cross', type: 'animation' }, lineState: { params: { count: 1000 }, annotation: { text: '相交=红色', position: 'bottom' } } },

  // ===== prob (3) =====
  { lineId: 'prob-1', sectionId: 'prob', scene: { id: 'prob-formula', type: 'animation' }, lineState: { params: { count: 1000 }, annotation: { text: 'P = 2/π', position: 'top' } } },
  { lineId: 'prob-2', sectionId: 'prob', scene: { id: 'prob-angle', type: 'animation' }, lineState: { params: { count: 1000 }, annotation: { text: '角度均匀分布', position: 'bottom' } } },
  { lineId: 'prob-3', sectionId: 'prob', scene: { id: 'prob-hint', type: 'animation' }, lineState: { params: { count: 1000 }, annotation: { text: '概率里藏着π', position: 'bottom' } } },

  // ===== estimate (2) =====
  { lineId: 'est-1', sectionId: 'estimate', scene: { id: 'est-freq', type: 'animation' }, lineState: { params: { count: 5000 }, annotation: { text: '频率→概率', position: 'top' } } },
  { lineId: 'est-2', sectionId: 'estimate', scene: { id: 'est-invert', type: 'animation' }, lineState: { params: { count: 5000 }, annotation: { text: 'π ≈ 2n/相交数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-more', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 5000 }, annotation: { text: '增投针看收敛', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 1000 }, annotation: { text: '重新投一次', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '随机连到π', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-prob', type: 'summary' }, lineState: { annotation: { text: 'P = 2/π', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
