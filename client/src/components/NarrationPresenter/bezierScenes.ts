/**
 * 贝塞尔曲线讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBezierState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const bezierScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { curve: false, controlPoints: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-app', type: 'animation' },
    lineState: {
      show: { curve: true, controlPoints: true },
      annotation: { text: '字体、动画、汽车设计', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-pen', type: 'animation' },
    lineState: {
      show: { curve: true, controlPoints: true },
      annotation: { text: '钢笔工具画贝塞尔曲线', position: 'bottom' },
    },
  },

  // ========== control-points 段落 (4行) ==========
  {
    lineId: 'control-points-1',
    sectionId: 'control-points',
    scene: { id: 'cp-def', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true, controlPolygon: true },
      annotation: { text: '控制点定义曲线形状', position: 'top' },
    },
  },
  {
    lineId: 'control-points-2',
    sectionId: 'control-points',
    scene: { id: 'cp-label', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true, labels: true },
      annotation: { text: 'P0、P1、P2...', position: 'bottom' },
    },
  },
  {
    lineId: 'control-points-3',
    sectionId: 'control-points',
    scene: { id: 'cp-pass', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      highlight: ['P0', 'P3'],
      annotation: { text: '经过首尾控制点', position: 'bottom' },
    },
  },
  {
    lineId: 'control-points-4',
    sectionId: 'control-points',
    scene: { id: 'cp-drag', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      annotation: { text: '拖动控制点', position: 'bottom' },
    },
  },

  // ========== construction 段落 (5行) ==========
  {
    lineId: 'construction-1',
    sectionId: 'construction',
    scene: { id: 'con-algo', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 0.5 },
      show: { curve: true, controlPoints: true },
      annotation: { text: 'de Casteljau算法', position: 'top' },
    },
  },
  {
    lineId: 'construction-2',
    sectionId: 'construction',
    scene: { id: 'con-lerp', type: 'formula' },
    lineState: {
      params: { degree: 3, t: 0.5 },
      show: { curve: true, formula: true },
      annotation: { text: '线性插值 lerp', position: 'bottom' },
    },
  },
  {
    lineId: 'construction-3',
    sectionId: 'construction',
    scene: { id: 'con-layer', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 0.5, showConstruction: true },
      show: { curve: true, controlPoints: true, construction: true },
      annotation: { text: '逐层插值', position: 'bottom' },
    },
  },
  {
    lineId: 'construction-4',
    sectionId: 'construction',
    scene: { id: 'con-final', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 0.5, showConstruction: true },
      show: { curve: true, controlPoints: true, construction: true, point: true },
      annotation: { text: '最终点在曲线上', position: 'bottom' },
    },
  },
  {
    lineId: 'construction-5',
    sectionId: 'construction',
    scene: { id: 'con-show', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { degree: 3, t: 0.5, showConstruction: true },
      show: { curve: true, controlPoints: true, construction: true },
      annotation: { text: '显示构造过程', position: 'bottom' },
    },
  },

  // ========== parameter-t 段落 (5行) ==========
  {
    lineId: 'parameter-t-1',
    sectionId: 'parameter-t',
    scene: { id: 't-range', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 0.5 },
      show: { curve: true, controlPoints: true, point: true },
      annotation: { text: 't∈[0,1]', position: 'top' },
    },
  },
  {
    lineId: 'parameter-t-2',
    sectionId: 'parameter-t',
    scene: { id: 't-zero', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 0 },
      show: { curve: true, controlPoints: true, point: true },
      highlight: ['point'],
      annotation: { text: 't=0 在起点', position: 'bottom' },
    },
  },
  {
    lineId: 'parameter-t-3',
    sectionId: 'parameter-t',
    scene: { id: 't-one', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 1 },
      show: { curve: true, controlPoints: true, point: true },
      highlight: ['point'],
      annotation: { text: 't=1 在终点', position: 'bottom' },
    },
  },
  {
    lineId: 'parameter-t-4',
    sectionId: 'parameter-t',
    scene: { id: 't-half', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 0.5 },
      show: { curve: true, controlPoints: true, point: true },
      annotation: { text: 't=0.5 在中间', position: 'bottom' },
    },
  },
  {
    lineId: 'parameter-t-5',
    sectionId: 'parameter-t',
    scene: { id: 't-slider', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { degree: 3, t: 0.5 },
      show: { curve: true, controlPoints: true, point: true },
      annotation: { text: '拖动t滑块', position: 'bottom' },
    },
  },

  // ========== degree 段落 (5行) ==========
  {
    lineId: 'degree-1',
    sectionId: 'degree',
    scene: { id: 'deg-def', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      annotation: { text: '阶数=控制点数-1', position: 'top' },
    },
  },
  {
    lineId: 'degree-2',
    sectionId: 'degree',
    scene: { id: 'deg-1', type: 'animation' },
    lineState: {
      params: { degree: 1 },
      show: { curve: true, controlPoints: true },
      annotation: { text: '一次曲线=直线', position: 'bottom' },
    },
  },
  {
    lineId: 'degree-3',
    sectionId: 'degree',
    scene: { id: 'deg-2', type: 'animation' },
    lineState: {
      params: { degree: 2 },
      show: { curve: true, controlPoints: true },
      annotation: { text: '二次贝塞尔曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'degree-4',
    sectionId: 'degree',
    scene: { id: 'deg-3', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      highlight: ['curve'],
      annotation: { text: '三次曲线最常用', position: 'bottom' },
    },
  },
  {
    lineId: 'degree-5',
    sectionId: 'degree',
    scene: { id: 'deg-btn', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      annotation: { text: '添加/删除控制点', position: 'bottom' },
    },
  },

  // ========== bernstein 段落 (4行) ==========
  {
    lineId: 'bernstein-1',
    sectionId: 'bernstein',
    scene: { id: 'bern-poly', type: 'formula' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, formula: true },
      annotation: { text: '伯恩斯坦多项式', position: 'top' },
    },
  },
  {
    lineId: 'bernstein-2',
    sectionId: 'bernstein',
    scene: { id: 'bern-graph', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, bernsteinGraph: true },
      annotation: { text: '基函数曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'bernstein-3',
    sectionId: 'bernstein',
    scene: { id: 'bern-weight', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 0.5 },
      show: { curve: true, bernsteinGraph: true, weights: true },
      annotation: { text: '控制点权重', position: 'bottom' },
    },
  },
  {
    lineId: 'bernstein-4',
    sectionId: 'bernstein',
    scene: { id: 'bern-sum', type: 'formula' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, formula: true },
      annotation: { text: '权重和=1', position: 'bottom' },
    },
  },

  // ========== properties 段落 (5行) ==========
  {
    lineId: 'properties-1',
    sectionId: 'properties',
    scene: { id: 'prop-intro', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      annotation: { text: '重要性质', position: 'top' },
    },
  },
  {
    lineId: 'properties-2',
    sectionId: 'properties',
    scene: { id: 'prop-endpoint', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      highlight: ['P0', 'P3'],
      annotation: { text: '经过首尾控制点', position: 'bottom' },
    },
  },
  {
    lineId: 'properties-3',
    sectionId: 'properties',
    scene: { id: 'prop-tangent', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true, tangent: true },
      annotation: { text: '端点处相切', position: 'bottom' },
    },
  },
  {
    lineId: 'properties-4',
    sectionId: 'properties',
    scene: { id: 'prop-convex', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true, convexHull: true },
      annotation: { text: '在凸包内', position: 'bottom' },
    },
  },
  {
    lineId: 'properties-5',
    sectionId: 'properties',
    scene: { id: 'prop-affine', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      annotation: { text: '仿射不变性', position: 'bottom' },
    },
  },

  // ========== animation 段落 (3行) ==========
  {
    lineId: 'animation-1',
    sectionId: 'animation',
    scene: { id: 'anim-btn', type: 'animation' },
    lineState: {
      params: { degree: 3, t: 0, isAnimating: false },
      show: { curve: true, controlPoints: true },
      annotation: { text: '点击动画按钮', position: 'top' },
    },
  },
  {
    lineId: 'animation-2',
    sectionId: 'animation',
    scene: { id: 'anim-move', type: 'animation' },
    lineState: {
      params: { degree: 3, isAnimating: true },
      show: { curve: true, controlPoints: true, point: true },
      annotation: { text: '点沿曲线移动', position: 'bottom' },
    },
  },
  {
    lineId: 'animation-3',
    sectionId: 'animation',
    scene: { id: 'anim-layer', type: 'animation' },
    lineState: {
      params: { degree: 3, isAnimating: true, showConstruction: true },
      show: { curve: true, controlPoints: true, point: true, construction: true },
      annotation: { text: 'de Casteljau可视化', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { curve: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-def', type: 'animation' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true, controlPoints: true },
      annotation: { text: '控制点+de Casteljau', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-t', type: 'animation' },
    lineState: {
      params: { degree: 3, isAnimating: true },
      show: { curve: true, controlPoints: true, point: true },
      annotation: { text: 't从0到1生成曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-app', type: 'application' },
    lineState: {
      params: { degree: 3 },
      show: { curve: true },
      annotation: { text: '图形学重要工具', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { curve: false },
      annotation: { text: '更直观理解贝塞尔曲线！', position: 'bottom' },
    },
  },
]
