/**
 * 多面体截面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultPolyhedronSliceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const polyhedronSliceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { presetId: 'cube-square' }, annotation: { text: '用平面切开立方体', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { presetId: 'cube-square' }, annotation: { text: '平行于面切：正方形', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { presetId: 'cube-hex' }, annotation: { text: '沿体对角线：正六边形', position: 'bottom' } } },
  { lineId: 'al-1', sectionId: 'algorithm', scene: { id: 'al-1', type: 'animation' }, lineState: { params: { presetId: 'cube-hex' }, annotation: { text: '逐面求交线段', position: 'top' } } },
  { lineId: 'al-2', sectionId: 'algorithm', scene: { id: 'al-2', type: 'animation' }, lineState: { params: { presetId: 'cube-hex' }, annotation: { text: '两端异号则棱穿过平面', position: 'bottom' } } },
  { lineId: 'al-3', sectionId: 'algorithm', scene: { id: 'al-3', type: 'animation' }, lineState: { params: { presetId: 'octa-hex' }, annotation: { text: '线段必须接成环', position: 'bottom' } } },
  { lineId: 'hx-1', sectionId: 'hexagon', scene: { id: 'hx-1', type: 'animation' }, lineState: { params: { presetId: 'cube-hex' }, annotation: { text: '体对角线是三重对称轴', position: 'top' } } },
  { lineId: 'hx-2', sectionId: 'hexagon', scene: { id: 'hx-2', type: 'animation' }, lineState: { params: { presetId: 'cube-hex' }, annotation: { text: '转 120° 立方体回到自己', position: 'bottom' } } },
  { lineId: 'hx-3', sectionId: 'hexagon', scene: { id: 'hx-3', type: 'animation' }, lineState: { params: { presetId: 'cube-hex' }, annotation: { text: '边长极差 0，内角 120°', position: 'bottom' } } },
  { lineId: 'sw-1', sectionId: 'sweep', scene: { id: 'sw-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'cube-tri' }, annotation: { text: '拖动位置滑块', position: 'top' } } },
  { lineId: 'sw-2', sectionId: 'sweep', scene: { id: 'sw-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'cube-tri' }, annotation: { text: '切到角：正三角形', position: 'bottom' } } },
  { lineId: 'sw-3', sectionId: 'sweep', scene: { id: 'sw-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'cube-hex' }, annotation: { text: '只有中心那刀是正六边形', position: 'bottom' } } },
  { lineId: 'ot-1', sectionId: 'others', scene: { id: 'ot-1', type: 'animation' }, lineState: { params: { presetId: 'tetra-square' }, annotation: { text: '四面体切出正方形', position: 'top' } } },
  { lineId: 'ot-2', sectionId: 'others', scene: { id: 'ot-2', type: 'animation' }, lineState: { params: { presetId: 'octa-hex' }, annotation: { text: '八面体也切出正六边形', position: 'bottom' } } },
  { lineId: 'ot-3', sectionId: 'others', scene: { id: 'ot-3', type: 'animation' }, lineState: { params: { presetId: 'cube-hex' }, annotation: { text: '边数 ≤ 面数', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '逐面求交，线段接成环', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '立方体切正六边形', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
