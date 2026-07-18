/**
 * 谢尔宾斯基地毯讲解场景配置
 * 每句口播对应一个迭代层数（params.level）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSierpinskiCarpetState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sierpinskiCarpetScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '谢尔宾斯基地毯', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-holes', type: 'animation' }, lineState: { params: { level: 1 }, annotation: { text: '不断挖洞', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { level: 2 }, annotation: { text: '二维分形', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'rule-1', sectionId: 'rule', scene: { id: 'rule-grid', type: 'animation' }, lineState: { params: { level: 1 }, annotation: { text: '切成 3x3 九格', position: 'top' } } },
  { lineId: 'rule-2', sectionId: 'rule', scene: { id: 'rule-dig', type: 'animation' }, lineState: { params: { level: 1 }, annotation: { text: '挖去正中心', position: 'bottom' } } },
  { lineId: 'rule-3', sectionId: 'rule', scene: { id: 'rule-once', type: 'animation' }, lineState: { params: { level: 1 }, annotation: { text: '一次迭代', position: 'bottom' } } },

  // ===== recurse (3) =====
  { lineId: 'rec-1', sectionId: 'recurse', scene: { id: 'rec-repeat', type: 'animation' }, lineState: { params: { level: 2 }, annotation: { text: '对每格重复', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recurse', scene: { id: 'rec-nest', type: 'animation' }, lineState: { params: { level: 3 }, annotation: { text: '一层套一层', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recurse', scene: { id: 'rec-self', type: 'animation' }, lineState: { params: { level: 3 }, annotation: { text: '自相似', position: 'bottom' } } },

  // ===== dimension (3) =====
  { lineId: 'dim-1', sectionId: 'dimension', scene: { id: 'dim-scale', type: 'animation' }, lineState: { params: { level: 2 }, annotation: { text: '缩 1/3 留 8 份', position: 'top' } } },
  { lineId: 'dim-2', sectionId: 'dimension', scene: { id: 'dim-log', type: 'animation' }, lineState: { params: { level: 3 }, annotation: { text: 'log8 / log3', position: 'bottom' } } },
  { lineId: 'dim-3', sectionId: 'dimension', scene: { id: 'dim-between', type: 'animation' }, lineState: { params: { level: 4 }, annotation: { text: '介于一维二维', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-level', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { level: 3 }, annotation: { text: '调整层数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-deep', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { level: 4 }, annotation: { text: '面积趋于零', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '挖中心再递归', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-dim', type: 'summary' }, lineState: { annotation: { text: '维数 log8/log3', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美!', position: 'bottom' } } },
]
