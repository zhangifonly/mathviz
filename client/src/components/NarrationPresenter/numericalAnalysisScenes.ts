/**
 * 数值分析讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNumericalAnalysisState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const numericalAnalysisScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { diagram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-purpose', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数值方法的意义', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-core', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '核心问题', position: 'bottom' },
    },
  },

  // ========== error-analysis 段落 (4行) ==========
  {
    lineId: 'error-1',
    sectionId: 'error-analysis',
    scene: { id: 'error-sources', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '误差来源', position: 'top' },
    },
  },
  {
    lineId: 'error-2',
    sectionId: 'error-analysis',
    scene: { id: 'error-truncation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '截断误差', position: 'bottom' },
    },
  },
  {
    lineId: 'error-3',
    sectionId: 'error-analysis',
    scene: { id: 'error-roundoff', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '舍入误差', position: 'bottom' },
    },
  },
  {
    lineId: 'error-4',
    sectionId: 'error-analysis',
    scene: { id: 'error-types', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '绝对误差与相对误差', position: 'bottom' },
    },
  },

  // ========== ode-methods 段落 (4行) ==========
  {
    lineId: 'ode-1',
    sectionId: 'ode-methods',
    scene: { id: 'ode-euler', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '欧拉法', position: 'top' },
    },
  },
  {
    lineId: 'ode-2',
    sectionId: 'ode-methods',
    scene: { id: 'ode-euler-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '欧拉法公式', position: 'bottom' },
    },
  },
  {
    lineId: 'ode-3',
    sectionId: 'ode-methods',
    scene: { id: 'ode-rk4', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '龙格-库塔法', position: 'bottom' },
    },
  },
  {
    lineId: 'ode-4',
    sectionId: 'ode-methods',
    scene: { id: 'ode-rk4-coefficients', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'RK4 系数', position: 'bottom' },
    },
  },

  // ========== stability 段落 (4行) ==========
  {
    lineId: 'stability-1',
    sectionId: 'stability',
    scene: { id: 'stability-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数值稳定性', position: 'top' },
    },
  },
  {
    lineId: 'stability-2',
    sectionId: 'stability',
    scene: { id: 'stability-stepsize', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '步长选择', position: 'bottom' },
    },
  },
  {
    lineId: 'stability-3',
    sectionId: 'stability',
    scene: { id: 'stability-stiff', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '刚性方程', position: 'bottom' },
    },
  },
  {
    lineId: 'stability-4',
    sectionId: 'stability',
    scene: { id: 'stability-condition', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '条件数', position: 'bottom' },
    },
  },

  // ========== root-finding 段落 (4行) ==========
  {
    lineId: 'root-1',
    sectionId: 'root-finding',
    scene: { id: 'root-bisection', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '二分法', position: 'top' },
    },
  },
  {
    lineId: 'root-2',
    sectionId: 'root-finding',
    scene: { id: 'root-bisection-convergence', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '线性收敛', position: 'bottom' },
    },
  },
  {
    lineId: 'root-3',
    sectionId: 'root-finding',
    scene: { id: 'root-newton', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '牛顿法', position: 'bottom' },
    },
  },
  {
    lineId: 'root-4',
    sectionId: 'root-finding',
    scene: { id: 'root-newton-issues', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '牛顿法的局限', position: 'bottom' },
    },
  },

  // ========== convergence 段落 (4行) ==========
  {
    lineId: 'convergence-1',
    sectionId: 'convergence',
    scene: { id: 'convergence-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '收敛性', position: 'top' },
    },
  },
  {
    lineId: 'convergence-2',
    sectionId: 'convergence',
    scene: { id: 'convergence-order', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '收敛阶', position: 'bottom' },
    },
  },
  {
    lineId: 'convergence-3',
    sectionId: 'convergence',
    scene: { id: 'convergence-types', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '线性与二次收敛', position: 'bottom' },
    },
  },
  {
    lineId: 'convergence-4',
    sectionId: 'convergence',
    scene: { id: 'convergence-balance', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '精度与效率平衡', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-weather', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '天气预报', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-fem', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '有限元分析', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-ml', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '机器学习优化', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-finance', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '金融工程', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-methods', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '系统方法', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-error', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '误差分析', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-criteria', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '稳定性与收敛性', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '感谢观看!', position: 'bottom' },
    },
  },
]
