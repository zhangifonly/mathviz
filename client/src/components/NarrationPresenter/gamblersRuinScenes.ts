/**
 * 赌徒破产讲解场景配置
 * 每句口播对应一组赌局参数（params.i 本金 / params.N 目标 / params.p 胜率）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGamblersRuinState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gamblersRuinScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '赌徒破产', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-two', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.5 }, annotation: { text: '破产 or 达标', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.5 }, annotation: { text: '各有多大概率？', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.5 }, annotation: { text: '经典概率问题', position: 'bottom' } } },

  // ===== walk (3) =====
  { lineId: 'walk-1', sectionId: 'walk', scene: { id: 'walk-step', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.5 }, annotation: { text: '每局 ±1 随机迈步', position: 'top' } } },
  { lineId: 'walk-2', sectionId: 'walk', scene: { id: 'walk-wall', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.5 }, annotation: { text: '0 与 N 是吸收壁', position: 'bottom' } } },
  { lineId: 'walk-3', sectionId: 'walk', scene: { id: 'walk-absorb', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.5 }, annotation: { text: '终会撞上一道壁', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-fair', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.5 }, annotation: { text: '(N−i)/N', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-ratio', type: 'animation' }, lineState: { params: { i: 5, N: 50, p: 0.5 }, annotation: { text: '本金比例越小越危险', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-power', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.45 }, annotation: { text: '不公平用幂次公式', position: 'bottom' } } },

  // ===== fairness (3) =====
  { lineId: 'fair-1', sectionId: 'fairness', scene: { id: 'fair-even', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.5 }, annotation: { text: '公平：比例决定', position: 'top' } } },
  { lineId: 'fair-2', sectionId: 'fairness', scene: { id: 'fair-tilt', type: 'animation' }, lineState: { params: { i: 10, N: 20, p: 0.48 }, annotation: { text: '略低胜率就大变', position: 'bottom' } } },
  { lineId: 'fair-3', sectionId: 'fairness', scene: { id: 'fair-house', type: 'animation' }, lineState: { params: { i: 20, N: 40, p: 0.45 }, annotation: { text: '赌场的微小优势', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-adjust', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { i: 20, N: 40, p: 0.45 }, annotation: { text: '调本金与胜率', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-resim', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { i: 10, N: 20, p: 0.48 }, annotation: { text: '重新模拟看结局', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '两壁随机游走', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-key', type: 'summary' }, lineState: { annotation: { text: '劣势被放大', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '久赌必输！', position: 'bottom' } } },
]
