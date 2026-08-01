/**
 * 环面纽结管 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultTorusKnotSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const torusKnotSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '在甜甜圈表面画闭曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { p: 2, q: 3 }, annotation: { text: '绕孔 q 圈, 绕管 p 圈', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInv: true }, annotation: { text: '套上圆管成实体纽结', position: 'bottom' } } },
  { lineId: 'wh-1', sectionId: 'why', scene: { id: 'wh-1', type: 'animation' }, lineState: { params: { p: 3, q: 4, showInv: true }, annotation: { text: '一般纽结要查表', position: 'top' } } },
  { lineId: 'wh-2', sectionId: 'why', scene: { id: 'wh-2', type: 'animation' }, lineState: { params: { p: 3, q: 4, showInv: true }, annotation: { text: '环面纽结有现成公式', position: 'bottom' } } },
  { lineId: 'wh-3', sectionId: 'why', scene: { id: 'wh-3', type: 'animation' }, lineState: { params: { p: 3, q: 5, showInv: true }, annotation: { text: '纽结理论最好的教材', position: 'bottom' } } },
  { lineId: 'fm-1', sectionId: 'formulas', scene: { id: 'fm-1', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInv: true }, annotation: { text: '交叉数 min(p(q−1), q(p−1))', position: 'top' } } },
  { lineId: 'fm-2', sectionId: 'formulas', scene: { id: 'fm-2', type: 'animation' }, lineState: { params: { p: 2, q: 5, showInv: true }, annotation: { text: '亏格 (p−1)(q−1)/2', position: 'bottom' } } },
  { lineId: 'fm-3', sectionId: 'formulas', scene: { id: 'fm-3', type: 'animation' }, lineState: { params: { p: 3, q: 5, showInv: true }, annotation: { text: '桥数 min(p,q)', position: 'bottom' } } },
  { lineId: 'gc-1', sectionId: 'gcd', scene: { id: 'gc-1', type: 'animation' }, lineState: { params: { p: 2, q: 3, showInv: true }, annotation: { text: '有公因数则提前闭合', position: 'top' } } },
  { lineId: 'gc-2', sectionId: 'gcd', scene: { id: 'gc-2', type: 'animation' }, lineState: { params: { p: 2, q: 6, showInv: true }, annotation: { text: '分支数 = gcd(p,q)', position: 'bottom' } } },
  { lineId: 'gc-3', sectionId: 'gcd', scene: { id: 'gc-3', type: 'animation' }, lineState: { params: { p: 2, q: 6, showInv: true }, annotation: { text: '切到 (2,6): 两个分支', position: 'bottom' } } },
  { lineId: 'sy-1', sectionId: 'symmetry', scene: { id: 'sy-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 2, q: 3, showInv: true }, annotation: { text: '先看 (2,3)', position: 'top' } } },
  { lineId: 'sy-2', sectionId: 'symmetry', scene: { id: 'sy-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 3, q: 2, showInv: true }, annotation: { text: '三个公式交换 p,q 不变', position: 'bottom' } } },
  { lineId: 'sy-3', sectionId: 'symmetry', scene: { id: 'sy-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 2, q: 3, showInv: true }, annotation: { text: '环面翻过来即互换', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '两个整数完全决定', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '不变量都有现成公式', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
