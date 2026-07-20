/**
 * 骰子与古典概率讲解场景配置
 * 每句口播对应骰子数量与投掷次数（params.numDice / params.trials）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDiceProbabilityState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const diceProbabilityScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '骰子与古典概率', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fair', type: 'animation' }, lineState: { params: { numDice: 1, trials: 0 }, annotation: { text: '每面机会相等', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-start', type: 'animation' }, lineState: { params: { numDice: 1, trials: 0 }, annotation: { text: '从掷骰子出发', position: 'bottom' } } },

  // ===== classical (3) =====
  { lineId: 'cls-1', sectionId: 'classical', scene: { id: 'cls-sym', type: 'animation' }, lineState: { params: { numDice: 1, trials: 0 }, annotation: { text: '六面对称', position: 'top' } } },
  { lineId: 'cls-2', sectionId: 'classical', scene: { id: 'cls-def', type: 'animation' }, lineState: { params: { numDice: 1, trials: 0 }, annotation: { text: '有利数÷总数', position: 'bottom' } } },
  { lineId: 'cls-3', sectionId: 'classical', scene: { id: 'cls-sixth', type: 'animation' }, lineState: { params: { numDice: 1, trials: 0 }, annotation: { text: 'P=1/6', position: 'bottom' } } },

  // ===== distribution (3) =====
  { lineId: 'dist-1', sectionId: 'distribution', scene: { id: 'dist-two', type: 'animation' }, lineState: { params: { numDice: 2, trials: 0 }, annotation: { text: '看两点之和', position: 'top' } } },
  { lineId: 'dist-2', sectionId: 'distribution', scene: { id: 'dist-edge', type: 'animation' }, lineState: { params: { numDice: 2, trials: 0 }, annotation: { text: '2 和 12 最稀少', position: 'bottom' } } },
  { lineId: 'dist-3', sectionId: 'distribution', scene: { id: 'dist-peak', type: 'animation' }, lineState: { params: { numDice: 2, trials: 0 }, annotation: { text: '7 居中最高', position: 'top' } } },

  // ===== law (3) =====
  { lineId: 'law-1', sectionId: 'law', scene: { id: 'law-noise', type: 'animation' }, lineState: { params: { numDice: 2, trials: 100 }, annotation: { text: '少量时波动', position: 'top' } } },
  { lineId: 'law-2', sectionId: 'law', scene: { id: 'law-converge', type: 'animation' }, lineState: { params: { numDice: 2, trials: 10000 }, annotation: { text: '越多越贴近', position: 'bottom' } } },
  { lineId: 'law-3', sectionId: 'law', scene: { id: 'law-name', type: 'animation' }, lineState: { params: { numDice: 2, trials: 100000 }, annotation: { text: '大数定律', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-trials', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { numDice: 2, trials: 100000 }, annotation: { text: '加大投掷次数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-dice', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { numDice: 3, trials: 10000 }, annotation: { text: '增减骰子数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-classical', type: 'summary' }, lineState: { annotation: { text: '古典概率', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-law', type: 'summary' }, lineState: { annotation: { text: '频率逼近概率', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
