/**
 * 方向导数讲解场景配置
 * 每句口播对应函数选择（params.field）与方向角（params.angle，单位度）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDirectionalDerivativeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const directionalDerivativeScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '方向导数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-dirs', type: 'animation' }, lineState: { params: { field: 'paraboloid', angle: 0 }, annotation: { text: '朝这个方向多陡？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-vary', type: 'animation' }, lineState: { params: { field: 'paraboloid', angle: 60 }, annotation: { text: '方向不同，坡度不同', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { field: 'paraboloid', angle: 45 }, annotation: { text: '这就是方向导数', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-partial', type: 'animation' }, lineState: { params: { field: 'saddle', angle: 0 }, annotation: { text: '偏导只看坐标轴', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-any', type: 'animation' }, lineState: { params: { field: 'saddle', angle: 30 }, annotation: { text: '任意方向 u', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-rose', type: 'animation' }, lineState: { params: { field: 'saddle', angle: 120 }, annotation: { text: '半径=方向导数', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-dot', type: 'animation' }, lineState: { params: { field: 'paraboloid', angle: 45 }, annotation: { text: 'D_u f = ∇f · u', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-cos', type: 'animation' }, lineState: { params: { field: 'paraboloid', angle: 20 }, annotation: { text: '= |∇f| cos(夹角)', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-grad', type: 'animation' }, lineState: { params: { field: 'paraboloid', angle: 45 }, annotation: { text: '关键在梯度', position: 'bottom' } } },

  // ===== maxdir (3) =====
  { lineId: 'max-1', sectionId: 'maxdir', scene: { id: 'max-align', type: 'animation' }, lineState: { params: { field: 'ripple', angle: 45 }, annotation: { text: '沿梯度最大', position: 'top' } } },
  { lineId: 'max-2', sectionId: 'maxdir', scene: { id: 'max-perp', type: 'animation' }, lineState: { params: { field: 'ripple', angle: 135 }, annotation: { text: '垂直为零', position: 'bottom' } } },
  { lineId: 'max-3', sectionId: 'maxdir', scene: { id: 'max-neg', type: 'animation' }, lineState: { params: { field: 'ripple', angle: 225 }, annotation: { text: '反向下降最快', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'paraboloid', angle: 90 }, annotation: { text: '拖动方向角', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-max', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'paraboloid', angle: 45 }, annotation: { text: '转到梯度方向', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '任意方向的变化率', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-key', type: 'summary' }, lineState: { annotation: { text: '梯度点乘方向', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
