/**
 * 三角形四心 讲解场景配置
 * 每句口播对应预设三角形索引（params.triangle）及内外接圆开关
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTriangleCentersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const triangleCentersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '三角形四心', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-lines', type: 'animation' }, lineState: { params: { triangle: 0 }, annotation: { text: '不同的线交汇成点', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-four', type: 'animation' }, lineState: { params: { triangle: 0 }, annotation: { text: '四个经典的心', position: 'bottom' } } },

  // ===== centroid-circum (4) =====
  { lineId: 'cc-1', sectionId: 'centroid-circum', scene: { id: 'cc-centroid', type: 'animation' }, lineState: { params: { triangle: 0 }, annotation: { text: '重心 = 顶点平均', position: 'top' } } },
  { lineId: 'cc-2', sectionId: 'centroid-circum', scene: { id: 'cc-balance', type: 'animation' }, lineState: { params: { triangle: 0 }, annotation: { text: '三角形的平衡点', position: 'bottom' } } },
  { lineId: 'cc-3', sectionId: 'centroid-circum', scene: { id: 'cc-circum', type: 'animation' }, lineState: { params: { triangle: 0 }, annotation: { text: '外心到三顶点等距', position: 'top' } } },
  { lineId: 'cc-4', sectionId: 'centroid-circum', scene: { id: 'cc-circumcircle', type: 'animation' }, lineState: { params: { triangle: 0 }, annotation: { text: '外接圆过三顶点', position: 'bottom' } } },

  // ===== incenter-ortho (3) =====
  { lineId: 'io-1', sectionId: 'incenter-ortho', scene: { id: 'io-incenter', type: 'animation' }, lineState: { params: { triangle: 0 }, annotation: { text: '内心到三边等距', position: 'top' } } },
  { lineId: 'io-2', sectionId: 'incenter-ortho', scene: { id: 'io-incircle', type: 'animation' }, lineState: { params: { triangle: 0 }, annotation: { text: '内切圆贴着三边', position: 'bottom' } } },
  { lineId: 'io-3', sectionId: 'incenter-ortho', scene: { id: 'io-ortho', type: 'animation' }, lineState: { params: { triangle: 1 }, annotation: { text: '垂心=高线交点', position: 'top' } } },

  // ===== euler (2) =====
  { lineId: 'eu-1', sectionId: 'euler', scene: { id: 'eu-line', type: 'animation' }, lineState: { params: { triangle: 1 }, annotation: { text: '三心共线', position: 'top' } } },
  { lineId: 'eu-2', sectionId: 'euler', scene: { id: 'eu-ratio', type: 'animation' }, lineState: { params: { triangle: 1 }, annotation: { text: 'OG:GH = 1:2', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { triangle: 2 }, annotation: { text: '切换三角形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-obtuse', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { triangle: 1 }, annotation: { text: '心跑到形外', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '四心的构造', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-circles', type: 'summary' }, lineState: { annotation: { text: '内外接圆与欧拉线', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '我们下次再见！', position: 'bottom' } } },
]
