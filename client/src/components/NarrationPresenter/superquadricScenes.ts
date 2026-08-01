/**
 * 超二次曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSuperquadricState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const superquadricScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '球与立方体的关系', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { n1: 0.4, n2: 0.4 }, annotation: { text: '秘密藏在指数里', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { n1: 1, n2: 1 }, annotation: { text: 'Barr 1981', position: 'bottom' } } },
  { lineId: 'sg-1', sectionId: 'signed', scene: { id: 'sg-1', type: 'animation' }, lineState: { annotation: { text: '余弦在二三象限为负', position: 'top' } } },
  { lineId: 'sg-2', sectionId: 'signed', scene: { id: 'sg-2', type: 'animation' }, lineState: { annotation: { text: '先取绝对值再乘回符号', position: 'bottom' } } },
  { lineId: 'sg-3', sectionId: 'signed', scene: { id: 'sg-3', type: 'animation' }, lineState: { annotation: { text: '曲面才能完整闭合', position: 'bottom' } } },
  { lineId: 'fm-1', sectionId: 'family', scene: { id: 'fm-1', type: 'animation' }, lineState: { params: { n1: 1, n2: 1 }, annotation: { text: 'n1=n2=1: 标准椭球', position: 'top' } } },
  { lineId: 'fm-2', sectionId: 'family', scene: { id: 'fm-2', type: 'animation' }, lineState: { params: { n1: 0.15, n2: 0.15 }, annotation: { text: '指数趋 0: 立方体', position: 'bottom' } } },
  { lineId: 'fm-3', sectionId: 'family', scene: { id: 'fm-3', type: 'animation' }, lineState: { params: { n1: 3.5, n2: 3.5 }, annotation: { text: 'n=2 八面体, n>3 星形', position: 'bottom' } } },
  { lineId: 'vl-1', sectionId: 'volume', scene: { id: 'vl-1', type: 'animation' }, lineState: { params: { n1: 1, n2: 1 }, annotation: { text: '指数为 1: 体积 4π/3', position: 'top' } } },
  { lineId: 'vl-2', sectionId: 'volume', scene: { id: 'vl-2', type: 'animation' }, lineState: { params: { n1: 2, n2: 2 }, annotation: { text: '趋 0 得 8, 等于 2 得 4/3', position: 'bottom' } } },
  { lineId: 'vl-3', sectionId: 'volume', scene: { id: 'vl-3', type: 'animation' }, lineState: { params: { n1: 2, n2: 2 }, annotation: { text: '数值积分与理论吻合', position: 'bottom' } } },
  { lineId: 'ex-1', sectionId: 'explore', scene: { id: 'ex-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n1: 0.5, n2: 0.5 }, annotation: { text: '拖动两个指数滑块', position: 'top' } } },
  { lineId: 'ex-2', sectionId: 'explore', scene: { id: 'ex-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n1: 1, n2: 0.3 }, annotation: { text: '纵圆横方: 方柱', position: 'bottom' } } },
  { lineId: 'ex-3', sectionId: 'explore', scene: { id: 'ex-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n1: 1, n2: 0.3 }, annotation: { text: '残差始终贴在零上', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '从方到圆到星', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '带符号幂不可省', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
