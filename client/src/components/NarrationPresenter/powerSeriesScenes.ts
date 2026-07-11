/**
 * 幂级数收敛讲解场景配置
 * 每句口播对应级数与项数（params.seriesId / params.terms）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPowerSeriesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const powerSeriesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '幂级数收敛', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-form', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 3 }, annotation: { text: '一次加一次项', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-equal', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 6 }, annotation: { text: '等于一个函数', position: 'bottom' } } },

  // ===== partial (3) =====
  { lineId: 'partial-1', sectionId: 'partial', scene: { id: 'partial-def', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 4 }, annotation: { text: '取前几项', position: 'top' } } },
  { lineId: 'partial-2', sectionId: 'partial', scene: { id: 'partial-curve', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 6 }, annotation: { text: '黄色=部分和', position: 'bottom' } } },
  { lineId: 'partial-3', sectionId: 'partial', scene: { id: 'partial-approach', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 12 }, annotation: { text: '越加越贴近', position: 'bottom' } } },

  // ===== radius (3) =====
  { lineId: 'radius-1', sectionId: 'radius', scene: { id: 'radius-edge', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 12 }, annotation: { text: '无形的边界', position: 'top' } } },
  { lineId: 'radius-2', sectionId: 'radius', scene: { id: 'radius-def', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 12 }, annotation: { text: '红线=收敛半径', position: 'bottom' } } },
  { lineId: 'radius-3', sectionId: 'radius', scene: { id: 'radius-inout', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 16 }, annotation: { text: '内收敛外发散', position: 'bottom' } } },

  // ===== why (2) =====
  { lineId: 'why-1', sectionId: 'why', scene: { id: 'why-geo', type: 'animation' }, lineState: { params: { seriesId: 'geometric', terms: 14 }, annotation: { text: '几何级数 R=1', position: 'top' } } },
  { lineId: 'why-2', sectionId: 'why', scene: { id: 'why-exp', type: 'animation' }, lineState: { params: { seriesId: 'exp', terms: 10 }, annotation: { text: '指数级数 R=∞', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-terms', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { seriesId: 'arctan', terms: 8 }, annotation: { text: '增加项数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { seriesId: 'ln1px', terms: 10 }, annotation: { text: '切换级数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '项越多越准', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-radius', type: 'summary' }, lineState: { annotation: { text: '半径划定范围', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
