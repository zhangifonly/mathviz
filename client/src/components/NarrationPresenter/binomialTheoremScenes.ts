/**
 * 二项式定理讲解场景配置
 * 每句口播对应高亮的指数 n（params.n）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBinomialTheoremState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const binomialTheoremScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '二项式定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-square', type: 'animation' }, lineState: { params: { n: 2 }, annotation: { text: '系数 1·2·1', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-more', type: 'animation' }, lineState: { params: { n: 3 }, annotation: { text: '更高次呢？', position: 'bottom' } } },

  // ===== coeff (3) =====
  { lineId: 'coeff-1', sectionId: 'coeff', scene: { id: 'coeff-count', type: 'animation' }, lineState: { params: { n: 3 }, annotation: { text: 'n+1 项', position: 'top' } } },
  { lineId: 'coeff-2', sectionId: 'coeff', scene: { id: 'coeff-pow', type: 'animation' }, lineState: { params: { n: 4 }, annotation: { text: '指数和恒为 n', position: 'bottom' } } },
  { lineId: 'coeff-3', sectionId: 'coeff', scene: { id: 'coeff-tri', type: 'animation' }, lineState: { params: { n: 4 }, annotation: { text: '系数排成三角', position: 'bottom' } } },

  // ===== pascal (3) =====
  { lineId: 'pascal-1', sectionId: 'pascal', scene: { id: 'pascal-name', type: 'animation' }, lineState: { params: { n: 4 }, annotation: { text: '帕斯卡/杨辉三角', position: 'top' } } },
  { lineId: 'pascal-2', sectionId: 'pascal', scene: { id: 'pascal-rule', type: 'animation' }, lineState: { params: { n: 5 }, annotation: { text: '上两数之和', position: 'bottom' } } },
  { lineId: 'pascal-3', sectionId: 'pascal', scene: { id: 'pascal-row', type: 'animation' }, lineState: { params: { n: 5 }, annotation: { text: '第 n 行=系数', position: 'bottom' } } },

  // ===== combo (3) =====
  { lineId: 'combo-1', sectionId: 'combo', scene: { id: 'combo-cnk', type: 'animation' }, lineState: { params: { n: 4 }, annotation: { text: '系数=C(n,k)', position: 'top' } } },
  { lineId: 'combo-2', sectionId: 'combo', scene: { id: 'combo-pick', type: 'animation' }, lineState: { params: { n: 4 }, annotation: { text: '选 k 个 b', position: 'bottom' } } },
  { lineId: 'combo-3', sectionId: 'combo', scene: { id: 'combo-ways', type: 'animation' }, lineState: { params: { n: 5 }, annotation: { text: 'C(n,k) 种选法', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 3 }, annotation: { text: '切换指数 n', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-match', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 5 }, annotation: { text: '系数一一对应', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '展开成 n+1 项', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-combo', type: 'summary' }, lineState: { annotation: { text: '系数=帕斯卡行', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
