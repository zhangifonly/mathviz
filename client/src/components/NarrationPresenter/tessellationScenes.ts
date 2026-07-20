/**
 * 密铺镶嵌讲解场景配置
 * 每句口播对应密铺类型（params.type）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTessellationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const tessellationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '密铺镶嵌', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-gap', type: 'animation' }, lineState: { params: { type: 'square' }, annotation: { text: '为何不留缝？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { type: 'square' }, annotation: { text: '密铺=铺满平面', position: 'bottom' } } },

  // ===== angle (3) =====
  { lineId: 'ang-1', sectionId: 'angle', scene: { id: 'ang-vertex', type: 'animation' }, lineState: { params: { type: 'triangle' }, annotation: { text: '看顶点', position: 'top' } } },
  { lineId: 'ang-2', sectionId: 'angle', scene: { id: 'ang-360', type: 'animation' }, lineState: { params: { type: 'triangle' }, annotation: { text: '角度和=360°', position: 'bottom' } } },
  { lineId: 'ang-3', sectionId: 'angle', scene: { id: 'ang-exact', type: 'animation' }, lineState: { params: { type: 'square' }, annotation: { text: '刚好合成一圈', position: 'bottom' } } },

  // ===== three (4) =====
  { lineId: 'thr-1', sectionId: 'three', scene: { id: 'thr-tri', type: 'animation' }, lineState: { params: { type: 'triangle' }, annotation: { text: '6个×60°', position: 'top' } } },
  { lineId: 'thr-2', sectionId: 'three', scene: { id: 'thr-sq', type: 'animation' }, lineState: { params: { type: 'square' }, annotation: { text: '4个×90°', position: 'top' } } },
  { lineId: 'thr-3', sectionId: 'three', scene: { id: 'thr-hex', type: 'animation' }, lineState: { params: { type: 'hexagon' }, annotation: { text: '3个×120°=蜂巢', position: 'bottom' } } },
  { lineId: 'thr-4', sectionId: 'three', scene: { id: 'thr-penta', type: 'animation' }, lineState: { params: { type: 'hexagon' }, annotation: { text: '五边形凑不齐', position: 'bottom' } } },

  // ===== semi (2) =====
  { lineId: 'semi-1', sectionId: 'semi', scene: { id: 'semi-mix', type: 'animation' }, lineState: { params: { type: 'hexagon' }, annotation: { text: '混搭正多边形', position: 'top' } } },
  { lineId: 'semi-2', sectionId: 'semi', scene: { id: 'semi-name', type: 'animation' }, lineState: { params: { type: 'triangle' }, annotation: { text: '半正则镶嵌', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { type: 'square' }, annotation: { text: '切换类型', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-vertex', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { type: 'triangle' }, annotation: { text: '观察顶点', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '铺满平面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cond', type: 'summary' }, lineState: { annotation: { text: '三四六边形', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
