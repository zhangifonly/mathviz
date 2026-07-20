/**
 * 戈斯珀曲线讲解场景配置
 * 每句口播对应迭代阶数（params.order）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGosperCurveState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gosperCurveScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '戈斯珀曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fill', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '填满平面', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-hex', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '六边形流水', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'def-1', sectionId: 'rule', scene: { id: 'def-axiom', type: 'animation' }, lineState: { params: { order: 1 }, annotation: { text: '公理 A', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'rule', scene: { id: 'def-rewrite', type: 'animation' }, lineState: { params: { order: 2 }, annotation: { text: 'A→A-B--B+A++AA+B-', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'rule', scene: { id: 'def-lsystem', type: 'animation' }, lineState: { params: { order: 2 }, annotation: { text: 'L 系统重写', position: 'bottom' } } },

  // ===== turn (3) =====
  { lineId: 'turn-1', sectionId: 'turn', scene: { id: 'turn-step', type: 'animation' }, lineState: { params: { order: 2 }, annotation: { text: '字母=前进一步', position: 'top' } } },
  { lineId: 'turn-2', sectionId: 'turn', scene: { id: 'turn-angle', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '±60 度转向', position: 'bottom' } } },
  { lineId: 'turn-3', sectionId: 'turn', scene: { id: 'turn-hex', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '拐出六边形', position: 'bottom' } } },

  // ===== tiling (2) =====
  { lineId: 'tile-1', sectionId: 'tiling', scene: { id: 'tile-seven', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '步数 ×7', position: 'top' } } },
  { lineId: 'tile-2', sectionId: 'tiling', scene: { id: 'tile-self', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '自相似', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-order', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 4 }, annotation: { text: '调整阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-fill', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 4 }, annotation: { text: '越高越致密', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'L 系统 + 60 度', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-fractal', type: 'summary' }, lineState: { annotation: { text: '自相似铺砌', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
