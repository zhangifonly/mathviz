/**
 * LU 分解讲解场景配置
 * 每句口播对应示例矩阵索引（params.matrix）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLuDecompositionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const luDecompositionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'LU分解', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-repeat', type: 'animation' }, lineState: { params: { matrix: 0 }, annotation: { text: '换右端就要重算？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { matrix: 0 }, annotation: { text: '记录消元, 反复使用', position: 'bottom' } } },

  // ===== eliminate (3) =====
  { lineId: 'elim-1', sectionId: 'eliminate', scene: { id: 'elim-col', type: 'animation' }, lineState: { params: { matrix: 0 }, annotation: { text: '逐列清零', position: 'top' } } },
  { lineId: 'elim-2', sectionId: 'eliminate', scene: { id: 'elim-u', type: 'animation' }, lineState: { params: { matrix: 0 }, annotation: { text: '得到上三角 U', position: 'bottom' } } },
  { lineId: 'elim-3', sectionId: 'eliminate', scene: { id: 'elim-rule', type: 'animation' }, lineState: { params: { matrix: 1 }, annotation: { text: '主元行去减下行', position: 'bottom' } } },

  // ===== store (3) =====
  { lineId: 'store-1', sectionId: 'store', scene: { id: 'store-factor', type: 'animation' }, lineState: { params: { matrix: 1 }, annotation: { text: '乘数别丢掉', position: 'top' } } },
  { lineId: 'store-2', sectionId: 'store', scene: { id: 'store-l', type: 'animation' }, lineState: { params: { matrix: 1 }, annotation: { text: '存进下三角 L', position: 'bottom' } } },
  { lineId: 'store-3', sectionId: 'store', scene: { id: 'store-book', type: 'animation' }, lineState: { params: { matrix: 2 }, annotation: { text: 'L 是消元账本', position: 'bottom' } } },

  // ===== verify (2) =====
  { lineId: 'verify-1', sectionId: 'verify', scene: { id: 'verify-mul', type: 'animation' }, lineState: { params: { matrix: 2 }, annotation: { text: 'L 乘 U 还原 A', position: 'top' } } },
  { lineId: 'verify-2', sectionId: 'verify', scene: { id: 'verify-solve', type: 'animation' }, lineState: { params: { matrix: 2 }, annotation: { text: '前代 + 回代', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { matrix: 0 }, annotation: { text: '切换示例矩阵', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { matrix: 1 }, annotation: { text: '逐步看消元', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'A = L · U', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-reuse', type: 'summary' }, lineState: { annotation: { text: '一次分解, 反复解', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
