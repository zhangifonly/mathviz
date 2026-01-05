/**
 * 泰勒级数讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTaylorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const taylorScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { graph: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-calc', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '计算器如何算 sin?', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-answer', type: 'animation' },
    lineState: {
      show: { graph: true, polynomial: true },
      annotation: { text: '多项式逼近', position: 'bottom' },
    },
  },

  // ========== basic-idea 段落 (4行) ==========
  {
    lineId: 'basic-idea-1',
    sectionId: 'basic-idea',
    scene: { id: 'bi-core', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '多项式近似函数', position: 'top' },
    },
  },
  {
    lineId: 'basic-idea-2',
    sectionId: 'basic-idea',
    scene: { id: 'bi-poly', type: 'animation' },
    lineState: {
      show: { graph: true, polynomial: true },
      annotation: { text: '加减乘幂运算', position: 'bottom' },
    },
  },
  {
    lineId: 'basic-idea-3',
    sectionId: 'basic-idea',
    scene: { id: 'bi-hard', type: 'animation' },
    lineState: {
      show: { graph: true, sinCurve: true },
      annotation: { text: 'sin/cos/e^x 难算', position: 'bottom' },
    },
  },
  {
    lineId: 'basic-idea-4',
    sectionId: 'basic-idea',
    scene: { id: 'bi-bridge', type: 'animation' },
    lineState: {
      show: { graph: true, sinCurve: true, polynomial: true },
      annotation: { text: '泰勒级数=桥梁', position: 'bottom' },
    },
  },

  // ========== taylor-formula 段落 (4行) ==========
  {
    lineId: 'taylor-formula-1',
    sectionId: 'taylor-formula',
    scene: { id: 'tf-expand', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '无穷级数展开', position: 'top' },
    },
  },
  {
    lineId: 'taylor-formula-2',
    sectionId: 'taylor-formula',
    scene: { id: 'tf-series', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '展开式', position: 'bottom' },
    },
  },
  {
    lineId: 'taylor-formula-3',
    sectionId: 'taylor-formula',
    scene: { id: 'tf-maclaurin', type: 'formula' },
    lineState: {
      params: { a: 0 },
      show: { graph: true, formula: true },
      annotation: { text: 'a=0 麦克劳林级数', position: 'bottom' },
    },
  },
  {
    lineId: 'taylor-formula-4',
    sectionId: 'taylor-formula',
    scene: { id: 'tf-coef', type: 'animation' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '系数=各阶导数', position: 'bottom' },
    },
  },

  // ========== exp-series 段落 (4行) ==========
  {
    lineId: 'exp-series-1',
    sectionId: 'exp-series',
    scene: { id: 'exp-intro', type: 'animation' },
    lineState: {
      show: { graph: true, expCurve: true },
      annotation: { text: 'e^x 展开', position: 'top' },
    },
  },
  {
    lineId: 'exp-series-2',
    sectionId: 'exp-series',
    scene: { id: 'exp-deriv', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '导数=自己', position: 'bottom' },
    },
  },
  {
    lineId: 'exp-series-3',
    sectionId: 'exp-series',
    scene: { id: 'exp-expand', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '1+x+x²/2!+x³/3!+...', position: 'bottom' },
    },
  },
  {
    lineId: 'exp-series-4',
    sectionId: 'exp-series',
    scene: { id: 'exp-conv', type: 'animation' },
    lineState: {
      params: { n: 10 },
      show: { graph: true, expCurve: true, polynomial: true },
      annotation: { text: '收敛快', position: 'bottom' },
    },
  },

  // ========== sin-series 段落 (4行) ==========
  {
    lineId: 'sin-series-1',
    sectionId: 'sin-series',
    scene: { id: 'sin-intro', type: 'animation' },
    lineState: {
      show: { graph: true, sinCurve: true },
      annotation: { text: 'sin x 展开', position: 'top' },
    },
  },
  {
    lineId: 'sin-series-2',
    sectionId: 'sin-series',
    scene: { id: 'sin-expand', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: 'x-x³/3!+x⁵/5!-...', position: 'bottom' },
    },
  },
  {
    lineId: 'sin-series-3',
    sectionId: 'sin-series',
    scene: { id: 'sin-odd', type: 'animation' },
    lineState: {
      show: { graph: true, sinCurve: true, polynomial: true },
      annotation: { text: '奇数次幂，正负交替', position: 'bottom' },
    },
  },
  {
    lineId: 'sin-series-4',
    sectionId: 'sin-series',
    scene: { id: 'sin-calc', type: 'animation' },
    lineState: {
      show: { graph: true, sinCurve: true },
      annotation: { text: '计算器原理', position: 'bottom' },
    },
  },

  // ========== approximation 段落 (4行) ==========
  {
    lineId: 'approximation-1',
    sectionId: 'approximation',
    scene: { id: 'approx-show', type: 'animation' },
    lineState: {
      params: { n: 3 },
      show: { graph: true, originalCurve: true, polynomial: true },
      annotation: { text: '蓝=原函数，红=多项式', position: 'top' },
    },
  },
  {
    lineId: 'approximation-2',
    sectionId: 'approximation',
    scene: { id: 'approx-n', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { n: 5 },
      show: { graph: true, originalCurve: true, polynomial: true, slider: true },
      annotation: { text: '调整项数 n', position: 'bottom' },
    },
  },
  {
    lineId: 'approximation-3',
    sectionId: 'approximation',
    scene: { id: 'approx-near', type: 'animation' },
    lineState: {
      params: { n: 5 },
      show: { graph: true, originalCurve: true, polynomial: true, expandPoint: true },
      annotation: { text: '展开点附近最好', position: 'bottom' },
    },
  },
  {
    lineId: 'approximation-4',
    sectionId: 'approximation',
    scene: { id: 'approx-far', type: 'animation' },
    lineState: {
      params: { n: 10 },
      show: { graph: true, originalCurve: true, polynomial: true },
      annotation: { text: '远处需更多项', position: 'bottom' },
    },
  },

  // ========== convergence 段落 (4行) ==========
  {
    lineId: 'convergence-1',
    sectionId: 'convergence',
    scene: { id: 'conv-not', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '不总是收敛', position: 'top' },
    },
  },
  {
    lineId: 'convergence-2',
    sectionId: 'convergence',
    scene: { id: 'conv-radius', type: 'animation' },
    lineState: {
      show: { graph: true, convergenceRegion: true },
      annotation: { text: '收敛半径', position: 'bottom' },
    },
  },
  {
    lineId: 'convergence-3',
    sectionId: 'convergence',
    scene: { id: 'conv-inf', type: 'animation' },
    lineState: {
      show: { graph: true, expCurve: true, sinCurve: true },
      annotation: { text: 'e^x, sin x 收敛半径=∞', position: 'bottom' },
    },
  },
  {
    lineId: 'convergence-4',
    sectionId: 'convergence',
    scene: { id: 'conv-geo', type: 'animation' },
    lineState: {
      show: { graph: true, geoCurve: true, convergenceRegion: true },
      annotation: { text: '1/(1-x) 只在 |x|<1 收敛', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '科学计算应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-calc', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '计算器/计算机', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-physics', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '物理小角度近似', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-num', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '数值分析基础', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { graph: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-poly', type: 'animation' },
    lineState: {
      show: { graph: true, originalCurve: true, polynomial: true },
      annotation: { text: '多项式逼近', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-deriv', type: 'animation' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '系数=各阶导数', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-conv', type: 'animation' },
    lineState: {
      show: { graph: true, convergenceRegion: true },
      annotation: { text: '注意收敛范围', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { graph: false },
      annotation: { text: '更直观理解泰勒级数！', position: 'bottom' },
    },
  },
]
