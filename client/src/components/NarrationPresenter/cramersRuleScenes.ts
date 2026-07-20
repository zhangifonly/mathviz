/**
 * 克拉默法则讲解场景配置
 * 每句口播对应一个样例方程组索引（params.sys）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCramersRuleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const cramersRuleScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '克拉默法则', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-elegant', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '用行列式解方程', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-ratio', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '解 = 行列式之比', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'rule-1', sectionId: 'rule', scene: { id: 'rule-detA', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '先算 det A', position: 'top' } } },
  { lineId: 'rule-2', sectionId: 'rule', scene: { id: 'rule-unique', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: 'det A ≠ 0 有唯一解', position: 'bottom' } } },
  { lineId: 'rule-3', sectionId: 'rule', scene: { id: 'rule-xi', type: 'animation' }, lineState: { params: { sys: 1 }, annotation: { text: 'x_i = detA_i / detA', position: 'bottom' } } },

  // ===== replace (3) =====
  { lineId: 'rep-1', sectionId: 'replace', scene: { id: 'rep-swap', type: 'animation' }, lineState: { params: { sys: 1 }, annotation: { text: '第 i 列换成 b', position: 'top' } } },
  { lineId: 'rep-2', sectionId: 'replace', scene: { id: 'rep-ai', type: 'animation' }, lineState: { params: { sys: 1 }, annotation: { text: '得到 A_i', position: 'bottom' } } },
  { lineId: 'rep-3', sectionId: 'replace', scene: { id: 'rep-formula', type: 'animation' }, lineState: { params: { sys: 2 }, annotation: { text: '简洁又对称', position: 'bottom' } } },

  // ===== geometry (3) =====
  { lineId: 'geo-1', sectionId: 'geometry', scene: { id: 'geo-area', type: 'animation' }, lineState: { params: { sys: 2 }, annotation: { text: '行列式=面积', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geometry', scene: { id: 'geo-swap', type: 'animation' }, lineState: { params: { sys: 2 }, annotation: { text: '换边改面积', position: 'bottom' } } },
  { lineId: 'geo-3', sectionId: 'geometry', scene: { id: 'geo-ratio', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '解=面积之比', position: 'bottom' } } },

  // ===== interaction (3) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sys: 1 }, annotation: { text: '切换方程组', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sys: 2 }, annotation: { text: '拖系数看解', position: 'bottom' } } },
  { lineId: 'int-3', sectionId: 'interaction', scene: { id: 'int-parallel', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sys: 0 }, annotation: { text: '趋于平行 detA→0', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '行列式之比', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-geo', type: 'summary' }, lineState: { annotation: { text: '几何是面积比', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
