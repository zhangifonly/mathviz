/**
 * Cavalieri 原理 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultCavalieriState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const cavalieriScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { sceneId: 'prism', h: 1 }, annotation: { text: '一摞纸', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { sceneId: 'prism', h: 1, exploded: true }, annotation: { text: '推歪后每张纸面积不变', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { sceneId: 'prism', h: 1.4 }, annotation: { text: '截面积处处相等 ⟹ 体积相等', position: 'bottom' } } },
  { lineId: 'py-1', sectionId: 'pyramid', scene: { id: 'py-1', type: 'animation' }, lineState: { params: { sceneId: 'pyramid', h: 0.4 }, annotation: { text: '棱锥 = 底面积 × 高 ÷ 3', position: 'top' } } },
  { lineId: 'py-2', sectionId: 'pyramid', scene: { id: 'py-2', type: 'animation' }, lineState: { params: { sceneId: 'pyramid', h: 1.0 }, annotation: { text: '截面按 (1−h/H) 缩小', position: 'bottom' } } },
  { lineId: 'py-3', sectionId: 'pyramid', scene: { id: 'py-3', type: 'animation' }, lineState: { params: { sceneId: 'pyramid', h: 1.6 }, annotation: { text: '面积按平方缩小，积分给出 1/3', position: 'bottom' } } },
  { lineId: 'sm-1', sectionId: 'same', scene: { id: 'sm-1', type: 'animation' }, lineState: { params: { sceneId: 'pyramid', h: 0.3 }, annotation: { text: '棱锥与圆锥同底同高', position: 'top' } } },
  { lineId: 'sm-2', sectionId: 'same', scene: { id: 'sm-2', type: 'animation' }, lineState: { params: { sceneId: 'pyramid', h: 1.2 }, annotation: { text: '两片截面始终相等', position: 'bottom' } } },
  { lineId: 'sm-3', sectionId: 'same', scene: { id: 'sm-3', type: 'animation' }, lineState: { params: { sceneId: 'pyramid', h: 1.8 }, annotation: { text: '把难算的换成好算的', position: 'bottom' } } },
  { lineId: 'sp-1', sectionId: 'sphere', scene: { id: 'sp-1', type: 'animation' }, lineState: { params: { sceneId: 'sphere', h: 0 }, annotation: { text: '阿基米德要算球体积', position: 'top' } } },
  { lineId: 'sp-2', sectionId: 'sphere', scene: { id: 'sp-2', type: 'animation' }, lineState: { params: { sceneId: 'sphere', h: 0.3 }, annotation: { text: '半球截面：π(r²−h²)', position: 'bottom' } } },
  { lineId: 'sp-3', sectionId: 'sphere', scene: { id: 'sp-3', type: 'animation' }, lineState: { params: { sceneId: 'sphere', h: 0.3 }, annotation: { text: '碗的截面是环，面积相同', position: 'bottom' } } },
  { lineId: 'ar-1', sectionId: 'archimedes', scene: { id: 'ar-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sceneId: 'sphere', h: 0.7 }, annotation: { text: '拖动滑块，偏差始终为 0', position: 'top' } } },
  { lineId: 'ar-2', sectionId: 'archimedes', scene: { id: 'ar-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sceneId: 'sphere', h: 0.9 }, annotation: { text: '半球 = 圆柱 − 圆锥 = 2πr³/3', position: 'bottom' } } },
  { lineId: 'ar-3', sectionId: 'archimedes', scene: { id: 'ar-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sceneId: 'sphere', h: 0.5 }, annotation: { text: '球:圆柱 = 2:3，刻在墓碑上', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '截面相等 ⟹ 体积相等', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '棱锥 1/3 来自平方积分', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
