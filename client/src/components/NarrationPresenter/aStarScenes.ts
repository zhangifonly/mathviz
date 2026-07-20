/**
 * A星寻路讲解场景配置
 * params.algo: 'astar' | 'dijkstra' 决定用哪种搜索；params.frame 控制显示到第几帧（-1=到底）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultAStarState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const aStarScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'A星寻路', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-maze', type: 'animation' }, lineState: { params: { algo: 'astar', frame: 0 }, annotation: { text: '布满障碍的网格', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-path', type: 'animation' }, lineState: { params: { algo: 'astar', frame: -1 }, annotation: { text: '找最短的一条路', position: 'bottom' } } },

  // ===== gcost (2) =====
  { lineId: 'def-1', sectionId: 'gcost', scene: { id: 'g-cost', type: 'animation' }, lineState: { params: { algo: 'astar', frame: 12 }, annotation: { text: 'g = 已走步数', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'gcost', scene: { id: 'g-step', type: 'animation' }, lineState: { params: { algo: 'astar', frame: 20 }, annotation: { text: '每步 g 加一', position: 'bottom' } } },

  // ===== hcost (3) =====
  { lineId: 'con-1', sectionId: 'hcost', scene: { id: 'h-est', type: 'animation' }, lineState: { params: { algo: 'astar', frame: 16 }, annotation: { text: 'h = 到终点估计', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'hcost', scene: { id: 'h-manhattan', type: 'animation' }, lineState: { params: { algo: 'astar', frame: 24 }, annotation: { text: '曼哈顿距离', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'hcost', scene: { id: 'h-admissible', type: 'animation' }, lineState: { params: { algo: 'astar', frame: -1 }, annotation: { text: '不高估=最短路', position: 'bottom' } } },

  // ===== fcost (3) =====
  { lineId: 'fn-1', sectionId: 'fcost', scene: { id: 'f-sum', type: 'animation' }, lineState: { params: { algo: 'astar', frame: 18 }, annotation: { text: 'f = g + h', position: 'top' } } },
  { lineId: 'fn-2', sectionId: 'fcost', scene: { id: 'f-expand', type: 'animation' }, lineState: { params: { algo: 'astar', frame: -1 }, annotation: { text: '优先扩展 f 最小', position: 'bottom' } } },
  { lineId: 'fn-3', sectionId: 'fcost', scene: { id: 'f-dijkstra', type: 'animation' }, lineState: { params: { algo: 'dijkstra', frame: -1 }, annotation: { text: 'h=0 即 Dijkstra', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-astar', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { algo: 'astar', frame: -1 }, annotation: { text: 'A* 定向铺开', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-dijkstra', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { algo: 'dijkstra', frame: -1 }, annotation: { text: 'Dijkstra 四面漫开', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'f = g + h', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-heuristic', type: 'summary' }, lineState: { annotation: { text: '又快又准', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
