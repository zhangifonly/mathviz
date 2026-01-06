/**
 * 主成分分析讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPcaState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pcaScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-high-dim', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '高维数据', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-simplify', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '简化复杂性', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-pca', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'PCA主成分分析', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-variance', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '找最大变化方向', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-first', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['pc1'],
      annotation: { text: '第一主成分', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-second', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['pc2'],
      annotation: { text: '第二主成分', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-all', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '所有主成分', position: 'bottom' },
    },
  },

  // ========== visualization 段落 (4行) ==========
  {
    lineId: 'vis-1',
    sectionId: 'visualization',
    scene: { id: 'vis-2d', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '二维数据', position: 'top' },
    },
  },
  {
    lineId: 'vis-2',
    sectionId: 'visualization',
    scene: { id: 'vis-ellipse', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['ellipse'],
      annotation: { text: '椭圆分布', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-3',
    sectionId: 'visualization',
    scene: { id: 'vis-long-axis', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['pc1'],
      annotation: { text: '长轴=第一主成分', position: 'bottom' },
    },
  },
  {
    lineId: 'vis-4',
    sectionId: 'visualization',
    scene: { id: 'vis-short-axis', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['pc2'],
      annotation: { text: '短轴=第二主成分', position: 'bottom' },
    },
  },

  // ========== math 段落 (4行) ==========
  {
    lineId: 'math-1',
    sectionId: 'math',
    scene: { id: 'math-covariance', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '协方差矩阵', position: 'top' },
    },
  },
  {
    lineId: 'math-2',
    sectionId: 'math',
    scene: { id: 'math-eigenvector', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['eigenvector'],
      annotation: { text: '主成分=特征向量', position: 'bottom' },
    },
  },
  {
    lineId: 'math-3',
    sectionId: 'math',
    scene: { id: 'math-eigenvalue', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['eigenvalue'],
      annotation: { text: '特征值=方差', position: 'bottom' },
    },
  },
  {
    lineId: 'math-4',
    sectionId: 'math',
    scene: { id: 'math-reduction', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '选前几个主成分', position: 'bottom' },
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
    scene: { id: 'app-face', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '人脸识别', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-finance', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '金融分析', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-bio', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '基因表达', position: 'bottom' },
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
    scene: { id: 'summary-direction', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['pc1', 'pc2'],
      annotation: { text: '主要变化方向', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-tool', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '降维工具', position: 'bottom' },
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
