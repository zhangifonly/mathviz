/**
 * 伪球面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultPseudosphereState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pseudosphereScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '球面: 常正曲率', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { annotation: { text: '有没有常负曲率的面?', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { annotation: { text: '伪球面 K = -1/a²', position: 'bottom' } } },
  { lineId: 'tract-1', sectionId: 'tractrix', scene: { id: 'tract-1', type: 'animation' }, lineState: { annotation: { text: '曳物线: 拖石头的轨迹', position: 'top' } } },
  { lineId: 'tract-2', sectionId: 'tractrix', scene: { id: 'tract-2', type: 'animation' }, lineState: { annotation: { text: '切线段长恒等于绳长', position: 'bottom' } } },
  { lineId: 'tract-3', sectionId: 'tractrix', scene: { id: 'tract-3', type: 'animation' }, lineState: { annotation: { text: '永远靠近却碰不到渐近线', position: 'bottom' } } },
  { lineId: 'surf-1', sectionId: 'surface', scene: { id: 'surf-1', type: 'animation' }, lineState: { annotation: { text: '绕渐近线旋转一圈', position: 'top' } } },
  { lineId: 'surf-2', sectionId: 'surface', scene: { id: 'surf-2', type: 'animation' }, lineState: { annotation: { text: '曲率与位置无关', position: 'bottom' } } },
  { lineId: 'surf-3', sectionId: 'surface', scene: { id: 'surf-3', type: 'animation' }, lineState: { annotation: { text: '总面积 = 4πa²', position: 'bottom' } } },
  { lineId: 'hyp-1', sectionId: 'hyperbolic', scene: { id: 'hyp-1', type: 'animation' }, lineState: { annotation: { text: '平行公理之争', position: 'top' } } },
  { lineId: 'hyp-2', sectionId: 'hyperbolic', scene: { id: 'hyp-2', type: 'animation' }, lineState: { annotation: { text: '贝尔特拉米 1868', position: 'bottom' } } },
  { lineId: 'hyp-3', sectionId: 'hyperbolic', scene: { id: 'hyp-3', type: 'animation' }, lineState: { annotation: { text: '非欧几何落地', position: 'bottom' } } },
  { lineId: 'lim-1', sectionId: 'limit', scene: { id: 'lim-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { annotation: { text: '拖动改变半径', position: 'top' } } },
  { lineId: 'lim-2', sectionId: 'limit', scene: { id: 'lim-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { annotation: { text: '腰部那圈边缘去不掉', position: 'bottom' } } },
  { lineId: 'lim-3', sectionId: 'limit', scene: { id: 'lim-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { annotation: { text: '希尔伯特定理', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '曳物线旋转成面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '双曲几何的局部模型', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
