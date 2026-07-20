/**
 * Catmull-Rom 样条讲解场景配置
 * params.samples = 每段采样数；params.compare = 是否叠加 B 样条对比
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCatmullRomState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const catmullRomScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Catmull-Rom样条', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-thru', type: 'animation' }, lineState: { params: { samples: 16, compare: 0 }, annotation: { text: '必须穿过每个点', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { samples: 16, compare: 0 }, annotation: { text: '过点又平滑', position: 'bottom' } } },

  // ===== tangent (3) =====
  { lineId: 'tan-1', sectionId: 'tangent', scene: { id: 'tan-dir', type: 'animation' }, lineState: { params: { samples: 16, compare: 0 }, annotation: { text: '每点的方向', position: 'top' } } },
  { lineId: 'tan-2', sectionId: 'tangent', scene: { id: 'tan-neigh', type: 'animation' }, lineState: { params: { samples: 16, compare: 0 }, annotation: { text: '前后点连线', position: 'bottom' } } },
  { lineId: 'tan-3', sectionId: 'tangent', scene: { id: 'tan-formula', type: 'animation' }, lineState: { params: { samples: 32, compare: 0 }, annotation: { text: '(P(i+1)-P(i-1))/2', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-hermite', type: 'animation' }, lineState: { params: { samples: 32, compare: 0 }, annotation: { text: '三次插值', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-matrix', type: 'animation' }, lineState: { params: { samples: 32, compare: 0 }, annotation: { text: '四点加权混合', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-t', type: 'animation' }, lineState: { params: { samples: 32, compare: 0 }, annotation: { text: 't: 0 → 1', position: 'bottom' } } },

  // ===== compare (3) =====
  { lineId: 'cmp-1', sectionId: 'compare', scene: { id: 'cmp-bspline', type: 'animation' }, lineState: { params: { samples: 32, compare: 1 }, annotation: { text: 'B样条被拉扯', position: 'top' } } },
  { lineId: 'cmp-2', sectionId: 'compare', scene: { id: 'cmp-interp', type: 'animation' }, lineState: { params: { samples: 32, compare: 1 }, annotation: { text: '插值 vs 逼近', position: 'bottom' } } },
  { lineId: 'cmp-3', sectionId: 'compare', scene: { id: 'cmp-choose', type: 'animation' }, lineState: { params: { samples: 32, compare: 1 }, annotation: { text: '各有所长', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { samples: 32, compare: 0 }, annotation: { text: '拖动控制点', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { samples: 32, compare: 1 }, annotation: { text: '对比两条曲线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '过点且光滑', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-use', type: 'summary' }, lineState: { annotation: { text: '动画路径常用', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
