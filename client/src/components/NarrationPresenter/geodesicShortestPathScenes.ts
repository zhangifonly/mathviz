/**
 * 球面测地线 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultGeodesicShortestPathState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const geodesicShortestPathScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { pairIndex: 0 }, annotation: { text: '航线明显向北弯', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { pairIndex: 0 }, annotation: { text: '两城纬度都在 40° 左右', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { pairIndex: 0 }, annotation: { text: '平面地图骗了你', position: 'bottom' } } },
  { lineId: 'cp-1', sectionId: 'compare', scene: { id: 'cp-1', type: 'animation' }, lineState: { params: { pairIndex: 0 }, annotation: { text: '沿纬线: cos(纬度)×经度差', position: 'top' } } },
  { lineId: 'cp-2', sectionId: 'compare', scene: { id: 'cp-2', type: 'animation' }, lineState: { params: { pairIndex: 0 }, annotation: { text: '大圆 10990km vs 纬线 14384km', position: 'bottom' } } },
  { lineId: 'cp-3', sectionId: 'compare', scene: { id: 'cp-3', type: 'animation' }, lineState: { params: { pairIndex: 0 }, annotation: { text: '多飞 31%, 白费四小时', position: 'bottom' } } },
  { lineId: 'nt-1', sectionId: 'north', scene: { id: 'nt-1', type: 'animation' }, lineState: { params: { pairIndex: 3 }, annotation: { text: '纬线长度随纬度收缩', position: 'top' } } },
  { lineId: 'nt-2', sectionId: 'north', scene: { id: 'nt-2', type: 'animation' }, lineState: { params: { pairIndex: 3 }, annotation: { text: '赤道 4 万, 北纬 60° 只剩 2 万', position: 'bottom' } } },
  { lineId: 'nt-3', sectionId: 'north', scene: { id: 'nt-3', type: 'animation' }, lineState: { params: { pairIndex: 0 }, annotation: { text: '航线最高纬 83.9°', position: 'bottom' } } },
  { lineId: 'cv-1', sectionId: 'curvature', scene: { id: 'cv-1', type: 'animation' }, lineState: { params: { pairIndex: 1 }, annotation: { text: '测地曲率为零才算直', position: 'top' } } },
  { lineId: 'cv-2', sectionId: 'curvature', scene: { id: 'cv-2', type: 'animation' }, lineState: { params: { pairIndex: 1 }, annotation: { text: '大圆弧精确为 0', position: 'bottom' } } },
  { lineId: 'cv-3', sectionId: 'curvature', scene: { id: 'cv-3', type: 'animation' }, lineState: { params: { pairIndex: 2 }, annotation: { text: '45° 纬线为 1, 60° 为 √3', position: 'bottom' } } },
  { lineId: 'dt-1', sectionId: 'detour', scene: { id: 'dt-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pairIndex: 0, detour: 0.2 }, annotation: { text: '把中点朝侧向推开', position: 'top' } } },
  { lineId: 'dt-2', sectionId: 'detour', scene: { id: 'dt-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pairIndex: 0, detour: 0.6 }, annotation: { text: '偏移越大路径越长', position: 'bottom' } } },
  { lineId: 'dt-3', sectionId: 'detour', scene: { id: 'dt-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pairIndex: 1 }, annotation: { text: '对径点例外: 无穷多条等长', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '大圆弧最短', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '测地曲率为零', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
