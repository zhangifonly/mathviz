/**
 * 生成函数讲解场景配置
 * 每句口播对应展示的示例索引（params.idx: 0=两骰子 1=三骰子 2=斐波那契）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGeneratingFunctionsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const generatingFunctionsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '生成函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pack', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '打包整串数列', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-tool', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '巧妙的工具', position: 'bottom' } } },

  // ===== coeff (3) =====
  { lineId: 'def-1', sectionId: 'coeff', scene: { id: 'def-encode', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '第k项=xᵏ系数', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'coeff', scene: { id: 'def-poly', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '浓缩成多项式', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'coeff', scene: { id: 'def-bars', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '柱高=系数值', position: 'bottom' } } },

  // ===== conv (3) =====
  { lineId: 'conv-1', sectionId: 'conv', scene: { id: 'conv-mul', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '相乘看第k项', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'conv', scene: { id: 'conv-def', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '下标相加=k 的卷积', position: 'bottom' } } },
  { lineId: 'conv-3', sectionId: 'conv', scene: { id: 'conv-count', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '恰是方案数', position: 'bottom' } } },

  // ===== apply (3) =====
  { lineId: 'app-1', sectionId: 'apply', scene: { id: 'app-die', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '单骰 x+…+x⁶', position: 'top' } } },
  { lineId: 'app-2', sectionId: 'apply', scene: { id: 'app-two', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '和为7最多，6种', position: 'bottom' } } },
  { lineId: 'app-3', sectionId: 'apply', scene: { id: 'app-fib', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: '斐波那契系数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 1 }, annotation: { text: '切换示例', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-sum', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 1 }, annotation: { text: '系数总和=方案数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '数列变系数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-conv', type: 'summary' }, lineState: { annotation: { text: '乘法即卷积', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
