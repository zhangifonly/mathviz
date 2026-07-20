/**
 * 考拉兹猜想讲解场景配置
 * 每句口播对应一个起点（params.start）或叠加图（params.overlay）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCollatzState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const collatzScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '考拉兹猜想', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pick', type: 'animation' }, lineState: { params: { start: 7 }, annotation: { text: '随便选一个数', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-one', type: 'animation' }, lineState: { params: { start: 7 }, annotation: { text: '似乎都归 1', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'rule-1', sectionId: 'rule', scene: { id: 'rule-even', type: 'animation' }, lineState: { params: { start: 16 }, annotation: { text: '偶数除以 2', position: 'top' } } },
  { lineId: 'rule-2', sectionId: 'rule', scene: { id: 'rule-odd', type: 'animation' }, lineState: { params: { start: 15 }, annotation: { text: '奇数乘 3 加 1', position: 'top' } } },
  { lineId: 'rule-3', sectionId: 'rule', scene: { id: 'rule-loop', type: 'animation' }, lineState: { params: { start: 15 }, annotation: { text: '反复迭代', position: 'bottom' } } },

  // ===== hail (3) =====
  { lineId: 'hail-1', sectionId: 'hail', scene: { id: 'hail-up', type: 'animation' }, lineState: { params: { start: 97 }, annotation: { text: '忽高忽低', position: 'top' } } },
  { lineId: 'hail-2', sectionId: 'hail', scene: { id: 'hail-27', type: 'animation' }, lineState: { params: { start: 27 }, annotation: { text: '飙到九千多', position: 'top' } } },
  { lineId: 'hail-3', sectionId: 'hail', scene: { id: 'hail-name', type: 'animation' }, lineState: { params: { start: 703 }, annotation: { text: '“冰雹数”', position: 'bottom' } } },

  // ===== mystery (2) =====
  { lineId: 'mys-1', sectionId: 'mystery', scene: { id: 'mys-verify', type: 'animation' }, lineState: { params: { overlay: true }, annotation: { text: '海量验证都归 1', position: 'top' } } },
  { lineId: 'mys-2', sectionId: 'mystery', scene: { id: 'mys-open', type: 'animation' }, lineState: { params: { overlay: true }, annotation: { text: '却无人能证明', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { start: 97 }, annotation: { text: '输入起点看轨迹', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-steps', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { start: 703 }, annotation: { text: '数一数停止时间', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rule', type: 'summary' }, lineState: { annotation: { text: '规则极简', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-open', type: 'summary' }, lineState: { annotation: { text: '仍是悬案', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
