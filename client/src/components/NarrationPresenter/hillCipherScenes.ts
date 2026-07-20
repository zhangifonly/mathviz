/**
 * 希尔密码讲解场景配置
 * 每句口播对应明文 text 与展示的字母块 block
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHillCipherState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const hillCipherScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '希尔密码', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-hill', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 0 }, annotation: { text: '1929 年 · 线性代数', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-block', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 0 }, annotation: { text: '整块变换', position: 'bottom' } } },

  // ===== vector (3) =====
  { lineId: 'def-1', sectionId: 'vector', scene: { id: 'def-num', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 0 }, annotation: { text: 'A=0 … Z=25', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'vector', scene: { id: 'def-pair', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 0 }, annotation: { text: '两字母一向量', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'vector', scene: { id: 'def-he', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 0 }, annotation: { text: 'HE = (7, 4)', position: 'bottom' } } },

  // ===== multiply (3) =====
  { lineId: 'mul-1', sectionId: 'multiply', scene: { id: 'mul-mat', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 0 }, annotation: { text: '矩阵 × 向量', position: 'top' } } },
  { lineId: 'mul-2', sectionId: 'multiply', scene: { id: 'mul-mod', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 1 }, annotation: { text: '结果 mod 26', position: 'bottom' } } },
  { lineId: 'mul-3', sectionId: 'multiply', scene: { id: 'mul-cipher', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 1 }, annotation: { text: '得到密文块', position: 'bottom' } } },

  // ===== inverse (3) =====
  { lineId: 'inv-1', sectionId: 'inverse', scene: { id: 'inv-mat', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 0 }, annotation: { text: '模 26 逆矩阵', position: 'top' } } },
  { lineId: 'inv-2', sectionId: 'inverse', scene: { id: 'inv-det', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 0 }, annotation: { text: '行列式与 26 互质', position: 'bottom' } } },
  { lineId: 'inv-3', sectionId: 'inverse', scene: { id: 'inv-back', type: 'animation' }, lineState: { params: { text: 'HELLO', block: 2 }, annotation: { text: '还原出明文', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { text: 'MATRIX', block: 0 }, annotation: { text: '输入明文', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { text: 'MATRIX', block: 1 }, annotation: { text: '逐块观察', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '矩阵加密', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-inv', type: 'summary' }, lineState: { annotation: { text: '模逆矩阵解密', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
