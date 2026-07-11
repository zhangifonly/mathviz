/**
 * 模运算与同余讲解场景配置
 * 每句口播对应圆环乘数（params.k）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultModularArithmeticState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const modularArithmeticScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '模运算与同余', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-clock', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '时钟绕回起点', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-journey', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '通往密码学', position: 'bottom' } } },

  // ===== clock (3) =====
  { lineId: 'clock-1', sectionId: 'clock', scene: { id: 'clock-remainder', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '只保留余数', position: 'top' } } },
  { lineId: 'clock-2', sectionId: 'clock', scene: { id: 'clock-fifteen', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '15 mod 12 = 3', position: 'top' } } },
  { lineId: 'clock-3', sectionId: 'clock', scene: { id: 'clock-wrap', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '圈在 0 到 n-1', position: 'bottom' } } },

  // ===== congruence (3) =====
  { lineId: 'cong-1', sectionId: 'congruence', scene: { id: 'cong-def', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '余数相同即同余', position: 'top' } } },
  { lineId: 'cong-2', sectionId: 'congruence', scene: { id: 'cong-example', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '17 ≡ 5 (mod 12)', position: 'top' } } },
  { lineId: 'cong-3', sectionId: 'congruence', scene: { id: 'cong-classes', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '归并成有限类', position: 'bottom' } } },

  // ===== circle (4) =====
  { lineId: 'circle-1', sectionId: 'circle', scene: { id: 'circle-points', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '点排上圆环', position: 'top' } } },
  { lineId: 'circle-2', sectionId: 'circle', scene: { id: 'circle-connect', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: 'i → i×2 mod n', position: 'top' } } },
  { lineId: 'circle-3', sectionId: 'circle', scene: { id: 'circle-cardioid', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '心形线浮现', position: 'bottom' } } },
  { lineId: 'circle-4', sectionId: 'circle', scene: { id: 'circle-nephroid', type: 'animation' }, lineState: { params: { k: 3 }, annotation: { text: '×3 肾脏线', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { k: 5 }, annotation: { text: '切换乘数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-emerge', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { k: 51 }, annotation: { text: '美从整体涌现', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '绕成圆环，归为一类', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-crypto', type: 'summary' }, lineState: { annotation: { text: '密码学的基石', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '深邃的秩序与美！', position: 'bottom' } } },
]
