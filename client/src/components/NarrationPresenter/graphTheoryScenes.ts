/**
 * 图论讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGraphTheoryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const graphTheoryScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { diagram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-navigation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '导航软件', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-social', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '社交网络推荐', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-graph', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '图论', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-structure', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '顶点和边', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-types', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '有向/无向,有权/无权', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-euler', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '欧拉七桥问题 (1736)', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-modern', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算机科学基础', position: 'bottom' },
    },
  },

  // ========== traversal 段落 (4行) ==========
  {
    lineId: 'trav-1',
    sectionId: 'traversal',
    scene: { id: 'trav-concept', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '图的遍历', position: 'top' },
    },
  },
  {
    lineId: 'trav-2',
    sectionId: 'traversal',
    scene: { id: 'trav-dfs', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['dfs'],
      annotation: { text: '深度优先搜索 (DFS)', position: 'bottom' },
    },
  },
  {
    lineId: 'trav-3',
    sectionId: 'traversal',
    scene: { id: 'trav-bfs', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['bfs'],
      annotation: { text: '广度优先搜索 (BFS)', position: 'bottom' },
    },
  },
  {
    lineId: 'trav-4',
    sectionId: 'traversal',
    scene: { id: 'trav-foundation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '基础算法', position: 'bottom' },
    },
  },

  // ========== shortest-path 段落 (4行) ==========
  {
    lineId: 'sp-1',
    sectionId: 'shortest-path',
    scene: { id: 'sp-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '最短路径问题', position: 'top' },
    },
  },
  {
    lineId: 'sp-2',
    sectionId: 'shortest-path',
    scene: { id: 'sp-dijkstra', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['dijkstra'],
      annotation: { text: 'Dijkstra算法', position: 'bottom' },
    },
  },
  {
    lineId: 'sp-3',
    sectionId: 'shortest-path',
    scene: { id: 'sp-greedy', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '贪心策略', position: 'bottom' },
    },
  },
  {
    lineId: 'sp-4',
    sectionId: 'shortest-path',
    scene: { id: 'sp-application', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '导航和路由', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '无处不在', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-social', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '社交网络分析', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-pagerank', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'PageRank算法', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-bio', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '蛋白质网络', position: 'bottom' },
    },
  },

  // ========== summary 段落 (4行) ==========
  {
    lineId: 'sum-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'sum-2',
    sectionId: 'summary',
    scene: { id: 'summary-tool', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '描述关系的工具', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-everywhere', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '应用无处不在', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-4',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '感谢观看!', position: 'bottom' },
    },
  },
]
