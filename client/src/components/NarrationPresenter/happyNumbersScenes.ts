/**
 * 快乐数讲解场景配置
 * 每句口播对应演示的起始数（params.n）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHappyNumbersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const happyNumbersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '快乐数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { n: 7 }, annotation: { text: '真有这个名字', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-game', type: 'animation' }, lineState: { params: { n: 7 }, annotation: { text: '一场迭代游戏', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'def-1', sectionId: 'rule', scene: { id: 'def-rule', type: 'animation' }, lineState: { params: { n: 23 }, annotation: { text: '各位平方再相加', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'rule', scene: { id: 'def-19', type: 'animation' }, lineState: { params: { n: 19 }, annotation: { text: '19 → 82', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'rule', scene: { id: 'def-iter', type: 'animation' }, lineState: { params: { n: 19 }, annotation: { text: '一步接一步', position: 'bottom' } } },

  // ===== converge (3) =====
  { lineId: 'con-1', sectionId: 'converge', scene: { id: 'con-happy', type: 'animation' }, lineState: { params: { n: 19 }, annotation: { text: '停在 1 = 快乐', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'converge', scene: { id: 'con-19', type: 'animation' }, lineState: { params: { n: 19 }, annotation: { text: '82·68·100·1', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'converge', scene: { id: 'con-sad', type: 'animation' }, lineState: { params: { n: 4 }, annotation: { text: '陷入八数循环', position: 'bottom' } } },

  // ===== distribute (2) =====
  { lineId: 'dis-1', sectionId: 'distribute', scene: { id: 'dis-count', type: 'animation' }, lineState: { params: { n: 28 }, annotation: { text: '100 内约 20 个', position: 'top' } } },
  { lineId: 'dis-2', sectionId: 'distribute', scene: { id: 'dis-pattern', type: 'animation' }, lineState: { params: { n: 44 }, annotation: { text: '乱中有序', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 82 }, annotation: { text: '输入任意数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-color', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 2 }, annotation: { text: '绿=快乐 红=循环', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '到达 1 即快乐', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cycle', type: 'summary' }, lineState: { annotation: { text: '其余陷入循环', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
