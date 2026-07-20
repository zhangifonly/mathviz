/**
 * K 近邻分类讲解场景配置
 * 每句口播携带 params: { k, classes, showQuery }
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKnnState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const knnScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'K近邻分类', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-friends', type: 'animation' }, lineState: { params: { classes: 2, k: 3, showQuery: false }, annotation: { text: '看身边的朋友', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { classes: 2, k: 3, showQuery: true }, annotation: { text: '最朴素的分类器', position: 'bottom' } } },

  // ===== distance (3) =====
  { lineId: 'dist-1', sectionId: 'distance', scene: { id: 'dist-points', type: 'animation' }, lineState: { params: { classes: 3, k: 1, showQuery: false }, annotation: { text: '颜色区分类别', position: 'top' } } },
  { lineId: 'dist-2', sectionId: 'distance', scene: { id: 'dist-measure', type: 'animation' }, lineState: { params: { classes: 3, k: 1, showQuery: true }, annotation: { text: '计算到各点距离', position: 'bottom' } } },
  { lineId: 'dist-3', sectionId: 'distance', scene: { id: 'dist-k', type: 'animation' }, lineState: { params: { classes: 3, k: 5, showQuery: true }, annotation: { text: '最近的 k 个邻居', position: 'bottom' } } },

  // ===== vote (3) =====
  { lineId: 'vote-1', sectionId: 'vote', scene: { id: 'vote-cast', type: 'animation' }, lineState: { params: { classes: 3, k: 5, showQuery: true }, annotation: { text: '邻居各自投票', position: 'top' } } },
  { lineId: 'vote-2', sectionId: 'vote', scene: { id: 'vote-majority', type: 'animation' }, lineState: { params: { classes: 3, k: 5, showQuery: true }, annotation: { text: '票多者胜', position: 'bottom' } } },
  { lineId: 'vote-3', sectionId: 'vote', scene: { id: 'vote-lazy', type: 'animation' }, lineState: { params: { classes: 2, k: 3, showQuery: false }, annotation: { text: '惰性学习', position: 'bottom' } } },

  // ===== boundary (3) =====
  { lineId: 'bnd-1', sectionId: 'boundary', scene: { id: 'bnd-region', type: 'animation' }, lineState: { params: { classes: 3, k: 3, showQuery: false }, annotation: { text: '交界即决策边界', position: 'top' } } },
  { lineId: 'bnd-2', sectionId: 'boundary', scene: { id: 'bnd-small', type: 'animation' }, lineState: { params: { classes: 3, k: 1, showQuery: false }, annotation: { text: 'k=1 边界锯齿', position: 'bottom' } } },
  { lineId: 'bnd-3', sectionId: 'boundary', scene: { id: 'bnd-large', type: 'animation' }, lineState: { params: { classes: 3, k: 9, showQuery: false }, annotation: { text: 'k=9 边界平滑', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-k', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { classes: 3, k: 5, showQuery: false }, annotation: { text: '调整 k', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-move', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { classes: 3, k: 5, showQuery: true }, annotation: { text: '移动查询点', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '距离+投票', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-choosek', type: 'summary' }, lineState: { annotation: { text: '选好 k 值', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
