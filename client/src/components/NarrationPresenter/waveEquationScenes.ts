/**
 * 波动方程讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultWaveEquationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const waveEquationScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-lake', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '湖面涟漪', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-propagation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '波的传播', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-equation', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '波动方程', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-description', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '扰动传播', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '∂²u/∂t² = c²∂²u/∂x²', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-types', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '声波、水波、电磁波', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-observe', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '观察波的行为', position: 'bottom' },
    },
  },

  // ========== propagation 段落 (4行) ==========
  {
    lineId: 'prop-1',
    sectionId: 'propagation',
    scene: { id: 'prop-string', type: 'animation' },
    lineState: {
      params: { time: 0 },
      show: { diagram: true },
      annotation: { text: '弦上的波', position: 'top' },
    },
  },
  {
    lineId: 'prop-2',
    sectionId: 'propagation',
    scene: { id: 'prop-split', type: 'animation' },
    lineState: {
      params: { time: 1 },
      show: { diagram: true },
      highlight: ['left-wave', 'right-wave'],
      annotation: { text: '左右传播', position: 'bottom' },
    },
  },
  {
    lineId: 'prop-3',
    sectionId: 'propagation',
    scene: { id: 'prop-shape', type: 'animation' },
    lineState: {
      params: { time: 3 },
      show: { diagram: true },
      annotation: { text: '波形保持', position: 'bottom' },
    },
  },
  {
    lineId: 'prop-4',
    sectionId: 'propagation',
    scene: { id: 'prop-property', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '波动方程特性', position: 'bottom' },
    },
  },

  // ========== standing-wave 段落 (4行) ==========
  {
    lineId: 'stand-1',
    sectionId: 'standing-wave',
    scene: { id: 'stand-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '驻波', position: 'top' },
    },
  },
  {
    lineId: 'stand-2',
    sectionId: 'standing-wave',
    scene: { id: 'stand-stationary', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '原地振动', position: 'bottom' },
    },
  },
  {
    lineId: 'stand-3',
    sectionId: 'standing-wave',
    scene: { id: 'stand-nodes', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['nodes', 'antinodes'],
      annotation: { text: '节点和波腹', position: 'bottom' },
    },
  },
  {
    lineId: 'stand-4',
    sectionId: 'standing-wave',
    scene: { id: 'stand-instrument', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '乐器弦振动', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '广泛应用', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-acoustics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '声学设计', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-seismic', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '地震学', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-em', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '麦克斯韦方程组', position: 'bottom' },
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
    scene: { id: 'summary-propagation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '扰动传播', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-standing', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['nodes'],
      annotation: { text: '驻波叠加', position: 'bottom' },
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
