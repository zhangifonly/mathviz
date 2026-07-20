/**
 * RSA 加密讲解场景配置
 * params.stage: 0=密钥生成 1=加密 2=解密
 * params.pairIndex: 选用第几对素数（对应 SAMPLE_PRIMES）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRsaCipherState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const rsaCipherScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'RSA加密', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-lock', type: 'animation' }, lineState: { params: { stage: 0, pairIndex: 0 }, annotation: { text: '公开的锁', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-key', type: 'animation' }, lineState: { params: { stage: 0, pairIndex: 0 }, annotation: { text: '私藏的钥匙', position: 'bottom' } } },

  // ===== keygen (3) =====
  { lineId: 'key-1', sectionId: 'keygen', scene: { id: 'key-n', type: 'animation' }, lineState: { params: { stage: 0, pairIndex: 0 }, annotation: { text: 'n = p·q', position: 'top' } } },
  { lineId: 'key-2', sectionId: 'keygen', scene: { id: 'key-phi', type: 'animation' }, lineState: { params: { stage: 0, pairIndex: 0 }, annotation: { text: 'φ=(p-1)(q-1)', position: 'bottom' } } },
  { lineId: 'key-3', sectionId: 'keygen', scene: { id: 'key-ed', type: 'animation' }, lineState: { params: { stage: 0, pairIndex: 0 }, annotation: { text: '公钥e·私钥d', position: 'bottom' } } },

  // ===== encrypt (3) =====
  { lineId: 'enc-1', sectionId: 'encrypt', scene: { id: 'enc-m', type: 'animation' }, lineState: { params: { stage: 1, pairIndex: 0 }, annotation: { text: '明文 m', position: 'top' } } },
  { lineId: 'enc-2', sectionId: 'encrypt', scene: { id: 'enc-c', type: 'animation' }, lineState: { params: { stage: 1, pairIndex: 0 }, annotation: { text: 'c = mᵉ mod n', position: 'bottom' } } },
  { lineId: 'enc-3', sectionId: 'encrypt', scene: { id: 'enc-pub', type: 'animation' }, lineState: { params: { stage: 1, pairIndex: 0 }, annotation: { text: '人人可加密', position: 'bottom' } } },

  // ===== decrypt (3) =====
  { lineId: 'dec-1', sectionId: 'decrypt', scene: { id: 'dec-in', type: 'animation' }, lineState: { params: { stage: 2, pairIndex: 0 }, annotation: { text: '收到密文', position: 'top' } } },
  { lineId: 'dec-2', sectionId: 'decrypt', scene: { id: 'dec-m', type: 'animation' }, lineState: { params: { stage: 2, pairIndex: 0 }, annotation: { text: 'm = cᵈ mod n', position: 'bottom' } } },
  { lineId: 'dec-3', sectionId: 'decrypt', scene: { id: 'dec-hard', type: 'animation' }, lineState: { params: { stage: 2, pairIndex: 2 }, annotation: { text: '分解 n 极难', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pair', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { stage: 0, pairIndex: 3 }, annotation: { text: '换一对素数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-msg', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { stage: 2, pairIndex: 1 }, annotation: { text: '输入消息', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '公开加密·私密解密', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-secure', type: 'summary' }, lineState: { annotation: { text: '大数分解护航', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
