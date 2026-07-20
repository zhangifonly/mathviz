/**
 * 阿波罗尼垫片讲解场景配置
 * 每句口播对应递归深度（params.depth）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultApollonianGasketState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const apollonianGasketScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '阿波罗尼垫片', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fill', type: 'animation' }, lineState: { params: { depth: 2 }, annotation: { text: '缝隙里填圆', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-art', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '圆织成的分形', position: 'bottom' } } },

  // ===== tangent (3) =====
  { lineId: 'tan-1', sectionId: 'tangent', scene: { id: 'tan-touch', type: 'animation' }, lineState: { params: { depth: 1 }, annotation: { text: '恰好相切一点', position: 'top' } } },
  { lineId: 'tan-2', sectionId: 'tangent', scene: { id: 'tan-curv', type: 'animation' }, lineState: { params: { depth: 2 }, annotation: { text: 'k = 1/r', position: 'bottom' } } },
  { lineId: 'tan-3', sectionId: 'tangent', scene: { id: 'tan-neg', type: 'animation' }, lineState: { params: { depth: 2 }, annotation: { text: '外圆曲率取负', position: 'bottom' } } },

  // ===== theorem (3) =====
  { lineId: 'thm-1', sectionId: 'theorem', scene: { id: 'thm-four', type: 'animation' }, lineState: { params: { depth: 1 }, annotation: { text: '四圆两两相切', position: 'top' } } },
  { lineId: 'thm-2', sectionId: 'theorem', scene: { id: 'thm-eq', type: 'formula' }, lineState: { annotation: { text: '笛卡尔圆定理', position: 'top' } } },
  { lineId: 'thm-3', sectionId: 'theorem', scene: { id: 'thm-solve', type: 'animation' }, lineState: { params: { depth: 3 }, annotation: { text: '解出第四圆', position: 'bottom' } } },

  // ===== fractal (3) =====
  { lineId: 'fra-1', sectionId: 'fractal', scene: { id: 'fra-three', type: 'animation' }, lineState: { params: { depth: 3 }, annotation: { text: '新增三个缝隙', position: 'top' } } },
  { lineId: 'fra-2', sectionId: 'fractal', scene: { id: 'fra-dense', type: 'animation' }, lineState: { params: { depth: 5 }, annotation: { text: '越填越密', position: 'bottom' } } },
  { lineId: 'fra-3', sectionId: 'fractal', scene: { id: 'fra-dim', type: 'animation' }, lineState: { params: { depth: 5 }, annotation: { text: '维数约 1.305', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-depth', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 4 }, annotation: { text: '调整递归深度', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-style', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 5 }, annotation: { text: '嵌套的层次', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '相切圆填缝', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-engine', type: 'summary' }, lineState: { annotation: { text: '定理是引擎', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
