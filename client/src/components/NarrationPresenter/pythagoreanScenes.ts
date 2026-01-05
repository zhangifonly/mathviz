/**
 * 勾股定理讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 33 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultPythagoreanState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置 - 每行口播对应一个场景
export const pythagoreanScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: {
      show: { triangle: false, squares: false, proof: false },
    },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-history', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false },
      annotation: { text: '数千年历史的定理', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-names', type: 'illustration' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false },
      annotation: { text: '勾三股四弦五 / 毕达哥拉斯', position: 'bottom' },
    },
  },

  // ========== theorem 段落 (4行) ==========
  {
    lineId: 'theorem-1',
    sectionId: 'theorem',
    scene: { id: 'thm-statement', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false },
      annotation: { text: '直角边平方和=斜边平方', position: 'top' },
    },
  },
  {
    lineId: 'theorem-2',
    sectionId: 'theorem',
    scene: { id: 'thm-formula', type: 'formula' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false, formula: true },
      annotation: { text: 'a² + b² = c²', position: 'bottom' },
    },
  },
  {
    lineId: 'theorem-3',
    sectionId: 'theorem',
    scene: { id: 'thm-hypotenuse', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false },
      highlight: ['hypotenuse'],
      annotation: { text: '斜边c是最长边，对着直角', position: 'bottom' },
    },
  },
  {
    lineId: 'theorem-4',
    sectionId: 'theorem',
    scene: { id: 'thm-usage', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false, formula: true },
      annotation: { text: '可求任意一边长度', position: 'bottom' },
    },
  },

  // ========== visualization 段落 (4行) ==========
  {
    lineId: 'visualization-1',
    sectionId: 'visualization',
    scene: { id: 'vis-triangle', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false },
      highlight: ['triangle'],
      annotation: { text: '蓝色直角三角形', position: 'top' },
    },
  },
  {
    lineId: 'visualization-2',
    sectionId: 'visualization',
    scene: { id: 'vis-squares', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: true, proof: false },
      highlight: ['squareA', 'squareB'],
      annotation: { text: '红=a²，绿=b²', position: 'bottom' },
    },
  },
  {
    lineId: 'visualization-3',
    sectionId: 'visualization',
    scene: { id: 'vis-area', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: true, proof: false },
      highlight: ['squareC'],
      annotation: { text: 'a²+b²=c²(面积关系)', position: 'bottom' },
    },
  },
  {
    lineId: 'visualization-4',
    sectionId: 'visualization',
    scene: { id: 'vis-checkbox', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: true, proof: false },
      annotation: { text: '勾选显示正方形', position: 'bottom' },
    },
  },

  // ========== proof 段落 (5行) ==========
  {
    lineId: 'proof-1',
    sectionId: 'proof',
    scene: { id: 'proof-mode', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4, mode: 'proof' },
      show: { triangle: true, squares: false, proof: true },
      annotation: { text: '几何证明模式', position: 'top' },
    },
  },
  {
    lineId: 'proof-2',
    sectionId: 'proof',
    scene: { id: 'proof-sq-a', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4, mode: 'proof' },
      show: { triangle: true, squares: true, proof: true },
      highlight: ['squareA'],
      annotation: { text: '边长a的正方形面积=a²', position: 'bottom' },
    },
  },
  {
    lineId: 'proof-3',
    sectionId: 'proof',
    scene: { id: 'proof-sq-b', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4, mode: 'proof' },
      show: { triangle: true, squares: true, proof: true },
      highlight: ['squareB'],
      annotation: { text: 'b²，两者之和=a²+b²', position: 'bottom' },
    },
  },
  {
    lineId: 'proof-4',
    sectionId: 'proof',
    scene: { id: 'proof-sq-c', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4, mode: 'proof' },
      show: { triangle: true, squares: true, proof: true },
      highlight: ['squareC'],
      annotation: { text: '斜边正方形c²=a²+b²', position: 'bottom' },
    },
  },
  {
    lineId: 'proof-5',
    sectionId: 'proof',
    scene: { id: 'proof-anim', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4, mode: 'proof', isAnimating: true },
      show: { triangle: true, squares: true, proof: true },
      annotation: { text: '播放动画看正方形出现', position: 'bottom' },
    },
  },

  // ========== pythagorean-triples 段落 (5行) ==========
  {
    lineId: 'pythagorean-triples-1',
    sectionId: 'pythagorean-triples',
    scene: { id: 'triples-def', type: 'formula' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false, formula: true },
      annotation: { text: '勾股数=满足定理的正整数', position: 'top' },
    },
  },
  {
    lineId: 'pythagorean-triples-2',
    sectionId: 'pythagorean-triples',
    scene: { id: 'triples-345', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: true, proof: false },
      highlight: ['triple345'],
      annotation: { text: '3²+4²=9+16=25=5²', position: 'bottom' },
    },
  },
  {
    lineId: 'pythagorean-triples-3',
    sectionId: 'pythagorean-triples',
    scene: { id: 'triples-others', type: 'animation' },
    lineState: {
      params: { a: 5, b: 12 },
      show: { triangle: true, squares: false, proof: false },
      annotation: { text: '5,12,13 和 8,15,17', position: 'bottom' },
    },
  },
  {
    lineId: 'pythagorean-triples-4',
    sectionId: 'pythagorean-triples',
    scene: { id: 'triples-multiples', type: 'animation' },
    lineState: {
      params: { a: 6, b: 8 },
      show: { triangle: true, squares: false, proof: false },
      annotation: { text: '6,8,10是3,4,5的两倍', position: 'bottom' },
    },
  },
  {
    lineId: 'pythagorean-triples-5',
    sectionId: 'pythagorean-triples',
    scene: { id: 'triples-buttons', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: true, proof: false },
      annotation: { text: '点击快速设置按钮', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'application-1',
    sectionId: 'application',
    scene: { id: 'app-mode', type: 'application' },
    lineState: {
      params: { a: 3, b: 4, mode: 'application' },
      show: { triangle: true, squares: false, proof: false },
      annotation: { text: '实际应用模式', position: 'top' },
    },
  },
  {
    lineId: 'application-2',
    sectionId: 'application',
    scene: { id: 'app-ladder', type: 'application' },
    lineState: {
      params: { a: 3, b: 4, mode: 'application' },
      show: { triangle: true, squares: false, proof: false },
      annotation: { text: '梯子靠墙问题', position: 'bottom' },
    },
  },
  {
    lineId: 'application-3',
    sectionId: 'application',
    scene: { id: 'app-triangle', type: 'application' },
    lineState: {
      params: { a: 3, b: 4, mode: 'application' },
      show: { triangle: true, squares: false, proof: false },
      highlight: ['ladder'],
      annotation: { text: '梯子=斜边，墙和地=直角边', position: 'bottom' },
    },
  },
  {
    lineId: 'application-4',
    sectionId: 'application',
    scene: { id: 'app-solve', type: 'application' },
    lineState: {
      params: { a: 3, b: 4, mode: 'application' },
      show: { triangle: true, squares: false, proof: false, formula: true },
      annotation: { text: '用勾股定理求边长', position: 'bottom' },
    },
  },

  // ========== parameters 段落 (3行) ==========
  {
    lineId: 'parameters-1',
    sectionId: 'parameters',
    scene: { id: 'param-slider', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: true, proof: false },
      annotation: { text: '用滑块调整a和b', position: 'top' },
    },
  },
  {
    lineId: 'parameters-2',
    sectionId: 'parameters',
    scene: { id: 'param-auto', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 5, b: 12 },
      show: { triangle: true, squares: true, proof: false },
      annotation: { text: 'c自动计算', position: 'bottom' },
    },
  },
  {
    lineId: 'parameters-3',
    sectionId: 'parameters',
    scene: { id: 'param-observe', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: true, proof: false },
      annotation: { text: '观察面积关系变化', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { triangle: false, squares: false, proof: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-formula', type: 'formula' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false, formula: true },
      annotation: { text: 'a²+b²=c²，c是斜边', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-proof', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: true, proof: true },
      annotation: { text: '面积法证明', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-usage', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { triangle: true, squares: false, proof: false },
      annotation: { text: '测量、建筑、导航应用', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { triangle: false, squares: false, proof: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
