/**
 * 随机游走讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRandomWalkState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const randomWalkScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-drunk', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '醉汉问题', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-questions', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '走到哪里?离多远?', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-math', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '深刻数学原理', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-definition', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '随机步骤累积', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-1d', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '左右移动', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-regularity', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '整体有规律', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-simulation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '观察模拟', position: 'bottom' },
    },
  },

  // ========== simulation 段落 (4行) ==========
  {
    lineId: 'sim-1',
    sectionId: 'simulation',
    scene: { id: 'sim-paths', type: 'animation' },
    lineState: {
      params: { paths: 10 },
      show: { diagram: true },
      annotation: { text: '多条轨迹', position: 'top' },
    },
  },
  {
    lineId: 'sim-2',
    sectionId: 'simulation',
    scene: { id: 'sim-statistics', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '相似统计特性', position: 'bottom' },
    },
  },
  {
    lineId: 'sim-3',
    sectionId: 'simulation',
    scene: { id: 'sim-fluctuation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '零点附近波动', position: 'bottom' },
    },
  },
  {
    lineId: 'sim-4',
    sectionId: 'simulation',
    scene: { id: 'sim-spread', type: 'animation' },
    lineState: {
      params: { steps: 100 },
      show: { diagram: true },
      annotation: { text: '扩散范围增大', position: 'bottom' },
    },
  },

  // ========== statistics 段落 (4行) ==========
  {
    lineId: 'stat-1',
    sectionId: 'statistics',
    scene: { id: 'stat-expectation', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'E[X] = 0', position: 'top' },
    },
  },
  {
    lineId: 'stat-2',
    sectionId: 'statistics',
    scene: { id: 'stat-variance', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'Var[X] ∝ n', position: 'bottom' },
    },
  },
  {
    lineId: 'stat-3',
    sectionId: 'statistics',
    scene: { id: 'stat-sqrt', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '偏离距离 ∝ √n', position: 'bottom' },
    },
  },
  {
    lineId: 'stat-4',
    sectionId: 'statistics',
    scene: { id: 'stat-diffusion', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '扩散定律', position: 'bottom' },
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
    scene: { id: 'app-finance', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '股票价格', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-brownian', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '布朗运动', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-ecology', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '动物觅食', position: 'bottom' },
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
    scene: { id: 'summary-regularity', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '随机中的规律', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-foundation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '随机过程基础', position: 'bottom' },
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
