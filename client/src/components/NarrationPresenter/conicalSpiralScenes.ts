/**
 * 圆锥螺线 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultConicalSpiralState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const conicalSpiralScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '平面上的对数螺线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { a: 0.628 }, annotation: { text: '把它抬到圆锥表面', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { a: 0.628 }, annotation: { text: '高度与半径成正比', position: 'bottom' } } },
  { lineId: 'cn-1', sectionId: 'cone', scene: { id: 'cn-1', type: 'animation' }, lineState: { params: { a: 0.628 }, annotation: { text: '圆锥面方程', position: 'top' } } },
  { lineId: 'cn-2', sectionId: 'cone', scene: { id: 'cn-2', type: 'animation' }, lineState: { params: { a: 0.628 }, annotation: { text: '残差 1e-14 量级', position: 'bottom' } } },
  { lineId: 'cn-3', sectionId: 'cone', scene: { id: 'cn-3', type: 'animation' }, lineState: { params: { a: 0.45 }, annotation: { text: '无限逼近顶点但不到达', position: 'bottom' } } },
  { lineId: 'pj-1', sectionId: 'projection', scene: { id: 'pj-1', type: 'animation' }, lineState: { params: { a: 0.628 }, annotation: { text: '压回去应还是对数螺线', position: 'top' } } },
  { lineId: 'pj-2', sectionId: 'projection', scene: { id: 'pj-2', type: 'animation' }, lineState: { params: { a: 0.628 }, annotation: { text: '算点到竖轴的距离', position: 'bottom' } } },
  { lineId: 'pj-3', sectionId: 'projection', scene: { id: 'pj-3', type: 'animation' }, lineState: { params: { a: 0.628 }, annotation: { text: '偏差 1e-16 量级', position: 'bottom' } } },
  { lineId: 'eq-1', sectionId: 'equiangular', scene: { id: 'eq-1', type: 'animation' }, lineState: { params: { a: 0.628 }, annotation: { text: '对数螺线的等角性', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equiangular', scene: { id: 'eq-2', type: 'animation' }, lineState: { params: { a: 0.9 }, annotation: { text: '母线是从顶点出发的直线', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equiangular', scene: { id: 'eq-3', type: 'animation' }, lineState: { params: { a: 0.9 }, annotation: { text: '夹角误差到小数点后八位', position: 'bottom' } } },
  { lineId: 'tn-1', sectionId: 'tune', scene: { id: 'tn-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 0.4 }, annotation: { text: '角小则锥尖而高', position: 'top' } } },
  { lineId: 'tn-2', sectionId: 'tune', scene: { id: 'tn-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.1 }, annotation: { text: '角大则锥扁而平', position: 'bottom' } } },
  { lineId: 'tn-3', sectionId: 'tune', scene: { id: 'tn-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 0.628 }, annotation: { text: '但夹角始终是常数', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '对数螺线抬上圆锥', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '与母线夹角恒定', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
