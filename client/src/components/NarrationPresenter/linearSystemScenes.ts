/**
 * 二元一次方程组讲解场景配置
 * 每句口播对应展示的方程组（params.systemId）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLinearSystemState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const linearSystemScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '二元一次方程组', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-two', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '两个方程', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-geo', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '用几何看清楚', position: 'bottom' } } },

  // ===== line-meaning (3) =====
  { lineId: 'line-1', sectionId: 'line-meaning', scene: { id: 'line-eq', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '一个方程一条直线', position: 'top' } } },
  { lineId: 'line-2', sectionId: 'line-meaning', scene: { id: 'line-point', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '线上点都满足方程', position: 'bottom' } } },
  { lineId: 'line-3', sectionId: 'line-meaning', scene: { id: 'line-infinite', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '无穷多组解', position: 'bottom' } } },

  // ===== intersection (3) =====
  { lineId: 'inter-1', sectionId: 'intersection', scene: { id: 'inter-two-lines', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '两条直线同图', position: 'top' } } },
  { lineId: 'inter-2', sectionId: 'intersection', scene: { id: 'inter-cross', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '交点同时满足两式', position: 'top' } } },
  { lineId: 'inter-3', sectionId: 'intersection', scene: { id: 'inter-solution', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '交点就是解', position: 'bottom' } } },

  // ===== three-cases (3) =====
  { lineId: 'case-1', sectionId: 'three-cases', scene: { id: 'case-unique', type: 'animation' }, lineState: { params: { systemId: 'unique' }, annotation: { text: '相交：唯一解', position: 'top' } } },
  { lineId: 'case-2', sectionId: 'three-cases', scene: { id: 'case-parallel', type: 'animation' }, lineState: { params: { systemId: 'parallel' }, annotation: { text: '平行：无解', position: 'top' } } },
  { lineId: 'case-3', sectionId: 'three-cases', scene: { id: 'case-coincident', type: 'animation' }, lineState: { params: { systemId: 'coincident' }, annotation: { text: '重合：无穷多解', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { systemId: 'parallel' }, annotation: { text: '切换方程组', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-check', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { systemId: 'unique' }, annotation: { text: '交点=解', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '交点就是解', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cases', type: 'summary' }, lineState: { annotation: { text: '相交/平行/重合', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
