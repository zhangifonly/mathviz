/**
 * 组合恒等式讲解场景配置
 * params.identity/n/k 驱动渲染器高亮对应格子
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCombinatorialProofState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const combinatorialProofScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '组合恒等式', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-triangle', type: 'animation' }, lineState: { params: { identity: 'sum', n: 4, k: 2 }, annotation: { text: '帕斯卡三角', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-count', type: 'animation' }, lineState: { params: { identity: 'sum', n: 4, k: 2 }, annotation: { text: '数格子即证明', position: 'bottom' } } },

  // ===== sum (3) =====
  { lineId: 'sum-1', sectionId: 'sum', scene: { id: 'sum-row', type: 'animation' }, lineState: { params: { identity: 'sum', n: 4, k: 2 }, annotation: { text: '整行相加 = 2^n', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'sum', scene: { id: 'sum-subset', type: 'animation' }, lineState: { params: { identity: 'sum', n: 5, k: 2 }, annotation: { text: '子集总数 2^n', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'sum', scene: { id: 'sum-classify', type: 'animation' }, lineState: { params: { identity: 'sum', n: 6, k: 3 }, annotation: { text: '按大小分类', position: 'bottom' } } },

  // ===== symmetry (3) =====
  { lineId: 'sym-1', sectionId: 'symmetry', scene: { id: 'sym-pair', type: 'animation' }, lineState: { params: { identity: 'symmetry', n: 6, k: 2 }, annotation: { text: 'C(n,k)=C(n,n-k)', position: 'top' } } },
  { lineId: 'sym-2', sectionId: 'symmetry', scene: { id: 'sym-keep', type: 'animation' }, lineState: { params: { identity: 'symmetry', n: 6, k: 2 }, annotation: { text: '留下=扔掉', position: 'bottom' } } },
  { lineId: 'sym-3', sectionId: 'symmetry', scene: { id: 'sym-same', type: 'animation' }, lineState: { params: { identity: 'symmetry', n: 7, k: 3 }, annotation: { text: '同一件事两种说法', position: 'bottom' } } },

  // ===== pascal (3) =====
  { lineId: 'pas-1', sectionId: 'pascal', scene: { id: 'pas-rule', type: 'animation' }, lineState: { params: { identity: 'pascal', n: 5, k: 2 }, annotation: { text: '上方两数之和', position: 'top' } } },
  { lineId: 'pas-2', sectionId: 'pascal', scene: { id: 'pas-split', type: 'animation' }, lineState: { params: { identity: 'pascal', n: 5, k: 2 }, annotation: { text: '含它 / 不含它', position: 'bottom' } } },
  { lineId: 'pas-3', sectionId: 'pascal', scene: { id: 'pas-add', type: 'animation' }, lineState: { params: { identity: 'pascal', n: 6, k: 3 }, annotation: { text: '两类相加=总数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-hockey', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { identity: 'hockey', n: 6, k: 2 }, annotation: { text: '曲棍球棒', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { identity: 'hockey', n: 7, k: 2 }, annotation: { text: '切换恒等式', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-end-1', sectionId: 'summary', scene: { id: 'end-recap', type: 'summary' }, lineState: { annotation: { text: '四个恒等式', position: 'top' } } },
  { lineId: 'sum-end-2', sectionId: 'summary', scene: { id: 'end-meaning', type: 'summary' }, lineState: { annotation: { text: '数同一样东西', position: 'bottom' } } },
  { lineId: 'sum-end-3', sectionId: 'summary', scene: { id: 'end-bye', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
