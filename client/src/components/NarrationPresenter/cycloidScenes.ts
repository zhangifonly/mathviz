/**
 * 旋轮线家族讲解场景配置
 * 每句口播对应精确的曲线类型（params.curve）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCycloidState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const cycloidScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '旋轮线家族', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-cycloid', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '摆线', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-arch', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '一拱一拱', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-roll', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '让圆滚起来', position: 'bottom' } } },

  // ===== cycloid (4) =====
  { lineId: 'cyc-1', sectionId: 'cycloid', scene: { id: 'cyc-roll', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '半径 r，转角 t', position: 'top' } } },
  { lineId: 'cyc-2', sectionId: 'cycloid', scene: { id: 'cyc-two', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '前进 + 旋转', position: 'top' } } },
  { lineId: 'cyc-3', sectionId: 'cycloid', scene: { id: 'cyc-eq', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: 'x=r(t−sin t)', position: 'bottom' } } },
  { lineId: 'cyc-4', sectionId: 'cycloid', scene: { id: 'cyc-peak', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '最高点 = 2r', position: 'top' } } },

  // ===== fastest (3) =====
  { lineId: 'fast-1', sectionId: 'fastest', scene: { id: 'fast-intro', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '惊人的性质', position: 'top' } } },
  { lineId: 'fast-2', sectionId: 'fastest', scene: { id: 'fast-brachisto', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '最速降线', position: 'bottom' } } },
  { lineId: 'fast-3', sectionId: 'fastest', scene: { id: 'fast-tauto', type: 'animation' }, lineState: { params: { curve: 'cycloid' }, annotation: { text: '等时性', position: 'bottom' } } },

  // ===== family (3) =====
  { lineId: 'fam-1', sectionId: 'family', scene: { id: 'fam-hypo', type: 'animation' }, lineState: { params: { curve: 'hypocycloid' }, annotation: { text: '内摆线', position: 'top' } } },
  { lineId: 'fam-2', sectionId: 'family', scene: { id: 'fam-astroid', type: 'animation' }, lineState: { params: { curve: 'astroid' }, annotation: { text: '星形线·4 尖点', position: 'top' } } },
  { lineId: 'fam-3', sectionId: 'family', scene: { id: 'fam-cardioid', type: 'animation' }, lineState: { params: { curve: 'cardioid' }, annotation: { text: '心脏线', position: 'top' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { curve: 'epicycloid' }, annotation: { text: '切换曲线', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-cusps', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { curve: 'astroid' }, annotation: { text: '观察尖点数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '最速降·等时', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-family', type: 'summary' }, lineState: { annotation: { text: '一整个家族', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
