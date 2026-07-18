/**
 * 欧拉函数讲解场景配置
 * 每句口播对应一个 n 值（params.n），驱动数环可视化
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEulerTotientState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const eulerTotientScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '欧拉函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-coprime', type: 'animation' }, lineState: { params: { n: 12 }, annotation: { text: '互质：gcd = 1', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { n: 12 }, annotation: { text: '数出个数 = φ(n)', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-phi', type: 'animation' }, lineState: { params: { n: 12 }, annotation: { text: 'φ(n) 的定义', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-twelve', type: 'animation' }, lineState: { params: { n: 12 }, annotation: { text: '1,5,7,11 互质', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-prime', type: 'animation' }, lineState: { params: { n: 13 }, annotation: { text: '质数 φ(p)=p−1', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-factor', type: 'animation' }, lineState: { params: { n: 30 }, annotation: { text: '看质因子', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-product', type: 'animation' }, lineState: { params: { n: 30 }, annotation: { text: 'n·∏(1−1/p)', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-calc', type: 'animation' }, lineState: { params: { n: 12 }, annotation: { text: '12·½·⅔ = 4', position: 'bottom' } } },

  // ===== multiplicative (3) =====
  { lineId: 'mul-1', sectionId: 'multiplicative', scene: { id: 'mul-intro', type: 'animation' }, lineState: { params: { n: 36 }, annotation: { text: '积性函数', position: 'top' } } },
  { lineId: 'mul-2', sectionId: 'multiplicative', scene: { id: 'mul-rule', type: 'animation' }, lineState: { params: { n: 36 }, annotation: { text: 'φ(mn)=φ(m)φ(n)', position: 'bottom' } } },
  { lineId: 'mul-3', sectionId: 'multiplicative', scene: { id: 'mul-example', type: 'animation' }, lineState: { params: { n: 36 }, annotation: { text: 'φ(36)=2·6=12', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-select', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 30 }, annotation: { text: '选择不同的 n', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 36 }, annotation: { text: '数蓝点 = φ(n)', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '互质计数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-props', type: 'summary' }, lineState: { annotation: { text: '公式 + 积性', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
