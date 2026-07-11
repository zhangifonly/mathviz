/**
 * 曼德博集与朱利亚集讲解场景配置
 * 每句口播对应一个可视化状态（mode / 参数 c）
 * lineId / sectionId 与 narration 稿件严格一一对应
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMandelbrotJuliaState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const mandelbrotJuliaScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '曼德博与朱利亚集', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-formula', type: 'animation' }, lineState: { params: { mode: 'mandelbrot' }, annotation: { text: 'z → z² + c', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-fractal', type: 'animation' }, lineState: { params: { mode: 'mandelbrot' }, annotation: { text: '无穷分形', position: 'bottom' } } },

  // ===== escape (3) =====
  { lineId: 'escape-1', sectionId: 'escape', scene: { id: 'escape-bounded', type: 'animation' }, lineState: { params: { mode: 'mandelbrot' }, annotation: { text: '有界 → 属于集合', position: 'top' } } },
  { lineId: 'escape-2', sectionId: 'escape', scene: { id: 'escape-diverge', type: 'animation' }, lineState: { params: { mode: 'mandelbrot' }, annotation: { text: '模超过 2 → 逃逸', position: 'top' } } },
  { lineId: 'escape-3', sectionId: 'escape', scene: { id: 'escape-color', type: 'animation' }, lineState: { params: { mode: 'mandelbrot' }, annotation: { text: '逃逸步数染色', position: 'bottom' } } },

  // ===== julia (3) =====
  { lineId: 'julia-1', sectionId: 'julia', scene: { id: 'julia-fixc', type: 'animation' }, lineState: { params: { mode: 'julia', cx: -0.4, cy: 0.6 }, annotation: { text: '固定 c，扫初值 z', position: 'top' } } },
  { lineId: 'julia-2', sectionId: 'julia', scene: { id: 'julia-set', type: 'animation' }, lineState: { params: { mode: 'julia', cx: -0.8, cy: 0.156 }, annotation: { text: '不逃逸的初值集合', position: 'bottom' } } },
  { lineId: 'julia-3', sectionId: 'julia', scene: { id: 'julia-unique', type: 'animation' }, lineState: { params: { mode: 'julia', cx: -0.123, cy: 0.745 }, annotation: { text: '每个 c 一幅图', position: 'bottom' } } },

  // ===== duality (3) =====
  { lineId: 'duality-1', sectionId: 'duality', scene: { id: 'duality-map', type: 'animation' }, lineState: { params: { mode: 'mandelbrot' }, annotation: { text: '曼德博集是地图', position: 'top' } } },
  { lineId: 'duality-2', sectionId: 'duality', scene: { id: 'duality-connected', type: 'animation' }, lineState: { params: { mode: 'julia', cx: 0.285, cy: 0.01 }, annotation: { text: '内部连通，外部成尘', position: 'bottom' } } },
  { lineId: 'duality-3', sectionId: 'duality', scene: { id: 'duality-index', type: 'animation' }, lineState: { params: { mode: 'julia', cx: -0.70176, cy: -0.3842 }, annotation: { text: '每点索引一个世界', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'julia', cx: -0.123, cy: 0.745 }, annotation: { text: '切换参数 c', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-zoom', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'mandelbrot' }, annotation: { text: '放大见自相似', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '平方迭代 + 逃逸染色', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-index', type: 'summary' }, lineState: { annotation: { text: '曼德博索引朱利亚', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美', position: 'bottom' } } },
]
