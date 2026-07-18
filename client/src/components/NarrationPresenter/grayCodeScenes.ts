/**
 * 格雷码讲解场景配置
 * 每句口播对应位数（params.bits）与高亮行（params.active）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGrayCodeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const grayCodeScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '格雷码', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-jump', type: 'animation' }, lineState: { params: { bits: 3, active: 4 }, annotation: { text: '3 转 4 三位齐变', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-glitch', type: 'animation' }, lineState: { params: { bits: 3, active: 4 }, annotation: { text: '可能读出乱码', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { bits: 3, active: 1 }, annotation: { text: '巧妙的编码', position: 'bottom' } } },

  // ===== adjacent (3) =====
  { lineId: 'adj-1', sectionId: 'adjacent', scene: { id: 'adj-rule', type: 'animation' }, lineState: { params: { bits: 3, active: 2 }, annotation: { text: '相邻只变一位', position: 'top' } } },
  { lineId: 'adj-2', sectionId: 'adjacent', scene: { id: 'adj-onebit', type: 'animation' }, lineState: { params: { bits: 3, active: 3 }, annotation: { text: '永远翻一个比特', position: 'bottom' } } },
  { lineId: 'adj-3', sectionId: 'adjacent', scene: { id: 'adj-hot', type: 'animation' }, lineState: { params: { bits: 4, active: 5 }, annotation: { text: '橙色=改变的位', position: 'bottom' } } },

  // ===== convert (3) =====
  { lineId: 'conv-1', sectionId: 'convert', scene: { id: 'conv-xor', type: 'animation' }, lineState: { params: { bits: 4, active: 6 }, annotation: { text: '与右移自己异或', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'convert', scene: { id: 'conv-formula', type: 'animation' }, lineState: { params: { bits: 4, active: 8 }, annotation: { text: 'g = n ⊕ (n>>1)', position: 'bottom' } } },
  { lineId: 'conv-3', sectionId: 'convert', scene: { id: 'conv-inv', type: 'animation' }, lineState: { params: { bits: 4, active: 10 }, annotation: { text: '前缀异或可还原', position: 'bottom' } } },

  // ===== karnaugh (2) =====
  { lineId: 'kar-1', sectionId: 'karnaugh', scene: { id: 'kar-map', type: 'animation' }, lineState: { params: { bits: 3, active: 5 }, annotation: { text: '卡诺图行列标号', position: 'top' } } },
  { lineId: 'kar-2', sectionId: 'karnaugh', scene: { id: 'kar-merge', type: 'animation' }, lineState: { params: { bits: 3, active: 6 }, annotation: { text: '相邻可合并化简', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-bits', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { bits: 4, active: -1 }, annotation: { text: '切换位数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-check', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { bits: 4, active: 12 }, annotation: { text: '逐行核对', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '相邻只差一位', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-xor', type: 'summary' }, lineState: { annotation: { text: '异或即可转换', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
