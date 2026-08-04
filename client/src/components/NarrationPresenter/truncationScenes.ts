/**
 * 截角变换 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultTruncationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const truncationScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { solidId: 'icosahedron', t: 0 }, annotation: { text: '先看正二十面体', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { solidId: 'icosahedron', t: 0.3333 }, annotation: { text: '12 五边形 + 20 六边形 = 足球', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { solidId: 'icosahedron', t: 0.3333 }, annotation: { text: '截角二十面体', position: 'bottom' } } },
  { lineId: 'ct-1', sectionId: 'counting', scene: { id: 'ct-1', type: 'animation' }, lineState: { params: { solidId: 'cube', t: 0.2929 }, annotation: { text: '数一数 V、E、F', position: 'top' } } },
  { lineId: 'ct-2', sectionId: 'counting', scene: { id: 'ct-2', type: 'animation' }, lineState: { params: { solidId: 'cube', t: 0.2929, showBase: true }, annotation: { text: "V′ = 2E，E′ = 3E", position: 'bottom' } } },
  { lineId: 'ct-3', sectionId: 'counting', scene: { id: 'ct-3', type: 'animation' }, lineState: { params: { solidId: 'cube', t: 0.2929 }, annotation: { text: 'F′ = F + V，χ 仍是 2', position: 'bottom' } } },
  { lineId: 'sd-1', sectionId: 'standard', scene: { id: 'sd-1', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', t: 0.15 }, annotation: { text: '削浅了新面太小', position: 'top' } } },
  { lineId: 'sd-2', sectionId: 'standard', scene: { id: 'sd-2', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', t: 0.3333 }, annotation: { text: 't = 1/(2 + 2sin(θ/2))', position: 'bottom' } } },
  { lineId: 'sd-3', sectionId: 'standard', scene: { id: 'sd-3', type: 'animation' }, lineState: { params: { solidId: 'dodecahedron', t: 0.2764 }, annotation: { text: '五边面给 0.2764，不是 1/3', position: 'bottom' } } },
  { lineId: 'rc-1', sectionId: 'rectify', scene: { id: 'rc-1', type: 'animation' }, lineState: { params: { solidId: 'cube', t: 0.42 }, annotation: { text: '继续往右拖', position: 'top' } } },
  { lineId: 'rc-2', sectionId: 'rectify', scene: { id: 'rc-2', type: 'animation' }, lineState: { params: { solidId: 'cube', t: 0.5 }, annotation: { text: 't=1/2：立方八面体', position: 'bottom' } } },
  { lineId: 'rc-3', sectionId: 'rectify', scene: { id: 'rc-3', type: 'animation' }, lineState: { params: { solidId: 'octahedron', t: 0.5 }, annotation: { text: '八面体整流到同一个', position: 'bottom' } } },
  { lineId: 'fm-1', sectionId: 'family', scene: { id: 'fm-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'icosahedron', t: 0.2 }, annotation: { text: '一根滑块串起三种立体', position: 'top' } } },
  { lineId: 'fm-2', sectionId: 'family', scene: { id: 'fm-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'dodecahedron', t: 0.2764 }, annotation: { text: '棱等长 ✓ 才是阿基米德立体', position: 'bottom' } } },
  { lineId: 'fm-3', sectionId: 'family', scene: { id: 'fm-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'icosahedron', t: 0.3333, showBase: true }, annotation: { text: '蓝色外壳是削之前', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'V′=2E, E′=3E, F′=F+V', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '标准 t 由面的边数决定', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
