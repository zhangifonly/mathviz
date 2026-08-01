/**
 * 蔡氏电路吸引子 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultChuaAttractorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const chuaAttractorScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '洛伦兹 1963 在计算机里', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { alpha: 15.6 }, annotation: { text: '会不会是计算误差?', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { alpha: 15.6, showDiag: true }, annotation: { text: '1983 蔡少棠用面包板', position: 'bottom' } } },
  { lineId: 'dd-1', sectionId: 'diode', scene: { id: 'dd-1', type: 'animation' }, lineState: { params: { alpha: 15.6 }, annotation: { text: '伏安特性是一条折线', position: 'top' } } },
  { lineId: 'dd-2', sectionId: 'diode', scene: { id: 'dd-2', type: 'animation' }, lineState: { params: { alpha: 15.6 }, annotation: { text: '斜率为负: 有源器件', position: 'bottom' } } },
  { lineId: 'dd-3', sectionId: 'diode', scene: { id: 'dd-3', type: 'animation' }, lineState: { params: { alpha: 15.6 }, annotation: { text: '内段 −1.143 外段 −0.714', position: 'bottom' } } },
  { lineId: 'tw-1', sectionId: 'twoscroll', scene: { id: 'tw-1', type: 'animation' }, lineState: { params: { alpha: 15.6 }, annotation: { text: '两个螺旋涡卷', position: 'top' } } },
  { lineId: 'tw-2', sectionId: 'twoscroll', scene: { id: 'tw-2', type: 'animation' }, lineState: { params: { alpha: 15.6 }, annotation: { text: '跳转时机无规律', position: 'bottom' } } },
  { lineId: 'tw-3', sectionId: 'twoscroll', scene: { id: 'tw-3', type: 'animation' }, lineState: { params: { alpha: 18 }, annotation: { text: '涡卷中心是不稳定平衡点', position: 'bottom' } } },
  { lineId: 'dv-1', sectionId: 'divergence', scene: { id: 'dv-1', type: 'animation' }, lineState: { params: { alpha: 15.6, showDiag: true }, annotation: { text: '常说混沌系统耗散', position: 'top' } } },
  { lineId: 'dv-2', sectionId: 'divergence', scene: { id: 'dv-2', type: 'animation' }, lineState: { params: { alpha: 15.6, showDiag: true }, annotation: { text: '内段散度 +1.23: 膨胀', position: 'bottom' } } },
  { lineId: 'dv-3', sectionId: 'divergence', scene: { id: 'dv-3', type: 'animation' }, lineState: { params: { alpha: 15.6, showDiag: true }, annotation: { text: '外段 −5.46: 收缩交替', position: 'bottom' } } },
  { lineId: 'vf-1', sectionId: 'verify', scene: { id: 'vf-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { alpha: 15.6, showDiag: true }, annotation: { text: '看李雅普诺夫指数', position: 'top' } } },
  { lineId: 'vf-2', sectionId: 'verify', scene: { id: 'vf-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { alpha: 15.6, showDiag: true }, annotation: { text: '为正即混沌, 约 0.42', position: 'bottom' } } },
  { lineId: 'vf-3', sectionId: 'verify', scene: { id: 'vf-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { alpha: 10, showDiag: true }, annotation: { text: 'α=10 时为负, 不混沌', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '第一个物理混沌系统', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '散度内外段变号', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
