/**
 * 球面镶嵌 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSphericalTilingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sphericalTilingScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { kind: 'dodecahedron' }, annotation: { text: '顶点推到外接球面', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'dodecahedron' }, annotation: { text: '十二块球面五边形铺满', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'dodecahedron' }, annotation: { text: '记法 {面边数, 顶点面数}', position: 'bottom' } } },
  { lineId: 'ar-1', sectionId: 'area', scene: { id: 'ar-1', type: 'animation' }, lineState: { params: { kind: 'tetrahedron' }, annotation: { text: '总面积须等于 4π', position: 'top' } } },
  { lineId: 'ar-2', sectionId: 'area', scene: { id: 'ar-2', type: 'animation' }, lineState: { params: { kind: 'octahedron' }, annotation: { text: '从面心切成球面三角形', position: 'bottom' } } },
  { lineId: 'ar-3', sectionId: 'area', scene: { id: 'ar-3', type: 'animation' }, lineState: { params: { kind: 'icosahedron' }, annotation: { text: '误差 1e-15 量级', position: 'bottom' } } },
  { lineId: 'an-1', sectionId: 'angle', scene: { id: 'an-1', type: 'animation' }, lineState: { params: { kind: 'tetrahedron' }, annotation: { text: '平面正三角形内角 60°', position: 'top' } } },
  { lineId: 'an-2', sectionId: 'angle', scene: { id: 'an-2', type: 'animation' }, lineState: { params: { kind: 'tetrahedron' }, annotation: { text: '球面上是 120°', position: 'bottom' } } },
  { lineId: 'an-3', sectionId: 'angle', scene: { id: 'an-3', type: 'animation' }, lineState: { params: { kind: 'octahedron' }, annotation: { text: '顶点面角和恰为 360°', position: 'bottom' } } },
  { lineId: 'df-1', sectionId: 'defect', scene: { id: 'df-1', type: 'animation' }, lineState: { params: { kind: 'tetrahedron' }, annotation: { text: '按平面尺寸拼会凑不满', position: 'top' } } },
  { lineId: 'df-2', sectionId: 'defect', scene: { id: 'df-2', type: 'animation' }, lineState: { params: { kind: 'cube' }, annotation: { text: '差额叫角亏', position: 'bottom' } } },
  { lineId: 'df-3', sectionId: 'defect', scene: { id: 'df-3', type: 'animation' }, lineState: { params: { kind: 'icosahedron' }, annotation: { text: '角亏总和 = 4π = 720°', position: 'bottom' } } },
  { lineId: 'th-1', sectionId: 'three', scene: { id: 'th-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'dodecahedron' }, annotation: { text: '(p−2)(q−2) < 4: 球面', position: 'top' } } },
  { lineId: 'th-2', sectionId: 'three', scene: { id: 'th-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'cube' }, annotation: { text: '= 4: 平面, 只有 3 种', position: 'bottom' } } },
  { lineId: 'th-3', sectionId: 'three', scene: { id: 'th-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'icosahedron' }, annotation: { text: '> 4: 双曲, 无穷多种', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '五种正规球面镶嵌', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '面积配平到 4π', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
