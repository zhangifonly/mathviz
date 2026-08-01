/**
 * 8字形克莱因瓶 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultKleinBottleFigure8State: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const kleinBottleFigure8Scenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '瓶状浸入之外的另一种', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: '更像打结的环形管道', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: '同一个拓扑曲面', position: 'bottom' } } },
  { lineId: 'sc-1', sectionId: 'section', scene: { id: 'sc-1', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: '截面: (sin v, sin 2v)', position: 'top' } } },
  { lineId: 'sc-2', sectionId: 'section', scene: { id: 'sc-2', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: 'v=0 与 v=π 都过原点', position: 'bottom' } } },
  { lineId: 'sc-3', sectionId: 'section', scene: { id: 'sc-3', type: 'animation' }, lineState: { params: { a: 2.4 }, annotation: { text: '沿圆周搬运一圈', position: 'bottom' } } },
  { lineId: 'tw-1', sectionId: 'twist', scene: { id: 'tw-1', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: '转速只有搬运的一半', position: 'top' } } },
  { lineId: 'tw-2', sectionId: 'twist', scene: { id: 'tw-2', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: '一整圈只转半圈', position: 'bottom' } } },
  { lineId: 'tw-3', sectionId: 'twist', scene: { id: 'tw-3', type: 'animation' }, lineState: { params: { a: 1.7 }, annotation: { text: '与莫比乌斯带同机制', position: 'bottom' } } },
  { lineId: 'gl-1', sectionId: 'gluing', scene: { id: 'gl-1', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: 'u+2π 不回原处', position: 'top' } } },
  { lineId: 'gl-2', sectionId: 'gluing', scene: { id: 'gl-2', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: '朴素闭合偏差 2.35', position: 'bottom' } } },
  { lineId: 'gl-3', sectionId: 'gluing', scene: { id: 'gl-3', type: 'animation' }, lineState: { params: { a: 2 }, annotation: { text: 'v 取反后降到 1e-16', position: 'bottom' } } },
  { lineId: 'iv-1', sectionId: 'invariant', scene: { id: 'iv-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 2.2 }, annotation: { text: 'χ 与环面都是 0', position: 'top' } } },
  { lineId: 'iv-2', sectionId: 'invariant', scene: { id: 'iv-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 2.2 }, annotation: { text: '但可定向性不同', position: 'bottom' } } },
  { lineId: 'iv-3', sectionId: 'invariant', scene: { id: 'iv-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 2 }, annotation: { text: '两个独立的不变量', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '8 字截面转半圈', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '粘合需 v 取反', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
