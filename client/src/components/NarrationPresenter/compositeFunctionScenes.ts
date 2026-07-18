/**
 * 复合函数讲解场景配置
 * 每句口播对应内外函数 key（params.f / params.g）与演示步 params.demo
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCompositeFunctionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const compositeFunctionScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '复合函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-relay', type: 'animation' }, lineState: { params: { g: 'sine', f: 'square', demo: -1 }, annotation: { text: '两台机器接力', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-io', type: 'animation' }, lineState: { params: { g: 'sine', f: 'square', demo: 2 }, annotation: { text: '输出接输入', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { g: 'sine', f: 'square', demo: 3 }, annotation: { text: '函数套函数', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-notation', type: 'animation' }, lineState: { params: { g: 'linear', f: 'square', demo: -1 }, annotation: { text: 'f(g(x))', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-inner', type: 'animation' }, lineState: { params: { g: 'linear', f: 'square', demo: 1 }, annotation: { text: '先算内层 g', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-outer', type: 'animation' }, lineState: { params: { g: 'linear', f: 'square', demo: 3 }, annotation: { text: '再算外层 f', position: 'bottom' } } },

  // ===== graph (3) =====
  { lineId: 'gra-1', sectionId: 'graph', scene: { id: 'gra-three', type: 'animation' }, lineState: { params: { g: 'sine', f: 'square', demo: -1 }, annotation: { text: '三条曲线', position: 'top' } } },
  { lineId: 'gra-2', sectionId: 'graph', scene: { id: 'gra-reshape', type: 'animation' }, lineState: { params: { g: 'sine', f: 'exp', demo: -1 }, annotation: { text: '二次塑形', position: 'bottom' } } },
  { lineId: 'gra-3', sectionId: 'graph', scene: { id: 'gra-newshape', type: 'animation' }, lineState: { params: { g: 'abs', f: 'sine', demo: -1 }, annotation: { text: '形状焕然一新', position: 'bottom' } } },

  // ===== order (2) =====
  { lineId: 'ord-1', sectionId: 'order', scene: { id: 'ord-sqinc', type: 'animation' }, lineState: { params: { g: 'linear', f: 'square', demo: 2 }, annotation: { text: '先加一再平方', position: 'top' } } },
  { lineId: 'ord-2', sectionId: 'order', scene: { id: 'ord-swap', type: 'animation' }, lineState: { params: { g: 'square', f: 'linear', demo: 2 }, annotation: { text: 'f∘g ≠ g∘f', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { g: 'sine', f: 'square', demo: -1 }, annotation: { text: '选内外函数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-demo', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { g: 'sine', f: 'square', demo: 4 }, annotation: { text: '跟箭头走两步', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '先内后外', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-order', type: 'summary' }, lineState: { annotation: { text: '次序不可换', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
