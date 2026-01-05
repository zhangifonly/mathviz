/**
 * 复数讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultComplexState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const complexScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { plane: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-sqrt', type: 'animation' },
    lineState: {
      show: { plane: true },
      annotation: { text: '负数不能开平方？', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-i', type: 'formula' },
    lineState: {
      show: { plane: true, formula: true },
      annotation: { text: 'i²=-1', position: 'bottom' },
    },
  },

  // ========== imaginary-unit 段落 (4行) ==========
  {
    lineId: 'imaginary-unit-1',
    sectionId: 'imaginary-unit',
    scene: { id: 'iu-def', type: 'formula' },
    lineState: {
      show: { plane: true, formula: true },
      annotation: { text: 'i²=-1 定义', position: 'top' },
    },
  },
  {
    lineId: 'imaginary-unit-2',
    sectionId: 'imaginary-unit',
    scene: { id: 'iu-sqrt', type: 'animation' },
    lineState: {
      show: { plane: true },
      annotation: { text: '负数的平方根', position: 'bottom' },
    },
  },
  {
    lineId: 'imaginary-unit-3',
    sectionId: 'imaginary-unit',
    scene: { id: 'iu-example', type: 'formula' },
    lineState: {
      show: { plane: true, formula: true },
      annotation: { text: '√(-4)=2i', position: 'bottom' },
    },
  },
  {
    lineId: 'imaginary-unit-4',
    sectionId: 'imaginary-unit',
    scene: { id: 'iu-app', type: 'animation' },
    lineState: {
      show: { plane: true },
      annotation: { text: '虚数的实际应用', position: 'bottom' },
    },
  },

  // ========== complex-number 段落 (4行) ==========
  {
    lineId: 'complex-number-1',
    sectionId: 'complex-number',
    scene: { id: 'cn-form', type: 'formula' },
    lineState: {
      params: { a: 3, b: 2 },
      show: { plane: true, formula: true },
      annotation: { text: 'z=a+bi', position: 'top' },
    },
  },
  {
    lineId: 'complex-number-2',
    sectionId: 'complex-number',
    scene: { id: 'cn-parts', type: 'animation' },
    lineState: {
      params: { a: 3, b: 2 },
      show: { plane: true, point: true },
      highlight: ['realPart', 'imagPart'],
      annotation: { text: '实部a，虚部b', position: 'bottom' },
    },
  },
  {
    lineId: 'complex-number-3',
    sectionId: 'complex-number',
    scene: { id: 'cn-real', type: 'animation' },
    lineState: {
      params: { a: 3, b: 0 },
      show: { plane: true, point: true },
      annotation: { text: 'b=0 → 实数', position: 'bottom' },
    },
  },
  {
    lineId: 'complex-number-4',
    sectionId: 'complex-number',
    scene: { id: 'cn-pure', type: 'animation' },
    lineState: {
      params: { a: 0, b: 2 },
      show: { plane: true, point: true },
      annotation: { text: 'a=0 → 纯虚数', position: 'bottom' },
    },
  },

  // ========== complex-plane 段落 (4行) ==========
  {
    lineId: 'complex-plane-1',
    sectionId: 'complex-plane',
    scene: { id: 'cp-intro', type: 'animation' },
    lineState: {
      show: { plane: true, axes: true },
      annotation: { text: '复平面', position: 'top' },
    },
  },
  {
    lineId: 'complex-plane-2',
    sectionId: 'complex-plane',
    scene: { id: 'cp-axes', type: 'animation' },
    lineState: {
      show: { plane: true, axes: true },
      highlight: ['realAxis', 'imagAxis'],
      annotation: { text: '实轴和虚轴', position: 'bottom' },
    },
  },
  {
    lineId: 'complex-plane-3',
    sectionId: 'complex-plane',
    scene: { id: 'cp-point', type: 'animation' },
    lineState: {
      params: { a: 3, b: 2 },
      show: { plane: true, axes: true, point: true },
      annotation: { text: '复数↔平面上的点', position: 'bottom' },
    },
  },
  {
    lineId: 'complex-plane-4',
    sectionId: 'complex-plane',
    scene: { id: 'cp-drag', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 3, b: 2 },
      show: { plane: true, axes: true, point: true },
      annotation: { text: '拖动观察复数变化', position: 'bottom' },
    },
  },

  // ========== modulus-argument 段落 (4行) ==========
  {
    lineId: 'modulus-argument-1',
    sectionId: 'modulus-argument',
    scene: { id: 'ma-intro', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { plane: true, point: true },
      annotation: { text: '模和辐角表示', position: 'top' },
    },
  },
  {
    lineId: 'modulus-argument-2',
    sectionId: 'modulus-argument',
    scene: { id: 'ma-mod', type: 'formula' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { plane: true, point: true, modulus: true, formula: true },
      highlight: ['modulus'],
      annotation: { text: 'r=√(a²+b²)', position: 'bottom' },
    },
  },
  {
    lineId: 'modulus-argument-3',
    sectionId: 'modulus-argument',
    scene: { id: 'ma-arg', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { plane: true, point: true, modulus: true, argument: true },
      highlight: ['argument'],
      annotation: { text: 'θ=辐角', position: 'bottom' },
    },
  },
  {
    lineId: 'modulus-argument-4',
    sectionId: 'modulus-argument',
    scene: { id: 'ma-polar', type: 'formula' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { plane: true, point: true, modulus: true, argument: true, formula: true },
      annotation: { text: 'z=r(cosθ+isinθ)', position: 'bottom' },
    },
  },

  // ========== euler-formula 段落 (4行) ==========
  {
    lineId: 'euler-formula-1',
    sectionId: 'euler-formula',
    scene: { id: 'ef-formula', type: 'formula' },
    lineState: {
      show: { plane: true, formula: true },
      highlight: ['formula'],
      annotation: { text: 'e^(iθ)=cosθ+isinθ', position: 'top' },
    },
  },
  {
    lineId: 'euler-formula-2',
    sectionId: 'euler-formula',
    scene: { id: 'ef-connect', type: 'animation' },
    lineState: {
      show: { plane: true, unitCircle: true },
      annotation: { text: '指数与三角函数的联系', position: 'bottom' },
    },
  },
  {
    lineId: 'euler-formula-3',
    sectionId: 'euler-formula',
    scene: { id: 'ef-identity', type: 'formula' },
    lineState: {
      params: { theta: Math.PI },
      show: { plane: true, formula: true, point: true },
      highlight: ['formula'],
      annotation: { text: 'e^(iπ)+1=0', position: 'bottom' },
    },
  },
  {
    lineId: 'euler-formula-4',
    sectionId: 'euler-formula',
    scene: { id: 'ef-five', type: 'animation' },
    lineState: {
      show: { plane: true, formula: true },
      annotation: { text: '五个重要常数', position: 'bottom' },
    },
  },

  // ========== multiplication 段落 (5行) ==========
  {
    lineId: 'multiplication-1',
    sectionId: 'multiplication',
    scene: { id: 'mul-geo', type: 'animation' },
    lineState: {
      params: { z1: { a: 2, b: 1 }, z2: { a: 1, b: 1 } },
      show: { plane: true, points: true },
      annotation: { text: '复数乘法的几何意义', position: 'top' },
    },
  },
  {
    lineId: 'multiplication-2',
    sectionId: 'multiplication',
    scene: { id: 'mul-rule', type: 'formula' },
    lineState: {
      params: { z1: { a: 2, b: 1 }, z2: { a: 1, b: 1 } },
      show: { plane: true, points: true, formula: true },
      annotation: { text: '模相乘，辐角相加', position: 'bottom' },
    },
  },
  {
    lineId: 'multiplication-3',
    sectionId: 'multiplication',
    scene: { id: 'mul-rotate', type: 'animation' },
    lineState: {
      params: { z1: { a: 2, b: 1 }, z2: { a: 1, b: 1 } },
      show: { plane: true, points: true, product: true },
      annotation: { text: '旋转+缩放', position: 'bottom' },
    },
  },
  {
    lineId: 'multiplication-4',
    sectionId: 'multiplication',
    scene: { id: 'mul-i', type: 'animation' },
    lineState: {
      params: { z: { a: 2, b: 1 } },
      show: { plane: true, point: true, rotation: true },
      annotation: { text: '×i = 逆时针90°', position: 'bottom' },
    },
  },
  {
    lineId: 'multiplication-5',
    sectionId: 'multiplication',
    scene: { id: 'mul-i2', type: 'animation' },
    lineState: {
      params: { z: { a: 2, b: 1 } },
      show: { plane: true, point: true, rotation: true },
      annotation: { text: 'i²=-1 的几何解释', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { plane: true },
      annotation: { text: '复数的应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-ee', type: 'application' },
    lineState: {
      show: { plane: true },
      annotation: { text: '电气工程', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-qm', type: 'application' },
    lineState: {
      show: { plane: true },
      annotation: { text: '量子力学', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-signal', type: 'application' },
    lineState: {
      show: { plane: true },
      annotation: { text: '信号处理', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { plane: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-form', type: 'animation' },
    lineState: {
      show: { plane: true, point: true },
      annotation: { text: 'z=a+bi 复平面表示', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-polar', type: 'animation' },
    lineState: {
      show: { plane: true, point: true, modulus: true, argument: true },
      annotation: { text: '模和辐角', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-mul', type: 'animation' },
    lineState: {
      show: { plane: true, points: true, rotation: true },
      annotation: { text: '乘法=旋转+缩放', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { plane: false },
      annotation: { text: '更直观理解复数！', position: 'bottom' },
    },
  },
]
