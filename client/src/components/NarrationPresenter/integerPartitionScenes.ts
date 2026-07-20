/**
 * 整数分拆讲解场景配置
 * params.n 选择当前展示的整数，params.idx 选择该 n 的第几个分拆，
 * params.conj 为 true 时叠画共轭。
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultIntegerPartitionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const integerPartitionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '整数分拆', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-list', type: 'animation' }, lineState: { params: { n: 4, idx: 0 }, annotation: { text: '4 有五种分拆', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-order', type: 'animation' }, lineState: { params: { n: 4, idx: 3 }, annotation: { text: '不计顺序', position: 'bottom' } } },

  // ===== count (3) =====
  { lineId: 'def-1', sectionId: 'count', scene: { id: 'def-p4', type: 'animation' }, lineState: { params: { n: 4, idx: 0 }, annotation: { text: 'p(4) = 5', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'count', scene: { id: 'def-grow', type: 'animation' }, lineState: { params: { n: 7, idx: 0 }, annotation: { text: '增长飞快', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'count', scene: { id: 'def-dp', type: 'animation' }, lineState: { params: { n: 6, idx: 0 }, annotation: { text: '动态规划求 p(n)', position: 'bottom' } } },

  // ===== young (3) =====
  { lineId: 'yg-1', sectionId: 'young', scene: { id: 'yg-rows', type: 'animation' }, lineState: { params: { n: 6, idx: 1 }, annotation: { text: '一部件=一行方块', position: 'top' } } },
  { lineId: 'yg-2', sectionId: 'young', scene: { id: 'yg-stair', type: 'animation' }, lineState: { params: { n: 7, idx: 2 }, annotation: { text: '左对齐的台阶', position: 'bottom' } } },
  { lineId: 'yg-3', sectionId: 'young', scene: { id: 'yg-shape', type: 'animation' }, lineState: { params: { n: 6, idx: 2 }, annotation: { text: '看得见的和', position: 'bottom' } } },

  // ===== conjugate (3) =====
  { lineId: 'conj-1', sectionId: 'conjugate', scene: { id: 'conj-flip', type: 'animation' }, lineState: { params: { n: 6, idx: 1, conj: true }, annotation: { text: '沿对角线翻转', position: 'top' } } },
  { lineId: 'conj-2', sectionId: 'conjugate', scene: { id: 'conj-new', type: 'animation' }, lineState: { params: { n: 7, idx: 2, conj: true }, annotation: { text: '得到共轭分拆', position: 'bottom' } } },
  { lineId: 'conj-3', sectionId: 'conjugate', scene: { id: 'conj-sym', type: 'animation' }, lineState: { params: { n: 6, idx: 3, conj: true }, annotation: { text: '翻两次还原', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-browse', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 5, idx: 0 }, annotation: { text: '逐张翻看', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-conj', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 5, idx: 1, conj: true }, annotation: { text: '看转置', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '分拆与 p(n)', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-conj', type: 'summary' }, lineState: { annotation: { text: '杨氏图与共轭', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
