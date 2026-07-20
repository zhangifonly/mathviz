/**
 * 不动点迭代讲解场景配置
 * 每句口播对应函数 key 与迭代步数（params.func / params.steps）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFixedPointIterationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const fixedPointIterationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '不动点迭代', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-repeat', type: 'animation' }, lineState: { params: { func: 'cos', steps: 3 }, annotation: { text: '反复代入', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-rule', type: 'animation' }, lineState: { params: { func: 'cos', steps: 5 }, annotation: { text: '藏着规律', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-fixed', type: 'animation' }, lineState: { params: { func: 'half', steps: 0 }, annotation: { text: 'g(x)=x', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-cross', type: 'animation' }, lineState: { params: { func: 'half', steps: 2 }, annotation: { text: '曲线与对角线的交点', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-limit', type: 'animation' }, lineState: { params: { func: 'half', steps: 8 }, annotation: { text: '极限即不动点', position: 'bottom' } } },

  // ===== cobweb (3) =====
  { lineId: 'cob-1', sectionId: 'cobweb', scene: { id: 'cob-up', type: 'animation' }, lineState: { params: { func: 'sqrt', steps: 1 }, annotation: { text: '竖到曲线', position: 'top' } } },
  { lineId: 'cob-2', sectionId: 'cobweb', scene: { id: 'cob-side', type: 'animation' }, lineState: { params: { func: 'sqrt', steps: 2 }, annotation: { text: '横到对角线', position: 'bottom' } } },
  { lineId: 'cob-3', sectionId: 'cobweb', scene: { id: 'cob-web', type: 'animation' }, lineState: { params: { func: 'sqrt', steps: 10 }, annotation: { text: '织出蛛网', position: 'bottom' } } },

  // ===== converge (3) =====
  { lineId: 'conv-1', sectionId: 'converge', scene: { id: 'conv-slope', type: 'animation' }, lineState: { params: { func: 'cos', steps: 8 }, annotation: { text: '斜率决定命运', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'converge', scene: { id: 'conv-in', type: 'animation' }, lineState: { params: { func: 'cos', steps: 14 }, annotation: { text: "|g'|<1 收敛", position: 'bottom' } } },
  { lineId: 'conv-3', sectionId: 'converge', scene: { id: 'conv-out', type: 'animation' }, lineState: { params: { func: 'square', steps: 6 }, annotation: { text: '斜率太陡则发散', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-play', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { func: 'sqrt', steps: 12 }, annotation: { text: '拖动步数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { func: 'square', steps: 5 }, annotation: { text: '对比收敛与发散', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '反复代入求不动点', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cond', type: 'summary' }, lineState: { annotation: { text: '蛛网与收敛条件', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
