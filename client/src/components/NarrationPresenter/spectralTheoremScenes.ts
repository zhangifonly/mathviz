/**
 * 谱分解讲解场景配置
 * 每句口播对应展示的对称矩阵索引（params.mat，见 SAMPLE_MATRICES）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSpectralTheoremState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const spectralTheoremScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '谱分解', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-sym', type: 'animation' }, lineState: { params: { mat: 1 }, annotation: { text: '对称矩阵', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-thm', type: 'animation' }, lineState: { params: { mat: 1 }, annotation: { text: '优雅的分解定理', position: 'bottom' } } },

  // ===== concept-eigen (3) =====
  { lineId: 'def-1', sectionId: 'concept-eigen', scene: { id: 'def-real', type: 'animation' }, lineState: { params: { mat: 0 }, annotation: { text: '特征值都是实数', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'concept-eigen', scene: { id: 'def-orth', type: 'animation' }, lineState: { params: { mat: 2 }, annotation: { text: '特征向量互相正交', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'concept-eigen', scene: { id: 'def-basis', type: 'animation' }, lineState: { params: { mat: 2 }, annotation: { text: '标准正交坐标轴', position: 'bottom' } } },

  // ===== concept-formula (3) =====
  { lineId: 'form-1', sectionId: 'concept-formula', scene: { id: 'form-sum', type: 'animation' }, lineState: { params: { mat: 1 }, annotation: { text: 'M = Σ λ v vᵀ', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'concept-formula', scene: { id: 'form-rank1', type: 'animation' }, lineState: { params: { mat: 1 }, annotation: { text: '秩一投影之和', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'concept-formula', scene: { id: 'form-stretch', type: 'animation' }, lineState: { params: { mat: 2 }, annotation: { text: '各方向独立伸缩', position: 'bottom' } } },

  // ===== concept-geo (3) =====
  { lineId: 'geo-1', sectionId: 'concept-geo', scene: { id: 'geo-circle', type: 'animation' }, lineState: { params: { mat: 0 }, annotation: { text: '单位圆变椭圆', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'concept-geo', scene: { id: 'geo-axis', type: 'animation' }, lineState: { params: { mat: 2 }, annotation: { text: '主轴=特征向量', position: 'bottom' } } },
  { lineId: 'geo-3', sectionId: 'concept-geo', scene: { id: 'geo-len', type: 'animation' }, lineState: { params: { mat: 2 }, annotation: { text: '半轴长=特征值', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mat: 1 }, annotation: { text: '切换矩阵看主轴', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-orth', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mat: 2 }, annotation: { text: '主轴始终垂直', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '实值·正交', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-geo', type: 'summary' }, lineState: { annotation: { text: '圆变椭圆', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
