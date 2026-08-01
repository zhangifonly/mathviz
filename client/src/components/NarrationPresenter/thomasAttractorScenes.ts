/**
 * 托马斯吸引子 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultThomasAttractorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const thomasAttractorScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '正弦循环驱动', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { b: 0.208186 }, annotation: { text: '驱动与阻尼的拉锯', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { b: 0.208186, showDiag: true }, annotation: { text: '一个参数走完三种状态', position: 'bottom' } } },
  { lineId: 'dm-1', sectionId: 'damped', scene: { id: 'dm-1', type: 'animation' }, lineState: { params: { b: 0.5, showDiag: true }, annotation: { text: 'b=0.5: 阻尼压倒驱动', position: 'top' } } },
  { lineId: 'dm-2', sectionId: 'damped', scene: { id: 'dm-2', type: 'animation' }, lineState: { params: { b: 0.5, showDiag: true }, annotation: { text: 'λ₁=−0.34, 收敛到原点', position: 'bottom' } } },
  { lineId: 'dm-3', sectionId: 'damped', scene: { id: 'dm-3', type: 'animation' }, lineState: { params: { b: 0.5, showDiag: true }, annotation: { text: '完全可预测', position: 'bottom' } } },
  { lineId: 'cy-1', sectionId: 'cycle', scene: { id: 'cy-1', type: 'animation' }, lineState: { params: { b: 0.32, showDiag: true }, annotation: { text: 'b=0.32: 落在闭环上', position: 'top' } } },
  { lineId: 'cy-2', sectionId: 'cycle', scene: { id: 'cy-2', type: 'animation' }, lineState: { params: { b: 0.32, showDiag: true }, annotation: { text: '极限环, λ₁≈0', position: 'bottom' } } },
  { lineId: 'cy-3', sectionId: 'cycle', scene: { id: 'cy-3', type: 'animation' }, lineState: { params: { b: 0.32, showDiag: true }, annotation: { text: '周期性的可预测', position: 'bottom' } } },
  { lineId: 'ch-1', sectionId: 'chaos', scene: { id: 'ch-1', type: 'animation' }, lineState: { params: { b: 0.208186, showDiag: true }, annotation: { text: 'b=0.208: 放弃周期性', position: 'top' } } },
  { lineId: 'ch-2', sectionId: 'chaos', scene: { id: 'ch-2', type: 'animation' }, lineState: { params: { b: 0.208186, showDiag: true }, annotation: { text: 'λ₁=+0.031, 混沌', position: 'bottom' } } },
  { lineId: 'ch-3', sectionId: 'chaos', scene: { id: 'ch-3', type: 'animation' }, lineState: { params: { b: 0.1, showDiag: true }, annotation: { text: 'b=0.1: 混沌更强', position: 'bottom' } } },
  { lineId: 'bd-1', sectionId: 'bounded', scene: { id: 'bd-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { b: 0.1 }, annotation: { text: '为什么不飞到无穷?', position: 'top' } } },
  { lineId: 'bd-2', sectionId: 'bounded', scene: { id: 'bd-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { b: 0.1 }, annotation: { text: '正弦有界于 1', position: 'bottom' } } },
  { lineId: 'bd-3', sectionId: 'bounded', scene: { id: 'bd-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { b: 0.15, showDiag: true }, annotation: { text: '困在 |x| ≤ 1/b 内', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '阻尼 b 控制全局', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '不动点→极限环→混沌', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
