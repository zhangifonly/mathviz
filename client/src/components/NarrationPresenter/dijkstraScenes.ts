/**
 * Dijkstra 最短路讲解场景配置
 * 每句口播对应源点与目标点（params.source / params.target）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDijkstraState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const dijkstraScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Dijkstra最短路', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-map', type: 'animation' }, lineState: { params: { source: 0, target: 7 }, annotation: { text: '地图就是带权图', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { source: 0, target: 7 }, annotation: { text: '求最短路的经典算法', position: 'bottom' } } },

  // ===== greedy (3) =====
  { lineId: 'def-1', sectionId: 'greedy', scene: { id: 'def-init', type: 'animation' }, lineState: { params: { source: 0, target: 7 }, annotation: { text: '维护已知最短距离', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'greedy', scene: { id: 'def-pick', type: 'animation' }, lineState: { params: { source: 0, target: 7 }, annotation: { text: '选最近的未定节点', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'greedy', scene: { id: 'def-fix', type: 'animation' }, lineState: { params: { source: 0, target: 7 }, annotation: { text: '非负权=永久确定', position: 'bottom' } } },

  // ===== relax (3) =====
  { lineId: 'rel-1', sectionId: 'relax', scene: { id: 'rel-neighbor', type: 'animation' }, lineState: { params: { source: 0, target: 4 }, annotation: { text: '更新每个邻居', position: 'top' } } },
  { lineId: 'rel-2', sectionId: 'relax', scene: { id: 'rel-update', type: 'animation' }, lineState: { params: { source: 0, target: 4 }, annotation: { text: '更近就刷新前驱', position: 'bottom' } } },
  { lineId: 'rel-3', sectionId: 'relax', scene: { id: 'rel-name', type: 'animation' }, lineState: { params: { source: 0, target: 4 }, annotation: { text: '这就是松弛', position: 'bottom' } } },

  // ===== tree (2) =====
  { lineId: 'tree-1', sectionId: 'tree', scene: { id: 'tree-prev', type: 'animation' }, lineState: { params: { source: 3, target: 7 }, annotation: { text: '连起所有前驱', position: 'top' } } },
  { lineId: 'tree-2', sectionId: 'tree', scene: { id: 'tree-full', type: 'animation' }, lineState: { params: { source: 3, target: 0 }, annotation: { text: '最短路径树', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-source', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { source: 7, target: 0 }, annotation: { text: '换个源点看看', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-target', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { source: 0, target: 6 }, annotation: { text: '粉色即最短路径', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '贪心+松弛', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-tree', type: 'summary' }, lineState: { annotation: { text: '前驱连成树', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
