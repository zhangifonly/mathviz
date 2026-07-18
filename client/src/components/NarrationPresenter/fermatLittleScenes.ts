/**
 * 费马小定理讲解场景配置
 * 每句口播对应幂表的模数 p 与高亮底数 a（params.p / params.a）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFermatLittleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const fermatLittleScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '费马小定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-power', type: 'animation' }, lineState: { params: { p: 5, a: 2 }, annotation: { text: '反复自乘再取余', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-fingerprint', type: 'animation' }, lineState: { params: { p: 5, a: 2 }, annotation: { text: '末列回到 1', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-thm', type: 'animation' }, lineState: { params: { p: 7, a: 3 }, annotation: { text: 'a^(p-1)≡1', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-alt', type: 'animation' }, lineState: { params: { p: 7, a: 3 }, annotation: { text: 'a^p≡a', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-history', type: 'animation' }, lineState: { params: { p: 7, a: 5 }, annotation: { text: '费马 1640', position: 'bottom' } } },

  // ===== cycle (3) =====
  { lineId: 'cyc-1', sectionId: 'cycle', scene: { id: 'cyc-table', type: 'animation' }, lineState: { params: { p: 11, a: 2 }, annotation: { text: '每行一个底数', position: 'top' } } },
  { lineId: 'cyc-2', sectionId: 'cycle', scene: { id: 'cyc-loop', type: 'animation' }, lineState: { params: { p: 11, a: 2 }, annotation: { text: '余数循环往复', position: 'bottom' } } },
  { lineId: 'cyc-3', sectionId: 'cycle', scene: { id: 'cyc-order', type: 'animation' }, lineState: { params: { p: 11, a: 6 }, annotation: { text: '阶整除 p-1', position: 'bottom' } } },

  // ===== test (3) =====
  { lineId: 'test-1', sectionId: 'test', scene: { id: 'test-fail', type: 'animation' }, lineState: { params: { p: 13, a: 2 }, annotation: { text: '≠1 则非素数', position: 'top' } } },
  { lineId: 'test-2', sectionId: 'test', scene: { id: 'test-fast', type: 'animation' }, lineState: { params: { p: 13, a: 4 }, annotation: { text: '瞬间筛合数', position: 'bottom' } } },
  { lineId: 'test-3', sectionId: 'test', scene: { id: 'test-carmichael', type: 'animation' }, lineState: { params: { p: 13, a: 7 }, annotation: { text: '561 骗过测试', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-p', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 11, a: 3 }, annotation: { text: '换素数 p', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-a', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 11, a: 8 }, annotation: { text: '拖动底数 a', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '循环之美', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-crypto', type: 'summary' }, lineState: { annotation: { text: '密码学基石', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
