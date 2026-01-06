/**
 * 马尔可夫链讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMarkovChainState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const markovChainScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-weather', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '天气预报', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-pagerank', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '网页排名', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-markov', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '马尔可夫链', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-process', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '随机过程', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-memoryless', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '无记忆性', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-matrix', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '转移矩阵', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-example', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '简单例子', position: 'bottom' },
    },
  },

  // ========== transition 段落 (4行) ==========
  {
    lineId: 'trans-1',
    sectionId: 'transition',
    scene: { id: 'trans-weather', type: 'animation' },
    lineState: {
      params: { states: ['sunny', 'rainy'] },
      show: { diagram: true },
      annotation: { text: '晴天和雨天', position: 'top' },
    },
  },
  {
    lineId: 'trans-2',
    sectionId: 'transition',
    scene: { id: 'trans-sunny', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['sunny-sunny'],
      annotation: { text: '晴→晴 70%', position: 'bottom' },
    },
  },
  {
    lineId: 'trans-3',
    sectionId: 'transition',
    scene: { id: 'trans-rainy', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['rainy-rainy'],
      annotation: { text: '雨→雨 60%', position: 'bottom' },
    },
  },
  {
    lineId: 'trans-4',
    sectionId: 'transition',
    scene: { id: 'trans-matrix', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '转移矩阵', position: 'bottom' },
    },
  },

  // ========== steady-state 段落 (4行) ==========
  {
    lineId: 'steady-1',
    sectionId: 'steady-state',
    scene: { id: 'steady-converge', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '趋向稳态', position: 'top' },
    },
  },
  {
    lineId: 'steady-2',
    sectionId: 'steady-state',
    scene: { id: 'steady-no-change', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '概率不再变化', position: 'bottom' },
    },
  },
  {
    lineId: 'steady-3',
    sectionId: 'steady-state',
    scene: { id: 'steady-eigen', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '特征向量', position: 'bottom' },
    },
  },
  {
    lineId: 'steady-4',
    sectionId: 'steady-state',
    scene: { id: 'steady-tool', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '分析长期行为', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '重要应用', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-pagerank', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'Google PageRank', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-nlp', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '语音识别和NLP', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-finance', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '金融建模', position: 'bottom' },
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
    scene: { id: 'summary-markov', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '马尔可夫性质', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-steady', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '稳态分布', position: 'bottom' },
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
