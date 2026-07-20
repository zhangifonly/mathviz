/**
 * Delaunay 三角剖分讲解场景配置
 * 每句口播对应点数量（params.count）与是否显示外接圆（params.circle）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDelaunayTriangulationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const delaunayTriangulationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Delaunay三角剖分', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-bad', type: 'animation' }, lineState: { params: { count: 8 }, annotation: { text: '连法有好有坏', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '天生最优的连法', position: 'bottom' } } },

  // ===== circle (3) =====
  { lineId: 'def-1', sectionId: 'circle', scene: { id: 'def-rule', type: 'animation' }, lineState: { params: { count: 16, circle: 1 }, annotation: { text: '外接圆内无他点', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'circle', scene: { id: 'def-empty', type: 'animation' }, lineState: { params: { count: 16, circle: 1 }, annotation: { text: '空圆性质', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'circle', scene: { id: 'def-incr', type: 'animation' }, lineState: { params: { count: 8, circle: 1 }, annotation: { text: 'Bowyer-Watson 增量', position: 'bottom' } } },

  // ===== angle (3) =====
  { lineId: 'ang-1', sectionId: 'angle', scene: { id: 'ang-max', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '最大化最小角', position: 'top' } } },
  { lineId: 'ang-2', sectionId: 'angle', scene: { id: 'ang-slim', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '避免瘦长三角', position: 'bottom' } } },
  { lineId: 'ang-3', sectionId: 'angle', scene: { id: 'ang-even', type: 'animation' }, lineState: { params: { count: 30 }, annotation: { text: '匀称的网格', position: 'bottom' } } },

  // ===== dual (2) =====
  { lineId: 'dual-1', sectionId: 'dual', scene: { id: 'dual-center', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '连接外接圆心', position: 'top' } } },
  { lineId: 'dual-2', sectionId: 'dual', scene: { id: 'dual-voronoi', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '对偶沃罗诺伊', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 30 }, annotation: { text: '调整点数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-circle', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 16, circle: 1 }, annotation: { text: '验证空圆', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '空圆最优网', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-dual', type: 'summary' }, lineState: { annotation: { text: '对偶沃罗诺伊', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
