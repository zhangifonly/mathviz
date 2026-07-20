/**
 * 圆填充讲解场景配置
 * 每句口播对应一种堆积模式（params.mode）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCirclePackingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const circlePackingScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '圆填充', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-gap', type: 'animation' }, lineState: { params: { mode: 'square' }, annotation: { text: '总有缝隙', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-density', type: 'animation' }, lineState: { params: { mode: 'square' }, annotation: { text: '填充密度', position: 'top' } } },

  // ===== square (3) =====
  { lineId: 'sq-1', sectionId: 'square', scene: { id: 'sq-grid', type: 'animation' }, lineState: { params: { mode: 'square' }, annotation: { text: '排成方格', position: 'top' } } },
  { lineId: 'sq-2', sectionId: 'square', scene: { id: 'sq-corner', type: 'animation' }, lineState: { params: { mode: 'square' }, annotation: { text: '四角缝隙', position: 'bottom' } } },
  { lineId: 'sq-3', sectionId: 'square', scene: { id: 'sq-den', type: 'animation' }, lineState: { params: { mode: 'square' }, annotation: { text: '约 78.5%', position: 'bottom' } } },

  // ===== hex (3) =====
  { lineId: 'hex-1', sectionId: 'hex', scene: { id: 'hex-offset', type: 'animation' }, lineState: { params: { mode: 'hex' }, annotation: { text: '错开半个圆', position: 'top' } } },
  { lineId: 'hex-2', sectionId: 'hex', scene: { id: 'hex-honey', type: 'animation' }, lineState: { params: { mode: 'hex' }, annotation: { text: '六圆环绕', position: 'bottom' } } },
  { lineId: 'hex-3', sectionId: 'hex', scene: { id: 'hex-den', type: 'animation' }, lineState: { params: { mode: 'hex' }, annotation: { text: '约 90.7% 极限', position: 'bottom' } } },

  // ===== random (2) =====
  { lineId: 'rand-1', sectionId: 'random', scene: { id: 'rand-throw', type: 'animation' }, lineState: { params: { mode: 'random' }, annotation: { text: '随手丢入', position: 'top' } } },
  { lineId: 'rand-2', sectionId: 'random', scene: { id: 'rand-den', type: 'animation' }, lineState: { params: { mode: 'random' }, annotation: { text: '密度偏低', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'hex' }, annotation: { text: '切换模式', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'square' }, annotation: { text: '对比密度', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '填充密度', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-best', type: 'summary' }, lineState: { annotation: { text: '六边形最密', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美!', position: 'bottom' } } },
]
