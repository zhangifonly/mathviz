/**
 * 极限环讲解场景配置
 * 每句口播对应阻尼参数 mu（params.mu）与轨迹进度（params.progress）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLimitCycleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const limitCycleScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '极限环', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-osc', type: 'animation' }, lineState: { params: { mu: 1, progress: 0.5 }, annotation: { text: '自持振荡', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-cycle', type: 'animation' }, lineState: { params: { mu: 1, progress: 1 }, annotation: { text: '藏着极限环', position: 'bottom' } } },

  // ===== equation (3) =====
  { lineId: 'eq-1', sectionId: 'equation', scene: { id: 'eq-vdp', type: 'animation' }, lineState: { params: { mu: 1, progress: 0.7 }, annotation: { text: '范德波尔方程', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equation', scene: { id: 'eq-system', type: 'animation' }, lineState: { params: { mu: 1, progress: 0.85 }, annotation: { text: '化为一阶系统', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equation', scene: { id: 'eq-rk4', type: 'animation' }, lineState: { params: { mu: 1, progress: 1 }, annotation: { text: 'RK4 积分', position: 'bottom' } } },

  // ===== cycle (3) =====
  { lineId: 'cyc-1', sectionId: 'cycle', scene: { id: 'cyc-pump', type: 'animation' }, lineState: { params: { mu: 2, progress: 0.6 }, annotation: { text: '小振幅供能', position: 'top' } } },
  { lineId: 'cyc-2', sectionId: 'cycle', scene: { id: 'cyc-damp', type: 'animation' }, lineState: { params: { mu: 2, progress: 0.85 }, annotation: { text: '大振幅耗能', position: 'bottom' } } },
  { lineId: 'cyc-3', sectionId: 'cycle', scene: { id: 'cyc-orbit', type: 'animation' }, lineState: { params: { mu: 2, progress: 1 }, annotation: { text: '孤立闭轨', position: 'bottom' } } },

  // ===== attract (3) =====
  { lineId: 'att-1', sectionId: 'attract', scene: { id: 'att-inner', type: 'animation' }, lineState: { params: { mu: 1, progress: 0.5 }, annotation: { text: '内部向外靠拢', position: 'top' } } },
  { lineId: 'att-2', sectionId: 'attract', scene: { id: 'att-outer', type: 'animation' }, lineState: { params: { mu: 1, progress: 0.75 }, annotation: { text: '外部向内收拢', position: 'bottom' } } },
  { lineId: 'att-3', sectionId: 'attract', scene: { id: 'att-all', type: 'animation' }, lineState: { params: { mu: 1, progress: 1 }, annotation: { text: '同一环俘获', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-mu', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mu: 3, progress: 1 }, annotation: { text: '调整 mu', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-replay', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mu: 0.5, progress: 1 }, annotation: { text: '重看收敛', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-energy', type: 'summary' }, lineState: { annotation: { text: '负阻尼供能', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-orbit', type: 'summary' }, lineState: { annotation: { text: '孤立闭轨吸引', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
