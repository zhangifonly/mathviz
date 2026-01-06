/**
 * 混沌理论讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultChaosState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const chaosScenes: NarrationLineScene[] = [
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
      annotation: { text: '天气预报的极限', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-chaos-concept', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '混沌现象', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-deterministic', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '确定性 ≠ 可预测性', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-features', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '混沌系统三大特征', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-butterfly', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '蝴蝶效应', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-lorenz', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '洛伦兹吸引子 (1963)', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-viz', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '三维轨迹可视化', position: 'bottom' },
    },
  },

  // ========== visualization 段落 (4行) ==========
  {
    lineId: 'vis-1',
    sectionId: 'visualization',
    scene: { id: 'vis-attractor', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '洛伦兹吸引子', position: 'top' },
    },
  },
  {
    lineId: 'vis-2',
    sectionId: 'visualization',
    scene: { id: 'vis-butterfly-shape', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      highlight: ['butterfly'],
      annotation: { text: '蝴蝶形状', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-3',
    sectionId: 'visualization',
    scene: { id: 'vis-trajectory', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '无限不重复轨迹', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-4',
    sectionId: 'visualization',
    scene: { id: 'vis-essence', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      highlight: ['attractor'],
      annotation: { text: '有界但不周期', position: 'bottom' },
    },
  },

  // ========== sensitivity 段落 (4行) ==========
  {
    lineId: 'sens-1',
    sectionId: 'sensitivity',
    scene: { id: 'sens-two-paths', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '两条初始接近的轨迹', position: 'top' },
    },
  },
  {
    lineId: 'sens-2',
    sectionId: 'sensitivity',
    scene: { id: 'sens-diverge', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['divergence'],
      annotation: { text: '快速分离', position: 'bottom' },
    },
  },
  {
    lineId: 'sens-3',
    sectionId: 'sensitivity',
    scene: { id: 'sens-exponential', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '指数级分离', position: 'bottom' },
    },
  },
  {
    lineId: 'sens-4',
    sectionId: 'sensitivity',
    scene: { id: 'sens-unpredictable', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '测量误差被无限放大', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '混沌理论的应用', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-weather', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '气象学', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-crypto', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '密码学', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-ecology', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '生态学', position: 'bottom' },
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
    scene: { id: 'summary-complexity', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '简单规则→复杂行为', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-insight', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '确定性≠可预测性', position: 'bottom' },
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
