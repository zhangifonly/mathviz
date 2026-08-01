/**
 * 星形多面体 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultStellatedPolyhedraState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const stellatedPolyhedraScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '每个面向外拉一个尖', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { base: 'dodecahedron', h: 0.6 }, annotation: { text: '这个操作叫星化', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { base: 'dodecahedron', h: 1.2 }, annotation: { text: '有个量完全不动', position: 'bottom' } } },
  { lineId: 'ct-1', sectionId: 'count', scene: { id: 'ct-1', type: 'animation' }, lineState: { params: { base: 'cube', h: 0.6 }, annotation: { text: '顶点 = 原顶点 + 原面数', position: 'top' } } },
  { lineId: 'ct-2', sectionId: 'count', scene: { id: 'ct-2', type: 'animation' }, lineState: { params: { base: 'cube', h: 0.6 }, annotation: { text: '棱 = 原棱 × 3', position: 'bottom' } } },
  { lineId: 'ct-3', sectionId: 'count', scene: { id: 'ct-3', type: 'animation' }, lineState: { params: { base: 'octahedron', h: 0.6 }, annotation: { text: '面 = 原棱 × 2', position: 'bottom' } } },
  { lineId: 'iv-1', sectionId: 'invariant', scene: { id: 'iv-1', type: 'animation' }, lineState: { params: { base: 'tetrahedron', h: 0.6 }, annotation: { text: '代入欧拉公式', position: 'top' } } },
  { lineId: 'iv-2', sectionId: 'invariant', scene: { id: 'iv-2', type: 'animation' }, lineState: { params: { base: 'tetrahedron', h: 0.9 }, annotation: { text: '−3E + 2E = −E, 抵消', position: 'bottom' } } },
  { lineId: 'iv-3', sectionId: 'invariant', scene: { id: 'iv-3', type: 'animation' }, lineState: { params: { base: 'icosahedron', h: 0.6 }, annotation: { text: '五种立体一项不差', position: 'bottom' } } },
  { lineId: 'tp-1', sectionId: 'topology', scene: { id: 'tp-1', type: 'animation' }, lineState: { params: { base: 'dodecahedron', h: 0.2 }, annotation: { text: 'χ 是拓扑不变量', position: 'top' } } },
  { lineId: 'tp-2', sectionId: 'topology', scene: { id: 'tp-2', type: 'animation' }, lineState: { params: { base: 'dodecahedron', h: 1.0 }, annotation: { text: '没戳穿也没粘合', position: 'bottom' } } },
  { lineId: 'tp-3', sectionId: 'topology', scene: { id: 'tp-3', type: 'animation' }, lineState: { params: { base: 'dodecahedron', h: 1.8 }, annotation: { text: 'h 从 0 拉到很长, χ 恒为 2', position: 'bottom' } } },
  { lineId: 'kp-1', sectionId: 'kepler', scene: { id: 'kp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 'dodecahedron', h: 0.8 }, annotation: { text: '本实验不是那四种', position: 'top' } } },
  { lineId: 'kp-2', sectionId: 'kepler', scene: { id: 'kp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 'icosahedron', h: 0.8 }, annotation: { text: '它们的面是穿插的五角星', position: 'bottom' } } },
  { lineId: 'kp-3', sectionId: 'kepler', scene: { id: 'kp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 'dodecahedron', h: 0.6 }, annotation: { text: '小星形十二面体 χ = −6', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'V+F, 3E, 2E', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'χ 保持为 2', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
