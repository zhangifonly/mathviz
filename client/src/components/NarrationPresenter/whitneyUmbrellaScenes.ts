/**
 * 惠特尼伞 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultWhitneyUmbrellaState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const whitneyUmbrellaScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '映射会出什么毛病', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { scale: 1 }, annotation: { text: '惠特尼 1944 的分类', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { scale: 1 }, annotation: { text: '只有两类稳定奇点', position: 'bottom' } } },
  { lineId: 'mp-1', sectionId: 'map', scene: { id: 'mp-1', type: 'animation' }, lineState: { params: { scale: 1 }, annotation: { text: '(u,v) ↦ (uv, u, v²)', position: 'top' } } },
  { lineId: 'mp-2', sectionId: 'map', scene: { id: 'mp-2', type: 'animation' }, lineState: { params: { scale: 1 }, annotation: { text: '隐式: x² = y²z', position: 'bottom' } } },
  { lineId: 'mp-3', sectionId: 'map', scene: { id: 'mp-3', type: 'animation' }, lineState: { params: { scale: 1.3 }, annotation: { text: 'z ≥ 0, 只在上半空间', position: 'bottom' } } },
  { lineId: 'sc-1', sectionId: 'selfcross', scene: { id: 'sc-1', type: 'animation' }, lineState: { params: { scale: 1.3 }, annotation: { text: '取 u = 0', position: 'top' } } },
  { lineId: 'sc-2', sectionId: 'selfcross', scene: { id: 'sc-2', type: 'animation' }, lineState: { params: { scale: 1.3 }, annotation: { text: 'v 与 −v 给出同一点', position: 'bottom' } } },
  { lineId: 'sc-3', sectionId: 'selfcross', scene: { id: 'sc-3', type: 'animation' }, lineState: { params: { scale: 1.3 }, annotation: { text: '自交线在 z 轴正半轴', position: 'bottom' } } },
  { lineId: 'jc-1', sectionId: 'jacobian', scene: { id: 'jc-1', type: 'animation' }, lineState: { params: { scale: 1 }, annotation: { text: '自交不等于奇点', position: 'top' } } },
  { lineId: 'jc-2', sectionId: 'jacobian', scene: { id: 'jc-2', type: 'animation' }, lineState: { params: { scale: 1 }, annotation: { text: '浸入的判据: 雅可比满秩', position: 'bottom' } } },
  { lineId: 'jc-3', sectionId: 'jacobian', scene: { id: 'jc-3', type: 'animation' }, lineState: { params: { scale: 0.75 }, annotation: { text: '原点秩掉到 1', position: 'bottom' } } },
  { lineId: 'ds-1', sectionId: 'distinguish', scene: { id: 'ds-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 0.75 }, annotation: { text: '看两片的夹角', position: 'top' } } },
  { lineId: 'ds-2', sectionId: 'distinguish', scene: { id: 'ds-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 0.7 }, annotation: { text: '靠近伞点夹角变小', position: 'bottom' } } },
  { lineId: 'ds-3', sectionId: 'distinguish', scene: { id: 'ds-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 1.5 }, annotation: { text: '横截自交夹角有限', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '只有两类稳定奇点', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '原点雅可比退化', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
