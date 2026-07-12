/**
 * 统计初步讲解场景配置
 * 每句口播对应一个数据集（params.dataset）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultStatsBasicsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const statsBasicsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '统计初步', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-scores', type: 'animation' }, lineState: { params: { dataset: 'scores' }, annotation: { text: '一组考试成绩', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-extract', type: 'animation' }, lineState: { params: { dataset: 'scores' }, annotation: { text: '提炼关键信息', position: 'bottom' } } },

  // ===== center (3) =====
  { lineId: 'center-1', sectionId: 'center', scene: { id: 'center-idea', type: 'animation' }, lineState: { params: { dataset: 'scores' }, annotation: { text: '集中趋势', position: 'top' } } },
  { lineId: 'center-2', sectionId: 'center', scene: { id: 'center-mean', type: 'animation' }, lineState: { params: { dataset: 'scores' }, annotation: { text: '平均数', position: 'top' } } },
  { lineId: 'center-3', sectionId: 'center', scene: { id: 'center-median', type: 'animation' }, lineState: { params: { dataset: 'scores' }, annotation: { text: '中位数与众数', position: 'bottom' } } },

  // ===== spread (3) =====
  { lineId: 'spread-1', sectionId: 'spread', scene: { id: 'spread-idea', type: 'animation' }, lineState: { params: { dataset: 'spread' }, annotation: { text: '离散程度', position: 'top' } } },
  { lineId: 'spread-2', sectionId: 'spread', scene: { id: 'spread-range', type: 'animation' }, lineState: { params: { dataset: 'spread' }, annotation: { text: '极差', position: 'top' } } },
  { lineId: 'spread-3', sectionId: 'spread', scene: { id: 'spread-std', type: 'animation' }, lineState: { params: { dataset: 'spread' }, annotation: { text: '方差与标准差', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { dataset: 'heights' }, annotation: { text: '切换数据集', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-outlier', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { dataset: 'heights' }, annotation: { text: '异常值的影响', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-center', type: 'summary' }, lineState: { annotation: { text: '中心在哪里', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-spread', type: 'summary' }, lineState: { annotation: { text: '有多分散', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '读懂数据的故事！', position: 'bottom' } } },
]
