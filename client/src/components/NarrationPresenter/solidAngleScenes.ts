/**
 * 立体角与球面度 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSolidAngleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const solidAngleScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { presetId: 'octant' }, annotation: { text: '平面角 = 弧长 / r', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { presetId: 'octant' }, annotation: { text: '立体角 = 球面面积 / r²', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { presetId: 'wide' }, annotation: { text: '全空间 = 4π 球面度', position: 'bottom' } } },
  { lineId: 'tp-1', sectionId: 'triple', scene: { id: 'tp-1', type: 'animation' }, lineState: { params: { presetId: 'octant' }, annotation: { text: 'tan(Ω/2) 的分式公式', position: 'top' } } },
  { lineId: 'tp-2', sectionId: 'triple', scene: { id: 'tp-2', type: 'animation' }, lineState: { params: { presetId: 'wide' }, annotation: { text: '分子正是三重积', position: 'bottom' } } },
  { lineId: 'tp-3', sectionId: 'triple', scene: { id: 'tp-3', type: 'animation' }, lineState: { params: { presetId: 'octant' }, annotation: { text: '三正交射线: Ω = π/2 占 12.5%', position: 'bottom' } } },
  { lineId: 'ex-1', sectionId: 'excess', scene: { id: 'ex-1', type: 'animation' }, lineState: { params: { presetId: 'wide' }, annotation: { text: '球面上截出一个三角形', position: 'top' } } },
  { lineId: 'ex-2', sectionId: 'excess', scene: { id: 'ex-2', type: 'animation' }, lineState: { params: { presetId: 'wide' }, annotation: { text: '面积 = 内角和 − π', position: 'bottom' } } },
  { lineId: 'ex-3', sectionId: 'excess', scene: { id: 'ex-3', type: 'animation' }, lineState: { params: { presetId: 'narrow' }, annotation: { text: '两法残差 < 1e-8', position: 'bottom' } } },
  { lineId: 'cn-1', sectionId: 'cone', scene: { id: 'cn-1', type: 'animation' }, lineState: { params: { presetId: 'octant', showCone: true }, annotation: { text: 'Ω = 2π(1 − cos α)', position: 'top' } } },
  { lineId: 'cn-2', sectionId: 'cone', scene: { id: 'cn-2', type: 'animation' }, lineState: { params: { presetId: 'wide', showCone: true }, annotation: { text: 'α=90° 给 2π, α=180° 给 4π', position: 'bottom' } } },
  { lineId: 'cn-3', sectionId: 'cone', scene: { id: 'cn-3', type: 'animation' }, lineState: { params: { presetId: 'wide', showCone: true }, annotation: { text: '紫色圆锥与黄色区域同立体角', position: 'bottom' } } },
  { lineId: 'vt-1', sectionId: 'vertex', scene: { id: 'vt-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'octant' }, annotation: { text: '立方体顶点: Ω = π/2', position: 'top' } } },
  { lineId: 'vt-2', sectionId: 'vertex', scene: { id: 'vt-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'octant' }, annotation: { text: '八顶点和恰为 4π', position: 'bottom' } } },
  { lineId: 'vt-3', sectionId: 'vertex', scene: { id: 'vt-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'flat' }, annotation: { text: '正四面体只有 2.2, 不是定律', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '立体角 = 球面面积 / r²', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '两种算法交叉验证', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
