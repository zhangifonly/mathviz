/**
 * 幂迭代讲解场景配置
 * 每句口播对应矩阵索引（params.mi）与展示到第几步（params.step）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPowerIterationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const powerIterationScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '幂迭代', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-strong', type: 'animation' }, lineState: { params: { mi: 0, step: 0 }, annotation: { text: '最强的方向', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-avoid', type: 'animation' }, lineState: { params: { mi: 0, step: 0 }, annotation: { text: '不解特征方程', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { mi: 0, step: 1 }, annotation: { text: '反复乘就好', position: 'bottom' } } },

  // ===== multiply (3) =====
  { lineId: 'mul-1', sectionId: 'multiply', scene: { id: 'mul-start', type: 'animation' }, lineState: { params: { mi: 0, step: 1 }, annotation: { text: '乘一次', position: 'top' } } },
  { lineId: 'mul-2', sectionId: 'multiply', scene: { id: 'mul-again', type: 'animation' }, lineState: { params: { mi: 0, step: 3 }, annotation: { text: '再乘再乘', position: 'bottom' } } },
  { lineId: 'mul-3', sectionId: 'multiply', scene: { id: 'mul-bend', type: 'animation' }, lineState: { params: { mi: 0, step: 5 }, annotation: { text: '偏向主方向', position: 'bottom' } } },

  // ===== normalize (3) =====
  { lineId: 'norm-1', sectionId: 'normalize', scene: { id: 'norm-blow', type: 'animation' }, lineState: { params: { mi: 2, step: 2 }, annotation: { text: '长度会爆炸', position: 'top' } } },
  { lineId: 'norm-2', sectionId: 'normalize', scene: { id: 'norm-unit', type: 'animation' }, lineState: { params: { mi: 2, step: 3 }, annotation: { text: '缩回单位圆', position: 'bottom' } } },
  { lineId: 'norm-3', sectionId: 'normalize', scene: { id: 'norm-dir', type: 'animation' }, lineState: { params: { mi: 2, step: 5 }, annotation: { text: '只看方向', position: 'bottom' } } },

  // ===== converge (3) =====
  { lineId: 'conv-1', sectionId: 'converge', scene: { id: 'conv-lock', type: 'animation' }, lineState: { params: { mi: 0, step: 10 }, annotation: { text: '锁定主向量', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'converge', scene: { id: 'conv-rayleigh', type: 'animation' }, lineState: { params: { mi: 0, step: 14 }, annotation: { text: '瑞利商估值', position: 'bottom' } } },
  { lineId: 'conv-3', sectionId: 'converge', scene: { id: 'conv-fast', type: 'animation' }, lineState: { params: { mi: 2, step: 6 }, annotation: { text: '越突出越快', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mi: 1, step: 8 }, annotation: { text: '单步迭代', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mi: 1, step: 16 }, annotation: { text: '换个矩阵', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '乘+归一化', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: '瑞利商+PageRank', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
