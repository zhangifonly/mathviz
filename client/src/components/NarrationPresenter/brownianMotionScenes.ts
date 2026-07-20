/**
 * 布朗运动讲解场景配置
 * 每句口播对应模式（params.mode）与步数（params.steps）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBrownianMotionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const brownianMotionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '布朗运动', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-dance', type: 'animation' }, lineState: { params: { mode: '2d', steps: 500 }, annotation: { text: '永不停歇的舞动', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-collide', type: 'animation' }, lineState: { params: { mode: '2d', steps: 1000 }, annotation: { text: '分子的撞击', position: 'bottom' } } },

  // ===== increment (3) =====
  { lineId: 'inc-1', sectionId: 'increment', scene: { id: 'inc-walk', type: 'animation' }, lineState: { params: { mode: '1d', steps: 200 }, annotation: { text: '一步步随机漫步', position: 'top' } } },
  { lineId: 'inc-2', sectionId: 'increment', scene: { id: 'inc-gauss', type: 'animation' }, lineState: { params: { mode: '1d', steps: 500 }, annotation: { text: '高斯随机增量', position: 'bottom' } } },
  { lineId: 'inc-3', sectionId: 'increment', scene: { id: 'inc-sum', type: 'animation' }, lineState: { params: { mode: '1d', steps: 1000 }, annotation: { text: '累加成轨迹', position: 'bottom' } } },

  // ===== variance (3) =====
  { lineId: 'var-1', sectionId: 'variance', scene: { id: 'var-indep', type: 'animation' }, lineState: { params: { mode: '1d', steps: 500 }, annotation: { text: '独立增量相加', position: 'top' } } },
  { lineId: 'var-2', sectionId: 'variance', scene: { id: 'var-grow', type: 'animation' }, lineState: { params: { mode: '2d', steps: 1000 }, annotation: { text: '方差随 t 增长', position: 'bottom' } } },
  { lineId: 'var-3', sectionId: 'variance', scene: { id: 'var-sqrt', type: 'animation' }, lineState: { params: { mode: '2d', steps: 1000 }, annotation: { text: '偏离 ∝ √t', position: 'bottom' } } },

  // ===== nondiff (3) =====
  { lineId: 'nd-1', sectionId: 'nondiff', scene: { id: 'nd-cont', type: 'animation' }, lineState: { params: { mode: '1d', steps: 500 }, annotation: { text: '连续不断笔', position: 'top' } } },
  { lineId: 'nd-2', sectionId: 'nondiff', scene: { id: 'nd-jagged', type: 'animation' }, lineState: { params: { mode: '1d', steps: 1000 }, annotation: { text: '处处锯齿', position: 'bottom' } } },
  { lineId: 'nd-3', sectionId: 'nondiff', scene: { id: 'nd-nowhere', type: 'animation' }, lineState: { params: { mode: '1d', steps: 1000 }, annotation: { text: '处处不可导', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: '2d', steps: 1000 }, annotation: { text: '每次都不同', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-mode', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: '1d', steps: 500 }, annotation: { text: '一维↔二维', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '高斯增量累加', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-props', type: 'summary' }, lineState: { annotation: { text: '连续不可导', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
