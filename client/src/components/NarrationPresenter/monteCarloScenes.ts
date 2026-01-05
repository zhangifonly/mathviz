/**
 * 蒙特卡洛方法讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMonteCarloState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const monteCarloScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { canvas: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-method', type: 'animation' },
    lineState: {
      show: { canvas: true },
      annotation: { text: '随机数解决问题', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-name', type: 'animation' },
    lineState: {
      show: { canvas: true },
      annotation: { text: '蒙特卡洛赌场', position: 'bottom' },
    },
  },

  // ========== principle 段落 (4行) ==========
  {
    lineId: 'principle-1',
    sectionId: 'principle',
    scene: { id: 'prin-square', type: 'animation' },
    lineState: {
      show: { canvas: true, square: true, circle: true },
      annotation: { text: '正方形内画圆', position: 'top' },
    },
  },
  {
    lineId: 'principle-2',
    sectionId: 'principle',
    scene: { id: 'prin-area', type: 'formula' },
    lineState: {
      show: { canvas: true, square: true, circle: true, formula: true },
      annotation: { text: '面积：正方形4，圆π', position: 'bottom' },
    },
  },
  {
    lineId: 'principle-3',
    sectionId: 'principle',
    scene: { id: 'prin-prob', type: 'formula' },
    lineState: {
      show: { canvas: true, square: true, circle: true, formula: true },
      annotation: { text: '概率 = π/4', position: 'bottom' },
    },
  },
  {
    lineId: 'principle-4',
    sectionId: 'principle',
    scene: { id: 'prin-calc', type: 'formula' },
    lineState: {
      show: { canvas: true, formula: true },
      highlight: ['formula'],
      annotation: { text: 'π ≈ 4 × (圆内/总数)', position: 'bottom' },
    },
  },

  // ========== visualization 段落 (3行) ==========
  {
    lineId: 'visualization-1',
    sectionId: 'visualization',
    scene: { id: 'vis-circle', type: 'animation' },
    lineState: {
      show: { canvas: true, square: true, circle: true },
      annotation: { text: '蓝色单位圆', position: 'top' },
    },
  },
  {
    lineId: 'visualization-2',
    sectionId: 'visualization',
    scene: { id: 'vis-points', type: 'animation' },
    lineState: {
      params: { numPoints: 100 },
      show: { canvas: true, square: true, circle: true, points: true },
      annotation: { text: '绿色圆内，红色圆外', position: 'bottom' },
    },
  },
  {
    lineId: 'visualization-3',
    sectionId: 'visualization',
    scene: { id: 'vis-ratio', type: 'animation' },
    lineState: {
      params: { numPoints: 500 },
      show: { canvas: true, square: true, circle: true, points: true },
      annotation: { text: '比例接近面积比', position: 'bottom' },
    },
  },

  // ========== experiment 段落 (4行) ==========
  {
    lineId: 'experiment-1',
    sectionId: 'experiment',
    scene: { id: 'exp-start', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      show: { canvas: true, square: true, circle: true, startButton: true },
      annotation: { text: '点击开始', position: 'top' },
    },
  },
  {
    lineId: 'experiment-2',
    sectionId: 'experiment',
    scene: { id: 'exp-random', type: 'animation' },
    lineState: {
      params: { isRunning: true },
      show: { canvas: true, square: true, circle: true, points: true },
      annotation: { text: '随机生成点', position: 'bottom' },
    },
  },
  {
    lineId: 'experiment-3',
    sectionId: 'experiment',
    scene: { id: 'exp-judge', type: 'formula' },
    lineState: {
      show: { canvas: true, formula: true },
      annotation: { text: 'x²+y²≤1 在圆内', position: 'bottom' },
    },
  },
  {
    lineId: 'experiment-4',
    sectionId: 'experiment',
    scene: { id: 'exp-speed', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      show: { canvas: true, square: true, circle: true, points: true, speedSlider: true },
      annotation: { text: '调整速度', position: 'bottom' },
    },
  },

  // ========== convergence 段落 (4行) ==========
  {
    lineId: 'convergence-1',
    sectionId: 'convergence',
    scene: { id: 'conv-graph', type: 'animation' },
    lineState: {
      show: { canvas: true, convergenceGraph: true },
      annotation: { text: 'π估计值变化', position: 'top' },
    },
  },
  {
    lineId: 'convergence-2',
    sectionId: 'convergence',
    scene: { id: 'conv-true', type: 'animation' },
    lineState: {
      show: { canvas: true, convergenceGraph: true, trueLine: true },
      highlight: ['trueLine'],
      annotation: { text: '红色虚线=真实π', position: 'bottom' },
    },
  },
  {
    lineId: 'convergence-3',
    sectionId: 'convergence',
    scene: { id: 'conv-stable', type: 'animation' },
    lineState: {
      params: { numPoints: 5000 },
      show: { canvas: true, convergenceGraph: true, trueLine: true },
      annotation: { text: '逐渐稳定', position: 'bottom' },
    },
  },
  {
    lineId: 'convergence-4',
    sectionId: 'convergence',
    scene: { id: 'conv-law', type: 'animation' },
    lineState: {
      show: { canvas: true, convergenceGraph: true },
      annotation: { text: '大数定律', position: 'bottom' },
    },
  },

  // ========== accuracy 段落 (4行) ==========
  {
    lineId: 'accuracy-1',
    sectionId: 'accuracy',
    scene: { id: 'acc-sqrt', type: 'formula' },
    lineState: {
      show: { canvas: true, formula: true },
      annotation: { text: '精度∝√n', position: 'top' },
    },
  },
  {
    lineId: 'accuracy-2',
    sectionId: 'accuracy',
    scene: { id: 'acc-half', type: 'animation' },
    lineState: {
      show: { canvas: true, formula: true },
      annotation: { text: '误差减半需4倍点数', position: 'bottom' },
    },
  },
  {
    lineId: 'accuracy-3',
    sectionId: 'accuracy',
    scene: { id: 'acc-slow', type: 'animation' },
    lineState: {
      show: { canvas: true },
      annotation: { text: '收敛慢但简单', position: 'bottom' },
    },
  },
  {
    lineId: 'accuracy-4',
    sectionId: 'accuracy',
    scene: { id: 'acc-panel', type: 'animation' },
    lineState: {
      show: { canvas: true, statsPanel: true },
      annotation: { text: '估计值和误差', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'application-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { canvas: true },
      annotation: { text: '实际应用', position: 'top' },
    },
  },
  {
    lineId: 'application-2',
    sectionId: 'application',
    scene: { id: 'app-finance', type: 'application' },
    lineState: {
      show: { canvas: true },
      annotation: { text: '金融风险计算', position: 'bottom' },
    },
  },
  {
    lineId: 'application-3',
    sectionId: 'application',
    scene: { id: 'app-physics', type: 'application' },
    lineState: {
      show: { canvas: true },
      annotation: { text: '粒子模拟', position: 'bottom' },
    },
  },
  {
    lineId: 'application-4',
    sectionId: 'application',
    scene: { id: 'app-ai', type: 'application' },
    lineState: {
      show: { canvas: true },
      annotation: { text: '游戏AI', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { canvas: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-method', type: 'animation' },
    lineState: {
      show: { canvas: true, points: true },
      annotation: { text: '随机采样估算', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-formula', type: 'formula' },
    lineState: {
      show: { canvas: true, formula: true },
      annotation: { text: 'π ≈ 4×比值', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-law', type: 'animation' },
    lineState: {
      show: { canvas: true },
      annotation: { text: '大数定律', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { canvas: false },
      annotation: { text: '更直观理解蒙特卡洛！', position: 'bottom' },
    },
  },
]
