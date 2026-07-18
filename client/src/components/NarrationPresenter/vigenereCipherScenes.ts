/**
 * 维吉尼亚密码讲解场景配置
 * params.col 表示当前聚焦的列（示例 ATTACKATDAWN + LEMON 的第几个字母）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultVigenereCipherState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const vigenereCipherScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '维吉尼亚密码', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-vary', type: 'animation' }, lineState: { params: { col: 0 }, annotation: { text: '同字母变不同模样', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { col: 1 }, annotation: { text: '不可破译三百年', position: 'bottom' } } },

  // ===== shift (3) =====
  { lineId: 'shift-1', sectionId: 'shift', scene: { id: 'shift-mod', type: 'animation' }, lineState: { params: { col: 0 }, annotation: { text: '加法后模 26', position: 'top' } } },
  { lineId: 'shift-2', sectionId: 'shift', scene: { id: 'shift-key', type: 'animation' }, lineState: { params: { col: 2 }, annotation: { text: '密钥决定偏移', position: 'bottom' } } },
  { lineId: 'shift-3', sectionId: 'shift', scene: { id: 'shift-cycle', type: 'animation' }, lineState: { params: { col: 5 }, annotation: { text: '密钥循环铺满', position: 'bottom' } } },

  // ===== tabula (3) =====
  { lineId: 'tab-1', sectionId: 'tabula', scene: { id: 'tab-grid', type: 'animation' }, lineState: { params: { col: 3 }, annotation: { text: '26×26 查找表', position: 'top' } } },
  { lineId: 'tab-2', sectionId: 'tabula', scene: { id: 'tab-cross', type: 'animation' }, lineState: { params: { col: 4 }, annotation: { text: '行列交点=密文', position: 'bottom' } } },
  { lineId: 'tab-3', sectionId: 'tabula', scene: { id: 'tab-decrypt', type: 'animation' }, lineState: { params: { col: 6 }, annotation: { text: '反查即解密', position: 'bottom' } } },

  // ===== stronger (2) =====
  { lineId: 'str-1', sectionId: 'stronger', scene: { id: 'str-caesar', type: 'animation' }, lineState: { params: { col: 0 }, annotation: { text: '凯撒:单一偏移', position: 'top' } } },
  { lineId: 'str-2', sectionId: 'stronger', scene: { id: 'str-flat', type: 'animation' }, lineState: { params: { col: 7 }, annotation: { text: '抹平字母频率', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { col: 8 }, annotation: { text: '逐字母观察', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-cross', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { col: 9 }, annotation: { text: '高亮交点=密文', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '循环密钥多表移位', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-strong', type: 'summary' }, lineState: { annotation: { text: '远比凯撒坚固', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
