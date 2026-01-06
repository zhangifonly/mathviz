/**
 * 信号处理讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSignalProcessingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const signalProcessingScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-daily', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '听音乐、打电话、看视频', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-questions', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '处理、传输、存储', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-sp', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '信号处理', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-domains', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '时域 vs 频域', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-time', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '时域=随时间变化', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-freq', type: 'animation' },
    lineState: {
      show: { diagram: true, spectrum: true },
      annotation: { text: '频域=频率成分', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-fourier', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '傅里叶变换', position: 'bottom' },
    },
  },

  // ========== sampling 段落 (4行) ==========
  {
    lineId: 'samp-1',
    sectionId: 'sampling',
    scene: { id: 'samp-digital', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数字信号', position: 'top' },
    },
  },
  {
    lineId: 'samp-2',
    sectionId: 'sampling',
    scene: { id: 'samp-theorem', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'fs > 2fmax', position: 'bottom' },
    },
  },
  {
    lineId: 'samp-3',
    sectionId: 'sampling',
    scene: { id: 'samp-aliasing', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['aliasing'],
      annotation: { text: '混叠', position: 'bottom' },
    },
  },
  {
    lineId: 'samp-4',
    sectionId: 'sampling',
    scene: { id: 'samp-cd', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'CD采样率44.1kHz', position: 'bottom' },
    },
  },

  // ========== filter 段落 (4行) ==========
  {
    lineId: 'filt-1',
    sectionId: 'filter',
    scene: { id: 'filt-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '滤波器', position: 'top' },
    },
  },
  {
    lineId: 'filt-2',
    sectionId: 'filter',
    scene: { id: 'filt-lowpass', type: 'animation' },
    lineState: {
      params: { filterType: 'lowpass' },
      show: { diagram: true, spectrum: true },
      annotation: { text: '低通滤波器', position: 'bottom' },
    },
  },
  {
    lineId: 'filt-3',
    sectionId: 'filter',
    scene: { id: 'filt-highpass', type: 'animation' },
    lineState: {
      params: { filterType: 'highpass' },
      show: { diagram: true, spectrum: true },
      annotation: { text: '高通滤波器', position: 'bottom' },
    },
  },
  {
    lineId: 'filt-4',
    sectionId: 'filter',
    scene: { id: 'filt-bandpass', type: 'animation' },
    lineState: {
      params: { filterType: 'bandpass' },
      show: { diagram: true, spectrum: true },
      annotation: { text: '带通滤波器', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '现代技术', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-audio', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '音频处理', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-image', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '图像处理', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-comm', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '通信系统', position: 'bottom' },
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
    scene: { id: 'summary-domains', type: 'animation' },
    lineState: {
      show: { diagram: true, spectrum: true },
      annotation: { text: '时域和频域', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-operations', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '采样和滤波', position: 'bottom' },
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
