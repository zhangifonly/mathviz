/**
 * 常微分方程讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultOdeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const odeScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-examples', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '人口增长、放射衰变', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-rate', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '变化率', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-ode', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '微分方程', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-definition', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '包含导数的方程', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-ordinary', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '一个自变量', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-solve', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '找满足的函数', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-initial', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '初始条件', position: 'bottom' },
    },
  },

  // ========== exponential 段落 (4行) ==========
  {
    lineId: 'exp-1',
    sectionId: 'exponential',
    scene: { id: 'exp-simple', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'dy/dt = ky', position: 'top' },
    },
  },
  {
    lineId: 'exp-2',
    sectionId: 'exponential',
    scene: { id: 'exp-growth', type: 'animation' },
    lineState: {
      params: { k: 0.5 },
      show: { diagram: true, curve: true },
      annotation: { text: '指数增长 (k>0)', position: 'bottom' },
    },
  },
  {
    lineId: 'exp-3',
    sectionId: 'exponential',
    scene: { id: 'exp-decay', type: 'animation' },
    lineState: {
      params: { k: -0.5 },
      show: { diagram: true, curve: true },
      annotation: { text: '指数衰减 (k<0)', position: 'bottom' },
    },
  },
  {
    lineId: 'exp-4',
    sectionId: 'exponential',
    scene: { id: 'exp-solution', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'y = Ce^(kt)', position: 'bottom' },
    },
  },

  // ========== oscillation 段落 (4行) ==========
  {
    lineId: 'osc-1',
    sectionId: 'oscillation',
    scene: { id: 'osc-second-order', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '二阶微分方程', position: 'top' },
    },
  },
  {
    lineId: 'osc-2',
    sectionId: 'oscillation',
    scene: { id: 'osc-harmonic', type: 'animation' },
    lineState: {
      params: { damping: 0 },
      show: { diagram: true, curve: true },
      annotation: { text: '简谐振动', position: 'bottom' },
    },
  },
  {
    lineId: 'osc-3',
    sectionId: 'oscillation',
    scene: { id: 'osc-damped', type: 'animation' },
    lineState: {
      params: { damping: 0.1 },
      show: { diagram: true, curve: true },
      annotation: { text: '阻尼振动', position: 'bottom' },
    },
  },
  {
    lineId: 'osc-4',
    sectionId: 'oscillation',
    scene: { id: 'osc-model', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '弹簧、钟摆', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '科学建模', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-physics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '牛顿运动定律', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-ecology', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '捕食者-猎物', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-epidemic', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '疾病传播', position: 'bottom' },
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
    scene: { id: 'summary-language', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '描述变化的语言', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-everywhere', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '无处不在', position: 'bottom' },
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
