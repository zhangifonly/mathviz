/**
 * 快速幂讲解场景配置
 * 每句口播对应一组 (base, exp, mod) 及高亮步 (highlight)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFastExponentiationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const fastExponentiationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '快速幂', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-naive', type: 'animation' }, lineState: { params: { base: 2, exp: 100, mod: 1000000007, highlight: 0 }, annotation: { text: '朴素法要 99 次', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-fast', type: 'animation' }, lineState: { params: { base: 2, exp: 100, mod: 1000000007, highlight: -1 }, annotation: { text: '快速幂不到 10 次', position: 'bottom' } } },

  // ===== naive (3) =====
  { lineId: 'naive-1', sectionId: 'naive', scene: { id: 'naive-linear', type: 'animation' }, lineState: { params: { base: 3, exp: 13, mod: 0, highlight: 0 }, annotation: { text: '连乘 = 线性次数', position: 'top' } } },
  { lineId: 'naive-2', sectionId: 'naive', scene: { id: 'naive-slow', type: 'animation' }, lineState: { params: { base: 3, exp: 13, mod: 0, highlight: 1 }, annotation: { text: '指数大就崩', position: 'bottom' } } },
  { lineId: 'naive-3', sectionId: 'naive', scene: { id: 'naive-need', type: 'animation' }, lineState: { params: { base: 3, exp: 13, mod: 0, highlight: 2 }, annotation: { text: '需要更快的办法', position: 'bottom' } } },

  // ===== binary (3) =====
  { lineId: 'bin-1', sectionId: 'binary', scene: { id: 'bin-write', type: 'animation' }, lineState: { params: { base: 3, exp: 13, mod: 0, highlight: 0 }, annotation: { text: '指数转二进制', position: 'top' } } },
  { lineId: 'bin-2', sectionId: 'binary', scene: { id: 'bin-1101', type: 'animation' }, lineState: { params: { base: 3, exp: 13, mod: 0, highlight: 2 }, annotation: { text: '13 = 8+4+1', position: 'bottom' } } },
  { lineId: 'bin-3', sectionId: 'binary', scene: { id: 'bin-split', type: 'animation' }, lineState: { params: { base: 3, exp: 13, mod: 0, highlight: 3 }, annotation: { text: '拆成平方项乘积', position: 'bottom' } } },

  // ===== squaremul (3) =====
  { lineId: 'sq-1', sectionId: 'squaremul', scene: { id: 'sq-square', type: 'animation' }, lineState: { params: { base: 7, exp: 45, mod: 1000, highlight: 1 }, annotation: { text: '每步平方', position: 'top' } } },
  { lineId: 'sq-2', sectionId: 'squaremul', scene: { id: 'sq-mul', type: 'animation' }, lineState: { params: { base: 7, exp: 45, mod: 1000, highlight: 3 }, annotation: { text: '遇 1 就乘入', position: 'bottom' } } },
  { lineId: 'sq-3', sectionId: 'squaremul', scene: { id: 'sq-log', type: 'animation' }, lineState: { params: { base: 7, exp: 45, mod: 1000, highlight: -1 }, annotation: { text: '对数级乘法', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 2, exp: 100, mod: 1000000007, highlight: -1 }, annotation: { text: '换底数与指数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 2, exp: 100, mod: 1000000007, highlight: -1 }, annotation: { text: '对比乘法次数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '平方与乘', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-log', type: 'summary' }, lineState: { annotation: { text: '线性降到对数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
