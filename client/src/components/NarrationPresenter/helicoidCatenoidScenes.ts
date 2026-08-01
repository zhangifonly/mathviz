/**
 * 螺旋面与悬链面 讲解场景配置
 *
 * params.theta 决定画面上曲面处于伴随族的哪个位置(0=螺旋面, PI/2=悬链面),
 * params.morph 为真则让曲面在讲这句时自动来回变形。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultHelicoidCatenoidState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

const H = Math.PI / 2

export const helicoidCatenoidScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-title', type: 'title' }, lineState: { annotation: { text: '肥皂膜的形状', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-minimal', type: 'animation' }, lineState: { params: { theta: H }, annotation: { text: '平均曲率 H ≡ 0', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-morph', type: 'animation' }, lineState: { params: { morph: true }, annotation: { text: '两张面可以互变', position: 'bottom' } } },

  { lineId: 'heli-1', sectionId: 'helicoid', scene: { id: 'heli-shape', type: 'animation' }, lineState: { params: { theta: 0 }, annotation: { text: '螺旋面 · 旋转楼梯', position: 'top' } } },
  { lineId: 'heli-2', sectionId: 'helicoid', scene: { id: 'heli-rulings', type: 'animation' }, lineState: { params: { theta: 0, rulings: true }, annotation: { text: '直纹面 · 由直线织成', position: 'bottom' } } },
  { lineId: 'heli-3', sectionId: 'helicoid', scene: { id: 'heli-catalan', type: 'animation' }, lineState: { params: { theta: 0, rulings: true }, annotation: { text: '唯一的极小直纹面', position: 'bottom' } } },

  { lineId: 'cat-1', sectionId: 'catenoid', scene: { id: 'cat-curve', type: 'animation' }, lineState: { params: { theta: H }, annotation: { text: 'cosh 绕轴旋转', position: 'top' } } },
  { lineId: 'cat-2', sectionId: 'catenoid', scene: { id: 'cat-shape', type: 'animation' }, lineState: { params: { theta: H }, annotation: { text: '两圈之间的肥皂膜', position: 'bottom' } } },
  { lineId: 'cat-3', sectionId: 'catenoid', scene: { id: 'cat-euler', type: 'animation' }, lineState: { params: { theta: H }, annotation: { text: '欧拉 1744 年发现', position: 'bottom' } } },

  { lineId: 'fam-1', sectionId: 'family', scene: { id: 'fam-two', type: 'animation' }, lineState: { params: { morph: true }, annotation: { text: '同一族的两个端点', position: 'top' } } },
  { lineId: 'fam-2', sectionId: 'family', scene: { id: 'fam-theta', type: 'animation' }, lineState: { params: { theta: Math.PI / 4 }, annotation: { text: 'θ = 45° 的中间曲面', position: 'bottom' } } },
  { lineId: 'fam-3', sectionId: 'family', scene: { id: 'fam-minimal', type: 'animation' }, lineState: { params: { morph: true, showH: true }, annotation: { text: '整族都是极小曲面', position: 'bottom' } } },

  { lineId: 'iso-1', sectionId: 'isometry', scene: { id: 'iso-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { morph: true, showForm: true }, annotation: { text: 'E=G, F=0', position: 'top' } } },
  { lineId: 'iso-2', sectionId: 'isometry', scene: { id: 'iso-invariant', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { morph: true, showForm: true }, annotation: { text: '三个系数全程不变', position: 'bottom' } } },
  { lineId: 'iso-3', sectionId: 'isometry', scene: { id: 'iso-ant', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { morph: true, showForm: true }, annotation: { text: '内蕴几何不变', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'H ≡ 0', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-pair', type: 'summary' }, lineState: { annotation: { text: '互为伴随曲面', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
