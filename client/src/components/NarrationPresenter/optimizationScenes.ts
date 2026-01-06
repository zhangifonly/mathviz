/**
 * 优化算法讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultOptimizationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const optimizationScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-problems', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '最小成本、最大收益', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-examples', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '最短路线、资源分配', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-optimization', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数学优化', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-objective', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '目标函数', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-optimal', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['optimum'],
      annotation: { text: '最优解', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-types', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '无约束 vs 约束', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-simple', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '从简单开始', position: 'bottom' },
    },
  },

  // ========== unconstrained 段落 (4行) ==========
  {
    lineId: 'uncon-1',
    sectionId: 'unconstrained',
    scene: { id: 'uncon-gradient-zero', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '∇f = 0', position: 'top' },
    },
  },
  {
    lineId: 'uncon-2',
    sectionId: 'unconstrained',
    scene: { id: 'uncon-direction', type: 'animation' },
    lineState: {
      show: { diagram: true, arrow: true },
      annotation: { text: '梯度下降方向', position: 'bottom' },
    },
  },
  {
    lineId: 'uncon-3',
    sectionId: 'unconstrained',
    scene: { id: 'uncon-method', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '沿负梯度移动', position: 'bottom' },
    },
  },
  {
    lineId: 'uncon-4',
    sectionId: 'unconstrained',
    scene: { id: 'uncon-demo', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '观察收敛', position: 'bottom' },
    },
  },

  // ========== constrained 段落 (4行) ==========
  {
    lineId: 'con-1',
    sectionId: 'constrained',
    scene: { id: 'con-reality', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '现实有约束', position: 'top' },
    },
  },
  {
    lineId: 'con-2',
    sectionId: 'constrained',
    scene: { id: 'con-examples', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '预算、资源、时间', position: 'bottom' },
    },
  },
  {
    lineId: 'con-3',
    sectionId: 'constrained',
    scene: { id: 'con-lagrange', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '拉格朗日乘数法', position: 'bottom' },
    },
  },
  {
    lineId: 'con-4',
    sectionId: 'constrained',
    scene: { id: 'con-transform', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '转化为无约束', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '无处不在', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-logistics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '物流配送', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-finance', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '投资组合', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-ml', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '机器学习训练', position: 'bottom' },
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
    scene: { id: 'summary-tools', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '强大工具', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-thinking', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '优化思维', position: 'bottom' },
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
