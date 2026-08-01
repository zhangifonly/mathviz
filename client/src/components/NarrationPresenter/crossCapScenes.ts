/**
 * 交叉帽 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultCrossCapState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const crossCapScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '把对径点两两粘合', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { annotation: { text: '得到实射影平面', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { annotation: { text: '三维里粘不干净', position: 'bottom' } } },
  { lineId: 'why-1', sectionId: 'why', scene: { id: 'why-1', type: 'animation' }, lineState: { annotation: { text: '凑一对不难', position: 'top' } } },
  { lineId: 'why-2', sectionId: 'why', scene: { id: 'why-2', type: 'animation' }, lineState: { annotation: { text: '纸面自己撞上自己', position: 'bottom' } } },
  { lineId: 'why-3', sectionId: 'why', scene: { id: 'why-3', type: 'animation' }, lineState: { annotation: { text: '浸入: 允许自交', position: 'bottom' } } },
  { lineId: 'st-1', sectionId: 'structure', scene: { id: 'st-1', type: 'animation' }, lineState: { annotation: { text: '下方的竖直线段', position: 'top' } } },
  { lineId: 'st-2', sectionId: 'structure', scene: { id: 'st-2', type: 'animation' }, lineState: { params: { height: 1.6 }, annotation: { text: '两端各一个分支点', position: 'bottom' } } },
  { lineId: 'st-3', sectionId: 'structure', scene: { id: 'st-3', type: 'animation' }, lineState: { params: { height: 1.6 }, annotation: { text: '1 条自交线 + 2 个分支点', position: 'bottom' } } },
  { lineId: 'cmp-1', sectionId: 'compare', scene: { id: 'cmp-1', type: 'animation' }, lineState: { annotation: { text: '罗马曲面: 3 线 6 点', position: 'top' } } },
  { lineId: 'cmp-2', sectionId: 'compare', scene: { id: 'cmp-2', type: 'animation' }, lineState: { annotation: { text: '博伊曲面: 0 个分支点', position: 'bottom' } } },
  { lineId: 'cmp-3', sectionId: 'compare', scene: { id: 'cmp-3', type: 'animation' }, lineState: { annotation: { text: '同一曲面的三张面孔', position: 'bottom' } } },
  { lineId: 'exp-1', sectionId: 'explore', scene: { id: 'exp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { height: 0.5 }, annotation: { text: '拖动高度滑块', position: 'top' } } },
  { lineId: 'exp-2', sectionId: 'explore', scene: { id: 'exp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { height: 1.9 }, annotation: { text: '自交结构不变', position: 'bottom' } } },
  { lineId: 'exp-3', sectionId: 'explore', scene: { id: 'exp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { height: 1.9 }, annotation: { text: '拓扑不变性', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '对径点粘合而成', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '一条自交线两个分支点', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
