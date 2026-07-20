/**
 * 隐马尔可夫模型讲解场景配置
 * 每句口播对应序列长度（params.length）与是否显示解码（params.showDecoded）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHiddenMarkovState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const hiddenMarkovScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '隐马尔可夫模型', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-guess', type: 'animation' }, lineState: { params: { length: 12, showDecoded: false }, annotation: { text: '从活动猜天气', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-hidden', type: 'animation' }, lineState: { params: { length: 12, showDecoded: false }, annotation: { text: '天气=隐状态', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { length: 12, showDecoded: false }, annotation: { text: '隐马尔可夫模型', position: 'bottom' } } },

  // ===== chain (3) =====
  { lineId: 'chain-1', sectionId: 'chain', scene: { id: 'chain-mc', type: 'animation' }, lineState: { params: { length: 12, showDecoded: false }, annotation: { text: '天气按链转移', position: 'top' } } },
  { lineId: 'chain-2', sectionId: 'chain', scene: { id: 'chain-memoryless', type: 'animation' }, lineState: { params: { length: 12, showDecoded: false }, annotation: { text: '只看今天', position: 'bottom' } } },
  { lineId: 'chain-3', sectionId: 'chain', scene: { id: 'chain-matrix', type: 'animation' }, lineState: { params: { length: 20, showDecoded: false }, annotation: { text: '转移矩阵', position: 'bottom' } } },

  // ===== emit (3) =====
  { lineId: 'emit-1', sectionId: 'emit', scene: { id: 'emit-prob', type: 'animation' }, lineState: { params: { length: 20, showDecoded: false }, annotation: { text: '天气引发活动', position: 'top' } } },
  { lineId: 'emit-2', sectionId: 'emit', scene: { id: 'emit-example', type: 'animation' }, lineState: { params: { length: 20, showDecoded: false }, annotation: { text: '发射概率', position: 'bottom' } } },
  { lineId: 'emit-3', sectionId: 'emit', scene: { id: 'emit-project', type: 'animation' }, lineState: { params: { length: 20, showDecoded: false }, annotation: { text: '投射出观测', position: 'bottom' } } },

  // ===== viterbi (3) =====
  { lineId: 'vit-1', sectionId: 'viterbi', scene: { id: 'vit-question', type: 'animation' }, lineState: { params: { length: 20, showDecoded: true }, annotation: { text: '哪条路径最可能', position: 'top' } } },
  { lineId: 'vit-2', sectionId: 'viterbi', scene: { id: 'vit-dp', type: 'animation' }, lineState: { params: { length: 20, showDecoded: true }, annotation: { text: '动态规划逐列', position: 'bottom' } } },
  { lineId: 'vit-3', sectionId: 'viterbi', scene: { id: 'vit-backtrack', type: 'animation' }, lineState: { params: { length: 20, showDecoded: true }, annotation: { text: '回溯得路径', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { length: 20, showDecoded: true }, annotation: { text: '对比真实与解码', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-length', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { length: 30, showDecoded: true }, annotation: { text: '看准确率变化', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-model', type: 'summary' }, lineState: { annotation: { text: '隐状态+发射', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-viterbi', type: 'summary' }, lineState: { annotation: { text: '维特比解码', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
