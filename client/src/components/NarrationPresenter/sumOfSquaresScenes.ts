/**
 * 平方和定理讲解场景配置
 * 每句口播对应一个显示模式(mode)与被检视的数(pick)/范围(range)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSumOfSquaresState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sumOfSquaresScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '平方和定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-three', type: 'animation' }, lineState: { params: { mode: 'circle', pick: 3, range: 100 }, annotation: { text: '3 凑不出', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { mode: 'grid', range: 100 }, annotation: { text: '哪些数可以？', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-what', type: 'animation' }, lineState: { params: { mode: 'circle', pick: 5, range: 100 }, annotation: { text: 'a² + b² = n', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-25', type: 'animation' }, lineState: { params: { mode: 'circle', pick: 25, range: 100 }, annotation: { text: '25 有两种拆法', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-grid', type: 'animation' }, lineState: { params: { mode: 'grid', range: 100 }, annotation: { text: '点亮两平方和', position: 'bottom' } } },

  // ===== fermat (4) =====
  { lineId: 'fer-1', sectionId: 'fermat', scene: { id: 'fer-key', type: 'animation' }, lineState: { params: { mode: 'grid', range: 100 }, annotation: { text: '钥匙在质因子', position: 'top' } } },
  { lineId: 'fer-2', sectionId: 'fermat', scene: { id: 'fer-3k', type: 'animation' }, lineState: { params: { mode: 'circle', pick: 21, range: 100 }, annotation: { text: '看 4k+3 型', position: 'bottom' } } },
  { lineId: 'fer-3', sectionId: 'fermat', scene: { id: 'fer-even', type: 'animation' }, lineState: { params: { mode: 'grid', range: 100 }, annotation: { text: '需出现偶数次', position: 'bottom' } } },
  { lineId: 'fer-4', sectionId: 'fermat', scene: { id: 'fer-nine', type: 'animation' }, lineState: { params: { mode: 'circle', pick: 9, range: 100 }, annotation: { text: '9 = 3² 可以', position: 'top' } } },

  // ===== circle (3) =====
  { lineId: 'cir-1', sectionId: 'circle', scene: { id: 'cir-radius', type: 'animation' }, lineState: { params: { mode: 'circle', pick: 50, range: 100 }, annotation: { text: '半径 √n', position: 'top' } } },
  { lineId: 'cir-2', sectionId: 'circle', scene: { id: 'cir-points', type: 'animation' }, lineState: { params: { mode: 'circle', pick: 50, range: 100 }, annotation: { text: '整点即表示', position: 'bottom' } } },
  { lineId: 'cir-3', sectionId: 'circle', scene: { id: 'cir-count', type: 'animation' }, lineState: { params: { mode: 'circle', pick: 65, range: 100 }, annotation: { text: '数圆上格点', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'circle', pick: 25, range: 100 }, annotation: { text: '选一个 n', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-circle', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'circle', pick: 45, range: 100 }, annotation: { text: '看格点圆', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '费马双平方定理', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-geom', type: 'summary' }, lineState: { annotation: { text: '数与形互照', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
