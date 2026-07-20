/**
 * Frobenius 硬币问题讲解场景配置
 * 每句口播对应一组硬币面额（params.setIdx 指向 COIN_SETS 下标）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFrobeniusCoinState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const frobeniusCoinScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Frobenius硬币问题', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-can', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: '3,5 能凑出的', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-cannot', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: '1,2,4,7 凑不出', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: '最大凑不出的是几？', position: 'bottom' } } },

  // ===== representable (3) =====
  { lineId: 'rep-1', sectionId: 'representable', scene: { id: 'rep-blocks', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: '硬币=无限积木', position: 'top' } } },
  { lineId: 'rep-2', sectionId: 'representable', scene: { id: 'rep-combo', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: '非负整数组合', position: 'bottom' } } },
  { lineId: 'rep-3', sectionId: 'representable', scene: { id: 'rep-large', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: '足够大都能凑', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-two', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: '两枚硬币 a,b', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-eq', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: 'ab − a − b', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-example', type: 'animation' }, lineState: { params: { setIdx: 0 }, annotation: { text: '3,5 → 7', position: 'bottom' } } },

  // ===== mcnugget (3) =====
  { lineId: 'mcn-1', sectionId: 'mcnugget', scene: { id: 'mcn-set', type: 'animation' }, lineState: { params: { setIdx: 1 }, annotation: { text: '6,9,20 块装', position: 'top' } } },
  { lineId: 'mcn-2', sectionId: 'mcnugget', scene: { id: 'mcn-dp', type: 'animation' }, lineState: { params: { setIdx: 1 }, annotation: { text: '动态规划标记', position: 'bottom' } } },
  { lineId: 'mcn-3', sectionId: 'mcnugget', scene: { id: 'mcn-43', type: 'animation' }, lineState: { params: { setIdx: 1 }, annotation: { text: '麦乐鸡数 = 43', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { setIdx: 1 }, annotation: { text: '切换面额组合', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-highlight', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { setIdx: 1 }, annotation: { text: '高亮红格=Frobenius数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '最大不可凑金额', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-method', type: 'summary' }, lineState: { annotation: { text: '公式与DP', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
