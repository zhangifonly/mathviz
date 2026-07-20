/**
 * 最大似然估计讲解场景配置
 * params.dsIndex 选数据集，params.muOffset 试探参数偏离量
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMaxLikelihoodState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const maxLikelihoodScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '最大似然估计', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-unknown', type: 'animation' }, lineState: { params: { dsIndex: 0, muOffset: 2 }, annotation: { text: '均值未知', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { dsIndex: 0, muOffset: 0 }, annotation: { text: '哪个参数最可能？', position: 'bottom' } } },

  // ===== likelihood (3) =====
  { lineId: 'lik-1', sectionId: 'likelihood', scene: { id: 'lik-product', type: 'animation' }, lineState: { params: { dsIndex: 0, muOffset: -1 }, annotation: { text: '各点密度相乘', position: 'top' } } },
  { lineId: 'lik-2', sectionId: 'likelihood', scene: { id: 'lik-def', type: 'animation' }, lineState: { params: { dsIndex: 0, muOffset: -1 }, annotation: { text: '这就是似然', position: 'bottom' } } },
  { lineId: 'lik-3', sectionId: 'likelihood', scene: { id: 'lik-fit', type: 'animation' }, lineState: { params: { dsIndex: 0, muOffset: 0 }, annotation: { text: '越贴合越大', position: 'bottom' } } },

  // ===== loglik (3) =====
  { lineId: 'log-1', sectionId: 'loglik', scene: { id: 'log-tiny', type: 'animation' }, lineState: { params: { dsIndex: 1, muOffset: 2 }, annotation: { text: '连乘会极小', position: 'top' } } },
  { lineId: 'log-2', sectionId: 'loglik', scene: { id: 'log-sum', type: 'animation' }, lineState: { params: { dsIndex: 1, muOffset: 0 }, annotation: { text: '连乘变连加', position: 'bottom' } } },
  { lineId: 'log-3', sectionId: 'loglik', scene: { id: 'log-mono', type: 'animation' }, lineState: { params: { dsIndex: 1, muOffset: 0 }, annotation: { text: '峰值不变', position: 'bottom' } } },

  // ===== maximize (2) =====
  { lineId: 'max-1', sectionId: 'maximize', scene: { id: 'max-peak', type: 'animation' }, lineState: { params: { dsIndex: 1, muOffset: 0 }, annotation: { text: '峰顶即 MLE', position: 'top' } } },
  { lineId: 'max-2', sectionId: 'maximize', scene: { id: 'max-mean', type: 'animation' }, lineState: { params: { dsIndex: 2, muOffset: 0 }, annotation: { text: 'MLE=样本均值', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { dsIndex: 2, muOffset: 1.5 }, annotation: { text: '拖动试探均值', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { dsIndex: 0, muOffset: 0 }, annotation: { text: '换数据集看峰移', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '似然与对数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-mle', type: 'summary' }, lineState: { annotation: { text: '最大化得 MLE', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '让数据说话！', position: 'bottom' } } },
]
