/**
 * 函数图象变换讲解场景配置
 * 每句口播对应基函数 base 与变换参数 a/b/h/k
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFunctionTransformState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

const sq = { base: 'square' }

export const functionTransformScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '函数图象变换', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-family', type: 'animation' }, lineState: { params: { ...sq, a: 1, b: 1, h: 2, k: 0 }, annotation: { text: '同一家族', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-formula', type: 'animation' }, lineState: { params: { ...sq, a: 1, b: 1, h: 0, k: 1 }, annotation: { text: 'g=a·f(b(x-h))+k', position: 'bottom' } } },

  // ===== translate (3) =====
  { lineId: 'def-1', sectionId: 'translate', scene: { id: 'def-h', type: 'animation' }, lineState: { params: { ...sq, a: 1, b: 1, h: 2, k: 0 }, annotation: { text: 'h 右移', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'translate', scene: { id: 'def-k', type: 'animation' }, lineState: { params: { ...sq, a: 1, b: 1, h: 0, k: 2 }, annotation: { text: 'k 上移', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'translate', scene: { id: 'def-both', type: 'animation' }, lineState: { params: { ...sq, a: 1, b: 1, h: -2, k: -1 }, annotation: { text: 'h管左右·k管上下', position: 'bottom' } } },

  // ===== scale (3) =====
  { lineId: 'scl-1', sectionId: 'scale', scene: { id: 'scl-a', type: 'animation' }, lineState: { params: { ...sq, a: 2, b: 1, h: 0, k: 0 }, annotation: { text: 'a 竖直拉伸', position: 'top' } } },
  { lineId: 'scl-2', sectionId: 'scale', scene: { id: 'scl-b', type: 'animation' }, lineState: { params: { ...sq, a: 1, b: 2, h: 0, k: 0 }, annotation: { text: 'b 水平压缩', position: 'bottom' } } },
  { lineId: 'scl-3', sectionId: 'scale', scene: { id: 'scl-more', type: 'animation' }, lineState: { params: { ...sq, a: 0.5, b: 0.5, h: 0, k: 0 }, annotation: { text: '越小越扁越宽', position: 'bottom' } } },

  // ===== flip (2) =====
  { lineId: 'flp-1', sectionId: 'flip', scene: { id: 'flp-a', type: 'animation' }, lineState: { params: { ...sq, a: -1, b: 1, h: 0, k: 0 }, annotation: { text: 'a<0 沿x轴翻', position: 'top' } } },
  { lineId: 'flp-2', sectionId: 'flip', scene: { id: 'flp-b', type: 'animation' }, lineState: { params: { base: 'cubic', a: 1, b: -1, h: 0, k: 0 }, annotation: { text: 'b<0 沿y轴翻', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ...sq, a: 2, b: 1, h: 1, k: -1 }, annotation: { text: '拖动四滑块', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-effect', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 'sin', a: 2, b: 2, h: 0, k: 0 }, annotation: { text: '实时看效果', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '平移与伸缩', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-flip', type: 'summary' }, lineState: { annotation: { text: '负号翻折', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '掌握变形的钥匙！', position: 'bottom' } } },
]
