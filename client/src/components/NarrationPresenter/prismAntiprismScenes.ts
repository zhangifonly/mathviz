/**
 * 棱柱与反棱柱 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultPrismAntiprismState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const prismAntiprismScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '阿基米德立体十三种', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'prism', n: 6 }, annotation: { text: '附注: 不含棱柱与反棱柱', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'antiprism', n: 6 }, annotation: { text: '因为它们各有无穷多个', position: 'bottom' } } },
  { lineId: 'pr-1', sectionId: 'prism', scene: { id: 'pr-1', type: 'animation' }, lineState: { params: { kind: 'prism', n: 6 }, annotation: { text: '上下底面 + 长方形侧面', position: 'top' } } },
  { lineId: 'pr-2', sectionId: 'prism', scene: { id: 'pr-2', type: 'animation' }, lineState: { params: { kind: 'prism', n: 8 }, annotation: { text: '高度须等于底面边长', position: 'bottom' } } },
  { lineId: 'pr-3', sectionId: 'prism', scene: { id: 'pr-3', type: 'animation' }, lineState: { params: { kind: 'prism', n: 5 }, annotation: { text: 'V=2n, E=3n, F=n+2', position: 'bottom' } } },
  { lineId: 'ap-1', sectionId: 'antiprism', scene: { id: 'ap-1', type: 'animation' }, lineState: { params: { kind: 'antiprism', n: 6 }, annotation: { text: '上底面转过 π/n', position: 'top' } } },
  { lineId: 'ap-2', sectionId: 'antiprism', scene: { id: 'ap-2', type: 'animation' }, lineState: { params: { kind: 'antiprism', n: 6 }, annotation: { text: '侧面被分成三角形', position: 'bottom' } } },
  { lineId: 'ap-3', sectionId: 'antiprism', scene: { id: 'ap-3', type: 'animation' }, lineState: { params: { kind: 'antiprism', n: 8 }, annotation: { text: '高度由勾股定理定', position: 'bottom' } } },
  { lineId: 'dg-1', sectionId: 'degenerate', scene: { id: 'dg-1', type: 'animation' }, lineState: { params: { kind: 'prism', n: 4 }, annotation: { text: '棱柱取 n=4 会怎样?', position: 'top' } } },
  { lineId: 'dg-2', sectionId: 'degenerate', scene: { id: 'dg-2', type: 'animation' }, lineState: { params: { kind: 'prism', n: 4 }, annotation: { text: '六个正方形 = 立方体', position: 'bottom' } } },
  { lineId: 'dg-3', sectionId: 'degenerate', scene: { id: 'dg-3', type: 'animation' }, lineState: { params: { kind: 'antiprism', n: 3 }, annotation: { text: '反棱柱 n=3 = 正八面体', position: 'bottom' } } },
  { lineId: 'vl-1', sectionId: 'volume', scene: { id: 'vl-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'prism', n: 3 }, annotation: { text: '边数加大体积怎么变?', position: 'top' } } },
  { lineId: 'vl-2', sectionId: 'volume', scene: { id: 'vl-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'prism', n: 4 }, annotation: { text: 'n=4 时体积最大', position: 'bottom' } } },
  { lineId: 'vl-3', sectionId: 'volume', scene: { id: 'vl-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'prism', n: 12 }, annotation: { text: '之后被压成薄片', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '两族各有无穷多个', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '错开 π/n 是关键', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
