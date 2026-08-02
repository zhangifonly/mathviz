/**
 * 球面二角形 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSphericalLuneState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sphericalLuneScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { mode: 'lune', alpha: 1.5708 }, annotation: { text: '平面上最少三条边', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { mode: 'lune', alpha: 1.5708 }, annotation: { text: '两大圆交于对径两点', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { mode: 'lune', alpha: 1.0472 }, annotation: { text: '夹出的月牙叫二角形', position: 'bottom' } } },
  { lineId: 'ar-1', sectionId: 'area', scene: { id: 'ar-1', type: 'animation' }, lineState: { params: { mode: 'lune', alpha: 0.7854 }, annotation: { text: '面积 = 2α', position: 'top' } } },
  { lineId: 'ar-2', sectionId: 'area', scene: { id: 'ar-2', type: 'animation' }, lineState: { params: { mode: 'lune', alpha: 2.6 }, annotation: { text: 'α 转满 2π 扫过整个球面', position: 'bottom' } } },
  { lineId: 'ar-3', sectionId: 'area', scene: { id: 'ar-3', type: 'animation' }, lineState: { params: { mode: 'lune', alpha: 1.5708 }, annotation: { text: '故面积/4π = α/2π', position: 'bottom' } } },
  { lineId: 'ck-1', sectionId: 'check', scene: { id: 'ck-1', type: 'animation' }, lineState: { params: { mode: 'lune', alpha: 1.5708 }, annotation: { text: 'α=90°: 面积 π, 占 1/4', position: 'top' } } },
  { lineId: 'ck-2', sectionId: 'check', scene: { id: 'ck-2', type: 'animation' }, lineState: { params: { mode: 'lune', alpha: 3.1416 }, annotation: { text: 'α=180°: 半球, 面积 2π', position: 'bottom' } } },
  { lineId: 'ck-3', sectionId: 'check', scene: { id: 'ck-3', type: 'animation' }, lineState: { params: { mode: 'lune', alpha: 0.5236 }, annotation: { text: 'α=30°: 占 1/12', position: 'bottom' } } },
  { lineId: 'pg-1', sectionId: 'polygon', scene: { id: 'pg-1', type: 'animation' }, lineState: { params: { mode: 'polygon', n: 5, latDeg: 35 }, annotation: { text: 'n 边形: 内角和 −(n−2)π', position: 'top' } } },
  { lineId: 'pg-2', sectionId: 'polygon', scene: { id: 'pg-2', type: 'animation' }, lineState: { params: { mode: 'polygon', n: 6, latDeg: 30 }, annotation: { text: '平面上这个量恒为 0', position: 'bottom' } } },
  { lineId: 'pg-3', sectionId: 'polygon', scene: { id: 'pg-3', type: 'animation' }, lineState: { params: { mode: 'polygon', n: 8, latDeg: 45 }, annotation: { text: '两种算法残差 1e-15', position: 'bottom' } } },
  { lineId: 'gd-1', sectionId: 'girard', scene: { id: 'gd-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'polygon', n: 3, latDeg: 20 }, annotation: { text: '三大圆把球面切成八块', position: 'top' } } },
  { lineId: 'gd-2', sectionId: 'girard', scene: { id: 'gd-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'lune', alpha: 1.5708 }, annotation: { text: '三对二角形总面积 = 4×内角和', position: 'bottom' } } },
  { lineId: 'gd-3', sectionId: 'girard', scene: { id: 'gd-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'polygon', n: 3, latDeg: 30 }, annotation: { text: '整理得吉拉尔定理', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '二角形是球面独有', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '面积 = 2α', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
