/**
 * 雅可比矩阵讲解场景配置
 * 每句口播对应映射类型(params.mappingId)与高亮方块(params.hi, params.hj)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultJacobianState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const jacobianScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '雅可比矩阵', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-bend', type: 'animation' }, lineState: { params: { mappingId: 'swirl', hi: 4, hj: 4 }, annotation: { text: '方格被弯曲', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-zoom', type: 'animation' }, lineState: { params: { mappingId: 'swirl', hi: 2, hj: 3 }, annotation: { text: '放大近似平行四边形', position: 'bottom' } } },

  // ===== local (3) =====
  { lineId: 'def-1', sectionId: 'local', scene: { id: 'def-linear', type: 'animation' }, lineState: { params: { mappingId: 'polar', hi: 4, hj: 4 }, annotation: { text: '局部即线性', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'local', scene: { id: 'def-stretch', type: 'animation' }, lineState: { params: { mappingId: 'polar', hi: 6, hj: 5 }, annotation: { text: '拉伸加旋转', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'local', scene: { id: 'def-name', type: 'animation' }, lineState: { params: { mappingId: 'polar', hi: 3, hj: 2 }, annotation: { text: '雅可比矩阵登场', position: 'bottom' } } },

  // ===== matrix (3) =====
  { lineId: 'mat-1', sectionId: 'matrix', scene: { id: 'mat-partial', type: 'animation' }, lineState: { params: { mappingId: 'square', hi: 4, hj: 4 }, annotation: { text: '偏导排成 2×2', position: 'top' } } },
  { lineId: 'mat-2', sectionId: 'matrix', scene: { id: 'mat-column', type: 'animation' }, lineState: { params: { mappingId: 'square', hi: 5, hj: 5 }, annotation: { text: '每列=一个方向', position: 'bottom' } } },
  { lineId: 'mat-3', sectionId: 'matrix', scene: { id: 'mat-diff', type: 'animation' }, lineState: { params: { mappingId: 'square', hi: 2, hj: 2 }, annotation: { text: '数值差分通用', position: 'bottom' } } },

  // ===== det (3) =====
  { lineId: 'det-1', sectionId: 'det', scene: { id: 'det-area', type: 'animation' }, lineState: { params: { mappingId: 'wave', hi: 4, hj: 4 }, annotation: { text: '|det J| = 面积比', position: 'top' } } },
  { lineId: 'det-2', sectionId: 'det', scene: { id: 'det-scale', type: 'animation' }, lineState: { params: { mappingId: 'swirl', hi: 6, hj: 4 }, annotation: { text: '放大或压缩', position: 'bottom' } } },
  { lineId: 'det-3', sectionId: 'det', scene: { id: 'det-integral', type: 'animation' }, lineState: { params: { mappingId: 'polar', hi: 5, hj: 4 }, annotation: { text: 'dxdy=|detJ|dudv', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-move', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mappingId: 'square', hi: 3, hj: 4 }, annotation: { text: '移动方块', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mappingId: 'wave', hi: 4, hj: 3 }, annotation: { text: '切换映射', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '局部线性化', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-det', type: 'summary' }, lineState: { annotation: { text: '行列式=面积钥匙', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
