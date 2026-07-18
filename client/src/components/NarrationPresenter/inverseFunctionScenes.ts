/**
 * 反函数讲解场景配置
 * 每句口播对应一个函数 key（params.fnKey），决定画哪条曲线。
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultInverseFunctionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const inverseFunctionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '反函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-back', type: 'animation' }, lineState: { params: { fnKey: 'linear' }, annotation: { text: '能找回输入吗？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { fnKey: 'linear' }, annotation: { text: '把输出送回输入', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-compose', type: 'animation' }, lineState: { params: { fnKey: 'linear' }, annotation: { text: 'f 后 g 回原点', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-roundtrip', type: 'animation' }, lineState: { params: { fnKey: 'linear' }, annotation: { text: 'g(f(x)) = x', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-example', type: 'animation' }, lineState: { params: { fnKey: 'linear' }, annotation: { text: '乘二加一的反', position: 'bottom' } } },

  // ===== symmetry (3) =====
  { lineId: 'sym-1', sectionId: 'symmetry', scene: { id: 'sym-swap', type: 'animation' }, lineState: { params: { fnKey: 'cube' }, annotation: { text: '交换横纵坐标', position: 'top' } } },
  { lineId: 'sym-2', sectionId: 'symmetry', scene: { id: 'sym-point', type: 'animation' }, lineState: { params: { fnKey: 'cube' }, annotation: { text: '(a,b) 到 (b,a)', position: 'bottom' } } },
  { lineId: 'sym-3', sectionId: 'symmetry', scene: { id: 'sym-mirror', type: 'animation' }, lineState: { params: { fnKey: 'exp' }, annotation: { text: '关于 y=x 镜像', position: 'bottom' } } },

  // ===== monotone (3) =====
  { lineId: 'mono-1', sectionId: 'monotone', scene: { id: 'mono-unique', type: 'animation' }, lineState: { params: { fnKey: 'exp' }, annotation: { text: '输出对应唯一输入', position: 'top' } } },
  { lineId: 'mono-2', sectionId: 'monotone', scene: { id: 'mono-hline', type: 'animation' }, lineState: { params: { fnKey: 'exp' }, annotation: { text: '水平线检验', position: 'bottom' } } },
  { lineId: 'mono-3', sectionId: 'monotone', scene: { id: 'mono-strict', type: 'animation' }, lineState: { params: { fnKey: 'sqrt' }, annotation: { text: '单调才可逆', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnKey: 'sqrt' }, annotation: { text: '切换函数看镜像', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-pair', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnKey: 'cube' }, annotation: { text: '对称点对', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '交换输入输出', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-symmetry', type: 'summary' }, lineState: { annotation: { text: '关于 y=x 对称', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
