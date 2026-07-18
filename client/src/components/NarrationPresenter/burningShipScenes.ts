/**
 * 燃烧船分形讲解场景配置
 * 每句口播对应观察区域索引（params.region）与迭代上限（params.maxIter）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBurningShipState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const burningShipScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '燃烧船分形', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-cousin', type: 'animation' }, lineState: { params: { region: 0, maxIter: 120 }, annotation: { text: '曼德博的亲戚', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-abs', type: 'animation' }, lineState: { params: { region: 0, maxIter: 120 }, annotation: { text: '只多一步取绝对值', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'def-1', sectionId: 'formula', scene: { id: 'def-mandel', type: 'animation' }, lineState: { params: { region: 0, maxIter: 120 }, annotation: { text: 'z² + c', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'formula', scene: { id: 'def-absstep', type: 'animation' }, lineState: { params: { region: 0, maxIter: 120 }, annotation: { text: '先取 |Re|、|Im|', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'formula', scene: { id: 'def-full', type: 'animation' }, lineState: { params: { region: 0, maxIter: 200 }, annotation: { text: '(|Re z|+i|Im z|)²+c', position: 'bottom' } } },

  // ===== color (3) =====
  { lineId: 'col-1', sectionId: 'color', scene: { id: 'col-count', type: 'animation' }, lineState: { params: { region: 0, maxIter: 120 }, annotation: { text: '数逃逸迭代数', position: 'top' } } },
  { lineId: 'col-2', sectionId: 'color', scene: { id: 'col-inset', type: 'animation' }, lineState: { params: { region: 0, maxIter: 200 }, annotation: { text: '集合内近黑', position: 'bottom' } } },
  { lineId: 'col-3', sectionId: 'color', scene: { id: 'col-fire', type: 'animation' }, lineState: { params: { region: 0, maxIter: 200 }, annotation: { text: '逃得快则暖亮', position: 'bottom' } } },

  // ===== shape (2) =====
  { lineId: 'shape-1', sectionId: 'shape', scene: { id: 'shape-fleet', type: 'animation' }, lineState: { params: { region: 0, maxIter: 200 }, annotation: { text: '一排排船只', position: 'top' } } },
  { lineId: 'shape-2', sectionId: 'shape', scene: { id: 'shape-hull', type: 'animation' }, lineState: { params: { region: 1, maxIter: 200 }, annotation: { text: '主船身特写', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-zoom', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { region: 1, maxIter: 200 }, annotation: { text: '切区域缩放', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-iter', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { region: 1, maxIter: 200 }, annotation: { text: '提高迭代次数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '一步绝对值', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-color', type: 'summary' }, lineState: { annotation: { text: '逃逸时间染色', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
