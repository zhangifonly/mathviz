/**
 * 直纹曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultRuledSurfacesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const ruledSurfacesScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '直筷子能摆出弯面吗', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'cylinder', showRulings: true, surfaceAlpha: 0.5 }, annotation: { text: '准线 + 方向', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'cylinder', showRulings: true, surfaceAlpha: 0.5 }, annotation: { text: '固定 u 必得一条直线', position: 'bottom' } } },
  { lineId: 'sp-1', sectionId: 'simple', scene: { id: 'sp-1', type: 'animation' }, lineState: { params: { kind: 'cylinder', showRulings: true, surfaceAlpha: 0.5 }, annotation: { text: '圆柱: 方向恒竖直', position: 'top' } } },
  { lineId: 'sp-2', sectionId: 'simple', scene: { id: 'sp-2', type: 'animation' }, lineState: { params: { kind: 'cone', showRulings: true, surfaceAlpha: 0.5 }, annotation: { text: '圆锥: 共顶点', position: 'bottom' } } },
  { lineId: 'sp-3', sectionId: 'simple', scene: { id: 'sp-3', type: 'animation' }, lineState: { params: { kind: 'cone', showRulings: true, showDet: true, surfaceAlpha: 0.5 }, annotation: { text: '这两种能摊平', position: 'bottom' } } },
  { lineId: 'nd-1', sectionId: 'notdev', scene: { id: 'nd-1', type: 'animation' }, lineState: { params: { kind: 'helicoid', showRulings: true, surfaceAlpha: 0.5 }, annotation: { text: '不是都能摊平', position: 'top' } } },
  { lineId: 'nd-2', sectionId: 'notdev', scene: { id: 'nd-2', type: 'animation' }, lineState: { params: { kind: 'helicoid', showRulings: true, showDet: true, surfaceAlpha: 0.5 }, annotation: { text: '螺旋面 K<0, 压不平', position: 'bottom' } } },
  { lineId: 'nd-3', sectionId: 'notdev', scene: { id: 'nd-3', type: 'animation' }, lineState: { params: { kind: 'hyperboloid', showRulings: true, showDet: true, surfaceAlpha: 0.5 }, annotation: { text: '双曲面甚至有两族', position: 'bottom' } } },
  { lineId: 'cr-1', sectionId: 'criterion', scene: { id: 'cr-1', type: 'animation' }, lineState: { params: { kind: 'cylinder', showDet: true }, annotation: { text: '三向量排成行列式', position: 'top' } } },
  { lineId: 'cr-2', sectionId: 'criterion', scene: { id: 'cr-2', type: 'animation' }, lineState: { params: { kind: 'cone', showDet: true }, annotation: { text: '恒为零则可展', position: 'bottom' } } },
  { lineId: 'cr-3', sectionId: 'criterion', scene: { id: 'cr-3', type: 'animation' }, lineState: { params: { kind: 'helicoid', showDet: true }, annotation: { text: '圆柱圆锥精确为零', position: 'bottom' } } },
  { lineId: 'mb-1', sectionId: 'mobius', scene: { id: 'mb-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'mobius', showRulings: true, surfaceAlpha: 0.55 }, annotation: { text: '莫比乌斯带也是直纹面', position: 'top' } } },
  { lineId: 'mb-2', sectionId: 'mobius', scene: { id: 'mb-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'mobius', showRulings: true, surfaceAlpha: 0.55 }, annotation: { text: '绕一周方向翻半圈', position: 'bottom' } } },
  { lineId: 'mb-3', sectionId: 'mobius', scene: { id: 'mb-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'mobius', showRulings: true, surfaceAlpha: 0.55 }, annotation: { text: '走两圈才复原', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '准线加方向即可构造', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '直纹 ≠ 可展', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
