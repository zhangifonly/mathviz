/**
 * 相图分析讲解场景配置
 * 每句口播对应展示的系统索引（params.sys: 0结点 1鞍点 2焦点 3中心）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPhasePortraitState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const phasePortraitScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '相图分析', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-flow', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '看解如何流动', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { sys: 2 }, annotation: { text: '几何眼光', position: 'bottom' } } },

  // ===== field (3) =====
  { lineId: 'field-1', sectionId: 'field', scene: { id: 'field-arrows', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '每点一个速度箭头', position: 'top' } } },
  { lineId: 'field-2', sectionId: 'field', scene: { id: 'field-vector', type: 'animation' }, lineState: { params: { sys: 2 }, annotation: { text: '向量场如暗流', position: 'bottom' } } },
  { lineId: 'field-3', sectionId: 'field', scene: { id: 'field-traj', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '顺箭头描出轨线', position: 'bottom' } } },

  // ===== equil (3) =====
  { lineId: 'eq-1', sectionId: 'equil', scene: { id: 'eq-zero', type: 'animation' }, lineState: { params: { sys: 3 }, annotation: { text: '速度为零之处', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equil', scene: { id: 'eq-origin', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '平衡点=原点', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equil', scene: { id: 'eq-stable', type: 'animation' }, lineState: { params: { sys: 1 }, annotation: { text: '吸引还是推开？', position: 'bottom' } } },

  // ===== classify (3) =====
  { lineId: 'cls-1', sectionId: 'classify', scene: { id: 'cls-eigen', type: 'animation' }, lineState: { params: { sys: 0 }, annotation: { text: '迹与行列式定乾坤', position: 'top' } } },
  { lineId: 'cls-2', sectionId: 'classify', scene: { id: 'cls-saddle', type: 'animation' }, lineState: { params: { sys: 1 }, annotation: { text: '同号=结点 异号=鞍点', position: 'bottom' } } },
  { lineId: 'cls-3', sectionId: 'classify', scene: { id: 'cls-focus', type: 'animation' }, lineState: { params: { sys: 2 }, annotation: { text: '复特征值让轨线打转', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sys: 3 }, annotation: { text: '切换系统', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-check', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sys: 1 }, annotation: { text: '对照迹与行列式', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '不解方程看行为', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-four', type: 'summary' }, lineState: { annotation: { text: '四类都在特征值里', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
