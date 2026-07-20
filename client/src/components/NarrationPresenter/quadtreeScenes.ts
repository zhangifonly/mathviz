/**
 * 四叉树讲解场景配置
 * 每句口播对应点数量(params.count)与节点容量(params.capacity)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultQuadtreeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const quadtreeScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '四叉树', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-many', type: 'animation' }, lineState: { params: { count: 160, capacity: 4 }, annotation: { text: '海量点找邻居', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-local', type: 'animation' }, lineState: { params: { count: 80, capacity: 4 }, annotation: { text: '只看周围一小块', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-split', type: 'animation' }, lineState: { params: { count: 80, capacity: 4 }, annotation: { text: '把空间切四份', position: 'bottom' } } },

  // ===== divide (3) =====
  { lineId: 'div-1', sectionId: 'divide', scene: { id: 'div-box', type: 'animation' }, lineState: { params: { count: 30, capacity: 8 }, annotation: { text: '大框住所有点', position: 'top' } } },
  { lineId: 'div-2', sectionId: 'divide', scene: { id: 'div-four', type: 'animation' }, lineState: { params: { count: 80, capacity: 4 }, annotation: { text: '超容量则四分', position: 'bottom' } } },
  { lineId: 'div-3', sectionId: 'divide', scene: { id: 'div-recur', type: 'animation' }, lineState: { params: { count: 160, capacity: 4 }, annotation: { text: '递归继续切', position: 'bottom' } } },

  // ===== adaptive (3) =====
  { lineId: 'ada-1', sectionId: 'adaptive', scene: { id: 'ada-dense', type: 'animation' }, lineState: { params: { count: 160, capacity: 2 }, annotation: { text: '密处又小又密', position: 'top' } } },
  { lineId: 'ada-2', sectionId: 'adaptive', scene: { id: 'ada-sparse', type: 'animation' }, lineState: { params: { count: 80, capacity: 4 }, annotation: { text: '疏处保留大格', position: 'bottom' } } },
  { lineId: 'ada-3', sectionId: 'adaptive', scene: { id: 'ada-auto', type: 'animation' }, lineState: { params: { count: 160, capacity: 4 }, annotation: { text: '深度自动调整', position: 'bottom' } } },

  // ===== query (2) =====
  { lineId: 'qry-1', sectionId: 'query', scene: { id: 'qry-range', type: 'animation' }, lineState: { params: { count: 160, capacity: 4 }, annotation: { text: '只下探相交格', position: 'top' } } },
  { lineId: 'qry-2', sectionId: 'query', scene: { id: 'qry-prune', type: 'animation' }, lineState: { params: { count: 160, capacity: 4 }, annotation: { text: '剪掉不相交子树', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 160, capacity: 4 }, annotation: { text: '调整点数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-cap', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 80, capacity: 2 }, annotation: { text: '调整容量', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rule', type: 'summary' }, lineState: { annotation: { text: '超容量就四分', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-speed', type: 'summary' }, lineState: { annotation: { text: '查询大提速', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
