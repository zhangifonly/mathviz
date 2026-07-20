/**
 * 最小二乘法讲解场景配置
 * 每句口播对应噪声大小与点数（params.noise / params.count / params.residuals）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLeastSquaresState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const leastSquaresScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '最小二乘法', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-scatter', type: 'animation' }, lineState: { params: { noise: 18, count: 24, residuals: 0 }, annotation: { text: '穿过点团中心', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-which', type: 'animation' }, lineState: { params: { noise: 18, count: 24, residuals: 0 }, annotation: { text: '哪条直线最好？', position: 'bottom' } } },

  // ===== residual (3) =====
  { lineId: 'res-1', sectionId: 'residual', scene: { id: 'res-vertical', type: 'animation' }, lineState: { params: { noise: 18, count: 16, residuals: 1 }, annotation: { text: '竖直残差 = 误差', position: 'top' } } },
  { lineId: 'res-2', sectionId: 'residual', scene: { id: 'res-sum', type: 'animation' }, lineState: { params: { noise: 18, count: 16, residuals: 1 }, annotation: { text: '平方后求和 = RSS', position: 'bottom' } } },
  { lineId: 'res-3', sectionId: 'residual', scene: { id: 'res-square', type: 'animation' }, lineState: { params: { noise: 24, count: 16, residuals: 1 }, annotation: { text: '平方放大大偏差', position: 'bottom' } } },

  // ===== minimize (3) =====
  { lineId: 'min-1', sectionId: 'minimize', scene: { id: 'min-best', type: 'animation' }, lineState: { params: { noise: 12, count: 24, residuals: 1 }, annotation: { text: 'RSS 最小的直线', position: 'top' } } },
  { lineId: 'min-2', sectionId: 'minimize', scene: { id: 'min-normal', type: 'animation' }, lineState: { params: { noise: 12, count: 24, residuals: 1 }, annotation: { text: '求导=0 得正规方程', position: 'bottom' } } },
  { lineId: 'min-3', sectionId: 'minimize', scene: { id: 'min-closed', type: 'animation' }, lineState: { params: { noise: 12, count: 24, residuals: 0 }, annotation: { text: 'k=cov/var，过均值点', position: 'bottom' } } },

  // ===== goodness (2) =====
  { lineId: 'good-1', sectionId: 'goodness', scene: { id: 'good-r2', type: 'animation' }, lineState: { params: { noise: 6, count: 24, residuals: 0 }, annotation: { text: '决定系数 R²', position: 'top' } } },
  { lineId: 'good-2', sectionId: 'goodness', scene: { id: 'good-close', type: 'animation' }, lineState: { params: { noise: 6, count: 24, residuals: 0 }, annotation: { text: 'R²→1 越好', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-noise', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { noise: 36, count: 24, residuals: 1 }, annotation: { text: '噪声大 R² 降', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { noise: 18, count: 24, residuals: 1 }, annotation: { text: '始终最优拟合', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '最小化残差平方和', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-formula', type: 'summary' }, lineState: { annotation: { text: '闭式解与 R²', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
