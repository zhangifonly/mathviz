/**
 * 分数可视化讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 51 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultFractionsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置 - 每行口播对应一个场景
export const fractionsScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-title', type: 'title' },
    lineState: {
      show: { fraction1: false, fraction2: false, formula: false },
    },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-cake', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: false },
      annotation: { text: '切蛋糕 = 分数', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-shapes', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: false },
      annotation: { text: '漂亮的图形', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-start', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
    },
  },

  // ========== concept 段落 (5行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-parts', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '分子 / 分母', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-denominator', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      highlight: ['denominator'],
      annotation: { text: '分母=4份', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-numerator', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      highlight: ['numerator'],
      annotation: { text: '分子=取1份', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-quarter', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '四分之一 = 1/4', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-5',
    sectionId: 'concept',
    scene: { id: 'concept-pie', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      highlight: ['fraction1'],
      annotation: { text: '蓝色=取的部分', position: 'bottom' },
    },
  },

  // ========== visualization 段落 (5行) ==========
  {
    lineId: 'vis-1',
    sectionId: 'visualization',
    scene: { id: 'vis-intro', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '不同的图形表示', position: 'top' },
    },
  },
  {
    lineId: 'vis-2',
    sectionId: 'visualization',
    scene: { id: 'vis-pie', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '饼图 - 像切蛋糕', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-3',
    sectionId: 'visualization',
    scene: { id: 'vis-bar', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'bar' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '条形图 - 像巧克力', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-4',
    sectionId: 'visualization',
    scene: { id: 'vis-grid', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'grid' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '网格图 - 像格子纸', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-5',
    sectionId: 'visualization',
    scene: { id: 'vis-same', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '都是同一个分数！', position: 'bottom' },
    },
  },

  // ========== compare 段落 (5行) ==========
  {
    lineId: 'compare-1',
    sectionId: 'compare',
    scene: { id: 'compare-intro', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: false, fraction2: false, formula: false },
      annotation: { text: '比较分数大小', position: 'top' },
    },
  },
  {
    lineId: 'compare-2',
    sectionId: 'compare',
    scene: { id: 'compare-visual', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: false },
      annotation: { text: '看涂色面积', position: 'bottom' },
    },
  },
  {
    lineId: 'compare-3',
    sectionId: 'compare',
    scene: { id: 'compare-example', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '1/4 < 2/3', position: 'bottom' },
    },
  },
  {
    lineId: 'compare-4',
    sectionId: 'compare',
    scene: { id: 'compare-decimal', type: 'formula' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '0.25 vs 0.67', position: 'bottom' },
    },
  },
  {
    lineId: 'compare-5',
    sectionId: 'compare',
    scene: { id: 'compare-result', type: 'formula' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true, result: true },
      annotation: { text: '2/3 > 1/4', position: 'bottom' },
    },
  },

  // ========== addition 段落 (5行) ==========
  {
    lineId: 'add-1',
    sectionId: 'addition',
    scene: { id: 'add-intro', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'add', visualization: 'pie' },
      show: { fraction1: false, fraction2: false, formula: false },
      annotation: { text: '先通分，再相加', position: 'top' },
    },
  },
  {
    lineId: 'add-2',
    sectionId: 'addition',
    scene: { id: 'add-common', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'add', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: false },
      annotation: { text: '通分=相同分母', position: 'bottom' },
    },
  },
  {
    lineId: 'add-3',
    sectionId: 'addition',
    scene: { id: 'add-lcd', type: 'formula' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'add', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '公共分母 4×3=12', position: 'bottom' },
    },
  },
  {
    lineId: 'add-4',
    sectionId: 'addition',
    scene: { id: 'add-convert', type: 'formula' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'add', visualization: 'bar' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '3/12 + 8/12', position: 'bottom' },
    },
  },
  {
    lineId: 'add-5',
    sectionId: 'addition',
    scene: { id: 'add-result', type: 'formula' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'add', visualization: 'bar' },
      show: { fraction1: true, fraction2: true, formula: true, result: true },
      annotation: { text: '= 11/12', position: 'bottom' },
    },
  },

  // ========== multiplication 段落 (5行) ==========
  {
    lineId: 'mul-1',
    sectionId: 'multiplication',
    scene: { id: 'mul-intro', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'multiply', visualization: 'grid' },
      show: { fraction1: false, fraction2: false, formula: false },
      annotation: { text: '分子×分子，分母×分母', position: 'top' },
    },
  },
  {
    lineId: 'mul-2',
    sectionId: 'multiplication',
    scene: { id: 'mul-example', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'multiply', visualization: 'grid' },
      show: { fraction1: true, fraction2: true, formula: false },
      annotation: { text: '1/4 × 2/3', position: 'bottom' },
    },
  },
  {
    lineId: 'mul-3',
    sectionId: 'multiplication',
    scene: { id: 'mul-calc', type: 'formula' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'multiply', visualization: 'grid' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '1×2=2, 4×3=12', position: 'bottom' },
    },
  },
  {
    lineId: 'mul-4',
    sectionId: 'multiplication',
    scene: { id: 'mul-simplify', type: 'formula' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'multiply', visualization: 'grid' },
      show: { fraction1: true, fraction2: true, formula: true, result: true },
      annotation: { text: '2/12 = 1/6', position: 'bottom' },
    },
  },
  {
    lineId: 'mul-5',
    sectionId: 'multiplication',
    scene: { id: 'mul-meaning', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'multiply', visualization: 'grid' },
      show: { fraction1: true, fraction2: true, formula: true, result: true },
      annotation: { text: '取一部分的一部分', position: 'bottom' },
    },
  },

  // ========== simplify 段落 (5行) ==========
  {
    lineId: 'simp-1',
    sectionId: 'simplify',
    scene: { id: 'simp-intro', type: 'animation' },
    lineState: {
      params: { num1: 4, den1: 12, operation: 'equivalent', visualization: 'pie' },
      show: { fraction1: false, fraction2: false, formula: false },
      annotation: { text: '约分=简化分数', position: 'top' },
    },
  },
  {
    lineId: 'simp-2',
    sectionId: 'simplify',
    scene: { id: 'simp-method', type: 'animation' },
    lineState: {
      params: { num1: 4, den1: 12, operation: 'equivalent', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: false },
      annotation: { text: '找最大公约数', position: 'bottom' },
    },
  },
  {
    lineId: 'simp-3',
    sectionId: 'simplify',
    scene: { id: 'simp-gcd', type: 'formula' },
    lineState: {
      params: { num1: 4, den1: 12, operation: 'equivalent', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: 'GCD(4,12)=4', position: 'bottom' },
    },
  },
  {
    lineId: 'simp-4',
    sectionId: 'simplify',
    scene: { id: 'simp-divide', type: 'formula' },
    lineState: {
      params: { num1: 4, den1: 12, operation: 'equivalent', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '4÷4=1, 12÷4=3', position: 'bottom' },
    },
  },
  {
    lineId: 'simp-5',
    sectionId: 'simplify',
    scene: { id: 'simp-result', type: 'animation' },
    lineState: {
      params: { num1: 4, den1: 12, operation: 'equivalent', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true, result: true },
      highlight: ['fraction1', 'fraction2'],
      annotation: { text: '4/12 = 1/3 面积相同！', position: 'bottom' },
    },
  },

  // ========== parameters 段落 (5行) ==========
  {
    lineId: 'param-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '轮到你了！', position: 'top' },
    },
  },
  {
    lineId: 'param-2',
    sectionId: 'parameters',
    scene: { id: 'param-operation', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '选择操作类型', position: 'bottom' },
    },
  },
  {
    lineId: 'param-3',
    sectionId: 'parameters',
    scene: { id: 'param-slider', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { num1: 2, den1: 5, num2: 3, den2: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '拖动滑块改变数字', position: 'bottom' },
    },
  },
  {
    lineId: 'param-4',
    sectionId: 'parameters',
    scene: { id: 'param-viz', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'bar' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '试试不同图形', position: 'bottom' },
    },
  },
  {
    lineId: 'param-5',
    sectionId: 'parameters',
    scene: { id: 'param-explore', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { num1: 3, den1: 8, num2: 5, den2: 6, operation: 'compare', visualization: 'grid' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '发现分数规律！', position: 'bottom' },
    },
  },

  // ========== application 段落 (5行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { fraction1: false, fraction2: false, formula: false },
      annotation: { text: '生活中的分数', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-food', type: 'application' },
    lineState: {
      params: { num1: 1, den1: 8, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '分蛋糕、分披萨', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-time', type: 'application' },
    lineState: {
      params: { num1: 1, den1: 2, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '半小时 = 1/2 小时', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-discount', type: 'application' },
    lineState: {
      params: { num1: 1, den1: 2, operation: 'compare', visualization: 'bar' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '五折 = 原价的 1/2', position: 'bottom' },
    },
  },
  {
    lineId: 'app-5',
    sectionId: 'application',
    scene: { id: 'app-summary', type: 'application' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '学好分数！', position: 'bottom' },
    },
  },

  // ========== summary 段落 (6行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { fraction1: false, fraction2: false, formula: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-concept', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '分子/分母 = 几份取几份', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-viz', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: false, formula: true },
      annotation: { text: '饼图、条形图、网格图', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-compare', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'compare', visualization: 'pie' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '比较：看图或转小数', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-ops', type: 'animation' },
    lineState: {
      params: { num1: 1, den1: 4, num2: 2, den2: 3, operation: 'add', visualization: 'bar' },
      show: { fraction1: true, fraction2: true, formula: true },
      annotation: { text: '加法通分，乘法直接乘', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-6',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { fraction1: false, fraction2: false, formula: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
