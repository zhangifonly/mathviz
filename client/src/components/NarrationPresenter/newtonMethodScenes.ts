/**
 * 牛顿法讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNewtonMethodState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const newtonMethodScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-equation', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'f(x) = 0', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-complex', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'x⁵ + x = 1', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-newton', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '牛顿法', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-tangent', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '用切线逼近', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-initial', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['initial'],
      annotation: { text: '初始猜测', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-intersection', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      highlight: ['tangent'],
      annotation: { text: '切线与x轴交点', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-iterate', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '重复迭代', position: 'bottom' },
    },
  },

  // ========== visualization 段落 (4行) ==========
  {
    lineId: 'vis-1',
    sectionId: 'visualization',
    scene: { id: 'vis-demo', type: 'animation' },
    lineState: {
      params: { iteration: 0 },
      show: { diagram: true, curve: true },
      annotation: { text: '几何演示', position: 'top' },
    },
  },
  {
    lineId: 'vis-2',
    sectionId: 'visualization',
    scene: { id: 'vis-point', type: 'animation' },
    lineState: {
      params: { iteration: 0 },
      show: { diagram: true, curve: true },
      highlight: ['current'],
      annotation: { text: '红点=当前近似', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-3',
    sectionId: 'visualization',
    scene: { id: 'vis-next', type: 'animation' },
    lineState: {
      params: { iteration: 1 },
      show: { diagram: true, curve: true },
      highlight: ['tangent'],
      annotation: { text: '切线交点', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-4',
    sectionId: 'visualization',
    scene: { id: 'vis-converge', type: 'animation' },
    lineState: {
      params: { iteration: 5 },
      show: { diagram: true, curve: true },
      annotation: { text: '快速收敛', position: 'bottom' },
    },
  },

  // ========== convergence 段落 (4行) ==========
  {
    lineId: 'conv-1',
    sectionId: 'convergence',
    scene: { id: 'conv-quadratic', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '二次收敛', position: 'top' },
    },
  },
  {
    lineId: 'conv-2',
    sectionId: 'convergence',
    scene: { id: 'conv-double', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '精度翻倍', position: 'bottom' },
    },
  },
  {
    lineId: 'conv-3',
    sectionId: 'convergence',
    scene: { id: 'conv-fail', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['diverge'],
      annotation: { text: '可能不收敛', position: 'bottom' },
    },
  },
  {
    lineId: 'conv-4',
    sectionId: 'convergence',
    scene: { id: 'conv-zero-derivative', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['zero-deriv'],
      annotation: { text: '导数为零的问题', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '重要算法', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-calculator', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算器函数', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-optimization', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '优化问题', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-ml', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '机器学习', position: 'bottom' },
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
    scene: { id: 'summary-tangent', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '切线逼近', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-effective', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '大多数情况有效', position: 'bottom' },
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
