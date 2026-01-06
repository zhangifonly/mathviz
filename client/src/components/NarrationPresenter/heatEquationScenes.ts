/**
 * 热方程讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHeatEquationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const heatEquationScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-coffee', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '热咖啡变凉', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-warmth', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '暖手宝传热', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-equation', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '热方程', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-pde', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '偏微分方程 (1822)', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-change', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '温度时空变化', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-flow', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '热量流动', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-derivative', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['laplacian'],
      annotation: { text: '∂T/∂t = α∇²T', position: 'bottom' },
    },
  },

  // ========== visualization 段落 (4行) ==========
  {
    lineId: 'vis-1',
    sectionId: 'visualization',
    scene: { id: 'vis-rod', type: 'animation' },
    lineState: {
      params: { time: 0 },
      show: { diagram: true },
      annotation: { text: '金属棒温度演化', position: 'top' },
    },
  },
  {
    lineId: 'vis-2',
    sectionId: 'visualization',
    scene: { id: 'vis-initial', type: 'animation' },
    lineState: {
      params: { time: 0 },
      show: { diagram: true },
      highlight: ['center'],
      annotation: { text: '中间热,两端冷', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-3',
    sectionId: 'visualization',
    scene: { id: 'vis-diffuse', type: 'animation' },
    lineState: {
      params: { time: 5 },
      show: { diagram: true },
      annotation: { text: '热量扩散', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-4',
    sectionId: 'visualization',
    scene: { id: 'vis-equilibrium', type: 'animation' },
    lineState: {
      params: { time: 20 },
      show: { diagram: true },
      annotation: { text: '达到均匀温度', position: 'bottom' },
    },
  },

  // ========== boundary 段落 (4行) ==========
  {
    lineId: 'bound-1',
    sectionId: 'boundary',
    scene: { id: 'bound-concept', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '边界条件', position: 'top' },
    },
  },
  {
    lineId: 'bound-2',
    sectionId: 'boundary',
    scene: { id: 'bound-dirichlet', type: 'animation' },
    lineState: {
      params: { boundaryType: 'dirichlet' },
      show: { diagram: true },
      annotation: { text: '固定温度边界', position: 'bottom' },
    },
  },
  {
    lineId: 'bound-3',
    sectionId: 'boundary',
    scene: { id: 'bound-neumann', type: 'animation' },
    lineState: {
      params: { boundaryType: 'neumann' },
      show: { diagram: true },
      annotation: { text: '绝热边界', position: 'bottom' },
    },
  },
  {
    lineId: 'bound-4',
    sectionId: 'boundary',
    scene: { id: 'bound-different', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '不同演化', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '工程和科学', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-building', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '建筑保温', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-electronics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '电子散热', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-image', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '图像模糊', position: 'bottom' },
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
    scene: { id: 'summary-diffusion', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '热量扩散', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-conditions', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '初始+边界条件', position: 'bottom' },
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
