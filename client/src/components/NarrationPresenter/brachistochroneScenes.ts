/**
 * 最速降线讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultBrachistochroneState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const brachistochroneScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-drop', type: 'title' }, lineState: { annotation: { text: '最速降线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-line', type: 'animation' }, lineState: { annotation: { text: '直线最短?', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { annotation: { text: '最短≠最快', position: 'bottom' } } },

  { lineId: 'prob-1', sectionId: 'problem', scene: { id: 'prob-challenge', type: 'animation' }, lineState: { annotation: { text: '伯努利的挑战', position: 'top' } } },
  { lineId: 'prob-2', sectionId: 'problem', scene: { id: 'prob-newton', type: 'animation' }, lineState: { annotation: { text: '牛顿一夜解出', position: 'bottom' } } },
  { lineId: 'prob-3', sectionId: 'problem', scene: { id: 'prob-varcalc', type: 'animation' }, lineState: { annotation: { text: '变分法诞生', position: 'bottom' } } },

  { lineId: 'en-1', sectionId: 'energy', scene: { id: 'en-cons', type: 'animation' }, lineState: { annotation: { text: '速度来自高度', position: 'top' } } },
  { lineId: 'en-2', sectionId: 'energy', scene: { id: 'en-steep', type: 'animation' }, lineState: { annotation: { text: '先陡后缓', position: 'bottom' } } },
  { lineId: 'en-3', sectionId: 'energy', scene: { id: 'en-faster', type: 'animation' }, lineState: { annotation: { text: '弯路更快', position: 'bottom' } } },

  { lineId: 'cyc-1', sectionId: 'cycloid', scene: { id: 'cyc-curve', type: 'animation' }, lineState: { annotation: { text: '答案是摆线', position: 'top' } } },
  { lineId: 'cyc-2', sectionId: 'cycloid', scene: { id: 'cyc-race', type: 'animation' }, lineState: { annotation: { text: '摆线球最先到', position: 'bottom' } } },
  { lineId: 'cyc-3', sectionId: 'cycloid', scene: { id: 'cyc-tauto', type: 'animation' }, lineState: { annotation: { text: '等时曲线', position: 'bottom' } } },

  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-watch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { annotation: { text: '三球竞速', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { annotation: { text: '摆线最快', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '最短≠最快', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-history', type: 'summary' }, lineState: { annotation: { text: '变分法之源', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
