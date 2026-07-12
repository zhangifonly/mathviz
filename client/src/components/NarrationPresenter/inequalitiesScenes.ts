/**
 * 不等式与数轴讲解场景配置
 * 每句口播对应一个示例不等式（params.optionId 对应内核 INEQUALITY_OPTIONS）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultInequalitiesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const inequalitiesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '不等式与数轴', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-region', type: 'animation' }, lineState: { params: { optionId: 'simple' }, annotation: { text: '解是一整片区域', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-axis', type: 'animation' }, lineState: { params: { optionId: 'simple' }, annotation: { text: '画在数轴上', position: 'bottom' } } },

  // ===== solve (3) =====
  { lineId: 'solve-1', sectionId: 'solve', scene: { id: 'solve-move', type: 'animation' }, lineState: { params: { optionId: 'simple' }, annotation: { text: '移项分离', position: 'top' } } },
  { lineId: 'solve-2', sectionId: 'solve', scene: { id: 'solve-example', type: 'animation' }, lineState: { params: { optionId: 'simple' }, annotation: { text: 'x + 2 > 5 → x > 3', position: 'top' } } },
  { lineId: 'solve-3', sectionId: 'solve', scene: { id: 'solve-coeff', type: 'animation' }, lineState: { params: { optionId: 'coeff' }, annotation: { text: '系数化为 1', position: 'bottom' } } },

  // ===== flip (3) =====
  { lineId: 'flip-1', sectionId: 'flip', scene: { id: 'flip-warn', type: 'animation' }, lineState: { params: { optionId: 'flip' }, annotation: { text: '最易错的一步', position: 'top' } } },
  { lineId: 'flip-2', sectionId: 'flip', scene: { id: 'flip-rule', type: 'animation' }, lineState: { params: { optionId: 'flip' }, annotation: { text: '乘除负数，翻转不等号', position: 'top' } } },
  { lineId: 'flip-3', sectionId: 'flip', scene: { id: 'flip-example', type: 'animation' }, lineState: { params: { optionId: 'flip2' }, annotation: { text: '≥ 变成 ≤', position: 'bottom' } } },

  // ===== numberline (3) =====
  { lineId: 'nl-1', sectionId: 'numberline', scene: { id: 'nl-mark', type: 'animation' }, lineState: { params: { optionId: 'simple' }, annotation: { text: '标出边界', position: 'top' } } },
  { lineId: 'nl-2', sectionId: 'numberline', scene: { id: 'nl-point', type: 'animation' }, lineState: { params: { optionId: 'coeff' }, annotation: { text: '实心含等号 / 空心不含', position: 'bottom' } } },
  { lineId: 'nl-3', sectionId: 'numberline', scene: { id: 'nl-ray', type: 'animation' }, lineState: { params: { optionId: 'flip' }, annotation: { text: '射线指向解的方向', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optionId: 'flip' }, annotation: { text: '切换不等式', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-observe', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optionId: 'flip2' }, annotation: { text: '看圆点与方向', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-solve', type: 'summary' }, lineState: { annotation: { text: '移项 + 系数化一', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-flip', type: 'summary' }, lineState: { annotation: { text: '乘除负数翻转', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
