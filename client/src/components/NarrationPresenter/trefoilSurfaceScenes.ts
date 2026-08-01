/**
 * 三叶结曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultTrefoilSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const trefoilSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '打个结再粘住两端', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { p: 2, q: 3 }, annotation: { text: '拉不开不等于证明', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInfo: true }, annotation: { text: '要找不变量', position: 'bottom' } } },
  { lineId: 'cr-1', sectionId: 'crossing', scene: { id: 'cr-1', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInfo: true }, annotation: { text: '数投影上的交叉', position: 'top' } } },
  { lineId: 'cr-2', sectionId: 'crossing', scene: { id: 'cr-2', type: 'animation' }, lineState: { params: { p: 2, q: 3 }, annotation: { text: '平凡纽结交叉数为 0', position: 'bottom' } } },
  { lineId: 'cr-3', sectionId: 'crossing', scene: { id: 'cr-3', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInfo: true }, annotation: { text: '三叶结交叉数为 3', position: 'bottom' } } },
  { lineId: 'pl-1', sectionId: 'polynomial', scene: { id: 'pl-1', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInfo: true }, annotation: { text: '更实用: 亚历山大多项式', position: 'top' } } },
  { lineId: 'pl-2', sectionId: 'polynomial', scene: { id: 'pl-2', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInfo: true }, annotation: { text: '平凡结恒为 1', position: 'bottom' } } },
  { lineId: 'pl-3', sectionId: 'polynomial', scene: { id: 'pl-3', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInfo: true }, annotation: { text: 't=1 时两者都为 1', position: 'bottom' } } },
  { lineId: 'tk-1', sectionId: 'torusknot', scene: { id: 'tk-1', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInfo: true }, annotation: { text: '绕 p 圈经线 q 圈纬线', position: 'top' } } },
  { lineId: 'tk-2', sectionId: 'torusknot', scene: { id: 'tk-2', type: 'animation' }, lineState: { params: { p: 2, q: 5, showInfo: true }, annotation: { text: '(2,5): 五叶结', position: 'bottom' } } },
  { lineId: 'tk-3', sectionId: 'torusknot', scene: { id: 'tk-3', type: 'animation' }, lineState: { params: { p: 3, q: 4, showInfo: true }, annotation: { text: 'p 与 q 必须互素', position: 'bottom' } } },
  { lineId: 'lk-1', sectionId: 'link', scene: { id: 'lk-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 2, q: 4, showInfo: true }, annotation: { text: '切到 (2,4)', position: 'top' } } },
  { lineId: 'lk-2', sectionId: 'link', scene: { id: 'lk-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 2, q: 4, showInfo: true }, annotation: { text: '两根绳子套在一起', position: 'bottom' } } },
  { lineId: 'lk-3', sectionId: 'link', scene: { id: 'lk-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 2, q: 3, showInfo: true }, annotation: { text: '三叶结有左右手两版', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '交叉数为 3', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'Δ(t) = t²−t+1 ≠ 1', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
