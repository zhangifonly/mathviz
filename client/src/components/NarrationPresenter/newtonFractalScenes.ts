/**
 * 牛顿分形讲解场景配置
 * 每句口播对应多项式(params.poly)与缩放半宽(params.scale)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNewtonFractalState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const newtonFractalScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '牛顿分形', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fractal', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 1.6 }, annotation: { text: '求根竟生分形', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-preview', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 1.6 }, annotation: { text: '无穷精细的图案', position: 'bottom' } } },

  // ===== iterate (3) =====
  { lineId: 'def-1', sectionId: 'iterate', scene: { id: 'def-formula', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 1.6 }, annotation: { text: 'z ← z − f/f′', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'iterate', scene: { id: 'def-push', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 1.6 }, annotation: { text: '推向最近的根', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'iterate', scene: { id: 'def-cubic', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 1.6 }, annotation: { text: '三个立方根', position: 'bottom' } } },

  // ===== basin (3) =====
  { lineId: 'basin-1', sectionId: 'basin', scene: { id: 'basin-start', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 1.6 }, annotation: { text: '每点当作起点', position: 'top' } } },
  { lineId: 'basin-2', sectionId: 'basin', scene: { id: 'basin-color', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 1.6 }, annotation: { text: '同色=同一盆地', position: 'bottom' } } },
  { lineId: 'basin-3', sectionId: 'basin', scene: { id: 'basin-speed', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 1.6 }, annotation: { text: '亮度=收敛速度', position: 'bottom' } } },

  // ===== boundary (3) =====
  { lineId: 'edge-1', sectionId: 'boundary', scene: { id: 'edge-rough', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 0.8 }, annotation: { text: '边界并不光滑', position: 'top' } } },
  { lineId: 'edge-2', sectionId: 'boundary', scene: { id: 'edge-zoom', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 0.35 }, annotation: { text: '三色犬牙交错', position: 'bottom' } } },
  { lineId: 'edge-3', sectionId: 'boundary', scene: { id: 'edge-chaos', type: 'animation' }, lineState: { params: { poly: 'z^3-1', scale: 0.18 }, annotation: { text: '差之毫厘=混沌', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-quartic', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { poly: 'z^4-1', scale: 1.6 }, annotation: { text: '四色对称花纹', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-zoom', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { poly: 'z^4-1', scale: 0.5 }, annotation: { text: '放大见自相似', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '收敛盆地', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-boundary', type: 'summary' }, lineState: { annotation: { text: '分形边界与混沌', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
