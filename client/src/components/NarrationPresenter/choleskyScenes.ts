/**
 * Cholesky 分解讲解场景配置
 * params.matrix = 使用哪个样例矩阵索引；params.step = 已揭示的 L 元素个数
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCholeskyState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const choleskyScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Cholesky 分解', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-sym', type: 'animation' }, lineState: { params: { matrix: 1, step: 0 }, annotation: { text: '对称又正定', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-lu', type: 'animation' }, lineState: { params: { matrix: 0, step: 99 }, annotation: { text: 'LU 的对称版', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-symmetric', type: 'animation' }, lineState: { params: { matrix: 1, step: 0 }, annotation: { text: 'A = Aᵀ', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-posdef', type: 'animation' }, lineState: { params: { matrix: 1, step: 0 }, annotation: { text: '二次型恒为正', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-unique', type: 'animation' }, lineState: { params: { matrix: 1, step: 99 }, annotation: { text: '唯一的 L Lᵀ', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-col', type: 'animation' }, lineState: { params: { matrix: 0, step: 1 }, annotation: { text: '按列逐个求', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-diag', type: 'animation' }, lineState: { params: { matrix: 0, step: 1 }, annotation: { text: '对角=开平方根', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-off', type: 'animation' }, lineState: { params: { matrix: 0, step: 3 }, annotation: { text: '非对角=除对角元', position: 'bottom' } } },

  // ===== reconstruct (2) =====
  { lineId: 'rec-1', sectionId: 'reconstruct', scene: { id: 'rec-back', type: 'animation' }, lineState: { params: { matrix: 0, step: 99 }, annotation: { text: 'L Lᵀ 还原 A', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'reconstruct', scene: { id: 'rec-fail', type: 'animation' }, lineState: { params: { matrix: 2, step: 99 }, annotation: { text: '非正定则失败', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { matrix: 0, step: 4 }, annotation: { text: '逐格揭示', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { matrix: 1, step: 99 }, annotation: { text: '切换矩阵', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '下三角乘转置', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-use', type: 'summary' }, lineState: { annotation: { text: '稳定又高效', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
