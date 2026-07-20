/**
 * 卡普雷卡常数讲解场景配置
 * 每句口播对应一个起始四位数（params.n），展示其迭代链
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKaprekarState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const kaprekarScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '神奇的 6174', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pick', type: 'animation' }, lineState: { params: { n: 3524 }, annotation: { text: '随便挑个四位数', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-trap', type: 'animation' }, lineState: { params: { n: 3524 }, annotation: { text: '几乎总掉进 6174', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'rule-1', sectionId: 'rule', scene: { id: 'rule-big', type: 'animation' }, lineState: { params: { n: 3524 }, annotation: { text: '降序=最大数', position: 'top' } } },
  { lineId: 'rule-2', sectionId: 'rule', scene: { id: 'rule-small', type: 'animation' }, lineState: { params: { n: 3524 }, annotation: { text: '升序=最小数', position: 'top' } } },
  { lineId: 'rule-3', sectionId: 'rule', scene: { id: 'rule-sub', type: 'animation' }, lineState: { params: { n: 3524 }, annotation: { text: '大数减小数', position: 'bottom' } } },

  // ===== converge (3) =====
  { lineId: 'conv-1', sectionId: 'converge', scene: { id: 'conv-again', type: 'animation' }, lineState: { params: { n: 1234 }, annotation: { text: '反复迭代', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'converge', scene: { id: 'conv-all', type: 'animation' }, lineState: { params: { n: 9831 }, annotation: { text: '几乎都走到 6174', position: 'bottom' } } },
  { lineId: 'conv-3', sectionId: 'converge', scene: { id: 'conv-seven', type: 'animation' }, lineState: { params: { n: 9831 }, annotation: { text: '最多七步', position: 'bottom' } } },

  // ===== constant (2) =====
  { lineId: 'const-1', sectionId: 'constant', scene: { id: 'const-fixed', type: 'animation' }, lineState: { params: { n: 6174 }, annotation: { text: '7641 - 1467 = 6174', position: 'top' } } },
  { lineId: 'const-2', sectionId: 'constant', scene: { id: 'const-lock', type: 'animation' }, lineState: { params: { n: 6174 }, annotation: { text: '不动点', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 2005 }, annotation: { text: '输入四位数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 1234 }, annotation: { text: '比较收敛快慢', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '重排相减', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-order', type: 'summary' }, lineState: { annotation: { text: '最多七步收敛', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
