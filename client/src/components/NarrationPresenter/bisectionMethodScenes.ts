/**
 * 二分法求根讲解场景配置
 * 每句口播对应展示到第几步二分（params.step）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBisectionMethodState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const bisectionMethodScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '二分法求根', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-bracket', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '先圈住根', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-guess', type: 'animation' }, lineState: { params: { step: 1 }, annotation: { text: '每次往中间猜', position: 'bottom' } } },

  // ===== ivt (3) =====
  { lineId: 'ivt-1', sectionId: 'ivt', scene: { id: 'ivt-curve', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '左下右上', position: 'top' } } },
  { lineId: 'ivt-2', sectionId: 'ivt', scene: { id: 'ivt-cross', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '必穿过横轴', position: 'bottom' } } },
  { lineId: 'ivt-3', sectionId: 'ivt', scene: { id: 'ivt-theorem', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '异号则有根', position: 'bottom' } } },

  // ===== midpoint (3) =====
  { lineId: 'mid-1', sectionId: 'midpoint', scene: { id: 'mid-take', type: 'animation' }, lineState: { params: { step: 1 }, annotation: { text: '算中点函数值', position: 'top' } } },
  { lineId: 'mid-2', sectionId: 'midpoint', scene: { id: 'mid-sign', type: 'animation' }, lineState: { params: { step: 1 }, annotation: { text: '异号在哪半', position: 'bottom' } } },
  { lineId: 'mid-3', sectionId: 'midpoint', scene: { id: 'mid-drop', type: 'animation' }, lineState: { params: { step: 2 }, annotation: { text: '扔掉半边', position: 'bottom' } } },

  // ===== halve (3) =====
  { lineId: 'halve-1', sectionId: 'halve', scene: { id: 'halve-shrink', type: 'animation' }, lineState: { params: { step: 3 }, annotation: { text: '宽度减半', position: 'top' } } },
  { lineId: 'halve-2', sectionId: 'halve', scene: { id: 'halve-linear', type: 'animation' }, lineState: { params: { step: 5 }, annotation: { text: '线性收敛', position: 'bottom' } } },
  { lineId: 'halve-3', sectionId: 'halve', scene: { id: 'halve-stable', type: 'animation' }, lineState: { params: { step: 7 }, annotation: { text: '稳当必收敛', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { step: 9 }, annotation: { text: '两线向根夹拢', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { step: 12 }, annotation: { text: '换函数再试', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '定理 + 中点', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-halve', type: 'summary' }, lineState: { annotation: { text: '对半逼近', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
