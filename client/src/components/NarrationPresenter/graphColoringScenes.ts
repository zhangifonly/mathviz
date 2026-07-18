/**
 * 图着色讲解场景配置
 * 每句口播对应一个示例图（params.graphKey）与着色模式（params.mode）
 * mode: 'greedy' 贪心着色 | 'chromatic' 色数最优 | 'conflict' 展示冲突
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGraphColoringState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const graphColoringScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '图着色', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-map', type: 'animation' }, lineState: { params: { graphKey: 'map', mode: 'chromatic' }, annotation: { text: '最少几种颜色？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-graph', type: 'animation' }, lineState: { params: { graphKey: 'map', mode: 'chromatic' }, annotation: { text: '区域变节点·相邻连边', position: 'bottom' } } },

  // ===== constraint (3) =====
  { lineId: 'def-1', sectionId: 'constraint', scene: { id: 'def-rule', type: 'animation' }, lineState: { params: { graphKey: 'wheel6', mode: 'chromatic' }, annotation: { text: '相邻必不同色', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'constraint', scene: { id: 'def-conflict', type: 'animation' }, lineState: { params: { graphKey: 'wheel6', mode: 'conflict' }, annotation: { text: '同色=冲突边标红', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'constraint', scene: { id: 'def-goal', type: 'animation' }, lineState: { params: { graphKey: 'wheel6', mode: 'chromatic' }, annotation: { text: '颜色尽量少', position: 'bottom' } } },

  // ===== greedy (3) =====
  { lineId: 'greedy-1', sectionId: 'greedy', scene: { id: 'greedy-order', type: 'animation' }, lineState: { params: { graphKey: 'petersen', mode: 'greedy' }, annotation: { text: '按顺序处理节点', position: 'top' } } },
  { lineId: 'greedy-2', sectionId: 'greedy', scene: { id: 'greedy-min', type: 'animation' }, lineState: { params: { graphKey: 'petersen', mode: 'greedy' }, annotation: { text: '选最小可用色', position: 'bottom' } } },
  { lineId: 'greedy-3', sectionId: 'greedy', scene: { id: 'greedy-cmp', type: 'animation' }, lineState: { params: { graphKey: 'petersen', mode: 'chromatic' }, annotation: { text: '贪心未必最优', position: 'bottom' } } },

  // ===== chromatic (3) =====
  { lineId: 'chrom-1', sectionId: 'chromatic', scene: { id: 'chrom-def', type: 'animation' }, lineState: { params: { graphKey: 'wheel5', mode: 'chromatic' }, annotation: { text: '色数=最少颜色数', position: 'top' } } },
  { lineId: 'chrom-2', sectionId: 'chromatic', scene: { id: 'chrom-backtrack', type: 'animation' }, lineState: { params: { graphKey: 'wheel5', mode: 'chromatic' }, annotation: { text: '回溯逐步试探', position: 'bottom' } } },
  { lineId: 'chrom-3', sectionId: 'chromatic', scene: { id: 'chrom-fourcolor', type: 'animation' }, lineState: { params: { graphKey: 'map', mode: 'chromatic' }, annotation: { text: '平面地图四色足够', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-greedy', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { graphKey: 'petersen', mode: 'greedy' }, annotation: { text: '看贪心用几色', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-chromatic', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { graphKey: 'petersen', mode: 'chromatic' }, annotation: { text: '对比真正色数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '相邻不同色', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-method', type: 'summary' }, lineState: { annotation: { text: '贪心 vs 回溯', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
