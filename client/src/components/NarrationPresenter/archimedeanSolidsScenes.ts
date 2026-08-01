/**
 * 阿基米德立体 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultArchimedeanSolidsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const archimedeanSolidsScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '柏拉图立体条件太严', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { base: 'cube', t: 0.2929 }, annotation: { text: '允许多种正多边形', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { base: 'octahedron', t: 0.3333 }, annotation: { text: '共十三种', position: 'bottom' } } },
  { lineId: 'tr-1', sectionId: 'truncate', scene: { id: 'tr-1', type: 'animation' }, lineState: { params: { base: 'cube', t: 0.12 }, annotation: { text: '把每个顶点削掉', position: 'top' } } },
  { lineId: 'tr-2', sectionId: 'truncate', scene: { id: 'tr-2', type: 'animation' }, lineState: { params: { base: 'tetrahedron', t: 0.3333 }, annotation: { text: '三角形变六边形', position: 'bottom' } } },
  { lineId: 'tr-3', sectionId: 'truncate', scene: { id: 'tr-3', type: 'animation' }, lineState: { params: { base: 'cube', t: 0.2929 }, annotation: { text: '切口边数 = 原顶点度数', position: 'bottom' } } },
  { lineId: 'vf-1', sectionId: 'verify', scene: { id: 'vf-1', type: 'animation' }, lineState: { params: { base: 'cube', t: 0.2929 }, annotation: { text: '顶点数 = 原棱数 × 2', position: 'top' } } },
  { lineId: 'vf-2', sectionId: 'verify', scene: { id: 'vf-2', type: 'animation' }, lineState: { params: { base: 'octahedron', t: 0.3333 }, annotation: { text: '面数 = 原面数 + 原顶点数', position: 'bottom' } } },
  { lineId: 'vf-3', sectionId: 'verify', scene: { id: 'vf-3', type: 'animation' }, lineState: { params: { base: 'tetrahedron', t: 0.3333 }, annotation: { text: 'V − E + F 仍等于 2', position: 'bottom' } } },
  { lineId: 'rt-1', sectionId: 'ratio', scene: { id: 'rt-1', type: 'animation' }, lineState: { params: { base: 'cube', t: 0.15 }, annotation: { text: '切太浅边长不齐', position: 'top' } } },
  { lineId: 'rt-2', sectionId: 'ratio', scene: { id: 'rt-2', type: 'animation' }, lineState: { params: { base: 'octahedron', t: 0.3333 }, annotation: { text: '三角面立体取 1/3', position: 'bottom' } } },
  { lineId: 'rt-3', sectionId: 'ratio', scene: { id: 'rt-3', type: 'animation' }, lineState: { params: { base: 'cube', t: 0.2929 }, annotation: { text: '立方体取 1/(2+√2)≈0.293', position: 'bottom' } } },
  { lineId: 'rc-1', sectionId: 'rectify', scene: { id: 'rc-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 'cube', t: 0.42 }, annotation: { text: '比例调到 0.5', position: 'top' } } },
  { lineId: 'rc-2', sectionId: 'rectify', scene: { id: 'rc-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 'cube', t: 0.5 }, annotation: { text: '立方体截半得立方八面体', position: 'bottom' } } },
  { lineId: 'rc-3', sectionId: 'rectify', scene: { id: 'rc-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 'octahedron', t: 0.5 }, annotation: { text: '正八面体截半结果相同', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '多种正多边形面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '截角: 顶点变原棱数两倍', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
