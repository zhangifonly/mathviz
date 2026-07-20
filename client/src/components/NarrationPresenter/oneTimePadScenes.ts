/**
 * 一次一密讲解场景配置
 * 每句口播对应展示模式（params.mode）与明文（params.text）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultOneTimePadState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const oneTimePadScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '一次一密', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-perfect', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'HELLO' }, annotation: { text: '完美保密', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-xor', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'HELLO' }, annotation: { text: '秘密在异或', position: 'bottom' } } },

  // ===== xor (3) =====
  { lineId: 'xor-1', sectionId: 'xor', scene: { id: 'xor-mix', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'HELLO' }, annotation: { text: '明文⊕密钥=密文', position: 'top' } } },
  { lineId: 'xor-2', sectionId: 'xor', scene: { id: 'xor-invol', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'CRYPTO' }, annotation: { text: '异或两次复原', position: 'bottom' } } },
  { lineId: 'xor-3', sectionId: 'xor', scene: { id: 'xor-back', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'CRYPTO' }, annotation: { text: '再异或即解密', position: 'bottom' } } },

  // ===== key (2) =====
  { lineId: 'key-1', sectionId: 'key', scene: { id: 'key-len', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'SECRET' }, annotation: { text: '密钥与明文等长', position: 'top' } } },
  { lineId: 'key-2', sectionId: 'key', scene: { id: 'key-rand', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'SECRET' }, annotation: { text: '真随机·无规律', position: 'bottom' } } },

  // ===== perfect (3) =====
  { lineId: 'per-1', sectionId: 'perfect', scene: { id: 'per-any', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'HELLO' }, annotation: { text: '换密钥解出任意明文', position: 'top' } } },
  { lineId: 'per-2', sectionId: 'perfect', scene: { id: 'per-info', type: 'animation' }, lineState: { params: { mode: 'encrypt', text: 'HELLO' }, annotation: { text: '零信息泄露', position: 'bottom' } } },
  { lineId: 'per-3', sectionId: 'perfect', scene: { id: 'per-reuse', type: 'animation' }, lineState: { params: { mode: 'reuse', text: 'HELLO' }, annotation: { text: '重用即抵消', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-type', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'encrypt', text: 'CRYPTO' }, annotation: { text: '输入看异或', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-reuse', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'reuse', text: 'HELLO' }, annotation: { text: '重用模式', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '真随机等长密钥', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-caveat', type: 'summary' }, lineState: { annotation: { text: '绝不重用', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
