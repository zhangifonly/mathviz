/**
 * 反向传播讲解场景配置
 * 每句口播对应训练阶段（params.phase）：forward / loss / backward / train
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBackpropagationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const backpropagationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '反向传播', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-learn', type: 'animation' }, lineState: { params: { phase: 'forward' }, annotation: { text: '看例子学习', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { phase: 'forward' }, annotation: { text: '核心算法登场', position: 'bottom' } } },

  // ===== forward (3) =====
  { lineId: 'fwd-1', sectionId: 'forward', scene: { id: 'fwd-flow', type: 'animation' }, lineState: { params: { phase: 'forward' }, annotation: { text: '加权求和+激活', position: 'top' } } },
  { lineId: 'fwd-2', sectionId: 'forward', scene: { id: 'fwd-out', type: 'animation' }, lineState: { params: { phase: 'forward' }, annotation: { text: '信号向右流', position: 'bottom' } } },
  { lineId: 'fwd-3', sectionId: 'forward', scene: { id: 'fwd-net', type: 'animation' }, lineState: { params: { phase: 'forward' }, annotation: { text: '2-2-1 学异或', position: 'bottom' } } },

  // ===== loss (3) =====
  { lineId: 'loss-1', sectionId: 'loss', scene: { id: 'loss-measure', type: 'animation' }, lineState: { params: { phase: 'loss' }, annotation: { text: '预测对不对？', position: 'top' } } },
  { lineId: 'loss-2', sectionId: 'loss', scene: { id: 'loss-def', type: 'animation' }, lineState: { params: { phase: 'loss' }, annotation: { text: '差距的平方', position: 'bottom' } } },
  { lineId: 'loss-3', sectionId: 'loss', scene: { id: 'loss-goal', type: 'animation' }, lineState: { params: { phase: 'loss' }, annotation: { text: '目标：损失最小', position: 'bottom' } } },

  // ===== backward (4) =====
  { lineId: 'back-1', sectionId: 'backward', scene: { id: 'back-q', type: 'animation' }, lineState: { params: { phase: 'backward' }, annotation: { text: '权重怎么调？', position: 'top' } } },
  { lineId: 'back-2', sectionId: 'backward', scene: { id: 'back-grad', type: 'animation' }, lineState: { params: { phase: 'backward' }, annotation: { text: '求偏导=梯度', position: 'bottom' } } },
  { lineId: 'back-3', sectionId: 'backward', scene: { id: 'back-chain', type: 'animation' }, lineState: { params: { phase: 'backward' }, annotation: { text: '链式法则回传', position: 'bottom' } } },
  { lineId: 'back-4', sectionId: 'backward', scene: { id: 'back-flow', type: 'animation' }, lineState: { params: { phase: 'backward' }, annotation: { text: '误差从右向左', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { phase: 'train' }, annotation: { text: '单步训练', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-curve', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { phase: 'train' }, annotation: { text: '损失向下走', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-fwd', type: 'summary' }, lineState: { annotation: { text: '前向+损失', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-back', type: 'summary' }, lineState: { annotation: { text: '反向+更新', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '深度学习的引擎！', position: 'bottom' } } },
]
