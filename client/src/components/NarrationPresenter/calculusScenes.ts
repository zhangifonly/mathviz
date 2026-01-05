/**
 * 微积分讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCalculusState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const calculusScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-history', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '牛顿与莱布尼茨', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-goal', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '理解导数和积分', position: 'bottom' },
    },
  },

  // ========== derivative-concept 段落 (4行) ==========
  {
    lineId: 'derivative-concept-1',
    sectionId: 'derivative-concept',
    scene: { id: 'dc-rate', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true },
      annotation: { text: '瞬时变化率', position: 'top' },
    },
  },
  {
    lineId: 'derivative-concept-2',
    sectionId: 'derivative-concept',
    scene: { id: 'dc-car', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true },
      annotation: { text: '速度=位置的导数', position: 'bottom' },
    },
  },
  {
    lineId: 'derivative-concept-3',
    sectionId: 'derivative-concept',
    scene: { id: 'dc-tangent', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, tangent: true },
      annotation: { text: '导数=切线斜率', position: 'bottom' },
    },
  },
  {
    lineId: 'derivative-concept-4',
    sectionId: 'derivative-concept',
    scene: { id: 'dc-sign', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, tangent: true },
      annotation: { text: '正斜率增，负斜率减', position: 'bottom' },
    },
  },

  // ========== tangent-line 段落 (4行) ==========
  {
    lineId: 'tangent-line-1',
    sectionId: 'tangent-line',
    scene: { id: 'tl-curve', type: 'animation' },
    lineState: {
      params: { func: 'x^2', x: 1 },
      show: { graph: true, curve: true },
      annotation: { text: '蓝色曲线', position: 'top' },
    },
  },
  {
    lineId: 'tangent-line-2',
    sectionId: 'tangent-line',
    scene: { id: 'tl-line', type: 'animation' },
    lineState: {
      params: { func: 'x^2', x: 1 },
      show: { graph: true, curve: true, tangent: true },
      highlight: ['tangent'],
      annotation: { text: '红色切线', position: 'bottom' },
    },
  },
  {
    lineId: 'tangent-line-3',
    sectionId: 'tangent-line',
    scene: { id: 'tl-drag', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { func: 'x^2', x: 1 },
      show: { graph: true, curve: true, tangent: true, slider: true },
      annotation: { text: '拖动x观察切线', position: 'bottom' },
    },
  },
  {
    lineId: 'tangent-line-4',
    sectionId: 'tangent-line',
    scene: { id: 'tl-slope', type: 'animation' },
    lineState: {
      params: { func: 'x^2', x: 1 },
      show: { graph: true, curve: true, tangent: true, slope: true },
      annotation: { text: '斜率正负变化', position: 'bottom' },
    },
  },

  // ========== derivative-formula 段落 (4行) ==========
  {
    lineId: 'derivative-formula-1',
    sectionId: 'derivative-formula',
    scene: { id: 'df-limit', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: "f'(x)=lim[f(x+h)-f(x)]/h", position: 'top' },
    },
  },
  {
    lineId: 'derivative-formula-2',
    sectionId: 'derivative-formula',
    scene: { id: 'df-secant', type: 'animation' },
    lineState: {
      params: { h: 1 },
      show: { graph: true, curve: true, secant: true },
      annotation: { text: '割线→切线', position: 'bottom' },
    },
  },
  {
    lineId: 'derivative-formula-3',
    sectionId: 'derivative-formula',
    scene: { id: 'df-power', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: "(x^n)'=nx^(n-1)", position: 'bottom' },
    },
  },
  {
    lineId: 'derivative-formula-4',
    sectionId: 'derivative-formula',
    scene: { id: 'df-example', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: "(x²)'=2x, (x³)'=3x²", position: 'bottom' },
    },
  },

  // ========== integral-concept 段落 (4行) ==========
  {
    lineId: 'integral-concept-1',
    sectionId: 'integral-concept',
    scene: { id: 'ic-intro', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true },
      annotation: { text: '积分=累加', position: 'top' },
    },
  },
  {
    lineId: 'integral-concept-2',
    sectionId: 'integral-concept',
    scene: { id: 'ic-area', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, area: true },
      annotation: { text: '定积分=曲线下面积', position: 'bottom' },
    },
  },
  {
    lineId: 'integral-concept-3',
    sectionId: 'integral-concept',
    scene: { id: 'ic-sign', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, area: true },
      annotation: { text: '上方正，下方负', position: 'bottom' },
    },
  },
  {
    lineId: 'integral-concept-4',
    sectionId: 'integral-concept',
    scene: { id: 'ic-symbol', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '∫ 像拉长的S', position: 'bottom' },
    },
  },

  // ========== area-demo 段落 (4行) ==========
  {
    lineId: 'area-demo-1',
    sectionId: 'area-demo',
    scene: { id: 'ad-shade', type: 'animation' },
    lineState: {
      params: { a: 0, b: 2 },
      show: { graph: true, curve: true, area: true },
      annotation: { text: '阴影=定积分值', position: 'top' },
    },
  },
  {
    lineId: 'area-demo-2',
    sectionId: 'area-demo',
    scene: { id: 'ad-limits', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 0, b: 2 },
      show: { graph: true, curve: true, area: true, sliders: true },
      annotation: { text: '调整积分上下限', position: 'bottom' },
    },
  },
  {
    lineId: 'area-demo-3',
    sectionId: 'area-demo',
    scene: { id: 'ad-riemann', type: 'animation' },
    lineState: {
      params: { a: 0, b: 2, n: 10 },
      show: { graph: true, curve: true, rectangles: true },
      annotation: { text: '黎曼和近似', position: 'bottom' },
    },
  },
  {
    lineId: 'area-demo-4',
    sectionId: 'area-demo',
    scene: { id: 'ad-limit', type: 'animation' },
    lineState: {
      params: { a: 0, b: 2, n: 100 },
      show: { graph: true, curve: true, rectangles: true },
      annotation: { text: '矩形越多越精确', position: 'bottom' },
    },
  },

  // ========== ftc 段落 (4行) ==========
  {
    lineId: 'ftc-1',
    sectionId: 'ftc',
    scene: { id: 'ftc-inverse', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '导数与积分互逆', position: 'top' },
    },
  },
  {
    lineId: 'ftc-2',
    sectionId: 'ftc',
    scene: { id: 'ftc-theorem', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '微积分基本定理', position: 'bottom' },
    },
  },
  {
    lineId: 'ftc-3',
    sectionId: 'ftc',
    scene: { id: 'ftc-formula', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      highlight: ['formula'],
      annotation: { text: '∫f(x)dx=F(b)-F(a)', position: 'bottom' },
    },
  },
  {
    lineId: 'ftc-4',
    sectionId: 'ftc',
    scene: { id: 'ftc-use', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, area: true },
      annotation: { text: '求原函数计算定积分', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '广泛应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-physics', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '物理：速度、加速度', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-econ', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '经济：边际成本', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-eng', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '工程：面积体积', position: 'bottom' },
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
    scene: { id: 'summary-deriv', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, tangent: true },
      annotation: { text: '导数=切线斜率', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-integ', type: 'animation' },
    lineState: {
      show: { graph: true, curve: true, area: true },
      annotation: { text: '积分=曲线下面积', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-ftc', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '导数与积分互逆', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { graph: false },
      annotation: { text: '更直观理解微积分！', position: 'bottom' },
    },
  },
]
