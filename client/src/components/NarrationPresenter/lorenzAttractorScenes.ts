/**
 * 洛伦兹吸引子讲解场景配置
 * 每句口播对应参数预设（params.preset）与积分步数（params.steps）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLorenzAttractorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lorenzAttractorScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '洛伦兹吸引子', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-butterfly', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 4000 }, annotation: { text: '一只数学蝴蝶', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-chaos', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 6000 }, annotation: { text: '混沌理论的起点', position: 'bottom' } } },

  // ===== equations (3) =====
  { lineId: 'eq-1', sectionId: 'equations', scene: { id: 'eq-vars', type: 'formula' }, lineState: { params: { preset: 'classic', steps: 6000 }, annotation: { text: '三个变量 x y z', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equations', scene: { id: 'eq-xy', type: 'formula' }, lineState: { params: { preset: 'classic', steps: 6000 }, annotation: { text: 'dx dy 的变化率', position: 'top' } } },
  { lineId: 'eq-3', sectionId: 'equations', scene: { id: 'eq-nonlinear', type: 'formula' }, lineState: { params: { preset: 'classic', steps: 6000 }, annotation: { text: '乘积项 → 非线性', position: 'bottom' } } },

  // ===== attractor (3) =====
  { lineId: 'attr-1', sectionId: 'attractor', scene: { id: 'attr-bounded', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 8000 }, annotation: { text: '有界却不相交', position: 'top' } } },
  { lineId: 'attr-2', sectionId: 'attractor', scene: { id: 'attr-wings', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 10000 }, annotation: { text: '蝴蝶的两只翅膀', position: 'bottom' } } },
  { lineId: 'attr-3', sectionId: 'attractor', scene: { id: 'attr-fractal', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 12000 }, annotation: { text: '分形维数', position: 'bottom' } } },

  // ===== butterfly (3) =====
  { lineId: 'bf-1', sectionId: 'butterfly', scene: { id: 'bf-init', type: 'comparison' }, lineState: { params: { preset: 'classic', steps: 6000, twin: true }, annotation: { text: '差异千万分之一', position: 'top' } } },
  { lineId: 'bf-2', sectionId: 'butterfly', scene: { id: 'bf-diverge', type: 'comparison' }, lineState: { params: { preset: 'classic', steps: 9000, twin: true }, annotation: { text: '分道扬镳', position: 'bottom' } } },
  { lineId: 'bf-3', sectionId: 'butterfly', scene: { id: 'bf-sensitive', type: 'comparison' }, lineState: { params: { preset: 'classic', steps: 9000, twin: true }, annotation: { text: '对初值敏感', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-rho', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'stable', steps: 8000 }, annotation: { text: '调节参数 rho', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-onset', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'classic', steps: 10000 }, annotation: { text: 'rho≈28 展翅', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-determinism', type: 'summary' }, lineState: { annotation: { text: '确定却不可预测', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-defn', type: 'summary' }, lineState: { annotation: { text: '有界·非周期·敏感', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
