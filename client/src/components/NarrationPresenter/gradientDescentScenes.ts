/**
 * 梯度下降讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGradientDescentState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gradientDescentScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-mountain', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '雾中下山', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-strategy', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '沿最陡下坡走', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-ml', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '机器学习的基石', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-gradient', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '梯度向量', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-direction', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['gradient'],
      annotation: { text: '最陡上升方向', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-negative', type: 'animation' },
    lineState: {
      show: { diagram: true, arrow: true },
      annotation: { text: '沿负梯度移动', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-algorithm', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'x ← x - α∇f(x)', position: 'bottom' },
    },
  },

  // ========== algorithm 段落 (4行) ==========
  {
    lineId: 'algo-1',
    sectionId: 'algorithm',
    scene: { id: 'algo-demo', type: 'animation' },
    lineState: {
      params: { iteration: 0 },
      show: { diagram: true },
      annotation: { text: '二维函数演示', position: 'top' },
    },
  },
  {
    lineId: 'algo-2',
    sectionId: 'algorithm',
    scene: { id: 'algo-point', type: 'animation' },
    lineState: {
      show: { diagram: true, arrow: true },
      highlight: ['current'],
      annotation: { text: '红点=当前位置', position: 'bottom' },
    },
  },
  {
    lineId: 'algo-3',
    sectionId: 'algorithm',
    scene: { id: 'algo-step', type: 'animation' },
    lineState: {
      params: { iteration: 1 },
      show: { diagram: true, arrow: true },
      annotation: { text: '沿箭头移动', position: 'bottom' },
    },
  },
  {
    lineId: 'algo-4',
    sectionId: 'algorithm',
    scene: { id: 'algo-converge', type: 'animation' },
    lineState: {
      params: { iteration: 20 },
      show: { diagram: true },
      annotation: { text: '逐渐接近最小值', position: 'bottom' },
    },
  },

  // ========== learning-rate 段落 (4行) ==========
  {
    lineId: 'lr-1',
    sectionId: 'learning-rate',
    scene: { id: 'lr-concept', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['alpha'],
      annotation: { text: '学习率 α', position: 'top' },
    },
  },
  {
    lineId: 'lr-2',
    sectionId: 'learning-rate',
    scene: { id: 'lr-small', type: 'animation' },
    lineState: {
      params: { learningRate: 0.001 },
      show: { diagram: true },
      annotation: { text: '学习率太小', position: 'bottom' },
    },
  },
  {
    lineId: 'lr-3',
    sectionId: 'learning-rate',
    scene: { id: 'lr-large', type: 'animation' },
    lineState: {
      params: { learningRate: 0.5 },
      show: { diagram: true },
      highlight: ['overshoot'],
      annotation: { text: '学习率太大', position: 'bottom' },
    },
  },
  {
    lineId: 'lr-4',
    sectionId: 'learning-rate',
    scene: { id: 'lr-choice', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      show: { diagram: true },
      annotation: { text: '调整学习率', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '神经网络训练', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-deep-learning', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '深度学习', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-variants', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'SGD, Adam等', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-ai', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'AI革命的核心', position: 'bottom' },
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
    scene: { id: 'summary-simple', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '简单而强大', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-balance', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '速度与稳定的平衡', position: 'bottom' },
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
