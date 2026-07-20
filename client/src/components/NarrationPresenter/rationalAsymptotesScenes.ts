/**
 * 有理函数与渐近线讲解场景配置
 * params.example 指定展示第几个有理函数例子（0/1/2）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRationalAsymptotesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const rationalAsymptotesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '有理函数与渐近线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pole', type: 'animation' }, lineState: { params: { example: 0 }, annotation: { text: '分母为零处', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-approach', type: 'animation' }, lineState: { params: { example: 0 }, annotation: { text: '无限逼近', position: 'bottom' } } },

  // ===== vertical (3) =====
  { lineId: 'def-1', sectionId: 'vertical', scene: { id: 'def-root', type: 'animation' }, lineState: { params: { example: 0 }, annotation: { text: '分母的根', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'vertical', scene: { id: 'def-blowup', type: 'animation' }, lineState: { params: { example: 0 }, annotation: { text: '冲向无穷', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'vertical', scene: { id: 'def-redline', type: 'animation' }, lineState: { params: { example: 1 }, annotation: { text: '红色竖直虚线', position: 'bottom' } } },

  // ===== horizontal (3) =====
  { lineId: 'hor-1', sectionId: 'horizontal', scene: { id: 'hor-degree', type: 'animation' }, lineState: { params: { example: 1 }, annotation: { text: '比较次数', position: 'top' } } },
  { lineId: 'hor-2', sectionId: 'horizontal', scene: { id: 'hor-zero', type: 'animation' }, lineState: { params: { example: 0 }, annotation: { text: '低次趋于零', position: 'bottom' } } },
  { lineId: 'hor-3', sectionId: 'horizontal', scene: { id: 'hor-ratio', type: 'animation' }, lineState: { params: { example: 1 }, annotation: { text: '等次取系数比', position: 'bottom' } } },

  // ===== oblique (3) =====
  { lineId: 'obl-1', sectionId: 'oblique', scene: { id: 'obl-line', type: 'animation' }, lineState: { params: { example: 2 }, annotation: { text: '高一次是斜线', position: 'top' } } },
  { lineId: 'obl-2', sectionId: 'oblique', scene: { id: 'obl-divide', type: 'animation' }, lineState: { params: { example: 2 }, annotation: { text: '多项式长除', position: 'bottom' } } },
  { lineId: 'obl-3', sectionId: 'oblique', scene: { id: 'obl-quotient', type: 'animation' }, lineState: { params: { example: 2 }, annotation: { text: '商即斜渐近线', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { example: 1 }, annotation: { text: '切换例子', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { example: 2 }, annotation: { text: '蓝色末端渐近线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '两类渐近线', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-rules', type: 'summary' }, lineState: { annotation: { text: '三招判断', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
