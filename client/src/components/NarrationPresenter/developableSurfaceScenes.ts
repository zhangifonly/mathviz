/**
 * 可展曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultDevelopableSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const developableSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '纸能卷成筒不能贴成球', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'cylinder', showRulings: true, surfaceAlpha: 0.55 }, annotation: { text: '工程上极其重要', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'cylinder', showRulings: true, surfaceAlpha: 0.55 }, annotation: { text: '答案: 只有三类', position: 'bottom' } } },
  { lineId: 'th-1', sectionId: 'three', scene: { id: 'th-1', type: 'animation' }, lineState: { params: { kind: 'cylinder', showRulings: true, surfaceAlpha: 0.5 }, annotation: { text: '柱面: 平行直线族', position: 'top' } } },
  { lineId: 'th-2', sectionId: 'three', scene: { id: 'th-2', type: 'animation' }, lineState: { params: { kind: 'cone', showRulings: true, surfaceAlpha: 0.5 }, annotation: { text: '锥面: 全过同一顶点', position: 'bottom' } } },
  { lineId: 'th-3', sectionId: 'three', scene: { id: 'th-3', type: 'animation' }, lineState: { params: { kind: 'tangent', showRulings: true, surfaceAlpha: 0.5 }, annotation: { text: '切线面: 曲线的切线族', position: 'bottom' } } },
  { lineId: 'cr-1', sectionId: 'criterion', scene: { id: 'cr-1', type: 'animation' }, lineState: { params: { kind: 'tangent', showCriteria: true }, annotation: { text: '三向量排成行列式', position: 'top' } } },
  { lineId: 'cr-2', sectionId: 'criterion', scene: { id: 'cr-2', type: 'animation' }, lineState: { params: { kind: 'cylinder', showCriteria: true }, annotation: { text: '恒零即可展', position: 'bottom' } } },
  { lineId: 'cr-3', sectionId: 'criterion', scene: { id: 'cr-3', type: 'animation' }, lineState: { params: { kind: 'cone', showCriteria: true }, annotation: { text: '两条判据结论一致', position: 'bottom' } } },
  { lineId: 'nd-1', sectionId: 'notdev', scene: { id: 'nd-1', type: 'animation' }, lineState: { params: { kind: 'nondev', showRulings: true, surfaceAlpha: 0.55 }, annotation: { text: '反例: 螺旋面', position: 'top' } } },
  { lineId: 'nd-2', sectionId: 'notdev', scene: { id: 'nd-2', type: 'animation' }, lineState: { params: { kind: 'nondev', showCriteria: true, showRulings: true, surfaceAlpha: 0.55 }, annotation: { text: 'det=0.33, K=4.87', position: 'bottom' } } },
  { lineId: 'nd-3', sectionId: 'notdev', scene: { id: 'nd-3', type: 'animation' }, lineState: { params: { kind: 'nondev', showCriteria: true }, annotation: { text: '直纹 ≠ 可展', position: 'bottom' } } },
  { lineId: 'ap-1', sectionId: 'apply', scene: { id: 'ap-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'cylinder', showCriteria: true }, annotation: { text: '四种曲面依次切换', position: 'top' } } },
  { lineId: 'ap-2', sectionId: 'apply', scene: { id: 'ap-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'cone', showCriteria: true }, annotation: { text: '船体外板用平钢板压制', position: 'bottom' } } },
  { lineId: 'ap-3', sectionId: 'apply', scene: { id: 'ap-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'tangent', showCriteria: true }, annotation: { text: '服装先在平面裁片', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '只有三类可展曲面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '两条判据必然一致', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
