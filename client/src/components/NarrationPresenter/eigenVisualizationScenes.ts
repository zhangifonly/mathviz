/**
 * 特征值与特征向量讲解场景配置
 * 每句口播对应一个矩阵选项（params.optId）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEigenVisualizationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const eigenVisualizationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '特征值与特征向量', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-turn', type: 'animation' }, lineState: { params: { optId: 'stretch' }, annotation: { text: '大多向量会转向', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-fixed', type: 'animation' }, lineState: { params: { optId: 'stretch' }, annotation: { text: '特殊向量方向不变', position: 'bottom' } } },

  // ===== transform (3) =====
  { lineId: 'transform-1', sectionId: 'transform', scene: { id: 'trans-probe', type: 'animation' }, lineState: { params: { optId: 'stretch' }, annotation: { text: '蓝色向量偏转', position: 'top' } } },
  { lineId: 'transform-2', sectionId: 'transform', scene: { id: 'trans-eigen', type: 'animation' }, lineState: { params: { optId: 'stretch' }, annotation: { text: '彩色向量不动', position: 'bottom' } } },
  { lineId: 'transform-3', sectionId: 'transform', scene: { id: 'trans-line', type: 'animation' }, lineState: { params: { optId: 'stretch' }, annotation: { text: '特征方向', position: 'bottom' } } },

  // ===== eigen (3) =====
  { lineId: 'eigen-1', sectionId: 'eigen', scene: { id: 'eig-lambda', type: 'animation' }, lineState: { params: { optId: 'stretch' }, annotation: { text: '缩放倍数即 λ', position: 'top' } } },
  { lineId: 'eigen-2', sectionId: 'eigen', scene: { id: 'eig-scale', type: 'animation' }, lineState: { params: { optId: 'symmetric' }, annotation: { text: '拉长 / 压短 / 翻转', position: 'bottom' } } },
  { lineId: 'eigen-3', sectionId: 'eigen', scene: { id: 'eig-formula', type: 'formula' }, lineState: { annotation: { text: 'A v = λ v', position: 'top' } } },

  // ===== solve (3) =====
  { lineId: 'solve-1', sectionId: 'solve', scene: { id: 'solve-eq', type: 'formula' }, lineState: { annotation: { text: 'λ² - tr·λ + det = 0', position: 'top' } } },
  { lineId: 'solve-2', sectionId: 'solve', scene: { id: 'solve-disc', type: 'animation' }, lineState: { params: { optId: 'shear' }, annotation: { text: '判别式定实根', position: 'bottom' } } },
  { lineId: 'solve-3', sectionId: 'solve', scene: { id: 'solve-complex', type: 'animation' }, lineState: { params: { optId: 'rotation' }, annotation: { text: '旋转 → 复特征值', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-sym', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optId: 'symmetric' }, annotation: { text: '对称 → 垂直', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-shear', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optId: 'shear' }, annotation: { text: '剪切 → 重根', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '方向不变 + 缩放', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: 'PCA / 振动 / 量子', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '看清变换的灵魂！', position: 'bottom' } } },
]
