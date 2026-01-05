/**
 * 圆锥曲线讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultConicState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const conicScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { cone: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-three', type: 'animation' },
    lineState: {
      show: { cone: true, curves: true },
      annotation: { text: '椭圆、双曲线、抛物线', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-why', type: 'animation' },
    lineState: {
      show: { cone: true },
      annotation: { text: '切割圆锥得到', position: 'bottom' },
    },
  },

  // ========== cone-cutting 段落 (4行) ==========
  {
    lineId: 'cone-cutting-1',
    sectionId: 'cone-cutting',
    scene: { id: 'cc-cone', type: 'animation' },
    lineState: {
      show: { cone: true, doubleCone: true },
      annotation: { text: '双圆锥', position: 'top' },
    },
  },
  {
    lineId: 'cone-cutting-2',
    sectionId: 'cone-cutting',
    scene: { id: 'cc-plane', type: 'animation' },
    lineState: {
      show: { cone: true, plane: true },
      annotation: { text: '平面切割', position: 'bottom' },
    },
  },
  {
    lineId: 'cone-cutting-3',
    sectionId: 'cone-cutting',
    scene: { id: 'cc-circle', type: 'animation' },
    lineState: {
      params: { cutAngle: 0 },
      show: { cone: true, plane: true, section: true },
      annotation: { text: '水平→圆，倾斜→椭圆', position: 'bottom' },
    },
  },
  {
    lineId: 'cone-cutting-4',
    sectionId: 'cone-cutting',
    scene: { id: 'cc-others', type: 'animation' },
    lineState: {
      params: { cutAngle: 45 },
      show: { cone: true, plane: true, section: true },
      annotation: { text: '抛物线和双曲线', position: 'bottom' },
    },
  },

  // ========== ellipse 段落 (4行) ==========
  {
    lineId: 'ellipse-1',
    sectionId: 'ellipse',
    scene: { id: 'ell-def', type: 'animation' },
    lineState: {
      params: { a: 5, b: 3 },
      show: { ellipse: true },
      annotation: { text: '距离之和为常数', position: 'top' },
    },
  },
  {
    lineId: 'ellipse-2',
    sectionId: 'ellipse',
    scene: { id: 'ell-foci', type: 'animation' },
    lineState: {
      params: { a: 5, b: 3 },
      show: { ellipse: true, foci: true },
      highlight: ['F1', 'F2'],
      annotation: { text: '焦点 F1 和 F2', position: 'bottom' },
    },
  },
  {
    lineId: 'ellipse-3',
    sectionId: 'ellipse',
    scene: { id: 'ell-eq', type: 'formula' },
    lineState: {
      params: { a: 5, b: 3 },
      show: { ellipse: true, formula: true },
      annotation: { text: 'x²/a² + y²/b² = 1', position: 'bottom' },
    },
  },
  {
    lineId: 'ellipse-4',
    sectionId: 'ellipse',
    scene: { id: 'ell-abc', type: 'formula' },
    lineState: {
      params: { a: 5, b: 3 },
      show: { ellipse: true, formula: true, axes: true },
      highlight: ['a', 'b', 'c'],
      annotation: { text: 'c² = a² - b²', position: 'bottom' },
    },
  },

  // ========== ellipse-demo 段落 (4行) ==========
  {
    lineId: 'ellipse-demo-1',
    sectionId: 'ellipse-demo',
    scene: { id: 'ed-show', type: 'animation' },
    lineState: {
      params: { a: 5, b: 3 },
      show: { ellipse: true, foci: true, point: true },
      annotation: { text: '椭圆和焦点', position: 'top' },
    },
  },
  {
    lineId: 'ellipse-demo-2',
    sectionId: 'ellipse-demo',
    scene: { id: 'ed-drag', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 5, b: 3 },
      show: { ellipse: true, foci: true, point: true, distances: true },
      annotation: { text: '拖动观察距离之和', position: 'bottom' },
    },
  },
  {
    lineId: 'ellipse-demo-3',
    sectionId: 'ellipse-demo',
    scene: { id: 'ed-sum', type: 'animation' },
    lineState: {
      params: { a: 5, b: 3 },
      show: { ellipse: true, foci: true, point: true, distances: true, sum: true },
      annotation: { text: '距离之和不变', position: 'bottom' },
    },
  },
  {
    lineId: 'ellipse-demo-4',
    sectionId: 'ellipse-demo',
    scene: { id: 'ed-param', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { a: 5, b: 3 },
      show: { ellipse: true, foci: true, sliders: true },
      annotation: { text: '调整 a 和 b', position: 'bottom' },
    },
  },

  // ========== hyperbola 段落 (4行) ==========
  {
    lineId: 'hyperbola-1',
    sectionId: 'hyperbola',
    scene: { id: 'hyp-def', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { hyperbola: true },
      annotation: { text: '距离之差的绝对值为常数', position: 'top' },
    },
  },
  {
    lineId: 'hyperbola-2',
    sectionId: 'hyperbola',
    scene: { id: 'hyp-diff', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { hyperbola: true, foci: true },
      annotation: { text: '距离之"差"', position: 'bottom' },
    },
  },
  {
    lineId: 'hyperbola-3',
    sectionId: 'hyperbola',
    scene: { id: 'hyp-two', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { hyperbola: true, foci: true },
      highlight: ['branch1', 'branch2'],
      annotation: { text: '两支曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'hyperbola-4',
    sectionId: 'hyperbola',
    scene: { id: 'hyp-asym', type: 'animation' },
    lineState: {
      params: { a: 3, b: 4 },
      show: { hyperbola: true, asymptotes: true },
      highlight: ['asymptotes'],
      annotation: { text: '渐近线', position: 'bottom' },
    },
  },

  // ========== parabola 段落 (4行) ==========
  {
    lineId: 'parabola-1',
    sectionId: 'parabola',
    scene: { id: 'par-def', type: 'animation' },
    lineState: {
      params: { p: 2 },
      show: { parabola: true },
      annotation: { text: '到定点和定直线距离相等', position: 'top' },
    },
  },
  {
    lineId: 'parabola-2',
    sectionId: 'parabola',
    scene: { id: 'par-fd', type: 'animation' },
    lineState: {
      params: { p: 2 },
      show: { parabola: true, focus: true, directrix: true },
      highlight: ['focus', 'directrix'],
      annotation: { text: '焦点和准线', position: 'bottom' },
    },
  },
  {
    lineId: 'parabola-3',
    sectionId: 'parabola',
    scene: { id: 'par-eq', type: 'formula' },
    lineState: {
      params: { p: 2 },
      show: { parabola: true, formula: true },
      annotation: { text: 'y² = 2px', position: 'bottom' },
    },
  },
  {
    lineId: 'parabola-4',
    sectionId: 'parabola',
    scene: { id: 'par-one', type: 'animation' },
    lineState: {
      params: { p: 2 },
      show: { parabola: true },
      annotation: { text: '只有一支', position: 'bottom' },
    },
  },

  // ========== eccentricity 段落 (4行) ==========
  {
    lineId: 'eccentricity-1',
    sectionId: 'eccentricity',
    scene: { id: 'ecc-def', type: 'animation' },
    lineState: {
      show: { ellipse: true },
      annotation: { text: '离心率 e', position: 'top' },
    },
  },
  {
    lineId: 'eccentricity-2',
    sectionId: 'eccentricity',
    scene: { id: 'ecc-ell', type: 'formula' },
    lineState: {
      params: { e: 0.6 },
      show: { ellipse: true, formula: true },
      annotation: { text: 'e = c/a, 0 < e < 1', position: 'bottom' },
    },
  },
  {
    lineId: 'eccentricity-3',
    sectionId: 'eccentricity',
    scene: { id: 'ecc-shape', type: 'animation' },
    lineState: {
      params: { e: 0.8 },
      show: { ellipse: true, slider: true },
      annotation: { text: 'e→0 圆，e→1 扁', position: 'bottom' },
    },
  },
  {
    lineId: 'eccentricity-4',
    sectionId: 'eccentricity',
    scene: { id: 'ecc-all', type: 'animation' },
    lineState: {
      show: { ellipse: true, parabola: true, hyperbola: true },
      annotation: { text: '抛物线e=1，双曲线e>1', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { ellipse: true },
      annotation: { text: '天文学应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-kepler', type: 'application' },
    lineState: {
      show: { ellipse: true, sun: true, planet: true },
      annotation: { text: '开普勒定律', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-comet', type: 'application' },
    lineState: {
      show: { parabola: true, hyperbola: true },
      annotation: { text: '彗星轨道', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-antenna', type: 'application' },
    lineState: {
      show: { parabola: true },
      annotation: { text: '抛物面天线', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { cone: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-three', type: 'animation' },
    lineState: {
      show: { ellipse: true, hyperbola: true, parabola: true },
      annotation: { text: '三种圆锥曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-focus', type: 'animation' },
    lineState: {
      show: { ellipse: true, foci: true },
      annotation: { text: '焦点和距离关系', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-ecc', type: 'animation' },
    lineState: {
      show: { ellipse: true },
      annotation: { text: '离心率描述形状', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { cone: false },
      annotation: { text: '更直观理解圆锥曲线！', position: 'bottom' },
    },
  },
]
