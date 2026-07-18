/**
 * 约瑟夫问题讲解场景配置
 * 每句口播对应围圈参数（params.n / params.k / params.step）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultJosephusProblemState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const josephusProblemScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '约瑟夫问题', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-count', type: 'animation' }, lineState: { params: { n: 7, k: 3, step: 1 }, annotation: { text: '数到就出局', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-shrink', type: 'animation' }, lineState: { params: { n: 7, k: 3, step: 3 }, annotation: { text: '越来越少', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'rule-1', sectionId: 'rule', scene: { id: 'rule-k', type: 'animation' }, lineState: { params: { n: 12, k: 3, step: 1 }, annotation: { text: '每数到 k 出局', position: 'top' } } },
  { lineId: 'rule-2', sectionId: 'rule', scene: { id: 'rule-continue', type: 'animation' }, lineState: { params: { n: 12, k: 3, step: 5 }, annotation: { text: '接着往下报数', position: 'bottom' } } },
  { lineId: 'rule-3', sectionId: 'rule', scene: { id: 'rule-last', type: 'animation' }, lineState: { params: { n: 12, k: 3, step: 11 }, annotation: { text: '只剩一人', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'formula-1', sectionId: 'formula', scene: { id: 'formula-sim', type: 'animation' }, lineState: { params: { n: 7, k: 3, step: 4 }, annotation: { text: '不止能模拟', position: 'top' } } },
  { lineId: 'formula-2', sectionId: 'formula', scene: { id: 'formula-base', type: 'animation' }, lineState: { params: { n: 1, k: 3, step: 0 }, annotation: { text: 'J(1,k)=0', position: 'bottom' } } },
  { lineId: 'formula-3', sectionId: 'formula', scene: { id: 'formula-rec', type: 'animation' }, lineState: { params: { n: 7, k: 3, step: 3 }, annotation: { text: 'J(n,k)=(J(n-1,k)+k)%n', position: 'bottom' } } },

  // ===== survivor (3) =====
  { lineId: 'survivor-1', sectionId: 'survivor', scene: { id: 'survivor-back', type: 'animation' }, lineState: { params: { n: 7, k: 3, step: 5 }, annotation: { text: '换回熟悉编号', position: 'top' } } },
  { lineId: 'survivor-2', sectionId: 'survivor', scene: { id: 'survivor-show', type: 'animation' }, lineState: { params: { n: 7, k: 3, step: 6 }, annotation: { text: '幸存者是 4 号', position: 'bottom' } } },
  { lineId: 'survivor-3', sectionId: 'survivor', scene: { id: 'survivor-fast', type: 'animation' }, lineState: { params: { n: 20, k: 5, step: 19 }, annotation: { text: '几步就算出', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-adjust', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 12, k: 2, step: 6 }, annotation: { text: '调整 n 与 k', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-play', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 12, k: 2, step: 11 }, annotation: { text: '播放出局过程', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '报数出局规则', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-formula', type: 'summary' }, lineState: { annotation: { text: '递推公式预言', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
