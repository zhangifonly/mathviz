/**
 * 鸽巢原理讲解场景配置
 * 每句口播对应一组鸽子数/巢数（params.items / params.holes）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPigeonholeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pigeonholeScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '鸽巢原理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-crowd', type: 'animation' }, lineState: { params: { items: 13, holes: 12 }, annotation: { text: '13只挤进12个巢', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-try', type: 'animation' }, lineState: { params: { items: 13, holes: 12 }, annotation: { text: '怎么摆都躲不开', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { items: 13, holes: 12 }, annotation: { text: '这就是鸽巢原理', position: 'bottom' } } },

  // ===== principle (3) =====
  { lineId: 'prin-1', sectionId: 'principle', scene: { id: 'prin-more', type: 'animation' }, lineState: { params: { items: 5, holes: 4 }, annotation: { text: '物品比抽屉多', position: 'top' } } },
  { lineId: 'prin-2', sectionId: 'principle', scene: { id: 'prin-ceil', type: 'animation' }, lineState: { params: { items: 10, holes: 3 }, annotation: { text: '至少 ⌈n/m⌉ 个', position: 'bottom' } } },
  { lineId: 'prin-3', sectionId: 'principle', scene: { id: 'prin-two', type: 'animation' }, lineState: { params: { items: 13, holes: 12 }, annotation: { text: '⌈13/12⌉=2', position: 'bottom' } } },

  // ===== general (3) =====
  { lineId: 'gen-1', sectionId: 'general', scene: { id: 'gen-n1', type: 'animation' }, lineState: { params: { items: 8, holes: 7 }, annotation: { text: 'n+1 物 n 抽屉', position: 'top' } } },
  { lineId: 'gen-2', sectionId: 'general', scene: { id: 'gen-dense', type: 'animation' }, lineState: { params: { items: 20, holes: 6 }, annotation: { text: '越少巢越拥挤', position: 'bottom' } } },
  { lineId: 'gen-3', sectionId: 'general', scene: { id: 'gen-tool', type: 'animation' }, lineState: { params: { items: 20, holes: 6 }, annotation: { text: '有力的证明工具', position: 'bottom' } } },

  // ===== apply (2) =====
  { lineId: 'app-1', sectionId: 'apply', scene: { id: 'app-birthday', type: 'animation' }, lineState: { params: { items: 13, holes: 12 }, annotation: { text: '生日同月', position: 'top' } } },
  { lineId: 'app-2', sectionId: 'apply', scene: { id: 'app-handshake', type: 'animation' }, lineState: { params: { items: 10, holes: 9 }, annotation: { text: '握手问题', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-adjust', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { items: 20, holes: 6 }, annotation: { text: '调整鸽子与巢', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-collide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { items: 13, holes: 12 }, annotation: { text: '碰撞必然发生', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '多则必挤', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-nec', type: 'summary' }, lineState: { annotation: { text: '数学的必然性', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '我们下次再见！', position: 'bottom' } } },
]
