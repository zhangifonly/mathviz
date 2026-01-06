/**
 * 插值讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultInterpolationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const interpolationScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { diagram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-data', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '已知数据点', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-curve', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '平滑曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-method', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '插值方法', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-definition', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '通过数据点的函数', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-vs-regression', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '插值 vs 回归', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-linear', type: 'animation' },
    lineState: {
      params: { method: 'linear' },
      show: { diagram: true, curve: true },
      annotation: { text: '线性插值', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-smooth', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '需要更平滑', position: 'bottom' },
    },
  },

  // ========== lagrange 段落 (4行) ==========
  {
    lineId: 'lag-1',
    sectionId: 'lagrange',
    scene: { id: 'lag-intro', type: 'animation' },
    lineState: {
      params: { method: 'lagrange', points: 4 },
      show: { diagram: true, curve: true },
      annotation: { text: '拉格朗日插值', position: 'top' },
    },
  },
  {
    lineId: 'lag-2',
    sectionId: 'lagrange',
    scene: { id: 'lag-polynomial', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'n点→n-1次多项式', position: 'bottom' },
    },
  },
  {
    lineId: 'lag-3',
    sectionId: 'lagrange',
    scene: { id: 'lag-runge', type: 'animation' },
    lineState: {
      params: { method: 'lagrange', points: 10 },
      show: { diagram: true, curve: true },
      highlight: ['oscillation'],
      annotation: { text: '龙格现象', position: 'bottom' },
    },
  },
  {
    lineId: 'lag-4',
    sectionId: 'lagrange',
    scene: { id: 'lag-problem', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['edges'],
      annotation: { text: '边缘振荡', position: 'bottom' },
    },
  },

  // ========== spline 段落 (4行) ==========
  {
    lineId: 'spline-1',
    sectionId: 'spline',
    scene: { id: 'spline-intro', type: 'animation' },
    lineState: {
      params: { method: 'spline' },
      show: { diagram: true, curve: true },
      annotation: { text: '样条插值', position: 'top' },
    },
  },
  {
    lineId: 'spline-2',
    sectionId: 'spline',
    scene: { id: 'spline-cubic', type: 'animation' },
    lineState: {
      params: { method: 'cubic-spline' },
      show: { diagram: true, curve: true },
      annotation: { text: '三次样条', position: 'bottom' },
    },
  },
  {
    lineId: 'spline-3',
    sectionId: 'spline',
    scene: { id: 'spline-name', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '弹性木条', position: 'bottom' },
    },
  },
  {
    lineId: 'spline-4',
    sectionId: 'spline',
    scene: { id: 'spline-cad', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'CAD和图形学', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '重要应用', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-image', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '图像缩放', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-animation', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '动画关键帧', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-science', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '科学计算', position: 'bottom' },
    },
  },

  // ========== summary 段落 (4行) ==========
  {
    lineId: 'sum-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'sum-2',
    sectionId: 'summary',
    scene: { id: 'summary-methods', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '拉格朗日 vs 样条', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-choice', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '选择合适方法', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-4',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '感谢观看!', position: 'bottom' },
    },
  },
]
