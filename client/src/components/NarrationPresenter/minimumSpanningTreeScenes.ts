/**
 * 最小生成树讲解场景配置
 * params.algo 决定当前算法，params.step 决定展示到第几条 MST 边
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMinimumSpanningTreeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const minimumSpanningTreeScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '最小生成树', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-cost', type: 'animation' }, lineState: { params: { algo: 'kruskal', step: 0 }, annotation: { text: '每段线路都有造价', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-goal', type: 'animation' }, lineState: { params: { algo: 'kruskal', step: 7 }, annotation: { text: '最省成本连通', position: 'bottom' } } },

  // ===== tree (3) =====
  { lineId: 'tree-1', sectionId: 'tree', scene: { id: 'tree-def', type: 'animation' }, lineState: { params: { algo: 'kruskal', step: 4 }, annotation: { text: '连通且无环', position: 'top' } } },
  { lineId: 'tree-2', sectionId: 'tree', scene: { id: 'tree-count', type: 'animation' }, lineState: { params: { algo: 'kruskal', step: 7 }, annotation: { text: 'n-1 条边', position: 'bottom' } } },
  { lineId: 'tree-3', sectionId: 'tree', scene: { id: 'tree-min', type: 'animation' }, lineState: { params: { algo: 'kruskal', step: 7 }, annotation: { text: '权重和最小', position: 'bottom' } } },

  // ===== kruskal (3) =====
  { lineId: 'krus-1', sectionId: 'kruskal', scene: { id: 'krus-sort', type: 'animation' }, lineState: { params: { algo: 'kruskal', step: 1 }, annotation: { text: '边按权重排序', position: 'top' } } },
  { lineId: 'krus-2', sectionId: 'kruskal', scene: { id: 'krus-add', type: 'animation' }, lineState: { params: { algo: 'kruskal', step: 3 }, annotation: { text: '加最便宜不成环的边', position: 'bottom' } } },
  { lineId: 'krus-3', sectionId: 'kruskal', scene: { id: 'krus-dsu', type: 'animation' }, lineState: { params: { algo: 'kruskal', step: 7 }, annotation: { text: '并查集判环', position: 'bottom' } } },

  // ===== prim (3) =====
  { lineId: 'prim-1', sectionId: 'prim', scene: { id: 'prim-seed', type: 'animation' }, lineState: { params: { algo: 'prim', step: 1 }, annotation: { text: '从一点开始', position: 'top' } } },
  { lineId: 'prim-2', sectionId: 'prim', scene: { id: 'prim-grow', type: 'animation' }, lineState: { params: { algo: 'prim', step: 3 }, annotation: { text: '并入最短跨界边', position: 'bottom' } } },
  { lineId: 'prim-3', sectionId: 'prim', scene: { id: 'prim-full', type: 'animation' }, lineState: { params: { algo: 'prim', step: 7 }, annotation: { text: '滚雪球式扩展', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { algo: 'prim', step: 4 }, annotation: { text: '切换算法看顺序', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-equal', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { algo: 'kruskal', step: 7 }, annotation: { text: '总权重相同', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '最省成本连通', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-algos', type: 'summary' }, lineState: { annotation: { text: '两种贪心', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
