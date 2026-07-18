/**
 * 动态规划讲解场景配置
 * params.mode: 'lcs' | 'knap'；params.fill: 已填格数(-1 表示全表)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDynamicProgrammingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const dynamicProgrammingScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '动态规划', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-slow', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: 0 }, annotation: { text: '暴力递归太慢', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-repeat', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: 8 }, annotation: { text: '子问题被重复算', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-dp', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: -1 }, annotation: { text: '消灭重复计算', position: 'bottom' } } },

  // ===== overlap (3) =====
  { lineId: 'ov-1', sectionId: 'overlap', scene: { id: 'ov-split', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: 6 }, annotation: { text: '拆成小问题', position: 'top' } } },
  { lineId: 'ov-2', sectionId: 'overlap', scene: { id: 'ov-tree', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: 12 }, annotation: { text: '重叠子问题', position: 'bottom' } } },
  { lineId: 'ov-3', sectionId: 'overlap', scene: { id: 'ov-cache', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: -1 }, annotation: { text: '算一次就记下', position: 'bottom' } } },

  // ===== memo (3) =====
  { lineId: 'memo-1', sectionId: 'memo', scene: { id: 'memo-table', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: 4 }, annotation: { text: '二维表存答案', position: 'top' } } },
  { lineId: 'memo-2', sectionId: 'memo', scene: { id: 'memo-fill', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: 14 }, annotation: { text: '自底向上填表', position: 'bottom' } } },
  { lineId: 'memo-3', sectionId: 'memo', scene: { id: 'memo-dep', type: 'animation' }, lineState: { params: { mode: 'lcs', fill: -1 }, annotation: { text: '只依赖已算邻格', position: 'bottom' } } },

  // ===== optimal (3) =====
  { lineId: 'opt-1', sectionId: 'optimal', scene: { id: 'opt-struct', type: 'animation' }, lineState: { params: { mode: 'knap', fill: 20 }, annotation: { text: '最优子结构', position: 'top' } } },
  { lineId: 'opt-2', sectionId: 'optimal', scene: { id: 'opt-knap', type: 'animation' }, lineState: { params: { mode: 'knap', fill: -1 }, annotation: { text: '装或不装取较大', position: 'bottom' } } },
  { lineId: 'opt-3', sectionId: 'optimal', scene: { id: 'opt-back', type: 'animation' }, lineState: { params: { mode: 'knap', fill: -1 }, annotation: { text: '回溯得出方案', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-fill', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'lcs', fill: 10 }, annotation: { text: '看填表过程', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'knap', fill: -1 }, annotation: { text: '橙框=最优路径', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '一张表算一次', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-keys', type: 'summary' }, lineState: { annotation: { text: '两把钥匙', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
