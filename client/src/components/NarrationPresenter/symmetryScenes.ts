/**
 * 对称之美讲解场景配置
 * 每句口播对应一个对称图案（params.optionId）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSymmetryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const symmetryScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '对称之美', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-butterfly', type: 'animation' }, lineState: { params: { optionId: 'butterfly' }, annotation: { text: '左右一样叫对称', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-rule', type: 'animation' }, lineState: { params: { optionId: 'butterfly' }, annotation: { text: '藏着规律', position: 'bottom' } } },

  // ===== mirror (3) =====
  { lineId: 'mirror-1', sectionId: 'mirror', scene: { id: 'mirror-mirror', type: 'animation' }, lineState: { params: { optionId: 'butterfly' }, annotation: { text: '中间放面镜子', position: 'top' } } },
  { lineId: 'mirror-2', sectionId: 'mirror', scene: { id: 'mirror-axis', type: 'animation' }, lineState: { params: { optionId: 'butterfly' }, annotation: { text: '这条线是对称轴', position: 'bottom' } } },
  { lineId: 'mirror-3', sectionId: 'mirror', scene: { id: 'mirror-nature', type: 'animation' }, lineState: { params: { optionId: 'starfish' }, annotation: { text: '自然中处处可见', position: 'bottom' } } },

  // ===== rotation (3) =====
  { lineId: 'rotation-1', sectionId: 'rotation', scene: { id: 'rot-center', type: 'animation' }, lineState: { params: { optionId: 'triangle' }, annotation: { text: '绕中心转一转', position: 'top' } } },
  { lineId: 'rotation-2', sectionId: 'rotation', scene: { id: 'rot-pinwheel', type: 'animation' }, lineState: { params: { optionId: 'pinwheel' }, annotation: { text: '四重旋转对称', position: 'bottom' } } },
  { lineId: 'rotation-3', sectionId: 'rotation', scene: { id: 'rot-snowflake', type: 'animation' }, lineState: { params: { optionId: 'snowflake' }, annotation: { text: '雪花六重对称', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optionId: 'starfish' }, annotation: { text: '数一数转几次', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-fold', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optionId: 'snowflake' }, annotation: { text: '找找对称轴', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '变换后与自己重合', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-two', type: 'summary' }, lineState: { annotation: { text: '镜像 + 旋转', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
