/**
 * 集合论可视化讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 50 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultSetTheoryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置 - 每行口播对应一个场景
export const setTheoryScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: {
      show: { venn: false, formula: false, result: false },
    },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-toys', type: 'title' },
    lineState: {
      show: { venn: false, formula: false, result: false },
      annotation: { text: '分类玩具=集合思想', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-sets', type: 'title' },
    lineState: {
      show: { venn: false, formula: false, result: false },
      annotation: { text: '集合=分组的数学方法', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-start', type: 'title' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: false, result: false },
    },
  },

  // ========== concept 段落 (5行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-def', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: false, result: false },
      annotation: { text: '集合=共同特点的东西', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-a', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: false },
      highlight: ['setA'],
      annotation: { text: 'A = {1, 2, 3, 4, 5}', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-b', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: false },
      highlight: ['setB'],
      annotation: { text: 'B = {4, 5, 6, 7, 8}', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-element', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: false },
      annotation: { text: '大括号里的=元素', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-5',
    sectionId: 'concept',
    scene: { id: 'concept-belong', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: false },
      annotation: { text: '3∈A 表示"3属于A"', position: 'bottom' },
    },
  },

  // ========== venn 段落 (5行) ==========
  {
    lineId: 'venn-1',
    sectionId: 'venn',
    scene: { id: 'venn-intro', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: false, result: false },
      annotation: { text: '韦恩图=圆圈表示集合', position: 'top' },
    },
  },
  {
    lineId: 'venn-2',
    sectionId: 'venn',
    scene: { id: 'venn-circles', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: false, result: false },
      highlight: ['setA', 'setB'],
      annotation: { text: '蓝=A，绿=B', position: 'bottom' },
    },
  },
  {
    lineId: 'venn-3',
    sectionId: 'venn',
    scene: { id: 'venn-overlap', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: false, result: false },
      highlight: ['overlap'],
      annotation: { text: '重叠=共同元素', position: 'bottom' },
    },
  },
  {
    lineId: 'venn-4',
    sectionId: 'venn',
    scene: { id: 'venn-common', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: true },
      highlight: ['overlap'],
      annotation: { text: '4和5在重叠区域', position: 'bottom' },
    },
  },
  {
    lineId: 'venn-5',
    sectionId: 'venn',
    scene: { id: 'venn-visual', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: false },
      annotation: { text: '一眼看出集合关系！', position: 'bottom' },
    },
  },

  // ========== union 段落 (5行) ==========
  {
    lineId: 'union-1',
    sectionId: 'union',
    scene: { id: 'union-def', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: false, result: false },
      annotation: { text: '并集=所有元素合在一起', position: 'top' },
    },
  },
  {
    lineId: 'union-2',
    sectionId: 'union',
    scene: { id: 'union-symbol', type: 'formula' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: false },
      annotation: { text: '∪ 读作"并"', position: 'bottom' },
    },
  },
  {
    lineId: 'union-3',
    sectionId: 'union',
    scene: { id: 'union-venn', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: false },
      highlight: ['union'],
      annotation: { text: '紫色=并集区域', position: 'bottom' },
    },
  },
  {
    lineId: 'union-4',
    sectionId: 'union',
    scene: { id: 'union-example', type: 'formula' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: 'A∪B = {1,2,3,4,5,6,7,8}', position: 'bottom' },
    },
  },
  {
    lineId: 'union-5',
    sectionId: 'union',
    scene: { id: 'union-note', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '重复元素只写一次', position: 'bottom' },
    },
  },

  // ========== intersection 段落 (5行) ==========
  {
    lineId: 'inter-1',
    sectionId: 'intersection',
    scene: { id: 'inter-def', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: false, result: false },
      annotation: { text: '交集=共同拥有的元素', position: 'top' },
    },
  },
  {
    lineId: 'inter-2',
    sectionId: 'intersection',
    scene: { id: 'inter-symbol', type: 'formula' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: false },
      annotation: { text: '∩ 读作"交"', position: 'bottom' },
    },
  },
  {
    lineId: 'inter-3',
    sectionId: 'intersection',
    scene: { id: 'inter-venn', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: false },
      highlight: ['intersection'],
      annotation: { text: '紫色=交集区域(重叠)', position: 'bottom' },
    },
  },
  {
    lineId: 'inter-4',
    sectionId: 'intersection',
    scene: { id: 'inter-example', type: 'formula' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: 'A∩B = {4, 5}', position: 'bottom' },
    },
  },
  {
    lineId: 'inter-5',
    sectionId: 'intersection',
    scene: { id: 'inter-result', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: true },
      highlight: ['intersection'],
      annotation: { text: '只有4和5同时在A和B里', position: 'bottom' },
    },
  },

  // ========== difference 段落 (5行) ==========
  {
    lineId: 'diff-1',
    sectionId: 'difference',
    scene: { id: 'diff-def', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'difference' },
      show: { venn: true, formula: false, result: false },
      annotation: { text: '差集=去掉另一个集合的元素', position: 'top' },
    },
  },
  {
    lineId: 'diff-2',
    sectionId: 'difference',
    scene: { id: 'diff-symbol', type: 'formula' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'difference' },
      show: { venn: true, formula: true, result: false },
      annotation: { text: 'A\\B 读作"A减B"', position: 'bottom' },
    },
  },
  {
    lineId: 'diff-3',
    sectionId: 'difference',
    scene: { id: 'diff-venn', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'difference' },
      show: { venn: true, formula: true, result: false },
      highlight: ['difference'],
      annotation: { text: '紫色=A有B没有', position: 'bottom' },
    },
  },
  {
    lineId: 'diff-4',
    sectionId: 'difference',
    scene: { id: 'diff-example', type: 'formula' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'difference' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: 'A\\B = {1, 2, 3}', position: 'bottom' },
    },
  },
  {
    lineId: 'diff-5',
    sectionId: 'difference',
    scene: { id: 'diff-result', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'difference' },
      show: { venn: true, formula: true, result: true },
      highlight: ['difference'],
      annotation: { text: '1,2,3只在A里不在B里', position: 'bottom' },
    },
  },

  // ========== symmetric 段落 (5行) ==========
  {
    lineId: 'sym-1',
    sectionId: 'symmetric',
    scene: { id: 'sym-def', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'symmetric' },
      show: { venn: true, formula: false, result: false },
      annotation: { text: '对称差=各自独有的元素', position: 'top' },
    },
  },
  {
    lineId: 'sym-2',
    sectionId: 'symmetric',
    scene: { id: 'sym-symbol', type: 'formula' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'symmetric' },
      show: { venn: true, formula: true, result: false },
      annotation: { text: '△ 读作"对称差"', position: 'bottom' },
    },
  },
  {
    lineId: 'sym-3',
    sectionId: 'symmetric',
    scene: { id: 'sym-venn', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'symmetric' },
      show: { venn: true, formula: true, result: false },
      highlight: ['symmetric'],
      annotation: { text: '紫色=不重叠的区域', position: 'bottom' },
    },
  },
  {
    lineId: 'sym-4',
    sectionId: 'symmetric',
    scene: { id: 'sym-example', type: 'formula' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'symmetric' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: 'A△B = {1,2,3,6,7,8}', position: 'bottom' },
    },
  },
  {
    lineId: 'sym-5',
    sectionId: 'symmetric',
    scene: { id: 'sym-explain', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'symmetric' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '对称差=并集-交集', position: 'bottom' },
    },
  },

  // ========== parameters 段落 (5行) ==========
  {
    lineId: 'param-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '轮到你了！', position: 'top' },
    },
  },
  {
    lineId: 'param-2',
    sectionId: 'parameters',
    scene: { id: 'param-sets', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '修改集合A和B的元素', position: 'bottom' },
    },
  },
  {
    lineId: 'param-3',
    sectionId: 'parameters',
    scene: { id: 'param-ops', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '点击不同运算按钮', position: 'bottom' },
    },
  },
  {
    lineId: 'param-4',
    sectionId: 'parameters',
    scene: { id: 'param-disjoint', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { setA: [1, 2, 3], setB: [6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '不重叠时交集=空集', position: 'bottom' },
    },
  },
  {
    lineId: 'param-5',
    sectionId: 'parameters',
    scene: { id: 'param-subset', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [2, 3, 4], operation: 'difference' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: 'B⊂A时差集特殊', position: 'bottom' },
    },
  },

  // ========== application 段落 (5行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { venn: false, formula: false, result: false },
      annotation: { text: '生活中的集合运算', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-sports', type: 'application' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: false, result: false },
      annotation: { text: '足球同学A，篮球同学B', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-example', type: 'application' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '两种都喜欢=交集', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-search', type: 'application' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '搜索引擎AND=∩，OR=∪', position: 'bottom' },
    },
  },
  {
    lineId: 'app-5',
    sectionId: 'application',
    scene: { id: 'app-summary', type: 'application' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '学好集合分类整理信息！', position: 'bottom' },
    },
  },

  // ========== summary 段落 (6行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { venn: false, formula: false, result: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-set', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: false },
      annotation: { text: '集合=共同特点元素，用{}', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-venn', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'intersection' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '韦恩图圆圈表示，重叠=共同', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-ops', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'union' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '∪全部 ∩共同 \\独有', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-sym', type: 'animation' },
    lineState: {
      params: { setA: [1, 2, 3, 4, 5], setB: [4, 5, 6, 7, 8], operation: 'symmetric' },
      show: { venn: true, formula: true, result: true },
      annotation: { text: '△各自独有=∪-∩', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-6',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { venn: false, formula: false, result: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
