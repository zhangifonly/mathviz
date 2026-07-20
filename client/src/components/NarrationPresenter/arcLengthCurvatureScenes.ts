/**
 * 弧长与曲率讲解场景配置
 * 每句口播对应曲线索引 curveIdx 与参数 t
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultArcLengthCurvatureState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const arcLengthCurvatureScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '弧长与曲率', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-two', type: 'animation' }, lineState: { params: { curveIdx: 1, t: 1 }, annotation: { text: '多长？多弯？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { curveIdx: 1, t: 2 }, annotation: { text: '弧长 · 曲率', position: 'bottom' } } },

  // ===== length (3) =====
  { lineId: 'len-1', sectionId: 'length', scene: { id: 'len-slice', type: 'animation' }, lineState: { params: { curveIdx: 2, t: 1 }, annotation: { text: '切成微小段', position: 'top' } } },
  { lineId: 'len-2', sectionId: 'length', scene: { id: 'len-speed', type: 'animation' }, lineState: { params: { curveIdx: 2, t: 1.5 }, annotation: { text: '速度=√(x²+y²的导数)', position: 'bottom' } } },
  { lineId: 'len-3', sectionId: 'length', scene: { id: 'len-int', type: 'animation' }, lineState: { params: { curveIdx: 2, t: 2 }, annotation: { text: '积分求总长', position: 'bottom' } } },

  // ===== curvature (3) =====
  { lineId: 'cur-1', sectionId: 'curvature', scene: { id: 'cur-turn', type: 'animation' }, lineState: { params: { curveIdx: 3, t: 3 }, annotation: { text: '方向转多快', position: 'top' } } },
  { lineId: 'cur-2', sectionId: 'curvature', scene: { id: 'cur-formula', type: 'animation' }, lineState: { params: { curveIdx: 3, t: 6 }, annotation: { text: 'κ 的公式', position: 'bottom' } } },
  { lineId: 'cur-3', sectionId: 'curvature', scene: { id: 'cur-circle', type: 'animation' }, lineState: { params: { curveIdx: 0, t: 1 }, annotation: { text: '圆 κ=1/R', position: 'bottom' } } },

  // ===== osculate (3) =====
  { lineId: 'osc-1', sectionId: 'osculate', scene: { id: 'osc-fit', type: 'animation' }, lineState: { params: { curveIdx: 1, t: 0.5 }, annotation: { text: '最贴合的圆', position: 'top' } } },
  { lineId: 'osc-2', sectionId: 'osculate', scene: { id: 'osc-radius', type: 'animation' }, lineState: { params: { curveIdx: 1, t: 1.5 }, annotation: { text: '半径=1/κ', position: 'bottom' } } },
  { lineId: 'osc-3', sectionId: 'osculate', scene: { id: 'osc-vary', type: 'animation' }, lineState: { params: { curveIdx: 2, t: 0.2 }, annotation: { text: '越直圆越大', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-move', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { curveIdx: 1, t: 2.5 }, annotation: { text: '移动看变化', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { curveIdx: 3, t: 9 }, annotation: { text: '切向 · 法向', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-len', type: 'summary' }, lineState: { annotation: { text: '弧长=∫速度', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cur', type: 'summary' }, lineState: { annotation: { text: '曲率与密切圆', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
