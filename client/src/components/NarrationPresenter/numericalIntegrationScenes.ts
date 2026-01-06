/**
 * 数值积分讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNumericalIntegrationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const numericalIntegrationScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-integral', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '曲线下面积', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-no-solution', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '没有解析解', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-numerical', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数值积分', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-idea', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '简单图形近似', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-partition', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '分成小段', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-finer', type: 'animation' },
    lineState: {
      params: { subdivisions: 20 },
      show: { diagram: true },
      annotation: { text: '分得越细越精确', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-compare', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '比较方法', position: 'bottom' },
    },
  },

  // ========== rectangle 段落 (4行) ==========
  {
    lineId: 'rect-1',
    sectionId: 'rectangle',
    scene: { id: 'rect-intro', type: 'animation' },
    lineState: {
      params: { method: 'rectangle' },
      show: { diagram: true },
      annotation: { text: '矩形法', position: 'top' },
    },
  },
  {
    lineId: 'rect-2',
    sectionId: 'rectangle',
    scene: { id: 'rect-approx', type: 'animation' },
    lineState: {
      params: { method: 'rectangle' },
      show: { diagram: true },
      annotation: { text: '矩形近似', position: 'bottom' },
    },
  },
  {
    lineId: 'rect-3',
    sectionId: 'rectangle',
    scene: { id: 'rect-height', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '左/右/中点', position: 'bottom' },
    },
  },
  {
    lineId: 'rect-4',
    sectionId: 'rectangle',
    scene: { id: 'rect-midpoint', type: 'animation' },
    lineState: {
      params: { method: 'midpoint' },
      show: { diagram: true },
      annotation: { text: '中点法更精确', position: 'bottom' },
    },
  },

  // ========== trapezoid 段落 (4行) ==========
  {
    lineId: 'trap-1',
    sectionId: 'trapezoid',
    scene: { id: 'trap-intro', type: 'animation' },
    lineState: {
      params: { method: 'trapezoid' },
      show: { diagram: true },
      annotation: { text: '梯形法', position: 'top' },
    },
  },
  {
    lineId: 'trap-2',
    sectionId: 'trapezoid',
    scene: { id: 'trap-line', type: 'animation' },
    lineState: {
      params: { method: 'trapezoid' },
      show: { diagram: true },
      highlight: ['trapezoid'],
      annotation: { text: '直线连接', position: 'bottom' },
    },
  },
  {
    lineId: 'trap-3',
    sectionId: 'trapezoid',
    scene: { id: 'trap-simpson', type: 'animation' },
    lineState: {
      params: { method: 'simpson' },
      show: { diagram: true },
      annotation: { text: '辛普森法', position: 'bottom' },
    },
  },
  {
    lineId: 'trap-4',
    sectionId: 'trapezoid',
    scene: { id: 'trap-accuracy', type: 'animation' },
    lineState: {
      params: { method: 'simpson' },
      show: { diagram: true },
      annotation: { text: '精度更高', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '无处不在', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-physics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '物理量计算', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-stats', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '概率分布', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-engineering', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '工程应力', position: 'bottom' },
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
      show: { diagram: true },
      annotation: { text: '矩形法到辛普森法', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-choice', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '方法和分割数', position: 'bottom' },
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
