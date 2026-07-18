/**
 * 抛体运动讲解场景配置
 * 每句口播对应初速度（params.v0）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultProjectileMotionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const projectileMotionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '抛体运动', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-examples', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '投篮·喷泉·抛石', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '同一种曲线', position: 'bottom' } } },

  // ===== decompose (3) =====
  { lineId: 'def-1', sectionId: 'decompose', scene: { id: 'def-split', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '水平+竖直', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'decompose', scene: { id: 'def-horiz', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '水平匀速', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'decompose', scene: { id: 'def-vert', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '竖直受重力', position: 'bottom' } } },

  // ===== parabola (3) =====
  { lineId: 'par-1', sectionId: 'parabola', scene: { id: 'par-curve', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '合成抛物线', position: 'top' } } },
  { lineId: 'par-2', sectionId: 'parabola', scene: { id: 'par-time', type: 'animation' }, lineState: { params: { v0: 25 }, annotation: { text: '飞行时间', position: 'bottom' } } },
  { lineId: 'par-3', sectionId: 'parabola', scene: { id: 'par-sym', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '左右对称', position: 'bottom' } } },

  // ===== range (3) =====
  { lineId: 'rng-1', sectionId: 'range', scene: { id: 'rng-formula', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: 'R = v0² sin2θ / g', position: 'top' } } },
  { lineId: 'rng-2', sectionId: 'range', scene: { id: 'rng-45', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '45° 射程最远', position: 'bottom' } } },
  { lineId: 'rng-3', sectionId: 'range', scene: { id: 'rng-comp', type: 'animation' }, lineState: { params: { v0: 20 }, annotation: { text: '30°=60° 射程相等', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-v0', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { v0: 25 }, annotation: { text: '调整初速度', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-cmp', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { v0: 15 }, annotation: { text: '对比三个角度', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '分解为两方向', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-key', type: 'summary' }, lineState: { annotation: { text: '抛物线·45°最远', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
