/**
 * 超环面族 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSupertoroidState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const supertoroidScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { e1: 1, e2: 1 }, annotation: { text: '甜甜圈: 两个半径', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { e1: 1, e2: 1 }, annotation: { text: '再加两个形状指数', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { e1: 0.3, e2: 0.3 }, annotation: { text: '有样东西始终不变', position: 'bottom' } } },
  { lineId: 'tw-1', sectionId: 'two', scene: { id: 'tw-1', type: 'animation' }, lineState: { params: { e1: 1, e2: 1 }, annotation: { text: 'e1 作用在绕轴角度上', position: 'top' } } },
  { lineId: 'tw-2', sectionId: 'two', scene: { id: 'tw-2', type: 'animation' }, lineState: { params: { e1: 0.25, e2: 1 }, annotation: { text: '俯视从圆变方框', position: 'bottom' } } },
  { lineId: 'tw-3', sectionId: 'two', scene: { id: 'tw-3', type: 'animation' }, lineState: { params: { e1: 1, e2: 0.25 }, annotation: { text: 'e2 调小: 圆管变方管', position: 'bottom' } } },
  { lineId: 'iv-1', sectionId: 'invariant', scene: { id: 'iv-1', type: 'animation' }, lineState: { params: { e1: 0.3, e2: 0.3 }, annotation: { text: '洞一直都在', position: 'top' } } },
  { lineId: 'iv-2', sectionId: 'invariant', scene: { id: 'iv-2', type: 'animation' }, lineState: { params: { e1: 0.3, e2: 0.3 }, annotation: { text: '亏格 1, χ = 0', position: 'bottom' } } },
  { lineId: 'iv-3', sectionId: 'invariant', scene: { id: 'iv-3', type: 'animation' }, lineState: { params: { e1: 1, e2: 2 }, annotation: { text: 'z 范围恒为 ±r', position: 'bottom' } } },
  { lineId: 'tp-1', sectionId: 'topology', scene: { id: 'tp-1', type: 'animation' }, lineState: { params: { e1: 0.25, e2: 0.25 }, annotation: { text: '几何: 形状长度角度', position: 'top' } } },
  { lineId: 'tp-2', sectionId: 'topology', scene: { id: 'tp-2', type: 'animation' }, lineState: { params: { e1: 1, e2: 1 }, annotation: { text: '拓扑: 连通性与洞数', position: 'bottom' } } },
  { lineId: 'tp-3', sectionId: 'topology', scene: { id: 'tp-3', type: 'animation' }, lineState: { params: { e1: 1, e2: 1 }, annotation: { text: '分不清咖啡杯与甜甜圈', position: 'bottom' } } },
  { lineId: 'ex-1', sectionId: 'explore', scene: { id: 'ex-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { e1: 0.4, e2: 1 }, annotation: { text: '分别拖两个滑块', position: 'top' } } },
  { lineId: 'ex-2', sectionId: 'explore', scene: { id: 'ex-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { e1: 1, e2: 1 }, annotation: { text: '洞闭合则拓扑改变', position: 'bottom' } } },
  { lineId: 'ex-3', sectionId: 'explore', scene: { id: 'ex-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { e1: 2, e2: 1 }, annotation: { text: '始终是亏格 1 的环面', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '两个指数各管一事', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '亏格恒 1, χ 恒 0', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
