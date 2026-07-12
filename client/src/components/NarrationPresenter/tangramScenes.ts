/**
 * 七巧板讲解场景配置
 * 每句口播对应一个目标图形（params.shape）或标题/总结场景
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTangramState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const tangramScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '七巧板', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-square', type: 'animation' }, lineState: { params: { shape: 'square' }, annotation: { text: '一个正方形', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-vary', type: 'animation' }, lineState: { params: { shape: 'triangle' }, annotation: { text: '千变万化', position: 'bottom' } } },

  // ===== pieces (3) =====
  { lineId: 'pieces-1', sectionId: 'pieces', scene: { id: 'pieces-tri', type: 'animation' }, lineState: { params: { shape: 'square' }, annotation: { text: '五个三角形', position: 'top' } } },
  { lineId: 'pieces-2', sectionId: 'pieces', scene: { id: 'pieces-quad', type: 'animation' }, lineState: { params: { shape: 'square' }, annotation: { text: '正方形 + 平行四边形', position: 'bottom' } } },
  { lineId: 'pieces-3', sectionId: 'pieces', scene: { id: 'pieces-units', type: 'animation' }, lineState: { params: { shape: 'square' }, annotation: { text: '小三角 = 1 份', position: 'bottom' } } },

  // ===== dissection (2) =====
  { lineId: 'dissect-1', sectionId: 'dissection', scene: { id: 'dissect-fit', type: 'animation' }, lineState: { params: { shape: 'square' }, annotation: { text: '拼回大正方形', position: 'top' } } },
  { lineId: 'dissect-2', sectionId: 'dissection', scene: { id: 'dissect-nogap', type: 'animation' }, lineState: { params: { shape: 'square' }, annotation: { text: '不重叠不留缝', position: 'bottom' } } },

  // ===== conservation (3) =====
  { lineId: 'conserve-1', sectionId: 'conservation', scene: { id: 'conserve-rule', type: 'animation' }, lineState: { params: { shape: 'rectangle' }, annotation: { text: '总面积不变', position: 'top' } } },
  { lineId: 'conserve-2', sectionId: 'conservation', scene: { id: 'conserve-shapes', type: 'animation' }, lineState: { params: { shape: 'trapezoid' }, annotation: { text: '换形状，面积仍是 16', position: 'bottom' } } },
  { lineId: 'conserve-3', sectionId: 'conservation', scene: { id: 'conserve-move', type: 'animation' }, lineState: { params: { shape: 'parallelogram' }, annotation: { text: '只是搬动与旋转', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-choose', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { shape: 'triangle' }, annotation: { text: '选个目标图形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { shape: 'rectangle' }, annotation: { text: '始终是这七块', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '五三角 + 正方 + 平行四边', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-conserve', type: 'summary' }, lineState: { annotation: { text: '面积守恒始终成立', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
