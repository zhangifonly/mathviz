/**
 * 旋转体体积讲解场景配置
 * 每句口播对应曲线(params.curveId)与积分右端点(params.b)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSolidOfRevolutionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const solidOfRevolutionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '旋转体体积', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-solid', type: 'animation' }, lineState: { params: { curveId: 'sqrt', b: 4 }, annotation: { text: '绕 x 轴转一圈', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { curveId: 'sqrt', b: 4 }, annotation: { text: '体积怎么算？', position: 'bottom' } } },

  // ===== disk (3) =====
  { lineId: 'def-1', sectionId: 'disk', scene: { id: 'disk-slice', type: 'animation' }, lineState: { params: { curveId: 'line', b: 2 }, annotation: { text: '切成薄圆盘', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'disk', scene: { id: 'disk-radius', type: 'animation' }, lineState: { params: { curveId: 'line', b: 2 }, annotation: { text: '半径 = f(x)', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'disk', scene: { id: 'disk-vol', type: 'animation' }, lineState: { params: { curveId: 'line', b: 2 }, annotation: { text: 'π f(x)² · dx', position: 'bottom' } } },

  // ===== integral (3) =====
  { lineId: 'int-1', sectionId: 'integral', scene: { id: 'int-sum', type: 'animation' }, lineState: { params: { curveId: 'quad', b: 2 }, annotation: { text: '薄片求和 → 积分', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'integral', scene: { id: 'int-formula', type: 'animation' }, lineState: { params: { curveId: 'quad', b: 2 }, annotation: { text: '∫π f(x)² dx', position: 'bottom' } } },
  { lineId: 'int-3', sectionId: 'integral', scene: { id: 'int-simpson', type: 'animation' }, lineState: { params: { curveId: 'quad', b: 2 }, annotation: { text: '辛普森数值积分', position: 'bottom' } } },

  // ===== shell (3) =====
  { lineId: 'shl-1', sectionId: 'shell', scene: { id: 'shl-tube', type: 'animation' }, lineState: { params: { curveId: 'hump', b: 4 }, annotation: { text: '套成薄圆筒', position: 'top' } } },
  { lineId: 'shl-2', sectionId: 'shell', scene: { id: 'shl-formula', type: 'animation' }, lineState: { params: { curveId: 'hump', b: 4 }, annotation: { text: '2πy · L(y) · dy', position: 'bottom' } } },
  { lineId: 'shl-3', sectionId: 'shell', scene: { id: 'shl-same', type: 'animation' }, lineState: { params: { curveId: 'hump', b: 4 }, annotation: { text: '同一立体,结果相等', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'ita-1', sectionId: 'interaction', scene: { id: 'ita-change', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { curveId: 'sqrt', b: 4 }, annotation: { text: '换曲线/调区间', position: 'top' } } },
  { lineId: 'ita-2', sectionId: 'interaction', scene: { id: 'ita-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { curveId: 'sqrt', b: 3 }, annotation: { text: '两法数字咬合', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '圆盘 or 壳层', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-agree', type: 'summary' }, lineState: { annotation: { text: '积分累加,答案一致', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
