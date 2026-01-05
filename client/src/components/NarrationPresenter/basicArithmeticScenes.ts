/**
 * 加减乘除可视化讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 44 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultArithmeticState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置 - 每行口播对应一个场景
export const basicArithmeticScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-title', type: 'title' },
    lineState: {
      show: { group1: false, group2: false, formula: false },
    },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-blocks', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: false },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-ops', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: false },
      annotation: { text: '加 减 乘 除', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-encourage', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: true },
    },
  },

  // ========== addition 段落 (5行) ==========
  {
    lineId: 'add-1',
    sectionId: 'addition',
    scene: { id: 'add-concept', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: false, group2: false, formula: false },
      annotation: { text: '加法 = 合并', position: 'top' },
    },
  },
  {
    lineId: 'add-2',
    sectionId: 'addition',
    scene: { id: 'add-show-groups', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: false },
      highlight: ['group1'],
      annotation: { text: '蓝色=第一个数，绿色=第二个数', position: 'bottom' },
    },
  },
  {
    lineId: 'add-3',
    sectionId: 'addition',
    scene: { id: 'add-merge', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: true },
      highlight: ['group1', 'group2'],
      annotation: { text: '3 + 2 = 5', position: 'bottom' },
    },
  },
  {
    lineId: 'add-4',
    sectionId: 'addition',
    scene: { id: 'add-numberline', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: true, numberLine: true },
      annotation: { text: '数轴：向右走', position: 'top' },
    },
  },
  {
    lineId: 'add-5',
    sectionId: 'addition',
    scene: { id: 'add-commutative', type: 'animation' },
    lineState: {
      params: { num1: 7, num2: 5, operation: 'addition' },
      show: { group1: 7, group2: 5, formula: true },
      annotation: { text: '7+5 = 5+7 = 12', position: 'bottom' },
    },
  },

  // ========== subtraction 段落 (5行) ==========
  {
    lineId: 'sub-1',
    sectionId: 'subtraction',
    scene: { id: 'sub-concept', type: 'animation' },
    lineState: {
      params: { num1: 7, num2: 5, operation: 'subtraction' },
      show: { group1: false, group2: false, formula: false },
      annotation: { text: '减法 = 拿走', position: 'top' },
    },
  },
  {
    lineId: 'sub-2',
    sectionId: 'subtraction',
    scene: { id: 'sub-show-all', type: 'animation' },
    lineState: {
      params: { num1: 7, num2: 5, operation: 'subtraction' },
      show: { group1: 7, group2: false, formula: false },
      highlight: ['group1'],
      annotation: { text: '7个方块', position: 'bottom' },
    },
  },
  {
    lineId: 'sub-3',
    sectionId: 'subtraction',
    scene: { id: 'sub-remove', type: 'animation' },
    lineState: {
      params: { num1: 7, num2: 5, operation: 'subtraction' },
      show: { group1: 7, group2: true, formula: false },
      annotation: { text: '拿走5个', position: 'bottom' },
    },
  },
  {
    lineId: 'sub-4',
    sectionId: 'subtraction',
    scene: { id: 'sub-numberline', type: 'animation' },
    lineState: {
      params: { num1: 7, num2: 5, operation: 'subtraction' },
      show: { group1: 7, group2: true, formula: true, numberLine: true },
      annotation: { text: '数轴：向左走', position: 'top' },
    },
  },
  {
    lineId: 'sub-5',
    sectionId: 'subtraction',
    scene: { id: 'sub-inverse', type: 'animation' },
    lineState: {
      params: { num1: 12, num2: 5, operation: 'subtraction' },
      show: { group1: 12, group2: true, formula: true },
      annotation: { text: '7+5=12 → 12-5=7', position: 'bottom' },
    },
  },

  // ========== multiplication 段落 (5行) ==========
  {
    lineId: 'mul-1',
    sectionId: 'multiplication',
    scene: { id: 'mul-concept', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 4, operation: 'multiplication' },
      show: { group1: false, group2: false, formula: false },
      annotation: { text: '乘法 = 快捷加法', position: 'top' },
    },
  },
  {
    lineId: 'mul-2',
    sectionId: 'multiplication',
    scene: { id: 'mul-explain', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 4, operation: 'multiplication' },
      show: { group1: 3, group2: false, formula: false },
      annotation: { text: '3×4 = 3+3+3+3', position: 'bottom' },
    },
  },
  {
    lineId: 'mul-3',
    sectionId: 'multiplication',
    scene: { id: 'mul-grid', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 4, operation: 'multiplication' },
      show: { group1: true, group2: true, formula: false },
      highlight: ['group1'],
      annotation: { text: '4行 × 3列', position: 'bottom' },
    },
  },
  {
    lineId: 'mul-4',
    sectionId: 'multiplication',
    scene: { id: 'mul-commutative', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 4, operation: 'multiplication' },
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '3×4 = 4×3 = 12', position: 'bottom' },
    },
  },
  {
    lineId: 'mul-5',
    sectionId: 'multiplication',
    scene: { id: 'mul-meaning', type: 'animation' },
    lineState: {
      params: { num1: 5, num2: 3, operation: 'multiplication' },
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '5×3 = "3个5" = 15', position: 'bottom' },
    },
  },

  // ========== division 段落 (5行) ==========
  {
    lineId: 'div-1',
    sectionId: 'division',
    scene: { id: 'div-concept', type: 'animation' },
    lineState: {
      params: { num1: 12, num2: 3, operation: 'division' },
      show: { group1: false, group2: false, formula: false },
      annotation: { text: '除法 = 平均分', position: 'top' },
    },
  },
  {
    lineId: 'div-2',
    sectionId: 'division',
    scene: { id: 'div-show-all', type: 'animation' },
    lineState: {
      params: { num1: 12, num2: 3, operation: 'division' },
      show: { group1: 12, group2: false, formula: false },
      annotation: { text: '12个方块分3组', position: 'bottom' },
    },
  },
  {
    lineId: 'div-3',
    sectionId: 'division',
    scene: { id: 'div-groups', type: 'animation' },
    lineState: {
      params: { num1: 12, num2: 3, operation: 'division' },
      show: { group1: true, group2: true, formula: true },
      highlight: ['group1'],
      annotation: { text: '每组4个，12÷3=4', position: 'bottom' },
    },
  },
  {
    lineId: 'div-4',
    sectionId: 'division',
    scene: { id: 'div-remainder', type: 'animation' },
    lineState: {
      params: { num1: 7, num2: 3, operation: 'division' },
      show: { group1: true, group2: true, formula: true, result: true },
      annotation: { text: '7÷3=2...1', position: 'bottom' },
    },
  },
  {
    lineId: 'div-5',
    sectionId: 'division',
    scene: { id: 'div-inverse', type: 'animation' },
    lineState: {
      params: { num1: 12, num2: 3, operation: 'division' },
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '3×4=12 → 12÷3=4', position: 'bottom' },
    },
  },

  // ========== animation 段落 (4行) ==========
  {
    lineId: 'anim-1',
    sectionId: 'animation',
    scene: { id: 'anim-intro', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: false, group2: false, formula: false },
      annotation: { text: '点击播放动画', position: 'top' },
    },
  },
  {
    lineId: 'anim-2',
    sectionId: 'animation',
    scene: { id: 'anim-step1', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: false, formula: false },
      annotation: { text: '第一步：显示第一个数', position: 'bottom' },
    },
  },
  {
    lineId: 'anim-3',
    sectionId: 'animation',
    scene: { id: 'anim-step2', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: false },
      annotation: { text: '第二步：方块变化', position: 'bottom' },
    },
  },
  {
    lineId: 'anim-4',
    sectionId: 'animation',
    scene: { id: 'anim-step3', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: true },
      annotation: { text: '第三步：得到结果！', position: 'bottom' },
    },
  },

  // ========== parameters 段落 (5行) ==========
  {
    lineId: 'param-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'interactive' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: true },
      annotation: { text: '轮到你了！', position: 'top' },
    },
  },
  {
    lineId: 'param-2',
    sectionId: 'parameters',
    scene: { id: 'param-ops', type: 'interactive' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: true },
      annotation: { text: '选择运算类型', position: 'bottom' },
    },
  },
  {
    lineId: 'param-3',
    sectionId: 'parameters',
    scene: { id: 'param-numbers', type: 'interactive' },
    lineState: {
      params: { num1: 5, num2: 3, operation: 'addition' },
      show: { group1: 5, group2: 3, formula: true },
      annotation: { text: '拖动滑块改变数字', position: 'bottom' },
    },
  },
  {
    lineId: 'param-4',
    sectionId: 'parameters',
    scene: { id: 'param-sub-test', type: 'interactive' },
    lineState: {
      params: { num1: 3, num2: 5, operation: 'subtraction' },
      show: { group1: 3, group2: true, formula: true },
      annotation: { text: '试试：3-5=?', position: 'bottom' },
    },
  },
  {
    lineId: 'param-5',
    sectionId: 'parameters',
    scene: { id: 'param-div-test', type: 'interactive' },
    lineState: {
      params: { num1: 7, num2: 3, operation: 'division' },
      show: { group1: true, group2: true, formula: true, result: true },
      annotation: { text: '试试：7÷3=?', position: 'bottom' },
    },
  },

  // ========== application 段落 (5行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { group1: false, group2: false, formula: false },
      annotation: { text: '生活中的应用', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-add-sub', type: 'application' },
    lineState: {
      params: { num1: 5, num2: 3, operation: 'addition' },
      show: { group1: 5, group2: 3, formula: true },
      annotation: { text: '买东西：加法算总价，减法找零', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-mul', type: 'application' },
    lineState: {
      params: { num1: 5, num2: 3, operation: 'multiplication' },
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '3包糖×5颗=15颗', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-div', type: 'application' },
    lineState: {
      params: { num1: 12, num2: 4, operation: 'division' },
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '12块饼干÷4人=每人3块', position: 'bottom' },
    },
  },
  {
    lineId: 'app-5',
    sectionId: 'application',
    scene: { id: 'app-summary', type: 'application' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: true },
      annotation: { text: '学好四则运算！', position: 'bottom' },
    },
  },

  // ========== summary 段落 (6行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'sum-title', type: 'title' },
    lineState: {
      show: { group1: false, group2: false, formula: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'sum-add', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: true },
      annotation: { text: '加法：合并，向右走', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'sum-sub', type: 'animation' },
    lineState: {
      params: { num1: 5, num2: 2, operation: 'subtraction' },
      show: { group1: 5, group2: true, formula: true },
      annotation: { text: '减法：拿走，向左走', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'sum-mul', type: 'animation' },
    lineState: {
      params: { num1: 3, num2: 4, operation: 'multiplication' },
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '乘法：重复加法', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'sum-div', type: 'animation' },
    lineState: {
      params: { num1: 12, num2: 3, operation: 'division' },
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '除法：平均分', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-6',
    sectionId: 'summary',
    scene: { id: 'sum-end', type: 'title' },
    lineState: {
      show: { group1: false, group2: false, formula: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
