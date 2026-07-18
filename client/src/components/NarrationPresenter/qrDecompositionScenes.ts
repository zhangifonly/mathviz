/**
 * QR 分解讲解场景配置
 * 每句口播对应一个样例矩阵索引（params.idx）与是否显示正交列（params.showQ）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultQrDecompositionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const qrDecompositionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'QR分解', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-split', type: 'animation' }, lineState: { params: { idx: 1, showQ: 0 }, annotation: { text: '拆成两块结构', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-qr', type: 'animation' }, lineState: { params: { idx: 1, showQ: 1 }, annotation: { text: '正交阵 Q · 上三角 R', position: 'bottom' } } },

  // ===== gs (3) =====
  { lineId: 'gs-1', sectionId: 'gs', scene: { id: 'gs-first', type: 'animation' }, lineState: { params: { idx: 1, showQ: 0 }, annotation: { text: '第一列单位化', position: 'top' } } },
  { lineId: 'gs-2', sectionId: 'gs', scene: { id: 'gs-proj', type: 'animation' }, lineState: { params: { idx: 1, showQ: 1 }, annotation: { text: '减去投影得垂直', position: 'bottom' } } },
  { lineId: 'gs-3', sectionId: 'gs', scene: { id: 'gs-all', type: 'animation' }, lineState: { params: { idx: 2, showQ: 1 }, annotation: { text: '两两正交的单位向量', position: 'bottom' } } },

  // ===== qr (3) =====
  { lineId: 'qr-1', sectionId: 'qr', scene: { id: 'qr-Q', type: 'animation' }, lineState: { params: { idx: 2, showQ: 1 }, annotation: { text: 'Q转置Q = I', position: 'top' } } },
  { lineId: 'qr-2', sectionId: 'qr', scene: { id: 'qr-R', type: 'animation' }, lineState: { params: { idx: 2, showQ: 1 }, annotation: { text: 'R 记录投影系数', position: 'bottom' } } },
  { lineId: 'qr-3', sectionId: 'qr', scene: { id: 'qr-diag', type: 'animation' }, lineState: { params: { idx: 0, showQ: 1 }, annotation: { text: 'R 对角=剩余长度', position: 'bottom' } } },

  // ===== verify (2) =====
  { lineId: 'ver-1', sectionId: 'verify', scene: { id: 'ver-mul', type: 'animation' }, lineState: { params: { idx: 0, showQ: 1 }, annotation: { text: 'Q R = A', position: 'top' } } },
  { lineId: 'ver-2', sectionId: 'verify', scene: { id: 'ver-recombine', type: 'animation' }, lineState: { params: { idx: 2, showQ: 1 }, annotation: { text: '用正交基重组各列', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 1, showQ: 1 }, annotation: { text: '切换矩阵看正交化', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-table', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 2, showQ: 1 }, annotation: { text: '对照 Q R 表格', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'Q 正交 · R 上三角', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-uses', type: 'summary' }, lineState: { annotation: { text: '最小二乘·QR算法', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
