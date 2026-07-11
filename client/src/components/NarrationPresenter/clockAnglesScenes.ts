/**
 * 时钟与角度讲解场景配置
 * 每句口播对应一个时刻（params.hour / params.minute）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultClockAnglesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const clockAnglesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '时钟与角度', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-circle', type: 'animation' }, lineState: { params: { hour: 12, minute: 0 }, annotation: { text: '一圈 360 度', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-hook', type: 'animation' }, lineState: { params: { hour: 10, minute: 10 }, annotation: { text: '藏着的角度', position: 'bottom' } } },

  // ===== hands (3) =====
  { lineId: 'hands-1', sectionId: 'hands', scene: { id: 'hands-grid', type: 'animation' }, lineState: { params: { hour: 12, minute: 5 }, annotation: { text: '60 小格', position: 'top' } } },
  { lineId: 'hands-2', sectionId: 'hands', scene: { id: 'hands-minute', type: 'animation' }, lineState: { params: { hour: 12, minute: 15 }, annotation: { text: '分针每分钟 6 度', position: 'top' } } },
  { lineId: 'hands-3', sectionId: 'hands', scene: { id: 'hands-hour', type: 'animation' }, lineState: { params: { hour: 1, minute: 0 }, annotation: { text: '时针每小时 30 度', position: 'bottom' } } },

  // ===== angle (3) =====
  { lineId: 'angle-1', sectionId: 'angle', scene: { id: 'angle-each', type: 'animation' }, lineState: { params: { hour: 2, minute: 0 }, annotation: { text: '各自的角度', position: 'top' } } },
  { lineId: 'angle-2', sectionId: 'angle', scene: { id: 'angle-diff', type: 'animation' }, lineState: { params: { hour: 4, minute: 0 }, annotation: { text: '相减取较小', position: 'bottom' } } },
  { lineId: 'angle-3', sectionId: 'angle', scene: { id: 'angle-drift', type: 'animation' }, lineState: { params: { hour: 3, minute: 30 }, annotation: { text: '时针多走半度', position: 'bottom' } } },

  // ===== special (3) =====
  { lineId: 'special-1', sectionId: 'special', scene: { id: 'special-3', type: 'animation' }, lineState: { params: { hour: 3, minute: 0 }, annotation: { text: '3:00 直角 90 度', position: 'top' } } },
  { lineId: 'special-2', sectionId: 'special', scene: { id: 'special-6', type: 'animation' }, lineState: { params: { hour: 6, minute: 0 }, annotation: { text: '6:00 一条直线 180 度', position: 'bottom' } } },
  { lineId: 'special-3', sectionId: 'special', scene: { id: 'special-12', type: 'animation' }, lineState: { params: { hour: 12, minute: 0 }, annotation: { text: '12:00 重合 0 度', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { hour: 9, minute: 0 }, annotation: { text: '切换时刻', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-quarter', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { hour: 3, minute: 15 }, annotation: { text: '3:15 只有 7.5 度', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '分针 6 度 / 时针 30 度', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-formula', type: 'summary' }, lineState: { annotation: { text: '相减取较小', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
