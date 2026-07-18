/**
 * 凯撒密码讲解场景配置
 * 每句口播对应移位量（params.shift）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCaesarCipherState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const caesarCipherScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '凯撒密码', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-shift', type: 'animation' }, lineState: { params: { shift: 3 }, annotation: { text: '每个字母向后挪几位', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-atod', type: 'animation' }, lineState: { params: { shift: 3 }, annotation: { text: 'A→D, B→E', position: 'bottom' } } },

  // ===== shift (3) =====
  { lineId: 'def-1', sectionId: 'shift', scene: { id: 'def-key', type: 'animation' }, lineState: { params: { shift: 3 }, annotation: { text: '密钥 = shift', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'shift', scene: { id: 'def-enc', type: 'animation' }, lineState: { params: { shift: 7 }, annotation: { text: '向后走 shift 步', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'shift', scene: { id: 'def-dec', type: 'animation' }, lineState: { params: { shift: 7 }, annotation: { text: '反向走回即解密', position: 'bottom' } } },

  // ===== mod (3) =====
  { lineId: 'mod-1', sectionId: 'mod', scene: { id: 'mod-q', type: 'animation' }, lineState: { params: { shift: 3 }, annotation: { text: '走到 Z 之后?', position: 'top' } } },
  { lineId: 'mod-2', sectionId: 'mod', scene: { id: 'mod-wrap', type: 'animation' }, lineState: { params: { shift: 3 }, annotation: { text: 'XYZ→ABC 绕回', position: 'bottom' } } },
  { lineId: 'mod-3', sectionId: 'mod', scene: { id: 'mod-26', type: 'animation' }, lineState: { params: { shift: 13 }, annotation: { text: '模 26 循环', position: 'bottom' } } },

  // ===== crack (3) =====
  { lineId: 'crk-1', sectionId: 'crack', scene: { id: 'crk-freq', type: 'animation' }, lineState: { params: { shift: 7 }, annotation: { text: '频率不变', position: 'top' } } },
  { lineId: 'crk-2', sectionId: 'crack', scene: { id: 'crk-e', type: 'animation' }, lineState: { params: { shift: 7 }, annotation: { text: 'E 最常见', position: 'bottom' } } },
  { lineId: 'crk-3', sectionId: 'crack', scene: { id: 'crk-chi', type: 'animation' }, lineState: { params: { shift: 19 }, annotation: { text: '卡方比对现真钥', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-shift', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { shift: 13 }, annotation: { text: '调整移位量', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-crack', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { shift: 19 }, annotation: { text: '一键破解', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '移位 + 模 26', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-crack', type: 'summary' }, lineState: { annotation: { text: '频率分析破解', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
