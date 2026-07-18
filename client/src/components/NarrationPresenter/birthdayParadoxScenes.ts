/**
 * 生日悖论讲解场景配置
 * 每句口播对应高亮人数（params.n）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBirthdayParadoxState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const birthdayParadoxScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '生日悖论', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-doubt', type: 'animation' }, lineState: { params: { n: 23 }, annotation: { text: '一年 365 天', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-half', type: 'animation' }, lineState: { params: { n: 23 }, annotation: { text: '竟然过半！', position: 'bottom' } } },

  // ===== counter (3) =====
  { lineId: 'cnt-1', sectionId: 'counter', scene: { id: 'cnt-self', type: 'animation' }, lineState: { params: { n: 10 }, annotation: { text: '和我同天？很难', position: 'top' } } },
  { lineId: 'cnt-2', sectionId: 'counter', scene: { id: 'cnt-pairs', type: 'animation' }, lineState: { params: { n: 23 }, annotation: { text: '23 人 = 253 对', position: 'bottom' } } },
  { lineId: 'cnt-3', sectionId: 'counter', scene: { id: 'cnt-many', type: 'animation' }, lineState: { params: { n: 41 }, annotation: { text: '配对越多越易撞', position: 'bottom' } } },

  // ===== complement (3) =====
  { lineId: 'cmp-1', sectionId: 'complement', scene: { id: 'cmp-distinct', type: 'animation' }, lineState: { params: { n: 23 }, annotation: { text: '先算都不同', position: 'top' } } },
  { lineId: 'cmp-2', sectionId: 'complement', scene: { id: 'cmp-product', type: 'animation' }, lineState: { params: { n: 41 }, annotation: { text: '连乘越来越小', position: 'bottom' } } },
  { lineId: 'cmp-3', sectionId: 'complement', scene: { id: 'cmp-one-minus', type: 'animation' }, lineState: { params: { n: 41 }, annotation: { text: '1 减去它', position: 'bottom' } } },

  // ===== result (2) =====
  { lineId: 'res-1', sectionId: 'result', scene: { id: 'res-23', type: 'animation' }, lineState: { params: { n: 23 }, annotation: { text: 'n=23 约 50.7%', position: 'top' } } },
  { lineId: 'res-2', sectionId: 'result', scene: { id: 'res-70', type: 'animation' }, lineState: { params: { n: 70 }, annotation: { text: 'n=70 约 99.9%', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slider', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 57 }, annotation: { text: '拖动看曲线', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-sim', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 23 }, annotation: { text: '模拟贴合理论', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-pairs', type: 'summary' }, lineState: { annotation: { text: '比较所有配对', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-complement', type: 'summary' }, lineState: { annotation: { text: '补事件求解', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
