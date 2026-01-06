/**
 * 傅里叶级数讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFourierSeriesState: SceneState = {
  waveType: 'square',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const fourierSeriesScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-fourier', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '傅里叶的发现', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-decompose', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '正弦余弦级数', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-revolution', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '改变数学与物理', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-form', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['formula'],
      annotation: { text: 'a₀ + Σ(aₙcos + bₙsin)', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-harmonics', type: 'animation' },
    lineState: {
      show: { diagram: true, spectrum: true },
      annotation: { text: '谐波频率', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-coefficients', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['coefficients'],
      annotation: { text: '傅里叶系数', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-integral', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '积分公式', position: 'bottom' },
    },
  },

  // ========== square-wave 段落 (4行) ==========
  {
    lineId: 'sq-1',
    sectionId: 'square-wave',
    scene: { id: 'sq-intro', type: 'animation' },
    lineState: {
      params: { waveType: 'square', terms: 1 },
      show: { diagram: true },
      annotation: { text: '方波展开', position: 'top' },
    },
  },
  {
    lineId: 'sq-2',
    sectionId: 'square-wave',
    scene: { id: 'sq-odd', type: 'animation' },
    lineState: {
      params: { waveType: 'square', terms: 3 },
      show: { diagram: true, spectrum: true },
      annotation: { text: '只有奇次谐波', position: 'bottom' },
    },
  },
  {
    lineId: 'sq-3',
    sectionId: 'square-wave',
    scene: { id: 'sq-converge', type: 'animation' },
    lineState: {
      params: { waveType: 'square', terms: 10 },
      show: { diagram: true },
      annotation: { text: '逐渐逼近', position: 'bottom' },
    },
  },
  {
    lineId: 'sq-4',
    sectionId: 'square-wave',
    scene: { id: 'sq-gibbs', type: 'animation' },
    lineState: {
      params: { waveType: 'square', terms: 20 },
      show: { diagram: true },
      highlight: ['overshoot'],
      annotation: { text: '吉布斯现象', position: 'bottom' },
    },
  },

  // ========== gibbs 段落 (4行) ==========
  {
    lineId: 'gibbs-1',
    sectionId: 'gibbs',
    scene: { id: 'gibbs-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['overshoot'],
      annotation: { text: '不连续点过冲', position: 'top' },
    },
  },
  {
    lineId: 'gibbs-2',
    sectionId: 'gibbs',
    scene: { id: 'gibbs-9percent', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['overshoot'],
      annotation: { text: '约9%的过冲', position: 'bottom' },
    },
  },
  {
    lineId: 'gibbs-3',
    sectionId: 'gibbs',
    scene: { id: 'gibbs-inherent', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '固有特性', position: 'bottom' },
    },
  },
  {
    lineId: 'gibbs-4',
    sectionId: 'gibbs',
    scene: { id: 'gibbs-signal', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '信号处理中的注意', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '信号分析基础', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-music', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '音乐合成器', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-circuit', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '电路分析', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-jpeg', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'JPEG压缩', position: 'bottom' },
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
    scene: { id: 'summary-frequency', type: 'animation' },
    lineState: {
      show: { diagram: true, spectrum: true },
      annotation: { text: '频率结构', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-gibbs', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['overshoot'],
      annotation: { text: '吉布斯现象的局限性', position: 'bottom' },
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
