/**
 * 闵可夫斯基和与斯坦纳公式 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultMinkowskiSteinerState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const minkowskiSteinerScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { solidId: 'cube', r: 0 }, annotation: { text: '先看原来的立方体', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.4 }, annotation: { text: 'K ⊕ rB：所有到 K 距离 ≤ r 的点', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.7 }, annotation: { text: '体积是 r 的三次多项式', position: 'bottom' } } },
  { lineId: 'fm-1', sectionId: 'formula', scene: { id: 'fm-1', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.5 }, annotation: { text: 'V(r) = V + S·r + M·r² + (4π/3)r³', position: 'top' } } },
  { lineId: 'fm-2', sectionId: 'formula', scene: { id: 'fm-2', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.5 }, annotation: { text: '四个系数都有几何含义', position: 'bottom' } } },
  { lineId: 'fm-3', sectionId: 'formula', scene: { id: 'fm-3', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.5 }, annotation: { text: '四种颜色对应四项', position: 'bottom' } } },
  { lineId: 'pc-1', sectionId: 'pieces', scene: { id: 'pc-1', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.5, highlight: 1 }, annotation: { text: '面板：S·r', position: 'top' } } },
  { lineId: 'pc-2', sectionId: 'pieces', scene: { id: 'pc-2', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.5, highlight: 2 }, annotation: { text: '棱楔：M·r²', position: 'bottom' } } },
  { lineId: 'pc-3', sectionId: 'pieces', scene: { id: 'pc-3', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.5, highlight: 2 }, annotation: { text: 'M = ½ Σ 棱长 × 外二面角', position: 'bottom' } } },
  { lineId: 'bl-1', sectionId: 'ball', scene: { id: 'bl-1', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.6, highlight: 3 }, annotation: { text: '每个顶点一片球面', position: 'top' } } },
  { lineId: 'bl-2', sectionId: 'ball', scene: { id: 'bl-2', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.6, highlight: 3 }, annotation: { text: '八片拼成一整个球', position: 'bottom' } } },
  { lineId: 'bl-3', sectionId: 'ball', scene: { id: 'bl-3', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', r: 0.6, highlight: 3 }, annotation: { text: '四面体只有 4 个顶点, 顶点项不变', position: 'bottom' } } },
  { lineId: 'wy-1', sectionId: 'why', scene: { id: 'wy-1', type: 'animation' }, lineState: { params: { solidId: 'octahedron', r: 0.6, highlight: 3 }, annotation: { text: '外立体角之和恒为 4π', position: 'top' } } },
  { lineId: 'wy-2', sectionId: 'why', scene: { id: 'wy-2', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', r: 0.6 }, annotation: { text: '内立体角之和才不是常数', position: 'bottom' } } },
  { lineId: 'wy-3', sectionId: 'why', scene: { id: 'wy-3', type: 'animation' }, lineState: { params: { solidId: 'cube', r: 0.6 }, annotation: { text: '这是多面体版的高斯-博内', position: 'bottom' } } },
  { lineId: 'sp-1', sectionId: 'support', scene: { id: 'sp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'cube', r: 0.4 }, annotation: { text: 'h(u) = max⟨x, u⟩', position: 'top' } } },
  { lineId: 'sp-2', sectionId: 'support', scene: { id: 'sp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'cube', r: 0.8 }, annotation: { text: 'h(K⊕rB) = h(K) + r', position: 'bottom' } } },
  { lineId: 'sp-3', sectionId: 'support', scene: { id: 'sp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'cube', r: 0.8 }, annotation: { text: '每个方向都外推 r', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'V(r) 是 r 的三次多项式', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '本体 / 面 / 棱 / 顶点', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
