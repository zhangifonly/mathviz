/**
 * 洛伦兹84大气模型 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultLorenzAtmosphereState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lorenzAtmosphereScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '1963 版含义抽象', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { F: 8 }, annotation: { text: 'X 是西风急流强度', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { F: 8, showDiag: true }, annotation: { text: 'F 对应季节, G 对应海陆', position: 'bottom' } } },
  { lineId: 'wf-1', sectionId: 'waveflow', scene: { id: 'wf-1', type: 'animation' }, lineState: { params: { F: 8 }, annotation: { text: '−(Y²+Z²) 是涡旋能量', position: 'top' } } },
  { lineId: 'wf-2', sectionId: 'waveflow', scene: { id: 'wf-2', type: 'animation' }, lineState: { params: { F: 8 }, annotation: { text: '涡旋消耗西风动能', position: 'bottom' } } },
  { lineId: 'wf-3', sectionId: 'waveflow', scene: { id: 'wf-3', type: 'animation' }, lineState: { params: { F: 8 }, annotation: { text: 'X·Y 与 X·Z: 西风驱动涡旋', position: 'bottom' } } },
  { lineId: 'dv-1', sectionId: 'divergence', scene: { id: 'dv-1', type: 'animation' }, lineState: { params: { F: 8, showDiag: true }, annotation: { text: '散度 = −a−2+2X', position: 'top' } } },
  { lineId: 'dv-2', sectionId: 'divergence', scene: { id: 'dv-2', type: 'animation' }, lineState: { params: { F: 8, showDiag: true }, annotation: { text: '临界 X=1.125', position: 'bottom' } } },
  { lineId: 'dv-3', sectionId: 'divergence', scene: { id: 'dv-3', type: 'animation' }, lineState: { params: { F: 8, showDiag: true }, annotation: { text: '与蔡氏同一机制', position: 'bottom' } } },
  { lineId: 'bl-1', sectionId: 'blocking', scene: { id: 'bl-1', type: 'animation' }, lineState: { params: { F: 8 }, annotation: { text: 'X 在强弱间不规则切换', position: 'top' } } },
  { lineId: 'bl-2', sectionId: 'blocking', scene: { id: 'bl-2', type: 'animation' }, lineState: { params: { F: 8 }, annotation: { text: '弱西风 = 阻塞高压', position: 'bottom' } } },
  { lineId: 'bl-3', sectionId: 'blocking', scene: { id: 'bl-3', type: 'animation' }, lineState: { params: { F: 8, showDiag: true }, annotation: { text: '这是预报期限的根源', position: 'bottom' } } },
  { lineId: 'ss-1', sectionId: 'season', scene: { id: 'ss-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { F: 6, showDiag: true }, annotation: { text: 'F=6 夏季, λ₁≈0.002', position: 'top' } } },
  { lineId: 'ss-2', sectionId: 'season', scene: { id: 'ss-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { F: 8, showDiag: true }, annotation: { text: 'F=8 冬季, λ₁≈0.142', position: 'bottom' } } },
  { lineId: 'ss-3', sectionId: 'season', scene: { id: 'ss-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { F: 9, showDiag: true }, annotation: { text: '但 F=9 反而转负', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '三变量都有气象含义', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '混沌强度非单调', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
