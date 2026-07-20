/**
 * 斯坦纳链讲解场景配置
 * 每句口播对应链圆数量（params.count）与视图模式（params.mode）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSteinerChainState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const steinerChainScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '斯坦纳链', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fill', type: 'animation' }, lineState: { params: { count: 6, mode: 'concentric' }, annotation: { text: '两圆之间填圆', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-touch', type: 'animation' }, lineState: { params: { count: 6, mode: 'concentric' }, annotation: { text: '贴内外·挨邻居', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { count: 8, mode: 'general' }, annotation: { text: '首尾相接的链', position: 'bottom' } } },

  // ===== tangent (3) =====
  { lineId: 'def-1', sectionId: 'tangent', scene: { id: 'def-inout', type: 'animation' }, lineState: { params: { count: 6, mode: 'concentric' }, annotation: { text: '内切外·外切内', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'tangent', scene: { id: 'def-neighbor', type: 'animation' }, lineState: { params: { count: 6, mode: 'concentric' }, annotation: { text: '相邻两两外切', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'tangent', scene: { id: 'def-close', type: 'animation' }, lineState: { params: { count: 5, mode: 'concentric' }, annotation: { text: '正好绕一圈', position: 'bottom' } } },

  // ===== porism (3) =====
  { lineId: 'por-1', sectionId: 'porism', scene: { id: 'por-cond', type: 'animation' }, lineState: { params: { count: 6, mode: 'concentric' }, annotation: { text: 'sin(π/n)=(R−r)/(R+r)', position: 'top' } } },
  { lineId: 'por-2', sectionId: 'porism', scene: { id: 'por-once', type: 'animation' }, lineState: { params: { count: 8, mode: 'concentric' }, annotation: { text: '闭合一次即永远', position: 'bottom' } } },
  { lineId: 'por-3', sectionId: 'porism', scene: { id: 'por-spin', type: 'animation' }, lineState: { params: { count: 8, mode: 'general' }, annotation: { text: '自由旋转仍闭合', position: 'bottom' } } },

  // ===== inversion (3) =====
  { lineId: 'inv-1', sectionId: 'inversion', scene: { id: 'inv-general', type: 'animation' }, lineState: { params: { count: 6, mode: 'general' }, annotation: { text: '两圆不同心', position: 'top' } } },
  { lineId: 'inv-2', sectionId: 'inversion', scene: { id: 'inv-map', type: 'animation' }, lineState: { params: { count: 6, mode: 'general' }, annotation: { text: '反演保相切', position: 'bottom' } } },
  { lineId: 'inv-3', sectionId: 'inversion', scene: { id: 'inv-result', type: 'animation' }, lineState: { params: { count: 8, mode: 'general' }, annotation: { text: '同心→一般', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 5, mode: 'concentric' }, annotation: { text: '调整链圆个数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-spin', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 8, mode: 'general' }, annotation: { text: '让链条旋转', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '两圆间的相切链', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-porism', type: 'summary' }, lineState: { annotation: { text: '闭合即可旋转', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
