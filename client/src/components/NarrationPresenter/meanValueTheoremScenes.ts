/**
 * 中值定理讲解场景配置
 * 每句口播对应函数索引 fnIdx 与区间索引 ivIdx
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMeanValueTheoremState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const meanValueTheoremScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '中值定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-secant', type: 'animation' }, lineState: { params: { fnIdx: 2, ivIdx: 2 }, annotation: { text: '平均变化率=割线斜率', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { fnIdx: 2, ivIdx: 2 }, annotation: { text: '哪一瞬追平平均?', position: 'bottom' } } },

  // ===== secant (3) =====
  { lineId: 'sec-1', sectionId: 'secant', scene: { id: 'sec-formula', type: 'animation' }, lineState: { params: { fnIdx: 0, ivIdx: 0 }, annotation: { text: '(f(b)-f(a))/(b-a)', position: 'top' } } },
  { lineId: 'sec-2', sectionId: 'secant', scene: { id: 'sec-overall', type: 'animation' }, lineState: { params: { fnIdx: 0, ivIdx: 0 }, annotation: { text: '整体升降快慢', position: 'bottom' } } },
  { lineId: 'sec-3', sectionId: 'secant', scene: { id: 'sec-tangent', type: 'animation' }, lineState: { params: { fnIdx: 0, ivIdx: 0 }, annotation: { text: '切线=瞬时导数', position: 'bottom' } } },

  // ===== mvt (3) =====
  { lineId: 'mvt-1', sectionId: 'mvt', scene: { id: 'mvt-exist', type: 'animation' }, lineState: { params: { fnIdx: 0, ivIdx: 0 }, annotation: { text: '必有一点 c', position: 'top' } } },
  { lineId: 'mvt-2', sectionId: 'mvt', scene: { id: 'mvt-parallel', type: 'animation' }, lineState: { params: { fnIdx: 0, ivIdx: 0 }, annotation: { text: '切线平行割线', position: 'bottom' } } },
  { lineId: 'mvt-3', sectionId: 'mvt', scene: { id: 'mvt-catch', type: 'animation' }, lineState: { params: { fnIdx: 1, ivIdx: 2 }, annotation: { text: '瞬时追平平均', position: 'bottom' } } },

  // ===== rolle (2) =====
  { lineId: 'rolle-1', sectionId: 'rolle', scene: { id: 'rolle-flat', type: 'animation' }, lineState: { params: { fnIdx: 3, ivIdx: 0 }, annotation: { text: '割线水平, 斜率0', position: 'top' } } },
  { lineId: 'rolle-2', sectionId: 'rolle', scene: { id: 'rolle-peak', type: 'animation' }, lineState: { params: { fnIdx: 3, ivIdx: 0 }, annotation: { text: '峰谷处 f\'(c)=0', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-change', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnIdx: 1, ivIdx: 1 }, annotation: { text: '换函数/区间', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-follow', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnIdx: 0, ivIdx: 1 }, annotation: { text: '切线始终平行', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '平均被瞬时取到', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-geo', type: 'summary' }, lineState: { annotation: { text: '切线平行割线', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美!', position: 'bottom' } } },
]
