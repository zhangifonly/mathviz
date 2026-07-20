/**
 * 神经网络前向传播讲解场景配置
 * 每句口播对应一个输入预设（params.preset），渲染器据此重跑前向传播
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNeuralNetworkForwardState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const neuralNetworkForwardScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '神经网络前向传播', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-mimic', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '模仿大脑', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-flow', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '跟着信号走', position: 'bottom' } } },

  // ===== neuron (3) =====
  { lineId: 'def-1', sectionId: 'neuron', scene: { id: 'def-sum', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '权重求和', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'neuron', scene: { id: 'def-bias', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '再加偏置', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'neuron', scene: { id: 'def-out', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '过激活得输出', position: 'bottom' } } },

  // ===== propagate (3) =====
  { lineId: 'prop-1', sectionId: 'propagate', scene: { id: 'prop-feed', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '上层喂下层', position: 'top' } } },
  { lineId: 'prop-2', sectionId: 'propagate', scene: { id: 'prop-layer', type: 'animation' }, lineState: { params: { preset: 1 }, annotation: { text: '逐层加工', position: 'bottom' } } },
  { lineId: 'prop-3', sectionId: 'propagate', scene: { id: 'prop-answer', type: 'animation' }, lineState: { params: { preset: 2 }, annotation: { text: '输出层给答案', position: 'bottom' } } },

  // ===== activation (3) =====
  { lineId: 'act-1', sectionId: 'activation', scene: { id: 'act-sigmoid', type: 'animation' }, lineState: { params: { preset: 2 }, annotation: { text: 'sigmoid 开关', position: 'top' } } },
  { lineId: 'act-2', sectionId: 'activation', scene: { id: 'act-linear', type: 'animation' }, lineState: { params: { preset: 2 }, annotation: { text: '纯线性太弱', position: 'bottom' } } },
  { lineId: 'act-3', sectionId: 'activation', scene: { id: 'act-nonlinear', type: 'animation' }, lineState: { params: { preset: 0 }, annotation: { text: '非线性更强', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 1 }, annotation: { text: '切换输入', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-bright', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 2 }, annotation: { text: '看亮度变化', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-neuron', type: 'summary' }, lineState: { annotation: { text: '加权求和过激活', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-forward', type: 'summary' }, lineState: { annotation: { text: '逐层前向传播', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
