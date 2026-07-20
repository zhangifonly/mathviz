/**
 * 欧拉线讲解场景配置
 * 每句口播对应一个预置三角形（params.preset）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEulerLineState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const eulerLineScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '欧拉线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-centers', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '三个不同的中心', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-euler', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '欧拉的秘密', position: 'bottom' } } },

  // ===== centers (3) =====
  { lineId: 'def-1', sectionId: 'centers', scene: { id: 'def-centroid', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: 'G 重心=中线交点', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'centers', scene: { id: 'def-circum', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: 'O 外心=等距顶点', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'centers', scene: { id: 'def-ortho', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: 'H 垂心=高线交点', position: 'bottom' } } },

  // ===== collinear (3) =====
  { lineId: 'col-1', sectionId: 'collinear', scene: { id: 'col-line', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '三心排成一线', position: 'top' } } },
  { lineId: 'col-2', sectionId: 'collinear', scene: { id: 'col-name', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '这就是欧拉线', position: 'bottom' } } },
  { lineId: 'col-3', sectionId: 'collinear', scene: { id: 'col-cross', type: 'animation' }, lineState: { params: { preset: 2 }, annotation: { text: '叉积为零=共线', position: 'bottom' } } },

  // ===== ratio (3) =====
  { lineId: 'rat-1', sectionId: 'ratio', scene: { id: 'rat-pos', type: 'animation' }, lineState: { params: { preset: 2 }, annotation: { text: '重心的位置有讲究', position: 'top' } } },
  { lineId: 'rat-2', sectionId: 'ratio', scene: { id: 'rat-split', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: 'OG : GH = 1 : 2', position: 'bottom' } } },
  { lineId: 'rat-3', sectionId: 'ratio', scene: { id: 'rat-two', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '一份对两份', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 1 }, annotation: { text: '切换三角形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-degenerate', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 2 }, annotation: { text: '等边则三心重合', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '三心共线', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-ratio', type: 'summary' }, lineState: { annotation: { text: '一比二比例', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
