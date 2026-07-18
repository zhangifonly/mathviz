/**
 * 埃农映射讲解场景配置
 * 每句口播对应一组参数（params.a / params.b）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHenonMapState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const henonMapScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '埃农映射', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-parabola', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '抛物线加收缩', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-cloud', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '既杂乱又有序', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-map', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '两条公式', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-x', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: "x'=1-a·x²+y", position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-y', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: "y'=b·x", position: 'bottom' } } },

  // ===== attractor (3) =====
  { lineId: 'att-1', sectionId: 'attractor', scene: { id: 'att-transient', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '前几步是暂态', position: 'top' } } },
  { lineId: 'att-2', sectionId: 'attractor', scene: { id: 'att-basin', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '殊途同归', position: 'bottom' } } },
  { lineId: 'att-3', sectionId: 'attractor', scene: { id: 'att-shape', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '逃不出的吸引子', position: 'bottom' } } },

  // ===== fractal (2) =====
  { lineId: 'frac-1', sectionId: 'fractal', scene: { id: 'frac-lines', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '曲线其实是细线束', position: 'top' } } },
  { lineId: 'frac-2', sectionId: 'fractal', scene: { id: 'frac-self', type: 'animation' }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '自相似分形', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-a', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.2, b: 0.3 }, annotation: { text: '调整 a', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-b', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.4, b: 0.2 }, annotation: { text: '调整 b', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '两条公式迭代', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-fractal', type: 'summary' }, lineState: { annotation: { text: '分形吸引子', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
