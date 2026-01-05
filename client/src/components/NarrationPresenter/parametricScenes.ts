/**
 * 参数方程讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultParametricState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const parametricScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-func', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true },
      annotation: { text: 'y=f(x) 函数形式', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-solution', type: 'animation' },
    lineState: {
      show: { graph: true, circle: true },
      annotation: { text: '参数方程解决方案', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'con-param', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '参数 t 表示 x 和 y', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'con-form', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: 'x=f(t), y=g(t)', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'con-curve', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, point: true },
      annotation: { text: '点画出曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'con-time', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, point: true },
      annotation: { text: 't=时间，曲线=轨迹', position: 'bottom' },
    },
  },

  // ========== circle 段落 (4行) ==========
  {
    lineId: 'circle-1',
    sectionId: 'circle',
    scene: { id: 'cir-intro', type: 'animation' },
    lineState: {
      params: { r: 1 },
      show: { graph: true, circle: true },
      annotation: { text: '圆的参数方程', position: 'top' },
    },
  },
  {
    lineId: 'circle-2',
    sectionId: 'circle',
    scene: { id: 'cir-eq', type: 'formula' },
    lineState: {
      params: { r: 1 },
      show: { graph: true, circle: true, formula: true },
      annotation: { text: 'x=r cos t, y=r sin t', position: 'bottom' },
    },
  },
  {
    lineId: 'circle-3',
    sectionId: 'circle',
    scene: { id: 'cir-angle', type: 'animation' },
    lineState: {
      params: { r: 1 },
      show: { graph: true, circle: true, angle: true },
      annotation: { text: 't=角度，0到2π', position: 'bottom' },
    },
  },
  {
    lineId: 'circle-4',
    sectionId: 'circle',
    scene: { id: 'cir-compare', type: 'animation' },
    lineState: {
      params: { r: 1 },
      show: { graph: true, circle: true },
      annotation: { text: '比隐函数更方便', position: 'bottom' },
    },
  },

  // ========== ellipse 段落 (4行) ==========
  {
    lineId: 'ellipse-1',
    sectionId: 'ellipse',
    scene: { id: 'ell-intro', type: 'animation' },
    lineState: {
      params: { a: 2, b: 1 },
      show: { graph: true, ellipse: true },
      annotation: { text: '椭圆参数方程', position: 'top' },
    },
  },
  {
    lineId: 'ellipse-2',
    sectionId: 'ellipse',
    scene: { id: 'ell-eq', type: 'formula' },
    lineState: {
      params: { a: 2, b: 1 },
      show: { graph: true, ellipse: true, formula: true },
      annotation: { text: 'x=a cos t, y=b sin t', position: 'bottom' },
    },
  },
  {
    lineId: 'ellipse-3',
    sectionId: 'ellipse',
    scene: { id: 'ell-circle', type: 'animation' },
    lineState: {
      params: { a: 1, b: 1 },
      show: { graph: true, ellipse: true },
      annotation: { text: 'a=b 时退化为圆', position: 'bottom' },
    },
  },
  {
    lineId: 'ellipse-4',
    sectionId: 'ellipse',
    scene: { id: 'ell-param', type: 'animation' },
    lineState: {
      params: { a: 2, b: 1 },
      show: { graph: true, ellipse: true, point: true },
      annotation: { text: 't 从 0 到 2π', position: 'bottom' },
    },
  },

  // ========== cycloid 段落 (4行) ==========
  {
    lineId: 'cycloid-1',
    sectionId: 'cycloid',
    scene: { id: 'cyc-intro', type: 'animation' },
    lineState: {
      params: { r: 1 },
      show: { graph: true, cycloid: true, rollingCircle: true },
      annotation: { text: '摆线：圆滚动轨迹', position: 'top' },
    },
  },
  {
    lineId: 'cycloid-2',
    sectionId: 'cycloid',
    scene: { id: 'cyc-eq', type: 'formula' },
    lineState: {
      params: { r: 1 },
      show: { graph: true, cycloid: true, formula: true },
      annotation: { text: 'x=r(t-sin t), y=r(1-cos t)', position: 'bottom' },
    },
  },
  {
    lineId: 'cycloid-3',
    sectionId: 'cycloid',
    scene: { id: 'cyc-brachy', type: 'animation' },
    lineState: {
      params: { r: 1 },
      show: { graph: true, cycloid: true },
      highlight: ['brachistochrone'],
      annotation: { text: '最速降线', position: 'bottom' },
    },
  },
  {
    lineId: 'cycloid-4',
    sectionId: 'cycloid',
    scene: { id: 'cyc-demo', type: 'animation' },
    lineState: {
      params: { r: 1 },
      show: { graph: true, cycloid: true, ball: true },
      annotation: { text: '比直线更快', position: 'bottom' },
    },
  },

  // ========== lissajous 段落 (4行) ==========
  {
    lineId: 'lissajous-1',
    sectionId: 'lissajous',
    scene: { id: 'lis-intro', type: 'animation' },
    lineState: {
      params: { a: 3, b: 2, delta: 0 },
      show: { graph: true, lissajous: true },
      annotation: { text: '利萨如图形', position: 'top' },
    },
  },
  {
    lineId: 'lissajous-2',
    sectionId: 'lissajous',
    scene: { id: 'lis-eq', type: 'formula' },
    lineState: {
      params: { a: 3, b: 2, delta: 0 },
      show: { graph: true, lissajous: true, formula: true },
      annotation: { text: 'x=A sin(at+δ), y=B sin(bt)', position: 'bottom' },
    },
  },
  {
    lineId: 'lissajous-3',
    sectionId: 'lissajous',
    scene: { id: 'lis-adjust', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 3, b: 2, delta: Math.PI / 2 },
      show: { graph: true, lissajous: true, sliders: true },
      annotation: { text: '调整频率比和相位差', position: 'bottom' },
    },
  },
  {
    lineId: 'lissajous-4',
    sectionId: 'lissajous',
    scene: { id: 'lis-closed', type: 'animation' },
    lineState: {
      params: { a: 2, b: 3, delta: 0 },
      show: { graph: true, lissajous: true },
      annotation: { text: '简单整数比→闭合', position: 'bottom' },
    },
  },

  // ========== advantages 段落 (4行) ==========
  {
    lineId: 'advantages-1',
    sectionId: 'advantages',
    scene: { id: 'adv-intro', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '参数方程优势', position: 'top' },
    },
  },
  {
    lineId: 'advantages-2',
    sectionId: 'advantages',
    scene: { id: 'adv-nonfunc', type: 'animation' },
    lineState: {
      show: { graph: true, circle: true },
      annotation: { text: '表示非函数曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'advantages-3',
    sectionId: 'advantages',
    scene: { id: 'adv-motion', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, point: true, velocity: true },
      annotation: { text: '描述运动过程', position: 'bottom' },
    },
  },
  {
    lineId: 'advantages-4',
    sectionId: 'advantages',
    scene: { id: 'adv-graphics', type: 'animation' },
    lineState: {
      show: { graph: true, bezier: true },
      annotation: { text: '计算机图形学标准', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '实际应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-anim', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '计算机动画', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-robot', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '机器人路径规划', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-physics', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '抛体运动轨迹', position: 'bottom' },
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
    scene: { id: 'summary-param', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, point: true },
      annotation: { text: '参数 t 描述轨迹', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-curves', type: 'animation' },
    lineState: {
      show: { graph: true, circle: true, ellipse: true, cycloid: true },
      annotation: { text: '圆、椭圆、摆线、利萨如', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-app', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '动画和图形学应用', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { graph: false },
      annotation: { text: '更直观理解参数方程！', position: 'bottom' },
    },
  },
]
