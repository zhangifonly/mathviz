/**
 * 二次剩余讲解场景配置
 * 每句口播对应素数模数（params.p）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultQuadraticResidueState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const quadraticResidueScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '二次剩余', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-clock', type: 'animation' }, lineState: { params: { p: 7 }, annotation: { text: '模运算里的平方', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-mod7', type: 'animation' }, lineState: { params: { p: 7 }, annotation: { text: '模7: 只落在少数点', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-eq', type: 'animation' }, lineState: { params: { p: 11 }, annotation: { text: 'x^2 ≡ a (mod p)', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-square', type: 'animation' }, lineState: { params: { p: 11 }, annotation: { text: '模 p 的完全平方', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-half', type: 'animation' }, lineState: { params: { p: 11 }, annotation: { text: '恰好一半 (p-1)/2', position: 'bottom' } } },

  // ===== legendre (2) =====
  { lineId: 'leg-1', sectionId: 'legendre', scene: { id: 'leg-symbol', type: 'animation' }, lineState: { params: { p: 13 }, annotation: { text: '勒让德符号 (a/p)', position: 'top' } } },
  { lineId: 'leg-2', sectionId: 'legendre', scene: { id: 'leg-values', type: 'animation' }, lineState: { params: { p: 13 }, annotation: { text: '+1 / -1 / 0', position: 'bottom' } } },

  // ===== euler (3) =====
  { lineId: 'eul-1', sectionId: 'euler', scene: { id: 'eul-crit', type: 'animation' }, lineState: { params: { p: 13 }, annotation: { text: 'a^((p-1)/2) mod p', position: 'top' } } },
  { lineId: 'eul-2', sectionId: 'euler', scene: { id: 'eul-pm1', type: 'animation' }, lineState: { params: { p: 13 }, annotation: { text: '1 是剩余, -1 不是', position: 'bottom' } } },
  { lineId: 'eul-3', sectionId: 'euler', scene: { id: 'eul-fast', type: 'animation' }, lineState: { params: { p: 17 }, annotation: { text: '一次快速幂搞定', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-p', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 17 }, annotation: { text: '切换素数 p', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-pair', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 11 }, annotation: { text: 'x 与 p-x 配对', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '模 p 的完全平方', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-method', type: 'summary' }, lineState: { annotation: { text: '欧拉判别法', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
