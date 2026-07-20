/**
 * 广度与深度优先搜索讲解场景配置
 * 每句口播对应搜索模式（params.mode: 'bfs' | 'dfs'）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBfsDfsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const bfsDfsScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '走出迷宫', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-flood', type: 'animation' }, lineState: { params: { mode: 'bfs' }, annotation: { text: '层层漫开', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-dive', type: 'animation' }, lineState: { params: { mode: 'dfs' }, annotation: { text: '一路到底', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { mode: 'bfs' }, annotation: { text: 'BFS 与 DFS', position: 'bottom' } } },

  // ===== bfs (3) =====
  { lineId: 'bfs-1', sectionId: 'bfs', scene: { id: 'bfs-queue', type: 'animation' }, lineState: { params: { mode: 'bfs' }, annotation: { text: '队列·先进先出', position: 'top' } } },
  { lineId: 'bfs-2', sectionId: 'bfs', scene: { id: 'bfs-enqueue', type: 'animation' }, lineState: { params: { mode: 'bfs' }, annotation: { text: '邻居排队尾', position: 'bottom' } } },
  { lineId: 'bfs-3', sectionId: 'bfs', scene: { id: 'bfs-rings', type: 'animation' }, lineState: { params: { mode: 'bfs' }, annotation: { text: '同心圆扩散', position: 'bottom' } } },

  // ===== dfs (3) =====
  { lineId: 'dfs-1', sectionId: 'dfs', scene: { id: 'dfs-stack', type: 'animation' }, lineState: { params: { mode: 'dfs' }, annotation: { text: '栈·后进先出', position: 'top' } } },
  { lineId: 'dfs-2', sectionId: 'dfs', scene: { id: 'dfs-deep', type: 'animation' }, lineState: { params: { mode: 'dfs' }, annotation: { text: '蜿蜒深入', position: 'bottom' } } },
  { lineId: 'dfs-3', sectionId: 'dfs', scene: { id: 'dfs-back', type: 'animation' }, lineState: { params: { mode: 'dfs' }, annotation: { text: '死胡同回溯', position: 'bottom' } } },

  // ===== shortest (3) =====
  { lineId: 'short-1', sectionId: 'shortest', scene: { id: 'short-layer', type: 'animation' }, lineState: { params: { mode: 'bfs' }, annotation: { text: '先到步数更少', position: 'top' } } },
  { lineId: 'short-2', sectionId: 'shortest', scene: { id: 'short-path', type: 'animation' }, lineState: { params: { mode: 'bfs' }, annotation: { text: 'BFS 最短路', position: 'bottom' } } },
  { lineId: 'short-3', sectionId: 'shortest', scene: { id: 'short-detour', type: 'animation' }, lineState: { params: { mode: 'dfs' }, annotation: { text: 'DFS 常绕远', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-bfs', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'bfs' }, annotation: { text: '看 BFS 扩散', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-dfs', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'dfs' }, annotation: { text: '看 DFS 深入', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '队列 vs 栈', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-tradeoff', type: 'summary' }, lineState: { annotation: { text: '最短路 vs 省空间', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
