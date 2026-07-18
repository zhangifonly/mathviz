/**
 * 巴恩斯利蕨讲解场景配置
 * 每句口播对应迭代点数（params.count）与可选高亮变换（params.highlight）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBarnsleyFernState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const barnsleyFernScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '巴恩斯利蕨', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-rules', type: 'animation' }, lineState: { params: { count: 50000 }, annotation: { text: '四条规则', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { count: 50000 }, annotation: { text: '分形之美', position: 'bottom' } } },

  // ===== affine (3) =====
  { lineId: 'aff-1', sectionId: 'affine', scene: { id: 'aff-transform', type: 'animation' }, lineState: { params: { count: 10000 }, annotation: { text: '缩放·旋转·平移', position: 'top' } } },
  { lineId: 'aff-2', sectionId: 'affine', scene: { id: 'aff-coef', type: 'animation' }, lineState: { params: { count: 10000 }, annotation: { text: '六个系数', position: 'bottom' } } },
  { lineId: 'aff-3', sectionId: 'affine', scene: { id: 'aff-four', type: 'animation' }, lineState: { params: { count: 50000 }, annotation: { text: '四组系数', position: 'bottom' } } },

  // ===== ifs (3) =====
  { lineId: 'ifs-1', sectionId: 'ifs', scene: { id: 'ifs-origin', type: 'animation' }, lineState: { params: { count: 10000 }, annotation: { text: '从原点出发', position: 'top' } } },
  { lineId: 'ifs-2', sectionId: 'ifs', scene: { id: 'ifs-cloud', type: 'animation' }, lineState: { params: { count: 50000 }, annotation: { text: '点云成叶', position: 'bottom' } } },
  { lineId: 'ifs-3', sectionId: 'ifs', scene: { id: 'ifs-system', type: 'animation' }, lineState: { params: { count: 50000 }, annotation: { text: '迭代函数系统', position: 'bottom' } } },

  // ===== probability (3) =====
  { lineId: 'prob-1', sectionId: 'probability', scene: { id: 'prob-choose', type: 'animation' }, lineState: { params: { count: 50000 }, annotation: { text: '概率随机选取', position: 'top' } } },
  { lineId: 'prob-2', sectionId: 'probability', scene: { id: 'prob-main', type: 'animation' }, lineState: { params: { count: 50000, highlight: 1 }, annotation: { text: '主叶 85%', position: 'bottom' } } },
  { lineId: 'prob-3', sectionId: 'probability', scene: { id: 'prob-stem', type: 'animation' }, lineState: { params: { count: 50000, highlight: 0 }, annotation: { text: '茎 1%', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 10000 }, annotation: { text: '调整点数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-highlight', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 50000, highlight: 2 }, annotation: { text: '高亮变换', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '变换+概率+迭代', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-emerge', type: 'summary' }, lineState: { annotation: { text: '规则涌现形态', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美!', position: 'bottom' } } },
]
