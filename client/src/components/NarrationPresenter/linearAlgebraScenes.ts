/**
 * 线性代数讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLinearAlgebraState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const linearAlgebraScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-3d', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '3D游戏中的旋转', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-search', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '搜索引擎', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-related', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '线性代数', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-vector', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '向量', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-space', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '向量空间', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-matrix', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '矩阵=线性变换', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-viz', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '可视化理解', position: 'bottom' },
    },
  },

  // ========== transformation 段落 (4行) ==========
  {
    lineId: 'trans-1',
    sectionId: 'transformation',
    scene: { id: 'trans-property', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '保持直线和原点', position: 'top' },
    },
  },
  {
    lineId: 'trans-2',
    sectionId: 'transformation',
    scene: { id: 'trans-examples', type: 'animation' },
    lineState: {
      params: { transform: 'rotate' },
      show: { diagram: true },
      annotation: { text: '旋转、缩放、剪切', position: 'bottom' },
    },
  },
  {
    lineId: 'trans-3',
    sectionId: 'transformation',
    scene: { id: 'trans-matrix', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '矩阵表示', position: 'bottom' },
    },
  },
  {
    lineId: 'trans-4',
    sectionId: 'transformation',
    scene: { id: 'trans-grid', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['grid'],
      annotation: { text: '网格变形', position: 'bottom' },
    },
  },

  // ========== eigen 段落 (4行) ==========
  {
    lineId: 'eigen-1',
    sectionId: 'eigen',
    scene: { id: 'eigen-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['eigenvector'],
      annotation: { text: '特征向量', position: 'top' },
    },
  },
  {
    lineId: 'eigen-2',
    sectionId: 'eigen',
    scene: { id: 'eigen-value', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['eigenvalue'],
      annotation: { text: '特征值', position: 'bottom' },
    },
  },
  {
    lineId: 'eigen-3',
    sectionId: 'eigen',
    scene: { id: 'eigen-essence', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '变换的本质', position: 'bottom' },
    },
  },
  {
    lineId: 'eigen-4',
    sectionId: 'eigen',
    scene: { id: 'eigen-data', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数据降维', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '现代科技基础', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-graphics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算机图形学', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-ml', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '神经网络', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-quantum', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '量子力学', position: 'bottom' },
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
    scene: { id: 'summary-tools', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '空间变换工具', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-eigen', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['eigenvector'],
      annotation: { text: '特征值与特征向量', position: 'bottom' },
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
