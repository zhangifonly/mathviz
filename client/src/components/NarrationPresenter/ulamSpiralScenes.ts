/**
 * 素数螺旋讲解场景配置
 * 每句口播对应网格规模（params.count）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultUlamSpiralState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const ulamSpiralScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '素数螺旋', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-spiral', type: 'animation' }, lineState: { params: { count: 441 }, annotation: { text: '螺旋写自然数', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-mark', type: 'animation' }, lineState: { params: { count: 441 }, annotation: { text: '圈出素数', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-diag', type: 'animation' }, lineState: { params: { count: 961 }, annotation: { text: '对角线！', position: 'bottom' } } },

  // ===== build (3) =====
  { lineId: 'build-1', sectionId: 'build', scene: { id: 'build-center', type: 'animation' }, lineState: { params: { count: 441 }, annotation: { text: '从中心 1 展开', position: 'top' } } },
  { lineId: 'build-2', sectionId: 'build', scene: { id: 'build-fill', type: 'animation' }, lineState: { params: { count: 441 }, annotation: { text: '每数唯一位置', position: 'top' } } },
  { lineId: 'build-3', sectionId: 'build', scene: { id: 'build-gold', type: 'animation' }, lineState: { params: { count: 961 }, annotation: { text: '素数标金色', position: 'bottom' } } },

  // ===== pattern (3) =====
  { lineId: 'pat-1', sectionId: 'pattern', scene: { id: 'pat-lines', type: 'animation' }, lineState: { params: { count: 961 }, annotation: { text: '聚集在斜线', position: 'top' } } },
  { lineId: 'pat-2', sectionId: 'pattern', scene: { id: 'pat-poly', type: 'animation' }, lineState: { params: { count: 961 }, annotation: { text: 'n²+n+41', position: 'bottom' } } },
  { lineId: 'pat-3', sectionId: 'pattern', scene: { id: 'pat-rich', type: 'animation' }, lineState: { params: { count: 2601 }, annotation: { text: '素数多项式', position: 'bottom' } } },

  // ===== mystery (2) =====
  { lineId: 'mys-1', sectionId: 'mystery', scene: { id: 'mys-open', type: 'animation' }, lineState: { params: { count: 2601 }, annotation: { text: '至今无解', position: 'top' } } },
  { lineId: 'mys-2', sectionId: 'mystery', scene: { id: 'mys-riemann', type: 'animation' }, lineState: { params: { count: 2601 }, annotation: { text: '黎曼猜想', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-size', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 961 }, annotation: { text: '切换规模', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-density', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 2601 }, annotation: { text: '素数渐稀疏', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '对角线聚集', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-poly', type: 'summary' }, lineState: { annotation: { text: '二次多项式', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
