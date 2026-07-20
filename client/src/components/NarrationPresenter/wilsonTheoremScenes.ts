/**
 * 威尔逊定理讲解场景配置
 * 每句口播对应展示范围（params.upTo）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultWilsonTheoremState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const wilsonTheoremScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '威尔逊定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-question', type: 'animation' }, lineState: { params: { upTo: 15 }, annotation: { text: '一眼看出素数？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-factorial', type: 'animation' }, lineState: { params: { upTo: 15 }, annotation: { text: '阶乘藏着秘密', position: 'bottom' } } },

  // ===== theorem (3) =====
  { lineId: 'thm-1', sectionId: 'theorem', scene: { id: 'thm-state', type: 'animation' }, lineState: { params: { upTo: 25 }, annotation: { text: '(n-1)! mod n = n-1', position: 'top' } } },
  { lineId: 'thm-2', sectionId: 'theorem', scene: { id: 'thm-congr', type: 'animation' }, lineState: { params: { upTo: 25 }, annotation: { text: '(n-1)! ≡ -1 (mod n)', position: 'bottom' } } },
  { lineId: 'thm-3', sectionId: 'theorem', scene: { id: 'thm-iff', type: 'animation' }, lineState: { params: { upTo: 25 }, annotation: { text: '当且仅当 n 为素数', position: 'bottom' } } },

  // ===== modfact (3) =====
  { lineId: 'mod-1', sectionId: 'modfact', scene: { id: 'mod-overflow', type: 'animation' }, lineState: { params: { upTo: 25 }, annotation: { text: '阶乘会溢出', position: 'top' } } },
  { lineId: 'mod-2', sectionId: 'modfact', scene: { id: 'mod-step', type: 'animation' }, lineState: { params: { upTo: 25 }, annotation: { text: '边乘边取模', position: 'bottom' } } },
  { lineId: 'mod-3', sectionId: 'modfact', scene: { id: 'mod-safe', type: 'animation' }, lineState: { params: { upTo: 40 }, annotation: { text: '始终在 [0, n)', position: 'bottom' } } },

  // ===== contrast (3) =====
  { lineId: 'con-1', sectionId: 'contrast', scene: { id: 'con-prime', type: 'animation' }, lineState: { params: { upTo: 40 }, annotation: { text: '素数顶到 n-1', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'contrast', scene: { id: 'con-composite', type: 'animation' }, lineState: { params: { upTo: 40 }, annotation: { text: '合数塌成 0', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'contrast', scene: { id: 'con-four', type: 'animation' }, lineState: { params: { upTo: 40 }, annotation: { text: 'n=4 是特例', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { upTo: 25 }, annotation: { text: '选一个 n', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-verify', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { upTo: 40 }, annotation: { text: '一试便知', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '一句同余圈出素数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-mod', type: 'summary' }, lineState: { annotation: { text: '取模阶乘优雅可算', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
