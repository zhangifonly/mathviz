/**
 * 傅里叶绘图讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFourierDrawingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 5,
  isAnimating: false,
  highlightedElements: [],
}

export const fourierDrawingScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-circles', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '用旋转圆绘图?', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-math', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '傅里叶级数', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-preview', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '神奇的过程', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-decompose', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '周期函数分解', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-circle', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '正弦波→圆周运动', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-chain', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '首尾相连', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-coefficients', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['coefficients'],
      annotation: { text: '傅里叶系数', position: 'bottom' },
    },
  },

  // ========== visualization 段落 (4行) ==========
  {
    lineId: 'vis-1',
    sectionId: 'visualization',
    scene: { id: 'vis-square', type: 'animation' },
    lineState: {
      params: { shape: 'square', terms: 5 },
      show: { diagram: true, curve: true },
      annotation: { text: '绘制正方形', position: 'top' },
    },
  },
  {
    lineId: 'vis-2',
    sectionId: 'visualization',
    scene: { id: 'vis-circles', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['circles'],
      annotation: { text: '旋转的圆', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-3',
    sectionId: 'visualization',
    scene: { id: 'vis-trace', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      highlight: ['trajectory'],
      annotation: { text: '末端轨迹', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-4',
    sectionId: 'visualization',
    scene: { id: 'vis-more-circles', type: 'animation' },
    lineState: {
      params: { terms: 20 },
      show: { diagram: true, curve: true },
      annotation: { text: '增加圆的数量', position: 'bottom' },
    },
  },

  // ========== complex 段落 (4行) ==========
  {
    lineId: 'comp-1',
    sectionId: 'complex',
    scene: { id: 'comp-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '复杂图形挑战', position: 'top' },
    },
  },
  {
    lineId: 'comp-2',
    sectionId: 'complex',
    scene: { id: 'comp-any-curve', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '任何闭合曲线', position: 'bottom' },
    },
  },
  {
    lineId: 'comp-3',
    sectionId: 'complex',
    scene: { id: 'comp-examples', type: 'animation' },
    lineState: {
      params: { shape: 'signature' },
      show: { diagram: true, curve: true },
      annotation: { text: '签名、卡通、汉字', position: 'bottom' },
    },
  },
  {
    lineId: 'comp-4',
    sectionId: 'complex',
    scene: { id: 'comp-power', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '强大的表达能力', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '实际应用', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-compress', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '矢量图形压缩', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-recognition', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '形状识别', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-understanding', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '信号处理本质', position: 'bottom' },
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
    scene: { id: 'summary-circles', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '圆周运动叠加', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-beauty', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数学之美', position: 'bottom' },
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
