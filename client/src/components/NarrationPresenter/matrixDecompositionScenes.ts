/**
 * 矩阵分解讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMatrixDecompositionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const matrixDecompositionScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-analogy', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '整数分解为质因数', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-matrix', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '矩阵分解', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-explore', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '探索分解方法', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-definition', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'A = B·C·D', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-different', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '不同方法', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-lu-qr', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'LU分解和QR分解', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-svd', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'SVD最通用', position: 'bottom' },
    },
  },

  // ========== lu 段落 (4行) ==========
  {
    lineId: 'lu-1',
    sectionId: 'lu',
    scene: { id: 'lu-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'LU分解', position: 'top' },
    },
  },
  {
    lineId: 'lu-2',
    sectionId: 'lu',
    scene: { id: 'lu-gaussian', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '高斯消元法', position: 'bottom' },
    },
  },
  {
    lineId: 'lu-3',
    sectionId: 'lu',
    scene: { id: 'lu-efficient', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '高效解方程', position: 'bottom' },
    },
  },
  {
    lineId: 'lu-4',
    sectionId: 'lu',
    scene: { id: 'lu-backward', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '两次回代', position: 'bottom' },
    },
  },

  // ========== svd 段落 (4行) ==========
  {
    lineId: 'svd-1',
    sectionId: 'svd',
    scene: { id: 'svd-powerful', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '最强大的分解', position: 'top' },
    },
  },
  {
    lineId: 'svd-2',
    sectionId: 'svd',
    scene: { id: 'svd-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'A = UΣV^T', position: 'bottom' },
    },
  },
  {
    lineId: 'svd-3',
    sectionId: 'svd',
    scene: { id: 'svd-sigma', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['sigma'],
      annotation: { text: '奇异值对角矩阵', position: 'bottom' },
    },
  },
  {
    lineId: 'svd-4',
    sectionId: 'svd',
    scene: { id: 'svd-meaning', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '揭示秩和稳定性', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '科学计算', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-recommend', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '推荐系统', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-image', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '图像压缩', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-nlp', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '潜在语义分析', position: 'bottom' },
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
    scene: { id: 'summary-methods', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'LU到SVD', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-tool', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '强大工具', position: 'bottom' },
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
