/**
 * 一次函数讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 33 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLinearState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const linearScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { line: false, grid: false, intercepts: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-line', type: 'animation' },
    lineState: {
      params: { k: 1, b: 0 },
      show: { line: true, grid: true, intercepts: false },
      annotation: { text: '一次函数图像是直线', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-goal', type: 'animation' },
    lineState: {
      params: { k: 1, b: 0 },
      show: { line: true, grid: true, intercepts: true },
      annotation: { text: '理解斜率和截距', position: 'bottom' },
    },
  },

  // ========== formula 段落 (4行) ==========
  {
    lineId: 'formula-1',
    sectionId: 'formula',
    scene: { id: 'formula-general', type: 'formula' },
    lineState: {
      params: { k: 1, b: 1 },
      show: { line: true, grid: true, formula: true },
      annotation: { text: 'y = kx + b', position: 'top' },
    },
  },
  {
    lineId: 'formula-2',
    sectionId: 'formula',
    scene: { id: 'formula-k', type: 'formula' },
    lineState: {
      params: { k: 2, b: 1 },
      show: { line: true, grid: true, formula: true },
      highlight: ['k'],
      annotation: { text: 'k=斜率，决定倾斜程度', position: 'bottom' },
    },
  },
  {
    lineId: 'formula-3',
    sectionId: 'formula',
    scene: { id: 'formula-b', type: 'formula' },
    lineState: {
      params: { k: 1, b: 2 },
      show: { line: true, grid: true, formula: true, intercepts: true },
      highlight: ['b'],
      annotation: { text: 'b=y轴截距', position: 'bottom' },
    },
  },
  {
    lineId: 'formula-4',
    sectionId: 'formula',
    scene: { id: 'formula-const', type: 'formula' },
    lineState: {
      params: { k: 0, b: 2 },
      show: { line: true, grid: true, formula: true },
      annotation: { text: 'k=0时是水平线', position: 'bottom' },
    },
  },

  // ========== slope 段落 (5行) ==========
  {
    lineId: 'slope-1',
    sectionId: 'slope',
    scene: { id: 'slope-meaning', type: 'animation' },
    lineState: {
      params: { k: 1, b: 0 },
      show: { line: true, grid: true, slopeTriangle: true },
      annotation: { text: 'x增1，y增k', position: 'top' },
    },
  },
  {
    lineId: 'slope-2',
    sectionId: 'slope',
    scene: { id: 'slope-positive', type: 'animation' },
    lineState: {
      params: { k: 2, b: 0 },
      show: { line: true, grid: true, slopeTriangle: true },
      annotation: { text: 'k>0，向右上倾斜', position: 'bottom' },
    },
  },
  {
    lineId: 'slope-3',
    sectionId: 'slope',
    scene: { id: 'slope-negative', type: 'animation' },
    lineState: {
      params: { k: -1, b: 0 },
      show: { line: true, grid: true, slopeTriangle: true },
      annotation: { text: 'k<0，向右下倾斜', position: 'bottom' },
    },
  },
  {
    lineId: 'slope-4',
    sectionId: 'slope',
    scene: { id: 'slope-abs', type: 'animation' },
    lineState: {
      params: { k: 3, b: 0 },
      show: { line: true, grid: true, slopeTriangle: true },
      annotation: { text: '|k|越大越陡', position: 'bottom' },
    },
  },
  {
    lineId: 'slope-5',
    sectionId: 'slope',
    scene: { id: 'slope-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { k: 1, b: 0 },
      show: { line: true, grid: true, slopeTriangle: true },
      annotation: { text: '拖动滑块调整k', position: 'bottom' },
    },
  },

  // ========== intercept 段落 (4行) ==========
  {
    lineId: 'intercept-1',
    sectionId: 'intercept',
    scene: { id: 'int-y', type: 'animation' },
    lineState: {
      params: { k: 1, b: 2 },
      show: { line: true, grid: true, intercepts: true },
      highlight: ['yIntercept'],
      annotation: { text: 'b=x为0时y的值', position: 'top' },
    },
  },
  {
    lineId: 'intercept-2',
    sectionId: 'intercept',
    scene: { id: 'int-shift', type: 'animation' },
    lineState: {
      params: { k: 1, b: 3 },
      show: { line: true, grid: true, intercepts: true },
      annotation: { text: '改变b，直线上下平移', position: 'bottom' },
    },
  },
  {
    lineId: 'intercept-3',
    sectionId: 'intercept',
    scene: { id: 'int-x', type: 'formula' },
    lineState: {
      params: { k: 1, b: 2 },
      show: { line: true, grid: true, intercepts: true, formula: true },
      highlight: ['xIntercept'],
      annotation: { text: 'x轴截距=-b/k', position: 'bottom' },
    },
  },
  {
    lineId: 'intercept-4',
    sectionId: 'intercept',
    scene: { id: 'int-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { k: 1, b: 1 },
      show: { line: true, grid: true, intercepts: true },
      annotation: { text: '调整截距滑块', position: 'bottom' },
    },
  },

  // ========== graph 段落 (3行) ==========
  {
    lineId: 'graph-1',
    sectionId: 'graph',
    scene: { id: 'graph-line', type: 'animation' },
    lineState: {
      params: { k: 1, b: 1 },
      show: { line: true, grid: true, intercepts: true },
      annotation: { text: '蓝线=函数图像', position: 'top' },
    },
  },
  {
    lineId: 'graph-2',
    sectionId: 'graph',
    scene: { id: 'graph-triangle', type: 'animation' },
    lineState: {
      params: { k: 1, b: 1 },
      show: { line: true, grid: true, slopeTriangle: true },
      highlight: ['slopeTriangle'],
      annotation: { text: '黄色三角形=斜率', position: 'bottom' },
    },
  },
  {
    lineId: 'graph-3',
    sectionId: 'graph',
    scene: { id: 'graph-checkbox', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { k: 1, b: 1 },
      show: { line: true, grid: true, intercepts: true, slopeTriangle: true },
      annotation: { text: '勾选显示/隐藏元素', position: 'bottom' },
    },
  },

  // ========== animation 段落 (3行) ==========
  {
    lineId: 'animation-1',
    sectionId: 'animation',
    scene: { id: 'anim-button', type: 'animation' },
    lineState: {
      params: { k: -2, b: 1, isAnimating: false },
      show: { line: true, grid: true },
      annotation: { text: '点击播放动画', position: 'top' },
    },
  },
  {
    lineId: 'animation-2',
    sectionId: 'animation',
    scene: { id: 'anim-rotate', type: 'animation' },
    lineState: {
      params: { k: 0, b: 1, isAnimating: true },
      show: { line: true, grid: true, intercepts: true },
      annotation: { text: '直线绕截距点旋转', position: 'bottom' },
    },
  },
  {
    lineId: 'animation-3',
    sectionId: 'animation',
    scene: { id: 'anim-understand', type: 'animation' },
    lineState: {
      params: { k: 2, b: 1, isAnimating: true },
      show: { line: true, grid: true },
      annotation: { text: '理解斜率对方向的影响', position: 'bottom' },
    },
  },

  // ========== examples 段落 (4行) ==========
  {
    lineId: 'examples-1',
    sectionId: 'examples',
    scene: { id: 'ex-buttons', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { k: 1, b: 0 },
      show: { line: true, grid: true },
      annotation: { text: '点击快速设置按钮', position: 'top' },
    },
  },
  {
    lineId: 'examples-2',
    sectionId: 'examples',
    scene: { id: 'ex-yx', type: 'animation' },
    lineState: {
      params: { k: 1, b: 0 },
      show: { line: true, grid: true, formula: true },
      annotation: { text: 'y=x，过原点，45°', position: 'bottom' },
    },
  },
  {
    lineId: 'examples-3',
    sectionId: 'examples',
    scene: { id: 'ex-neg', type: 'animation' },
    lineState: {
      params: { k: -1, b: 0 },
      show: { line: true, grid: true, formula: true },
      annotation: { text: 'y=-x，方向相反', position: 'bottom' },
    },
  },
  {
    lineId: 'examples-4',
    sectionId: 'examples',
    scene: { id: 'ex-2x1', type: 'animation' },
    lineState: {
      params: { k: 2, b: 1 },
      show: { line: true, grid: true, formula: true, intercepts: true },
      annotation: { text: 'y=2x+1，更陡，截距1', position: 'bottom' },
    },
  },

  // ========== application 段落 (3行) ==========
  {
    lineId: 'application-1',
    sectionId: 'application',
    scene: { id: 'app-taxi', type: 'application' },
    lineState: {
      params: { k: 2, b: 10 },
      show: { line: true, grid: true, formula: true },
      annotation: { text: '出租车计费：起步价+每公里', position: 'top' },
    },
  },
  {
    lineId: 'application-2',
    sectionId: 'application',
    scene: { id: 'app-explain', type: 'application' },
    lineState: {
      params: { k: 2, b: 10 },
      show: { line: true, grid: true, formula: true, intercepts: true },
      annotation: { text: 'y=2x+10，起步10元，每公里2元', position: 'bottom' },
    },
  },
  {
    lineId: 'application-3',
    sectionId: 'application',
    scene: { id: 'app-more', type: 'application' },
    lineState: {
      params: { k: 1, b: 5 },
      show: { line: true, grid: true },
      annotation: { text: '手机话费、水电费等', position: 'bottom' },
    },
  },

  // ========== summary 段落 (4行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { line: false, grid: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-formula', type: 'formula' },
    lineState: {
      params: { k: 1, b: 1 },
      show: { line: true, grid: true, formula: true },
      annotation: { text: 'y=kx+b，k斜率，b截距', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-slope', type: 'animation' },
    lineState: {
      params: { k: 2, b: 1 },
      show: { line: true, grid: true, slopeTriangle: true },
      annotation: { text: 'k决定方向和程度，b决定交点', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { line: false, grid: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
