/**
 * 九点圆讲解场景配置
 * params.tri 选择预设三角形；params.highlight 高亮某类点
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNinePointCircleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const ninePointCircleScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '九点圆', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-nine', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'all' }, annotation: { text: '九点共圆', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'all' }, annotation: { text: '对每个三角形都成立', position: 'bottom' } } },

  // ===== mid (2) =====
  { lineId: 'def-1', sectionId: 'mid', scene: { id: 'def-mid', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'mid' }, annotation: { text: '三边中点', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'mid', scene: { id: 'def-mid2', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'mid' }, annotation: { text: '每边一分为二', position: 'bottom' } } },

  // ===== foot (2) =====
  { lineId: 'def-3', sectionId: 'foot', scene: { id: 'def-foot', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'foot' }, annotation: { text: '三高垂足', position: 'top' } } },
  { lineId: 'def-4', sectionId: 'foot', scene: { id: 'def-foot2', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'foot' }, annotation: { text: '三高交于垂心', position: 'bottom' } } },

  // ===== ortho (2) =====
  { lineId: 'def-5', sectionId: 'ortho', scene: { id: 'def-ortho', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'ortho' }, annotation: { text: '垂心连线中点', position: 'top' } } },
  { lineId: 'def-6', sectionId: 'ortho', scene: { id: 'def-count', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'all' }, annotation: { text: '一共九个点', position: 'bottom' } } },

  // ===== interaction (3) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-circle', type: 'animation' }, lineState: { params: { tri: 0, highlight: 'all' }, annotation: { text: '九点共圆', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-center', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { tri: 1, highlight: 'all' }, annotation: { text: '圆心=外心垂心中点', position: 'bottom' } } },
  { lineId: 'int-3', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { tri: 2, highlight: 'all' }, annotation: { text: '切换三角形验证', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '九点共处一圆', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-order', type: 'summary' }, lineState: { annotation: { text: '优雅的秩序', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '几何深处的和谐之美！', position: 'bottom' } } },
]
