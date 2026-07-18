/**
 * 切比雪夫多项式讲解场景配置
 * 每句口播对应最高阶数（params.degree）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultChebyshevPolynomialsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const chebyshevPolynomialsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '切比雪夫多项式', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-error', type: 'animation' }, lineState: { params: { degree: 3 }, annotation: { text: '最大误差最小', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { degree: 4 }, annotation: { text: '一族特别的多项式', position: 'bottom' } } },

  // ===== recurrence (3) =====
  { lineId: 'def-1', sectionId: 'recurrence', scene: { id: 'def-base', type: 'animation' }, lineState: { params: { degree: 1 }, annotation: { text: 'T0=1, T1=x', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'recurrence', scene: { id: 'def-recur', type: 'animation' }, lineState: { params: { degree: 2 }, annotation: { text: 'T(n+1)=2xTn-T(n-1)', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'recurrence', scene: { id: 'def-grow', type: 'animation' }, lineState: { params: { degree: 4 }, annotation: { text: '层层递推', position: 'bottom' } } },

  // ===== oscillation (3) =====
  { lineId: 'osc-1', sectionId: 'oscillation', scene: { id: 'osc-swing', type: 'animation' }, lineState: { params: { degree: 5 }, annotation: { text: '±1 之间摆动', position: 'top' } } },
  { lineId: 'osc-2', sectionId: 'oscillation', scene: { id: 'osc-equi', type: 'animation' }, lineState: { params: { degree: 5 }, annotation: { text: '等波动性质', position: 'bottom' } } },
  { lineId: 'osc-3', sectionId: 'oscillation', scene: { id: 'osc-minimax', type: 'animation' }, lineState: { params: { degree: 4 }, annotation: { text: '最大偏离最小', position: 'bottom' } } },

  // ===== nodes (3) =====
  { lineId: 'node-1', sectionId: 'nodes', scene: { id: 'node-zero', type: 'animation' }, lineState: { params: { degree: 4 }, annotation: { text: '穿过横轴 = 根', position: 'top' } } },
  { lineId: 'node-2', sectionId: 'nodes', scene: { id: 'node-formula', type: 'animation' }, lineState: { params: { degree: 5 }, annotation: { text: 'cos((2k+1)π/2n)', position: 'bottom' } } },
  { lineId: 'node-3', sectionId: 'nodes', scene: { id: 'node-runge', type: 'animation' }, lineState: { params: { degree: 5 }, annotation: { text: '抑制龙格现象', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-degree', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { degree: 5 }, annotation: { text: '调节阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-roots', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { degree: 4 }, annotation: { text: '根向两端聚拢', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '递推与等幅振荡', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-nodes', type: 'summary' }, lineState: { annotation: { text: '节点抑制龙格', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
