/**
 * 博弈论讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGameTheoryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gameTheoryScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { diagram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-gas-station', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '加油站定价', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-arms-race', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '军备竞赛困境', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-tool', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '策略互动的数学', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-interaction', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '策略互动', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-maximize', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '最大化自己收益', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-nash', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['nash'],
      annotation: { text: '纳什均衡', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-nobel', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '约翰·纳什 (1950)', position: 'bottom' },
    },
  },

  // ========== prisoner 段落 (4行) ==========
  {
    lineId: 'prisoner-1',
    sectionId: 'prisoner',
    scene: { id: 'prisoner-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '囚徒困境', position: 'top' },
    },
  },
  {
    lineId: 'prisoner-2',
    sectionId: 'prisoner',
    scene: { id: 'prisoner-setup', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '分开审讯', position: 'bottom' },
    },
  },
  {
    lineId: 'prisoner-3',
    sectionId: 'prisoner',
    scene: { id: 'prisoner-payoff', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '收益矩阵', position: 'bottom' },
    },
  },
  {
    lineId: 'prisoner-4',
    sectionId: 'prisoner',
    scene: { id: 'prisoner-result', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['defect-defect'],
      annotation: { text: '双方背叛', position: 'bottom' },
    },
  },

  // ========== nash 段落 (4行) ==========
  {
    lineId: 'nash-1',
    sectionId: 'nash',
    scene: { id: 'nash-equilibrium', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['equilibrium'],
      annotation: { text: '纳什均衡点', position: 'top' },
    },
  },
  {
    lineId: 'nash-2',
    sectionId: 'nash',
    scene: { id: 'nash-stable', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '单独改变会更糟', position: 'bottom' },
    },
  },
  {
    lineId: 'nash-3',
    sectionId: 'nash',
    scene: { id: 'nash-not-optimal', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '不一定最优', position: 'bottom' },
    },
  },
  {
    lineId: 'nash-4',
    sectionId: 'nash',
    scene: { id: 'nash-theorem', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '纳什定理', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '广泛应用', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-economics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '经济学', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-politics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '政治学', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-biology', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '生物学', position: 'bottom' },
    },
  },

  // ========== summary 段落 (4行) ==========
  {
    lineId: 'sum-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'sum-2',
    sectionId: 'summary',
    scene: { id: 'summary-decision', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '理性决策', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-paradox', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '个体理性→集体非理性', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-4',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '感谢观看!', position: 'bottom' },
    },
  },
]
