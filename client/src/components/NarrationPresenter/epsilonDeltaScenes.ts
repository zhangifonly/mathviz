/**
 * ε-δ 极限定义讲解场景配置
 * 每句口播对应函数(funcId)与挑战 ε(eps)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEpsilonDeltaState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const epsilonDeltaScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'ε-δ极限定义', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { funcId: 'linear', eps: 1 }, annotation: { text: '多近才算近？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-eps', type: 'animation' }, lineState: { params: { funcId: 'linear', eps: 1 }, annotation: { text: '用 ε 和 δ 刻画', position: 'bottom' } } },

  // ===== challenge (3) =====
  { lineId: 'chal-1', sectionId: 'challenge', scene: { id: 'chal-eps', type: 'animation' }, lineState: { params: { funcId: 'linear', eps: 1 }, annotation: { text: '给出一个 ε', position: 'top' } } },
  { lineId: 'chal-2', sectionId: 'challenge', scene: { id: 'chal-band', type: 'animation' }, lineState: { params: { funcId: 'linear', eps: 0.5 }, annotation: { text: 'L±ε 水平带', position: 'top' } } },
  { lineId: 'chal-3', sectionId: 'challenge', scene: { id: 'chal-narrow', type: 'animation' }, lineState: { params: { funcId: 'linear', eps: 0.25 }, annotation: { text: 'ε 越小越苛刻', position: 'bottom' } } },

  // ===== response (3) =====
  { lineId: 'resp-1', sectionId: 'response', scene: { id: 'resp-delta', type: 'animation' }, lineState: { params: { funcId: 'linear', eps: 0.5 }, annotation: { text: 'a±δ 竖直带', position: 'bottom' } } },
  { lineId: 'resp-2', sectionId: 'response', scene: { id: 'resp-inside', type: 'animation' }, lineState: { params: { funcId: 'square', eps: 0.5 }, annotation: { text: 'δ 内必落 ε 内', position: 'top' } } },
  { lineId: 'resp-3', sectionId: 'response', scene: { id: 'resp-safe', type: 'animation' }, lineState: { params: { funcId: 'square', eps: 0.5 }, annotation: { text: '绿框=安全区', position: 'bottom' } } },

  // ===== forall (2) =====
  { lineId: 'all-1', sectionId: 'forall', scene: { id: 'all-any', type: 'animation' }, lineState: { params: { funcId: 'square', eps: 0.25 }, annotation: { text: '任意 ε 都有 δ', position: 'top' } } },
  { lineId: 'all-2', sectionId: 'forall', scene: { id: 'all-mean', type: 'animation' }, lineState: { params: { funcId: 'square', eps: 0.1 }, annotation: { text: '这才是极限', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-shrink', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { funcId: 'square', eps: 0.1 }, annotation: { text: '调小 ε 看 δ 收缩', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-func', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { funcId: 'cubic', eps: 0.25 }, annotation: { text: '换个函数试试', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '对任意 ε 存在 δ', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-pair', type: 'summary' }, lineState: { annotation: { text: 'ε 纵向 δ 横向', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
