/**
 * 反常积分讲解场景配置
 * 每句口播对应被积函数（params.fnKey）与积分上限（params.upper）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultImproperIntegralState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const improperIntegralScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '反常积分', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-inf', type: 'animation' }, lineState: { params: { fnKey: 'inv-sq', upper: 12 }, annotation: { text: '积到无穷远？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { fnKey: 'inv-sq', upper: 20 }, annotation: { text: '面积还有意义吗', position: 'bottom' } } },

  // ===== infinite (3) =====
  { lineId: 'inf-1', sectionId: 'infinite', scene: { id: 'inf-range', type: 'animation' }, lineState: { params: { fnKey: 'inv-sq', upper: 15 }, annotation: { text: '区间到正无穷', position: 'top' } } },
  { lineId: 'inf-2', sectionId: 'infinite', scene: { id: 'inf-limit', type: 'animation' }, lineState: { params: { fnKey: 'inv-sq', upper: 30 }, annotation: { text: '先积到 T 再取极限', position: 'bottom' } } },
  { lineId: 'inf-3', sectionId: 'infinite', scene: { id: 'inf-conv', type: 'animation' }, lineState: { params: { fnKey: 'inv-sq', upper: 40 }, annotation: { text: '有限即收敛', position: 'bottom' } } },

  // ===== converge (3) =====
  { lineId: 'con-1', sectionId: 'converge', scene: { id: 'con-invsq', type: 'animation' }, lineState: { params: { fnKey: 'inv-sq', upper: 38 }, annotation: { text: '1/x² 趋于 1', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'converge', scene: { id: 'con-invx', type: 'animation' }, lineState: { params: { fnKey: 'inv-x', upper: 38 }, annotation: { text: '1/x 无限增长', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'converge', scene: { id: 'con-fate', type: 'animation' }, lineState: { params: { fnKey: 'inv-x', upper: 40 }, annotation: { text: '命运截然不同', position: 'bottom' } } },

  // ===== unbounded (3) =====
  { lineId: 'unb-1', sectionId: 'unbounded', scene: { id: 'unb-peak', type: 'animation' }, lineState: { params: { fnKey: 'exp-neg', upper: 10 }, annotation: { text: '函数冲向无穷', position: 'top' } } },
  { lineId: 'unb-2', sectionId: 'unbounded', scene: { id: 'unb-limit', type: 'animation' }, lineState: { params: { fnKey: 'exp-neg', upper: 20 }, annotation: { text: '逼近奇点取极限', position: 'bottom' } } },
  { lineId: 'unb-3', sectionId: 'unbounded', scene: { id: 'unb-finite', type: 'animation' }, lineState: { params: { fnKey: 'exp-neg', upper: 30 }, annotation: { text: '尖峰下有限面积', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnKey: 'inv-sq', upper: 25 }, annotation: { text: '拖动增大上限', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnKey: 'inv-x', upper: 40 }, annotation: { text: '收敛停住·发散攀升', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '用极限延伸面积', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-crit', type: 'summary' }, lineState: { annotation: { text: '极限存在即收敛', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
