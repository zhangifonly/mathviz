/**
 * 割线法讲解场景配置
 * 每句口播对应函数索引（params.fnIdx）与展示步数（params.step）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSecantMethodState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const secantMethodScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '割线法', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-hard', type: 'animation' }, lineState: { params: { fnIdx: 0, step: 0 }, annotation: { text: '导数难求', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { fnIdx: 0, step: 1 }, annotation: { text: '只用函数值', position: 'bottom' } } },

  // ===== secant (3) =====
  { lineId: 'sec-1', sectionId: 'secant', scene: { id: 'sec-tangent', type: 'animation' }, lineState: { params: { fnIdx: 0, step: 1 }, annotation: { text: '牛顿法用切线', position: 'top' } } },
  { lineId: 'sec-2', sectionId: 'secant', scene: { id: 'sec-line', type: 'animation' }, lineState: { params: { fnIdx: 0, step: 1 }, annotation: { text: '两点连线代替', position: 'bottom' } } },
  { lineId: 'sec-3', sectionId: 'secant', scene: { id: 'sec-close', type: 'animation' }, lineState: { params: { fnIdx: 0, step: 2 }, annotation: { text: '越近越像切线', position: 'bottom' } } },

  // ===== cross (3) =====
  { lineId: 'cross-1', sectionId: 'cross', scene: { id: 'cross-hit', type: 'animation' }, lineState: { params: { fnIdx: 1, step: 1 }, annotation: { text: '交 x 轴得新点', position: 'top' } } },
  { lineId: 'cross-2', sectionId: 'cross', scene: { id: 'cross-repeat', type: 'animation' }, lineState: { params: { fnIdx: 1, step: 2 }, annotation: { text: '重复迭代', position: 'bottom' } } },
  { lineId: 'cross-3', sectionId: 'cross', scene: { id: 'cross-slide', type: 'animation' }, lineState: { params: { fnIdx: 1, step: 3 }, annotation: { text: '滑向真根', position: 'bottom' } } },

  // ===== converge (2) =====
  { lineId: 'conv-1', sectionId: 'converge', scene: { id: 'conv-golden', type: 'animation' }, lineState: { params: { fnIdx: 2, step: 3 }, annotation: { text: '收敛阶≈1.618', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'converge', scene: { id: 'conv-fast', type: 'animation' }, lineState: { params: { fnIdx: 2, step: 5 }, annotation: { text: '快过二分法', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnIdx: 0, step: 2 }, annotation: { text: '单步观察', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-error', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnIdx: 0, step: 4 }, annotation: { text: '误差迅速缩小', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '割线代替切线', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-conv', type: 'summary' }, lineState: { annotation: { text: '超线性收敛', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
