/**
 * 二次函数讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 38 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultQuadraticState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const quadraticScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { parabola: false, grid: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-parabola', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: 0 },
      show: { parabola: true, grid: true },
      annotation: { text: '抛物线', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-examples', type: 'illustration' },
    lineState: {
      params: { a: -0.5, b: 0, c: 2 },
      show: { parabola: true, grid: true },
      annotation: { text: '投篮、喷泉轨迹', position: 'bottom' },
    },
  },

  // ========== formula 段落 (4行) ==========
  {
    lineId: 'formula-1',
    sectionId: 'formula',
    scene: { id: 'formula-general', type: 'formula' },
    lineState: {
      params: { a: 1, b: 2, c: 1 },
      show: { parabola: true, grid: true, formula: true },
      annotation: { text: 'y = ax² + bx + c', position: 'top' },
    },
  },
  {
    lineId: 'formula-2',
    sectionId: 'formula',
    scene: { id: 'formula-a', type: 'formula' },
    lineState: {
      params: { a: 2, b: 0, c: 0 },
      show: { parabola: true, grid: true, formula: true },
      highlight: ['a'],
      annotation: { text: 'a决定开口方向和宽窄', position: 'bottom' },
    },
  },
  {
    lineId: 'formula-3',
    sectionId: 'formula',
    scene: { id: 'formula-bc', type: 'formula' },
    lineState: {
      params: { a: 1, b: 2, c: -3 },
      show: { parabola: true, grid: true, formula: true },
      highlight: ['b', 'c'],
      annotation: { text: 'b和c决定位置', position: 'bottom' },
    },
  },
  {
    lineId: 'formula-4',
    sectionId: 'formula',
    scene: { id: 'formula-vertex', type: 'formula' },
    lineState: {
      params: { a: 1, b: -2, c: 1 },
      show: { parabola: true, grid: true, formula: true, vertex: true },
      annotation: { text: '顶点式: y=a(x-h)²+k', position: 'bottom' },
    },
  },

  // ========== coefficient-a 段落 (5行) ==========
  {
    lineId: 'coefficient-a-1',
    sectionId: 'coefficient-a',
    scene: { id: 'coef-intro', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: 0 },
      show: { parabola: true, grid: true },
      annotation: { text: 'a是最重要的参数', position: 'top' },
    },
  },
  {
    lineId: 'coefficient-a-2',
    sectionId: 'coefficient-a',
    scene: { id: 'coef-positive', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: 0 },
      show: { parabola: true, grid: true, vertex: true },
      annotation: { text: 'a>0，开口向上，有最低点', position: 'bottom' },
    },
  },
  {
    lineId: 'coefficient-a-3',
    sectionId: 'coefficient-a',
    scene: { id: 'coef-negative', type: 'animation' },
    lineState: {
      params: { a: -1, b: 0, c: 0 },
      show: { parabola: true, grid: true, vertex: true },
      annotation: { text: 'a<0，开口向下，有最高点', position: 'bottom' },
    },
  },
  {
    lineId: 'coefficient-a-4',
    sectionId: 'coefficient-a',
    scene: { id: 'coef-abs', type: 'animation' },
    lineState: {
      params: { a: 3, b: 0, c: 0 },
      show: { parabola: true, grid: true },
      annotation: { text: '|a|大→窄陡，|a|小→宽缓', position: 'bottom' },
    },
  },
  {
    lineId: 'coefficient-a-5',
    sectionId: 'coefficient-a',
    scene: { id: 'coef-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 1, b: 0, c: 0 },
      show: { parabola: true, grid: true },
      annotation: { text: '调整a观察变化', position: 'bottom' },
    },
  },

  // ========== vertex 段落 (4行) ==========
  {
    lineId: 'vertex-1',
    sectionId: 'vertex',
    scene: { id: 'vertex-intro', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: 0 },
      show: { parabola: true, grid: true, vertex: true },
      annotation: { text: '顶点=最高/最低点', position: 'top' },
    },
  },
  {
    lineId: 'vertex-2',
    sectionId: 'vertex',
    scene: { id: 'vertex-formula', type: 'formula' },
    lineState: {
      params: { a: 1, b: -2, c: 0 },
      show: { parabola: true, grid: true, vertex: true, formula: true },
      annotation: { text: 'x = -b/(2a)', position: 'bottom' },
    },
  },
  {
    lineId: 'vertex-3',
    sectionId: 'vertex',
    scene: { id: 'vertex-axis', type: 'animation' },
    lineState: {
      params: { a: 1, b: -2, c: 0 },
      show: { parabola: true, grid: true, vertex: true, axis: true },
      annotation: { text: '对称轴过顶点', position: 'bottom' },
    },
  },
  {
    lineId: 'vertex-4',
    sectionId: 'vertex',
    scene: { id: 'vertex-show', type: 'animation' },
    lineState: {
      params: { a: 1, b: -2, c: -3 },
      show: { parabola: true, grid: true, vertex: true, axis: true },
      highlight: ['vertex', 'axis'],
      annotation: { text: '红点=顶点，灰线=对称轴', position: 'bottom' },
    },
  },

  // ========== roots 段落 (6行) ==========
  {
    lineId: 'roots-1',
    sectionId: 'roots',
    scene: { id: 'roots-def', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: -4 },
      show: { parabola: true, grid: true, roots: true },
      annotation: { text: '根=与x轴交点', position: 'top' },
    },
  },
  {
    lineId: 'roots-2',
    sectionId: 'roots',
    scene: { id: 'roots-delta', type: 'formula' },
    lineState: {
      params: { a: 1, b: 0, c: -4 },
      show: { parabola: true, grid: true, roots: true, formula: true },
      annotation: { text: 'Δ = b² - 4ac', position: 'bottom' },
    },
  },
  {
    lineId: 'roots-3',
    sectionId: 'roots',
    scene: { id: 'roots-two', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: -4 },
      show: { parabola: true, grid: true, roots: true },
      highlight: ['roots'],
      annotation: { text: 'Δ>0: 两个不等实根', position: 'bottom' },
    },
  },
  {
    lineId: 'roots-4',
    sectionId: 'roots',
    scene: { id: 'roots-one', type: 'animation' },
    lineState: {
      params: { a: 1, b: -2, c: 1 },
      show: { parabola: true, grid: true, roots: true },
      annotation: { text: 'Δ=0: 一个重根(相切)', position: 'bottom' },
    },
  },
  {
    lineId: 'roots-5',
    sectionId: 'roots',
    scene: { id: 'roots-none', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: 4 },
      show: { parabola: true, grid: true },
      annotation: { text: 'Δ<0: 无实根(不相交)', position: 'bottom' },
    },
  },
  {
    lineId: 'roots-6',
    sectionId: 'roots',
    scene: { id: 'roots-show', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 1, b: 0, c: -4 },
      show: { parabola: true, grid: true, roots: true },
      annotation: { text: '绿点=根', position: 'bottom' },
    },
  },

  // ========== animation 段落 (3行) ==========
  {
    lineId: 'animation-1',
    sectionId: 'animation',
    scene: { id: 'anim-button', type: 'animation' },
    lineState: {
      params: { a: -2, b: 0, c: 0, isAnimating: false },
      show: { parabola: true, grid: true },
      annotation: { text: '点击播放动画', position: 'top' },
    },
  },
  {
    lineId: 'animation-2',
    sectionId: 'animation',
    scene: { id: 'anim-change', type: 'animation' },
    lineState: {
      params: { a: 0, b: 0, c: 0, isAnimating: true },
      show: { parabola: true, grid: true },
      annotation: { text: 'a从-2变到2', position: 'bottom' },
    },
  },
  {
    lineId: 'animation-3',
    sectionId: 'animation',
    scene: { id: 'anim-understand', type: 'animation' },
    lineState: {
      params: { a: 2, b: 0, c: 0, isAnimating: true },
      show: { parabola: true, grid: true },
      annotation: { text: '理解a对形态的影响', position: 'bottom' },
    },
  },

  // ========== examples 段落 (5行) ==========
  {
    lineId: 'examples-1',
    sectionId: 'examples',
    scene: { id: 'ex-intro', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: 0 },
      show: { parabola: true, grid: true },
      annotation: { text: '典型二次函数', position: 'top' },
    },
  },
  {
    lineId: 'examples-2',
    sectionId: 'examples',
    scene: { id: 'ex-simple', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: 0 },
      show: { parabola: true, grid: true, vertex: true, formula: true },
      annotation: { text: 'y=x²，顶点在原点', position: 'bottom' },
    },
  },
  {
    lineId: 'examples-3',
    sectionId: 'examples',
    scene: { id: 'ex-negative', type: 'animation' },
    lineState: {
      params: { a: -1, b: 0, c: 0 },
      show: { parabola: true, grid: true, vertex: true, formula: true },
      annotation: { text: 'y=-x²，开口向下', position: 'bottom' },
    },
  },
  {
    lineId: 'examples-4',
    sectionId: 'examples',
    scene: { id: 'ex-shift-y', type: 'animation' },
    lineState: {
      params: { a: 1, b: 0, c: -4 },
      show: { parabola: true, grid: true, roots: true, formula: true },
      annotation: { text: 'y=x²-4，下移4', position: 'bottom' },
    },
  },
  {
    lineId: 'examples-5',
    sectionId: 'examples',
    scene: { id: 'ex-shift-x', type: 'animation' },
    lineState: {
      params: { a: 1, b: -2, c: 1 },
      show: { parabola: true, grid: true, vertex: true, formula: true },
      annotation: { text: 'y=(x-1)²，右移1', position: 'bottom' },
    },
  },

  // ========== application 段落 (3行) ==========
  {
    lineId: 'application-1',
    sectionId: 'application',
    scene: { id: 'app-physics', type: 'application' },
    lineState: {
      params: { a: -0.5, b: 2, c: 0 },
      show: { parabola: true, grid: true },
      annotation: { text: '抛体运动轨迹', position: 'top' },
    },
  },
  {
    lineId: 'application-2',
    sectionId: 'application',
    scene: { id: 'app-engineering', type: 'application' },
    lineState: {
      params: { a: 0.5, b: 0, c: 0 },
      show: { parabola: true, grid: true },
      annotation: { text: '拱桥、抛物面天线', position: 'bottom' },
    },
  },
  {
    lineId: 'application-3',
    sectionId: 'application',
    scene: { id: 'app-economics', type: 'application' },
    lineState: {
      params: { a: -1, b: 4, c: 0 },
      show: { parabola: true, grid: true, vertex: true },
      annotation: { text: '利润函数，顶点=最大利润', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { parabola: false, grid: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-formula', type: 'formula' },
    lineState: {
      params: { a: 1, b: 0, c: 0 },
      show: { parabola: true, grid: true, formula: true },
      annotation: { text: 'y=ax²+bx+c，a决定开口', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-vertex', type: 'animation' },
    lineState: {
      params: { a: 1, b: -2, c: 0 },
      show: { parabola: true, grid: true, vertex: true, axis: true },
      annotation: { text: '顶点=最值点，对称轴过顶点', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-delta', type: 'formula' },
    lineState: {
      params: { a: 1, b: 0, c: -4 },
      show: { parabola: true, grid: true, roots: true, formula: true },
      annotation: { text: 'Δ决定根的个数', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { parabola: false, grid: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
