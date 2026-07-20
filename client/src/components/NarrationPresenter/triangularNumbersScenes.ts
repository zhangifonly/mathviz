/**
 * 三角形数与图形数讲解场景配置
 * 每句口播对应图形类型 params.figType 与序号 params.n
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTriangularNumbersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const triangularNumbersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '三角形数与图形数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-arrange', type: 'animation' }, lineState: { params: { figType: 'triangular', n: 3 }, annotation: { text: '点子摆成形状', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { figType: 'square', n: 4 }, annotation: { text: '这就是图形数', position: 'bottom' } } },

  // ===== triangular (3) =====
  { lineId: 'tri-1', sectionId: 'triangular', scene: { id: 'tri-rows', type: 'animation' }, lineState: { params: { figType: 'triangular', n: 2 }, annotation: { text: '一行一行堆', position: 'top' } } },
  { lineId: 'tri-2', sectionId: 'triangular', scene: { id: 'tri-nth', type: 'animation' }, lineState: { params: { figType: 'triangular', n: 5 }, annotation: { text: '第 n 层 n 个点', position: 'bottom' } } },
  { lineId: 'tri-3', sectionId: 'triangular', scene: { id: 'tri-sum', type: 'animation' }, lineState: { params: { figType: 'triangular', n: 6 }, annotation: { text: '1+2+...+n', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'sum-1', sectionId: 'formula', scene: { id: 'sum-pair', type: 'animation' }, lineState: { params: { figType: 'triangular', n: 5 }, annotation: { text: '两个拼成矩形', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'formula', scene: { id: 'sum-rect', type: 'animation' }, lineState: { params: { figType: 'square', n: 5 }, annotation: { text: 'n×(n+1) 的一半', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'formula', scene: { id: 'sum-formula', type: 'formula' }, lineState: { annotation: { text: 'T(n)=n(n+1)/2', position: 'top' } } },

  // ===== others (3) =====
  { lineId: 'oth-1', sectionId: 'others', scene: { id: 'oth-square', type: 'animation' }, lineState: { params: { figType: 'square', n: 5 }, annotation: { text: '正方形数 n²', position: 'top' } } },
  { lineId: 'oth-2', sectionId: 'others', scene: { id: 'oth-link', type: 'animation' }, lineState: { params: { figType: 'triangular', n: 6 }, annotation: { text: 'T(n)+T(n-1)=n²', position: 'bottom' } } },
  { lineId: 'oth-3', sectionId: 'others', scene: { id: 'oth-penta', type: 'animation' }, lineState: { params: { figType: 'pentagonal', n: 5 }, annotation: { text: '五边形数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-type', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { figType: 'pentagonal', n: 6 }, annotation: { text: '切换图形类型', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-n', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { figType: 'triangular', n: 8 }, annotation: { text: '调大 n', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'end-1', sectionId: 'summary', scene: { id: 'end-recap', type: 'summary' }, lineState: { annotation: { text: '看得见的加法', position: 'top' } } },
  { lineId: 'end-2', sectionId: 'summary', scene: { id: 'end-formula', type: 'summary' }, lineState: { annotation: { text: '数与形的默契', position: 'bottom' } } },
  { lineId: 'end-3', sectionId: 'summary', scene: { id: 'end-final', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
