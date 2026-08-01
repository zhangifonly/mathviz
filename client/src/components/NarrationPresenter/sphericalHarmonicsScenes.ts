/**
 * 球谐函数 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSphericalHarmonicsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sphericalHarmonicsScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '弦振动分解成正弦波', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { l: 3, m: 2 }, annotation: { text: '球面也有振动模态', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { l: 4, m: 3 }, annotation: { text: '从原子到宇宙都用它', position: 'bottom' } } },
  { lineId: 'qt-1', sectionId: 'quantum', scene: { id: 'qt-1', type: 'animation' }, lineState: { params: { l: 1, m: 0 }, annotation: { text: 'l: 角量子数', position: 'top' } } },
  { lineId: 'qt-2', sectionId: 'quantum', scene: { id: 'qt-2', type: 'animation' }, lineState: { params: { l: 3, m: 3 }, annotation: { text: 'm: 磁量子数, |m| ≤ l', position: 'bottom' } } },
  { lineId: 'qt-3', sectionId: 'quantum', scene: { id: 'qt-3', type: 'animation' }, lineState: { params: { l: 2, m: 0 }, annotation: { text: 's/p/d/f = l 为 0/1/2/3', position: 'bottom' } } },
  { lineId: 'nd-1', sectionId: 'nodal', scene: { id: 'nd-1', type: 'animation' }, lineState: { params: { l: 3, m: 1, showInfo: true }, annotation: { text: '半径 = |Y|', position: 'top' } } },
  { lineId: 'nd-2', sectionId: 'nodal', scene: { id: 'nd-2', type: 'animation' }, lineState: { params: { l: 3, m: 1, showInfo: true }, annotation: { text: '红蓝交界即节线', position: 'bottom' } } },
  { lineId: 'nd-3', sectionId: 'nodal', scene: { id: 'nd-3', type: 'animation' }, lineState: { params: { l: 4, m: 2, showInfo: true }, annotation: { text: '纬向 l−|m|, 经向 |m|', position: 'bottom' } } },
  { lineId: 'or-1', sectionId: 'ortho', scene: { id: 'or-1', type: 'animation' }, lineState: { params: { l: 2, m: 1, showInfo: true }, annotation: { text: '不同模态内积为零', position: 'top' } } },
  { lineId: 'or-2', sectionId: 'ortho', scene: { id: 'or-2', type: 'animation' }, lineState: { params: { l: 2, m: 1, showInfo: true }, annotation: { text: '与自身内积恰为一', position: 'bottom' } } },
  { lineId: 'or-3', sectionId: 'ortho', scene: { id: 'or-3', type: 'animation' }, lineState: { params: { l: 5, m: 3, showInfo: true }, annotation: { text: '这是傅里叶展开的前提', position: 'bottom' } } },
  { lineId: 'ap-1', sectionId: 'apply', scene: { id: 'ap-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { l: 0, m: 0, showInfo: true }, annotation: { text: 'l=0: s 轨道, 正球', position: 'top' } } },
  { lineId: 'ap-2', sectionId: 'apply', scene: { id: 'ap-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { l: 1, m: 0, showInfo: true }, annotation: { text: 'l=1 m=0: p_z 轨道', position: 'bottom' } } },
  { lineId: 'ap-3', sectionId: 'apply', scene: { id: 'ap-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { l: 2, m: 2, showInfo: true }, annotation: { text: 'l=2 m=2: d 轨道四叶', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '球面上的振动模态', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '节线总数恒为 l', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
