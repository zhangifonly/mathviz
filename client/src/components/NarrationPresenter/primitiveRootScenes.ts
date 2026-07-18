/**
 * 原根讲解场景配置
 * 每句口播对应底数 g 与素数 p（params.g / params.p）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPrimitiveRootState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const primitiveRootScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '原根', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-jump', type: 'animation' }, lineState: { params: { g: 3, p: 7 }, annotation: { text: '在圆环上跳跃', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-compare', type: 'animation' }, lineState: { params: { g: 2, p: 7 }, annotation: { text: '有的只打转', position: 'bottom' } } },

  // ===== cycle (3) =====
  { lineId: 'cyc-1', sectionId: 'cycle', scene: { id: 'cyc-power', type: 'animation' }, lineState: { params: { g: 3, p: 7 }, annotation: { text: '幂会周期重复', position: 'top' } } },
  { lineId: 'cyc-2', sectionId: 'cycle', scene: { id: 'cyc-fermat', type: 'animation' }, lineState: { params: { g: 3, p: 7 }, annotation: { text: 'g^(p-1)=1', position: 'bottom' } } },
  { lineId: 'cyc-3', sectionId: 'cycle', scene: { id: 'cyc-order', type: 'animation' }, lineState: { params: { g: 2, p: 7 }, annotation: { text: '轨迹长度=阶', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-root', type: 'animation' }, lineState: { params: { g: 3, p: 7 }, annotation: { text: '遍历全部余数', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-gen', type: 'animation' }, lineState: { params: { g: 5, p: 7 }, annotation: { text: '生成元', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-sub', type: 'animation' }, lineState: { params: { g: 2, p: 7 }, annotation: { text: '非原根落入子群', position: 'bottom' } } },

  // ===== dlog (2) =====
  { lineId: 'dlog-1', sectionId: 'dlog', scene: { id: 'dlog-write', type: 'animation' }, lineState: { params: { g: 2, p: 11 }, annotation: { text: '皆可写成 g 的幂', position: 'top' } } },
  { lineId: 'dlog-2', sectionId: 'dlog', scene: { id: 'dlog-crypto', type: 'animation' }, lineState: { params: { g: 2, p: 11 }, annotation: { text: '密码学基石', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-explore', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { g: 6, p: 13 }, annotation: { text: '换 p 与 g', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-color', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { g: 4, p: 13 }, annotation: { text: '蓝=原根 红=子群', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '生成元', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-link', type: 'summary' }, lineState: { annotation: { text: '连接密码学', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
