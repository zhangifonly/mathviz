/**
 * 拉格朗日乘数法讲解场景配置
 * 每句口播对应目标函数参数（params.a / params.b / params.r）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLagrangeMultiplierState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lagrangeMultiplierScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '拉格朗日乘数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-motivate', type: 'animation' }, lineState: { params: { a: 1, b: 1, r: 1 }, annotation: { text: '带约束的最优', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-key', type: 'animation' }, lineState: { params: { a: 1, b: 1, r: 1 }, annotation: { text: '一把钥匙', position: 'bottom' } } },

  // ===== setup (3) =====
  { lineId: 'setup-1', sectionId: 'setup', scene: { id: 'setup-constraint', type: 'animation' }, lineState: { params: { a: 1, b: 0, r: 1 }, annotation: { text: 'g = 0 上移动', position: 'top' } } },
  { lineId: 'setup-2', sectionId: 'setup', scene: { id: 'setup-contour', type: 'animation' }, lineState: { params: { a: 1, b: 0, r: 1 }, annotation: { text: 'f 的等高线', position: 'top' } } },
  { lineId: 'setup-3', sectionId: 'setup', scene: { id: 'setup-highest', type: 'animation' }, lineState: { params: { a: 1, b: 0, r: 1 }, annotation: { text: '碰到最高的线', position: 'bottom' } } },

  // ===== parallel (3) =====
  { lineId: 'parallel-1', sectionId: 'parallel', scene: { id: 'par-move', type: 'animation' }, lineState: { params: { a: 1, b: 1, r: 1 }, annotation: { text: '还能变大', position: 'top' } } },
  { lineId: 'parallel-2', sectionId: 'parallel', scene: { id: 'par-tangent', type: 'animation' }, lineState: { params: { a: 1, b: 1, r: 1 }, annotation: { text: '相切即极值', position: 'bottom' } } },
  { lineId: 'parallel-3', sectionId: 'parallel', scene: { id: 'par-grad', type: 'animation' }, lineState: { params: { a: 1, b: 1, r: 1 }, annotation: { text: '两梯度平行', position: 'bottom' } } },

  // ===== lambda (3) =====
  { lineId: 'lambda-1', sectionId: 'lambda', scene: { id: 'lam-eq', type: 'formula' }, lineState: { params: { a: 1, b: 2, r: 1.2 }, annotation: { text: '∇f = λ∇g', position: 'top' } } },
  { lineId: 'lambda-2', sectionId: 'lambda', scene: { id: 'lam-meaning', type: 'formula' }, lineState: { params: { a: 1, b: 2, r: 1.2 }, annotation: { text: 'λ 是乘数', position: 'top' } } },
  { lineId: 'lambda-3', sectionId: 'lambda', scene: { id: 'lam-solve', type: 'formula' }, lineState: { params: { a: 1, b: 2, r: 1.2 }, annotation: { text: '联立求解', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 2, b: 1, r: 1 }, annotation: { text: '切换目标', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-arrows', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1, b: 2, r: 1.2 }, annotation: { text: '梯度始终平行', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-tangent', type: 'summary' }, lineState: { annotation: { text: '相切处取极值', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-eq', type: 'summary' }, lineState: { annotation: { text: '∇f = λ∇g', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
