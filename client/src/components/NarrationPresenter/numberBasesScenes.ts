/**
 * 进制转换讲解场景配置
 * 每句口播对应一个展示数字（params.n）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNumberBasesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const numberBasesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '进制转换', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-ten', type: 'animation' }, lineState: { params: { n: 10 }, annotation: { text: '为何逢十进一', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-365', type: 'animation' }, lineState: { params: { n: 365 }, annotation: { text: '百·十·个', position: 'bottom' } } },

  // ===== placevalue (3) =====
  { lineId: 'def-1', sectionId: 'placevalue', scene: { id: 'def-power', type: 'animation' }, lineState: { params: { n: 365 }, annotation: { text: '权重=底数的幂', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'placevalue', scene: { id: 'def-ten', type: 'animation' }, lineState: { params: { n: 365 }, annotation: { text: '个十百千', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'placevalue', scene: { id: 'def-base', type: 'animation' }, lineState: { params: { n: 42 }, annotation: { text: '换底数即可', position: 'bottom' } } },

  // ===== binary (3) =====
  { lineId: 'bin-1', sectionId: 'binary', scene: { id: 'bin-two', type: 'animation' }, lineState: { params: { n: 13 }, annotation: { text: '逢二进一', position: 'top' } } },
  { lineId: 'bin-2', sectionId: 'binary', scene: { id: 'bin-power', type: 'animation' }, lineState: { params: { n: 13 }, annotation: { text: '权重是二的幂', position: 'bottom' } } },
  { lineId: 'bin-3', sectionId: 'binary', scene: { id: 'bin-1101', type: 'animation' }, lineState: { params: { n: 13 }, annotation: { text: '1101 = 13', position: 'bottom' } } },

  // ===== hex (2) =====
  { lineId: 'hex-1', sectionId: 'hex', scene: { id: 'hex-compact', type: 'animation' }, lineState: { params: { n: 255 }, annotation: { text: '更紧凑', position: 'top' } } },
  { lineId: 'hex-2', sectionId: 'hex', scene: { id: 'hex-nibble', type: 'animation' }, lineState: { params: { n: 2748 }, annotation: { text: '四位一符号', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 100 }, annotation: { text: '输入数字', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-len', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 200 }, annotation: { text: '进制越小位数越多', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rule', type: 'summary' }, lineState: { annotation: { text: '规则始终如一', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-power', type: 'summary' }, lineState: { annotation: { text: '各位相加还原', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '读懂机器的语言！', position: 'bottom' } } },
]
