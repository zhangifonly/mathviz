/**
 * 地图投影与失真 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultMapProjectionsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const mapProjectionsScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { kind: 'mercator', heatmap: 'none' }, annotation: { text: '格陵兰看着和非洲差不多', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'mercator', heatmap: 'area' }, annotation: { text: '真实面积非洲是它 14 倍', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'mercator', heatmap: 'area' }, annotation: { text: '不是印错, 是几何代价', position: 'bottom' } } },
  { lineId: 'ip-1', sectionId: 'impossible', scene: { id: 'ip-1', type: 'animation' }, lineState: { params: { kind: 'mercator', heatmap: 'none' }, annotation: { text: '高斯绝妙定理', position: 'top' } } },
  { lineId: 'ip-2', sectionId: 'impossible', scene: { id: 'ip-2', type: 'animation' }, lineState: { params: { kind: 'orthographic', heatmap: 'none' }, annotation: { text: '球面曲率恒为 1, 不是零', position: 'bottom' } } },
  { lineId: 'ip-3', sectionId: 'impossible', scene: { id: 'ip-3', type: 'animation' }, lineState: { params: { kind: 'lambertCylindrical', heatmap: 'angle' }, annotation: { text: '保角就牺牲面积, 反之亦然', position: 'bottom' } } },
  { lineId: 'ts-1', sectionId: 'tissot', scene: { id: 'ts-1', type: 'animation' }, lineState: { params: { kind: 'mercator', heatmap: 'none' }, annotation: { text: '球面小圆投影成椭圆', position: 'top' } } },
  { lineId: 'ts-2', sectionId: 'tissot', scene: { id: 'ts-2', type: 'animation' }, lineState: { params: { kind: 'equirectangular', heatmap: 'none' }, annotation: { text: '半轴 h 沿经线, k 沿纬线', position: 'bottom' } } },
  { lineId: 'ts-3', sectionId: 'tissot', scene: { id: 'ts-3', type: 'animation' }, lineState: { params: { kind: 'mercator', heatmap: 'none' }, annotation: { text: '等角 ⟺ h=k, 椭圆是圆', position: 'bottom' } } },
  { lineId: 'mc-1', sectionId: 'mercator', scene: { id: 'mc-1', type: 'animation' }, lineState: { params: { kind: 'mercator', heatmap: 'angle' }, annotation: { text: '墨卡托椭圆全是圆', position: 'top' } } },
  { lineId: 'mc-2', sectionId: 'mercator', scene: { id: 'mc-2', type: 'animation' }, lineState: { params: { kind: 'mercator', heatmap: 'area', probeLat: 60 }, annotation: { text: '面积失真 = 1/cos²φ', position: 'bottom' } } },
  { lineId: 'mc-3', sectionId: 'mercator', scene: { id: 'mc-3', type: 'animation' }, lineState: { params: { kind: 'mercator', heatmap: 'area', probeLat: 72 }, annotation: { text: '北纬 72° 放大 10.47 倍', position: 'bottom' } } },
  { lineId: 'td-1', sectionId: 'tradeoff', scene: { id: 'td-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'lambertCylindrical', heatmap: 'area' }, annotation: { text: '兰伯特: 面积因子恒为 1', position: 'top' } } },
  { lineId: 'td-2', sectionId: 'tradeoff', scene: { id: 'td-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'lambertCylindrical', heatmap: 'angle' }, annotation: { text: '但椭圆被压成横条', position: 'bottom' } } },
  { lineId: 'td-3', sectionId: 'tradeoff', scene: { id: 'td-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'sinusoidal', heatmap: 'area' }, annotation: { text: '正弦投影网格是斜的', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '任何投影必然失真', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'Tissot 椭圆量化失真', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
