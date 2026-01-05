/**
 * basic-arithmetic 逐句场景配置
 * Khan Academy 风格：每句话对应精确的动画状态
 */

import type { NarrationLineScene } from '../../types'

export const basicArithmeticScenes: NarrationLineScene[] = [
  // ========== intro 段落 ==========
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
      show: { group1: 3, group2: 2, formula: false },
      params: { num1: 3, num2: 2, operation: 'addition' },
      animate: { type: 'fadeIn', target: 'all' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-ops', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '加 减 乘 除', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-encourage', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      highlight: ['group1', 'group2'],
    },
  },

  // ========== addition 段落 ==========
  {
    lineId: 'add-1',
    sectionId: 'addition',
    scene: { id: 'add-concept', type: 'animation' },
    lineState: {
      show: { group1: 3, group2: false, formula: false },
      params: { num1: 3, num2: 2, operation: 'addition' },
      annotation: { text: '加法 = 合并', position: 'top' },
    },
  },
  {
    lineId: 'add-2',
    sectionId: 'addition',
    scene: { id: 'add-show-groups', type: 'animation' },
    lineState: {
      show: { group1: 3, group2: 2, formula: false },
      highlight: ['group1'],
      annotation: { text: '蓝色 = 第一个数', position: 'top', target: 'group1' },
    },
  },
  {
    lineId: 'add-3',
    sectionId: 'addition',
    scene: { id: 'add-merge', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, result: true, formula: true },
      animate: { type: 'merge', duration: 800 },
      annotation: { text: '数一数，一共 5 个！', position: 'bottom' },
    },
  },
  {
    lineId: 'add-4',
    sectionId: 'addition',
    scene: { id: 'add-numberline', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, numberLine: true, arrow: true },
      annotation: { text: '向右走', position: 'top' },
    },
  },
  {
    lineId: 'add-5',
    sectionId: 'addition',
    scene: { id: 'add-commutative', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      params: { num1: 7, num2: 5, operation: 'addition' },
      annotation: { text: '7+5 = 5+7 = 12', position: 'bottom' },
    },
  },

  // ========== subtraction 段落 ==========
  {
    lineId: 'sub-1',
    sectionId: 'subtraction',
    scene: { id: 'sub-concept', type: 'animation' },
    lineState: {
      show: { group1: 7, group2: false, formula: false },
      params: { num1: 7, num2: 5, operation: 'subtraction' },
      annotation: { text: '减法 = 拿走', position: 'top' },
    },
  },
  {
    lineId: 'sub-2',
    sectionId: 'subtraction',
    scene: { id: 'sub-show-all', type: 'animation' },
    lineState: {
      show: { group1: 7, group2: false, formula: false },
      highlight: ['group1'],
      annotation: { text: '开始有 7 个', position: 'top' },
    },
  },
  {
    lineId: 'sub-3',
    sectionId: 'subtraction',
    scene: { id: 'sub-remove', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, result: true, formula: true },
      animate: { type: 'remove', target: 'group2', duration: 800 },
      annotation: { text: '拿走 5 个，剩 2 个', position: 'bottom' },
    },
  },
  {
    lineId: 'sub-4',
    sectionId: 'subtraction',
    scene: { id: 'sub-numberline', type: 'animation' },
    lineState: {
      show: { group1: true, numberLine: true, arrow: true },
      annotation: { text: '向左走', position: 'top' },
    },
  },
  {
    lineId: 'sub-5',
    sectionId: 'subtraction',
    scene: { id: 'sub-inverse', type: 'animation' },
    lineState: {
      show: { group1: true, formula: true },
      annotation: { text: '7+5=12 → 12-5=7', position: 'bottom' },
    },
  },

  // ========== multiplication 段落 ==========
  {
    lineId: 'mul-1',
    sectionId: 'multiplication',
    scene: { id: 'mul-concept', type: 'animation' },
    lineState: {
      show: { group1: 3, group2: false, formula: false },
      params: { num1: 3, num2: 4, operation: 'multiplication' },
      annotation: { text: '乘法 = 重复加法', position: 'top' },
    },
  },
  {
    lineId: 'mul-2',
    sectionId: 'multiplication',
    scene: { id: 'mul-explain', type: 'animation' },
    lineState: {
      show: { group1: true, group2: false, formula: false },
      annotation: { text: '3×4 = 3+3+3+3', position: 'bottom' },
    },
  },
  {
    lineId: 'mul-3',
    sectionId: 'multiplication',
    scene: { id: 'mul-grid', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      animate: { type: 'fadeIn', duration: 600 },
      annotation: { text: '排成 3 行 4 列', position: 'top' },
    },
  },
  {
    lineId: 'mul-4',
    sectionId: 'multiplication',
    scene: { id: 'mul-commutative', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '3×4 = 4×3 = 12', position: 'bottom' },
    },
  },
  {
    lineId: 'mul-5',
    sectionId: 'multiplication',
    scene: { id: 'mul-summary', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      highlight: ['formula'],
      annotation: { text: '"几个几"的简便写法', position: 'bottom' },
    },
  },

  // ========== division 段落 ==========
  {
    lineId: 'div-1',
    sectionId: 'division',
    scene: { id: 'div-concept', type: 'animation' },
    lineState: {
      show: { group1: 12, group2: false, formula: false },
      params: { num1: 12, num2: 3, operation: 'division' },
      annotation: { text: '除法 = 平均分', position: 'top' },
    },
  },
  {
    lineId: 'div-2',
    sectionId: 'division',
    scene: { id: 'div-show-all', type: 'animation' },
    lineState: {
      show: { group1: 12, group2: false, formula: false },
      annotation: { text: '12 个方块分成 3 组', position: 'top' },
    },
  },
  {
    lineId: 'div-3',
    sectionId: 'division',
    scene: { id: 'div-split', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, result: true, formula: true },
      animate: { type: 'split', duration: 800 },
      annotation: { text: '每组 4 个！', position: 'bottom' },
    },
  },
  {
    lineId: 'div-4',
    sectionId: 'division',
    scene: { id: 'div-remainder', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, result: true, formula: true },
      params: { num1: 7, num2: 3, operation: 'division' },
      annotation: { text: '7÷3=2...1 有余数', position: 'bottom' },
    },
  },
  {
    lineId: 'div-5',
    sectionId: 'division',
    scene: { id: 'div-inverse', type: 'animation' },
    lineState: {
      show: { group1: true, formula: true },
      params: { num1: 12, num2: 3, operation: 'division' },
      annotation: { text: '3×4=12 → 12÷3=4', position: 'bottom' },
    },
  },

  // ========== animation 段落 ==========
  {
    lineId: 'anim-1',
    sectionId: 'animation',
    scene: { id: 'anim-intro', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      params: { num1: 5, num2: 3, operation: 'addition' },
    },
  },
  {
    lineId: 'anim-2',
    sectionId: 'animation',
    scene: { id: 'anim-step1', type: 'animation' },
    lineState: {
      show: { group1: 5, group2: false, formula: false },
      highlight: ['group1'],
      annotation: { text: '第一步：第一个数', position: 'top' },
    },
  },
  {
    lineId: 'anim-3',
    sectionId: 'animation',
    scene: { id: 'anim-step2', type: 'animation' },
    lineState: {
      show: { group1: true, group2: 3, formula: false },
      highlight: ['group2'],
      animate: { type: 'slideIn', target: 'group2', duration: 600 },
      annotation: { text: '第二步：加入第二个数', position: 'top' },
    },
  },
  {
    lineId: 'anim-4',
    sectionId: 'animation',
    scene: { id: 'anim-step3', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, result: true, formula: true },
      animate: { type: 'count', duration: 1000 },
      annotation: { text: '第三步：数一数结果！', position: 'bottom' },
    },
  },

  // ========== parameters 段落 ==========
  {
    lineId: 'param-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'interactive' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
    },
  },
  {
    lineId: 'param-2',
    sectionId: 'parameters',
    scene: { id: 'param-ops', type: 'interactive' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '选择运算类型', position: 'top' },
    },
  },
  {
    lineId: 'param-3',
    sectionId: 'parameters',
    scene: { id: 'param-nums', type: 'interactive' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      annotation: { text: '拖动滑块改变数字', position: 'top' },
    },
  },
  {
    lineId: 'param-4',
    sectionId: 'parameters',
    scene: { id: 'param-sub', type: 'interactive' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      params: { num1: 3, num2: 5, operation: 'subtraction' },
      annotation: { text: '试试 3-5 会怎样？', position: 'bottom' },
    },
  },
  {
    lineId: 'param-5',
    sectionId: 'parameters',
    scene: { id: 'param-div', type: 'interactive' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      params: { num1: 7, num2: 3, operation: 'division' },
      annotation: { text: '除法有余数吗？', position: 'bottom' },
    },
  },

  // ========== application 段落 ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      annotation: { text: '生活中的数学', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-shopping', type: 'application' },
    lineState: {
      params: { operation: 'addition' },
      annotation: { text: '买东西算总价', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-candy', type: 'application' },
    lineState: {
      params: { num1: 3, num2: 5, operation: 'multiplication' },
      annotation: { text: '3包×5颗=15颗', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-share', type: 'application' },
    lineState: {
      params: { num1: 12, num2: 4, operation: 'division' },
      annotation: { text: '12块÷4人=3块', position: 'bottom' },
    },
  },
  {
    lineId: 'app-5',
    sectionId: 'application',
    scene: { id: 'app-summary', type: 'application' },
    lineState: {
      annotation: { text: '数学无处不在！', position: 'bottom' },
    },
  },

  // ========== summary 段落 ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-add', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      params: { num1: 3, num2: 2, operation: 'addition' },
      annotation: { text: '加法：合并，向右走', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-sub', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      params: { num1: 5, num2: 2, operation: 'subtraction' },
      annotation: { text: '减法：拿走，向左走', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-mul', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      params: { num1: 3, num2: 4, operation: 'multiplication' },
      annotation: { text: '乘法：重复加法', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-div', type: 'animation' },
    lineState: {
      show: { group1: true, group2: true, formula: true },
      params: { num1: 12, num2: 3, operation: 'division' },
      annotation: { text: '除法：平均分', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-6',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      annotation: { text: '太棒了！继续探索吧！', position: 'bottom' },
    },
  },
]
