/**
 * 留数定理讲解场景配置
 * 每句口播对应一个预设场景 key（params.scenario）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultResidueTheoremState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const residueTheoremScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '留数定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-contour', type: 'animation' }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '复平面闭曲线', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-hint', type: 'animation' }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '只由几个点决定', position: 'bottom' } } },

  // ===== singularity (3) =====
  { lineId: 'sing-1', sectionId: 'singularity', scene: { id: 'sing-poles', type: 'animation' }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '孤立奇点', position: 'top' } } },
  { lineId: 'sing-2', sectionId: 'singularity', scene: { id: 'sing-simple', type: 'animation' }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '系数 / 距离', position: 'bottom' } } },
  { lineId: 'sing-3', sectionId: 'singularity', scene: { id: 'sing-residue', type: 'animation' }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '留数 Res', position: 'bottom' } } },

  // ===== theorem (3) =====
  { lineId: 'thm-1', sectionId: 'theorem', scene: { id: 'thm-formula', type: 'formula' }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '∮ = 2πi · ΣRes', position: 'top' } } },
  { lineId: 'thm-2', sectionId: 'theorem', scene: { id: 'thm-inside', type: 'animation' }, lineState: { params: { scenario: 'one-in' }, annotation: { text: '只算内部', position: 'top' } } },
  { lineId: 'thm-3', sectionId: 'theorem', scene: { id: 'thm-outside', type: 'animation' }, lineState: { params: { scenario: 'one-in' }, annotation: { text: '外部不贡献', position: 'bottom' } } },

  // ===== geometry (3) =====
  { lineId: 'geo-1', sectionId: 'geometry', scene: { id: 'geo-enclose', type: 'animation' }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '围住两个奇点', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geometry', scene: { id: 'geo-sum', type: 'animation' }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '留数相加', position: 'bottom' } } },
  { lineId: 'geo-3', sectionId: 'geometry', scene: { id: 'geo-zero', type: 'animation' }, lineState: { params: { scenario: 'none-in' }, annotation: { text: '无奇点 → 0', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scenario: 'complex-res' }, annotation: { text: '切换布局', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-verify', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scenario: 'two-in' }, annotation: { text: '理论 = 数值', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '∮ = 2πi · ΣRes', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-power', type: 'summary' }, lineState: { annotation: { text: '积分 → 几个数字', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
