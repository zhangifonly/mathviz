/**
 * 傅里叶变换讲解场景配置
 *
 * 为每句讲解定义对应的可视化场景
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultFourierState: SceneState = {
  waveType: 'square',
  frequency: 2,
  amplitude: 1,
  terms: 5,
  isAnimating: false,
  highlightedElements: [],
}

// 傅里叶变换场景配置
export const fourierScenes: NarrationLineScene[] = [
  // ========== 开场引入 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { waveform: false, spectrum: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-question-1', type: 'application' },
    lineState: {
      show: { waveform: false },
      annotation: { text: '音乐会现场', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-question-2', type: 'application' },
    lineState: {
      show: { waveform: false },
      annotation: { text: '均衡器调节', position: 'top' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-reveal', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 1 },
      show: { waveform: true },
      annotation: { text: '傅里叶变换', position: 'bottom' },
    },
  },

  // ========== 核心概念 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-decomposition', type: 'animation' },
    lineState: {
      params: { waveType: 'square', terms: 1 },
      show: { waveform: true, components: true },
      annotation: { text: '复杂信号=正弦波叠加', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-prism', type: 'comparison' },
    lineState: {
      show: { waveform: true },
      annotation: { text: '棱镜分解白光', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-time-domain', type: 'comparison' },
    lineState: {
      params: { waveType: 'square', terms: 10 },
      show: { waveform: true, spectrum: true },
      annotation: { text: '时域vs频域', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-bridge', type: 'comparison' },
    lineState: {
      params: { waveType: 'square', terms: 10 },
      show: { waveform: true, spectrum: true },
      annotation: { text: '傅里叶变换=桥梁', position: 'bottom' },
    },
  },

  // ========== 公式解读 (4行) ==========
  {
    lineId: 'formula-1',
    sectionId: 'formula',
    scene: { id: 'formula-intro', type: 'formula' },
    lineState: {
      show: { formula: true },
      annotation: { text: '傅里叶级数公式', position: 'top' },
    },
  },
  {
    lineId: 'formula-2',
    sectionId: 'formula',
    scene: { id: 'formula-square', type: 'formula' },
    lineState: {
      params: { waveType: 'square' },
      show: { formula: true, waveform: true },
      annotation: { text: '方波展开式', position: 'bottom' },
    },
  },
  {
    lineId: 'formula-3',
    sectionId: 'formula',
    scene: { id: 'formula-harmonics', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 3 },
      show: { waveform: true, components: true },
      annotation: { text: '1,3,5次谐波', position: 'bottom' },
    },
  },
  {
    lineId: 'formula-4',
    sectionId: 'formula',
    scene: { id: 'formula-amplitude', type: 'spectrum' },
    lineState: {
      params: { waveType: 'square', terms: 10 },
      show: { spectrum: true },
      annotation: { text: '振幅递减', position: 'bottom' },
    },
  },

  // ========== 波形选择 (5行) ==========
  {
    lineId: 'wave-1',
    sectionId: 'wave-selection',
    scene: { id: 'wave-intro', type: 'interactive', interactive: { allowWaveTypeChange: true } },
    lineState: {
      params: { waveType: 'square', terms: 10 },
      show: { waveform: true },
      annotation: { text: '选择不同波形', position: 'top' },
    },
  },
  {
    lineId: 'wave-sine',
    sectionId: 'wave-selection',
    scene: { id: 'wave-sine', type: 'waveform', interactive: { allowWaveTypeChange: true } },
    lineState: {
      params: { waveType: 'sine', terms: 1 },
      show: { waveform: true, spectrum: true },
      annotation: { text: '正弦波=单一频率', position: 'bottom' },
    },
  },
  {
    lineId: 'wave-square',
    sectionId: 'wave-selection',
    scene: { id: 'wave-square', type: 'waveform', interactive: { allowWaveTypeChange: true } },
    lineState: {
      params: { waveType: 'square', terms: 20 },
      show: { waveform: true, spectrum: true },
      annotation: { text: '方波=奇次谐波', position: 'bottom' },
    },
  },
  {
    lineId: 'wave-sawtooth',
    sectionId: 'wave-selection',
    scene: { id: 'wave-sawtooth', type: 'waveform', interactive: { allowWaveTypeChange: true } },
    lineState: {
      params: { waveType: 'sawtooth', terms: 20 },
      show: { waveform: true, spectrum: true },
      annotation: { text: '锯齿波=所有谐波', position: 'bottom' },
    },
  },
  {
    lineId: 'wave-triangle',
    sectionId: 'wave-selection',
    scene: { id: 'wave-triangle', type: 'waveform', interactive: { allowWaveTypeChange: true } },
    lineState: {
      params: { waveType: 'triangle', terms: 20 },
      show: { waveform: true, spectrum: true },
      annotation: { text: '三角波=奇次谐波(衰减快)', position: 'bottom' },
    },
  },

  // ========== 动画演示 (6行) ==========
  {
    lineId: 'anim-1',
    sectionId: 'animation',
    scene: { id: 'anim-setup', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 1 },
      show: { waveform: true },
      annotation: { text: '点击播放按钮', position: 'top' },
    },
  },
  {
    lineId: 'anim-2',
    sectionId: 'animation',
    scene: { id: 'anim-original', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 1 },
      show: { waveform: true, original: true },
      highlight: ['original'],
      annotation: { text: '蓝色=目标波形', position: 'bottom' },
    },
  },
  {
    lineId: 'anim-3',
    sectionId: 'animation',
    scene: { id: 'anim-approx', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 1 },
      show: { waveform: true, original: true, approximation: true },
      highlight: ['approximation'],
      annotation: { text: '红色=傅里叶逼近', position: 'bottom' },
    },
  },
  {
    lineId: 'anim-4',
    sectionId: 'animation',
    scene: { id: 'anim-converge', type: 'animation', interactive: { allowAnimation: true } },
    lineState: {
      params: { waveType: 'square', terms: 1, isAnimating: true },
      show: { waveform: true, original: true, approximation: true },
      annotation: { text: '项数增加，逼近更好', position: 'bottom' },
    },
  },
  {
    lineId: 'anim-5',
    sectionId: 'animation',
    scene: { id: 'anim-gibbs', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 50 },
      show: { waveform: true, original: true, approximation: true },
      highlight: ['gibbs'],
      annotation: { text: '吉布斯现象', position: 'bottom' },
    },
  },
  {
    lineId: 'anim-6',
    sectionId: 'animation',
    scene: { id: 'anim-gibbs-explain', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 50 },
      show: { waveform: true, original: true, approximation: true },
      annotation: { text: '跳变点约9%过冲', position: 'bottom' },
    },
  },

  // ========== 频谱分析 (4行) ==========
  {
    lineId: 'spectrum-1',
    sectionId: 'spectrum',
    scene: { id: 'spectrum-intro', type: 'spectrum' },
    lineState: {
      params: { waveType: 'square', terms: 20 },
      show: { spectrum: true },
      annotation: { text: '频谱图', position: 'top' },
    },
  },
  {
    lineId: 'spectrum-2',
    sectionId: 'spectrum',
    scene: { id: 'spectrum-axes', type: 'spectrum' },
    lineState: {
      params: { waveType: 'square', terms: 20 },
      show: { spectrum: true },
      highlight: ['axes'],
      annotation: { text: '横轴=频率，纵轴=振幅', position: 'bottom' },
    },
  },
  {
    lineId: 'spectrum-3',
    sectionId: 'spectrum',
    scene: { id: 'spectrum-square', type: 'spectrum' },
    lineState: {
      params: { waveType: 'square', terms: 20 },
      show: { spectrum: true },
      highlight: ['oddHarmonics'],
      annotation: { text: '方波只有奇数倍频率', position: 'bottom' },
    },
  },
  {
    lineId: 'spectrum-4',
    sectionId: 'spectrum',
    scene: { id: 'spectrum-power', type: 'comparison' },
    lineState: {
      params: { waveType: 'square', terms: 20 },
      show: { waveform: true, spectrum: true },
      annotation: { text: '时域+频域并排', position: 'bottom' },
    },
  },

  // ========== 参数探索 (4行) ==========
  {
    lineId: 'param-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'interactive', interactive: { allowParamChange: true, allowWaveTypeChange: true } },
    lineState: {
      params: { waveType: 'square', terms: 10 },
      show: { waveform: true, spectrum: true },
      annotation: { text: '调整参数探索', position: 'top' },
    },
  },
  {
    lineId: 'param-freq',
    sectionId: 'parameters',
    scene: { id: 'param-frequency', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { frequency: 1 },
      show: { waveform: true },
      annotation: { text: '频率越高，振荡越快', position: 'bottom' },
    },
  },
  {
    lineId: 'param-amp',
    sectionId: 'parameters',
    scene: { id: 'param-amplitude', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { amplitude: 0.5 },
      show: { waveform: true },
      annotation: { text: '振幅改变高度', position: 'bottom' },
    },
  },
  {
    lineId: 'param-terms',
    sectionId: 'parameters',
    scene: { id: 'param-terms', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { terms: 1 },
      show: { waveform: true, original: true, approximation: true },
      annotation: { text: '项数越多，逼近越好', position: 'bottom' },
    },
  },

  // ========== 实际应用 (5行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { waveform: true },
      annotation: { text: '傅里叶变换应用', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-audio', type: 'application' },
    lineState: {
      show: { spectrum: true },
      annotation: { text: '均衡器调节频段', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-image', type: 'application' },
    lineState: {
      show: { waveform: true },
      annotation: { text: 'JPEG图像压缩', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-comm', type: 'application' },
    lineState: {
      show: { waveform: true, spectrum: true },
      annotation: { text: '通信信号调制', position: 'bottom' },
    },
  },
  {
    lineId: 'app-5',
    sectionId: 'application',
    scene: { id: 'app-medical', type: 'application' },
    lineState: {
      show: { waveform: true },
      annotation: { text: 'CT/MRI图像重建', position: 'bottom' },
    },
  },

  // ========== 总结回顾 (6行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'summary' },
    lineState: {
      show: { waveform: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-point-1', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 20 },
      show: { waveform: true, components: true },
      annotation: { text: '任何信号=正弦波叠加', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-point-2', type: 'comparison' },
    lineState: {
      show: { waveform: true, spectrum: true },
      annotation: { text: '时域↔频域的桥梁', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-point-3', type: 'spectrum', interactive: { allowWaveTypeChange: true } },
    lineState: {
      params: { waveType: 'square', terms: 20 },
      show: { spectrum: true },
      annotation: { text: '不同波形有不同频谱', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-point-4', type: 'waveform' },
    lineState: {
      params: { waveType: 'square', terms: 50 },
      show: { waveform: true, original: true, approximation: true },
      highlight: ['gibbs'],
      annotation: { text: '吉布斯现象：跳变点过冲', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-6',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { waveform: false },
      annotation: { text: '继续探索数学之美！', position: 'bottom' },
    },
  },
]
