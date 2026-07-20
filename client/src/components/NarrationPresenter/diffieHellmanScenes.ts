/**
 * 迪菲-赫尔曼密钥交换讲解场景配置
 * 每句口播对应 Alice/Bob 的私钥参数（params.a / params.b）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDiffieHellmanState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const diffieHellmanScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '公开处协商秘密', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-history', type: 'animation' }, lineState: { params: { a: 6, b: 9 }, annotation: { text: '1976 年的突破', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { a: 6, b: 9 }, annotation: { text: '藏住难逆的计算', position: 'bottom' } } },

  // ===== params (3) =====
  { lineId: 'def-1', sectionId: 'params', scene: { id: 'def-pg', type: 'animation' }, lineState: { params: { a: 6, b: 9 }, annotation: { text: '公开 p 与原根 g', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'params', scene: { id: 'def-open', type: 'animation' }, lineState: { params: { a: 6, b: 9 }, annotation: { text: '窃听者也能看到', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'params', scene: { id: 'def-priv', type: 'animation' }, lineState: { params: { a: 3, b: 4 }, annotation: { text: '私钥藏在心里', position: 'bottom' } } },

  // ===== compute (3) =====
  { lineId: 'cmp-1', sectionId: 'compute', scene: { id: 'cmp-alice', type: 'animation' }, lineState: { params: { a: 4, b: 7 }, annotation: { text: 'A = g^a mod p', position: 'top' } } },
  { lineId: 'cmp-2', sectionId: 'compute', scene: { id: 'cmp-bob', type: 'animation' }, lineState: { params: { a: 4, b: 7 }, annotation: { text: 'B = g^b mod p', position: 'bottom' } } },
  { lineId: 'cmp-3', sectionId: 'compute', scene: { id: 'cmp-swap', type: 'animation' }, lineState: { params: { a: 4, b: 7 }, annotation: { text: '公开交换 A、B', position: 'bottom' } } },

  // ===== shared (3) =====
  { lineId: 'shr-1', sectionId: 'shared', scene: { id: 'shr-mix', type: 'animation' }, lineState: { params: { a: 6, b: 9 }, annotation: { text: '各自再乘方', position: 'top' } } },
  { lineId: 'shr-2', sectionId: 'shared', scene: { id: 'shr-eq', type: 'animation' }, lineState: { params: { a: 6, b: 9 }, annotation: { text: '同为 g^(ab) mod p', position: 'bottom' } } },
  { lineId: 'shr-3', sectionId: 'shared', scene: { id: 'shr-hard', type: 'animation' }, lineState: { params: { a: 6, b: 9 }, annotation: { text: '离散对数难题', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 3, b: 9 }, annotation: { text: '各选一个私钥', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-agree', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 7, b: 4 }, annotation: { text: '密钥总是一致', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-open', type: 'summary' }, lineState: { annotation: { text: '私钥不出门', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-secure', type: 'summary' }, lineState: { annotation: { text: '快速幂与难题', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
