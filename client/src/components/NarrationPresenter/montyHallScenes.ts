/**
 * 蒙提霍尔问题讲解场景配置
 * 每句口播对应模拟局数（params.trials）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMontyHallState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const montyHallScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '蒙提霍尔问题', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pick', type: 'animation' }, lineState: { params: { trials: 50 }, annotation: { text: '先选一扇门', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-host', type: 'animation' }, lineState: { params: { trials: 50 }, annotation: { text: '换还是不换？', position: 'bottom' } } },

  // ===== myth (3) =====
  { lineId: 'myth-1', sectionId: 'myth', scene: { id: 'myth-half', type: 'animation' }, lineState: { params: { trials: 50 }, annotation: { text: '真的是一半一半？', position: 'top' } } },
  { lineId: 'myth-2', sectionId: 'myth', scene: { id: 'myth-stay', type: 'animation' }, lineState: { params: { trials: 200 }, annotation: { text: '干脆不换？', position: 'bottom' } } },
  { lineId: 'myth-3', sectionId: 'myth', scene: { id: 'myth-wrong', type: 'animation' }, lineState: { params: { trials: 200 }, annotation: { text: '直觉错了', position: 'bottom' } } },

  // ===== info (3) =====
  { lineId: 'info-1', sectionId: 'info', scene: { id: 'info-hostrule', type: 'animation' }, lineState: { params: { trials: 200 }, annotation: { text: '主持人只开有羊的门', position: 'top' } } },
  { lineId: 'info-2', sectionId: 'info', scene: { id: 'info-third', type: 'animation' }, lineState: { params: { trials: 200 }, annotation: { text: '初选只有 1/3', position: 'bottom' } } },
  { lineId: 'info-3', sectionId: 'info', scene: { id: 'info-twothird', type: 'animation' }, lineState: { params: { trials: 1000 }, annotation: { text: '另两扇占 2/3', position: 'bottom' } } },

  // ===== switch (3) =====
  { lineId: 'switch-1', sectionId: 'switch', scene: { id: 'switch-concentrate', type: 'animation' }, lineState: { params: { trials: 1000 }, annotation: { text: '2/3 集中到另一扇', position: 'top' } } },
  { lineId: 'switch-2', sectionId: 'switch', scene: { id: 'switch-bet', type: 'animation' }, lineState: { params: { trials: 1000 }, annotation: { text: '押注初选选错', position: 'bottom' } } },
  { lineId: 'switch-3', sectionId: 'switch', scene: { id: 'switch-double', type: 'animation' }, lineState: { params: { trials: 1000 }, annotation: { text: '换 2/3 · 不换 1/3', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-sim', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { trials: 200 }, annotation: { text: '让计算机反复玩', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-converge', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { trials: 1000 }, annotation: { text: '曲线收敛到理论值', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-info', type: 'summary' }, lineState: { annotation: { text: '信息重塑概率', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-rate', type: 'summary' }, lineState: { annotation: { text: '换 2/3 不换 1/3', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '相信数学之美！', position: 'bottom' } } },
]
