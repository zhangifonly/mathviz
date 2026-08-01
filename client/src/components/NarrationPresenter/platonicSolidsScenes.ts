/**
 * 柏拉图立体 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultPlatonicSolidsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const platonicSolidsScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '每面同样的正多边形', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'tetrahedron' }, annotation: { text: '平面上有无穷多种', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'dodecahedron' }, annotation: { text: '空间里恰好五种', position: 'bottom' } } },
  { lineId: 'wy-1', sectionId: 'why', scene: { id: 'wy-1', type: 'animation' }, lineState: { params: { kind: 'cube' }, annotation: { text: '看一个顶点', position: 'top' } } },
  { lineId: 'wy-2', sectionId: 'why', scene: { id: 'wy-2', type: 'animation' }, lineState: { params: { kind: 'cube' }, annotation: { text: '内角和须小于 360°', position: 'bottom' } } },
  { lineId: 'wy-3', sectionId: 'why', scene: { id: 'wy-3', type: 'animation' }, lineState: { params: { kind: 'icosahedron' }, annotation: { text: '(p−2)(q−2) < 4', position: 'bottom' } } },
  { lineId: 'el-1', sectionId: 'euler', scene: { id: 'el-1', type: 'animation' }, lineState: { params: { kind: 'tetrahedron', showEuler: true }, annotation: { text: 'V − E + F = 2', position: 'top' } } },
  { lineId: 'el-2', sectionId: 'euler', scene: { id: 'el-2', type: 'animation' }, lineState: { params: { kind: 'cube', showEuler: true }, annotation: { text: '欧拉特征数是拓扑不变量', position: 'bottom' } } },
  { lineId: 'el-3', sectionId: 'euler', scene: { id: 'el-3', type: 'animation' }, lineState: { params: { kind: 'dodecahedron', showEuler: true }, annotation: { text: '棱数从面表自动推出', position: 'bottom' } } },
  { lineId: 'dl-1', sectionId: 'dual', scene: { id: 'dl-1', type: 'animation' }, lineState: { params: { kind: 'cube', showDual: true }, annotation: { text: '取面心作新顶点', position: 'top' } } },
  { lineId: 'dl-2', sectionId: 'dual', scene: { id: 'dl-2', type: 'animation' }, lineState: { params: { kind: 'octahedron', showDual: true }, annotation: { text: '六面体 ↔ 八面体', position: 'bottom' } } },
  { lineId: 'dl-3', sectionId: 'dual', scene: { id: 'dl-3', type: 'animation' }, lineState: { params: { kind: 'tetrahedron', showDual: true }, annotation: { text: '四面体自对偶', position: 'bottom' } } },
  { lineId: 'df-1', sectionId: 'defect', scene: { id: 'df-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'tetrahedron', showEuler: true }, annotation: { text: '360° 减内角和 = 角亏', position: 'top' } } },
  { lineId: 'df-2', sectionId: 'defect', scene: { id: 'df-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'octahedron', showEuler: true }, annotation: { text: '笛卡尔: 总和恒为 720°', position: 'bottom' } } },
  { lineId: 'df-3', sectionId: 'defect', scene: { id: 'df-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'icosahedron', showEuler: true }, annotation: { text: '二十面体: 12 × 60° = 720°', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '恰好五种正多面体', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'V − E + F = 2', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
