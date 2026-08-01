/**
 * 球面螺线 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSphericalSpiralState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sphericalSpiralScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '船长只有罗盘', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'loxodrome', param: 1.0 }, annotation: { text: '与所有经线夹角相同', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'loxodrome', param: 1.0 }, annotation: { text: '普通地图上是弯线', position: 'bottom' } } },
  { lineId: 'mc-1', sectionId: 'mercator', scene: { id: 'mc-1', type: 'animation' }, lineState: { params: { kind: 'loxodrome', param: 1.0 }, annotation: { text: '1569 年墨卡托投影', position: 'top' } } },
  { lineId: 'mc-2', sectionId: 'mercator', scene: { id: 'mc-2', type: 'animation' }, lineState: { params: { kind: 'loxodrome', param: 1.2 }, annotation: { text: '格陵兰被放大 14 倍', position: 'bottom' } } },
  { lineId: 'mc-3', sectionId: 'mercator', scene: { id: 'mc-3', type: 'animation' }, lineState: { params: { kind: 'loxodrome', param: 1.2 }, annotation: { text: '参数化里出现对数', position: 'bottom' } } },
  { lineId: 'cf-1', sectionId: 'confusion', scene: { id: 'cf-1', type: 'animation' }, lineState: { params: { kind: 'archimedean', param: 6 }, annotation: { text: '另一条常被误认', position: 'top' } } },
  { lineId: 'cf-2', sectionId: 'confusion', scene: { id: 'cf-2', type: 'animation' }, lineState: { params: { kind: 'archimedean', param: 6 }, annotation: { text: '绕圈均匀, 看着很像', position: 'bottom' } } },
  { lineId: 'cf-3', sectionId: 'confusion', scene: { id: 'cf-3', type: 'animation' }, lineState: { params: { kind: 'archimedean', param: 4 }, annotation: { text: '但夹角极差 17~32°', position: 'bottom' } } },
  { lineId: 'ln-1', sectionId: 'length', scene: { id: 'ln-1', type: 'animation' }, lineState: { params: { kind: 'loxodrome', param: 1.3 }, annotation: { text: '从北极绕到南极', position: 'top' } } },
  { lineId: 'ln-2', sectionId: 'length', scene: { id: 'ln-2', type: 'animation' }, lineState: { params: { kind: 'loxodrome', param: 1.4 }, annotation: { text: '越近极点圈越密', position: 'bottom' } } },
  { lineId: 'ln-3', sectionId: 'length', scene: { id: 'ln-3', type: 'animation' }, lineState: { params: { kind: 'loxodrome', param: 1.4 }, annotation: { text: '弧长却是 πR/sin β', position: 'bottom' } } },
  { lineId: 'cp-1', sectionId: 'compare', scene: { id: 'cp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'loxodrome', param: 1.0 }, annotation: { text: '等角航线读数不动', position: 'top' } } },
  { lineId: 'cp-2', sectionId: 'compare', scene: { id: 'cp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'archimedean', param: 8 }, annotation: { text: '阿基米德读数在变', position: 'bottom' } } },
  { lineId: 'cp-3', sectionId: 'compare', scene: { id: 'cp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'loxodrome', param: 1.45 }, annotation: { text: '夹角越小弧长越短', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '罗盘航向不变的航迹', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '绕无穷多圈弧长有限', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
