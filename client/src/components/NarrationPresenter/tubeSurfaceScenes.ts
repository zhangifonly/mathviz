/**
 * 管状曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultTubeSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const tubeSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '给弯铁丝套橡胶皮', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'helix', showCenter: true }, annotation: { text: '截面必须垂直于曲线', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'helix', showCenter: true, showFrame: true, surfaceAlpha: 0.5 }, annotation: { text: '需要稳定的坐标框架', position: 'bottom' } } },
  { lineId: 'fr-1', sectionId: 'frame', scene: { id: 'fr-1', type: 'animation' }, lineState: { params: { kind: 'helix', showFrame: true, surfaceAlpha: 0.4 }, annotation: { text: 'T: 切向量', position: 'top' } } },
  { lineId: 'fr-2', sectionId: 'frame', scene: { id: 'fr-2', type: 'animation' }, lineState: { params: { kind: 'helix', showFrame: true, surfaceAlpha: 0.4 }, annotation: { text: 'N: 主法向量', position: 'bottom' } } },
  { lineId: 'fr-3', sectionId: 'frame', scene: { id: 'fr-3', type: 'animation' }, lineState: { params: { kind: 'helix', showFrame: true, showCenter: true, surfaceAlpha: 0.4 }, annotation: { text: 'B = T × N, 三者两两垂直', position: 'bottom' } } },
  { lineId: 'bd-1', sectionId: 'build', scene: { id: 'bd-1', type: 'animation' }, lineState: { params: { kind: 'helix', showCenter: true, radius: 0.18 }, annotation: { text: '在 N-B 平面画圆', position: 'top' } } },
  { lineId: 'bd-2', sectionId: 'build', scene: { id: 'bd-2', type: 'animation' }, lineState: { params: { kind: 'helix', showCenter: true, radius: 0.3 }, annotation: { text: '圆自动垂直于曲线', position: 'bottom' } } },
  { lineId: 'bd-3', sectionId: 'build', scene: { id: 'bd-3', type: 'animation' }, lineState: { params: { kind: 'helix', radius: 0.3 }, annotation: { text: '半径误差 <1e-10', position: 'bottom' } } },
  { lineId: 'cv-1', sectionId: 'curves', scene: { id: 'cv-1', type: 'animation' }, lineState: { params: { kind: 'helix', showCenter: true }, annotation: { text: '螺旋线: 曲率挠率恒定', position: 'top' } } },
  { lineId: 'cv-2', sectionId: 'curves', scene: { id: 'cv-2', type: 'animation' }, lineState: { params: { kind: 'trefoil', showCenter: true, radius: 0.35 }, annotation: { text: '三叶结: 最简非平凡纽结', position: 'bottom' } } },
  { lineId: 'cv-3', sectionId: 'curves', scene: { id: 'cv-3', type: 'animation' }, lineState: { params: { kind: 'viviani', showCenter: true, radius: 0.2 }, annotation: { text: '维维亚尼: 球与柱的交线', position: 'bottom' } } },
  { lineId: 'cw-1', sectionId: 'caveat', scene: { id: 'cw-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'trefoil', showFrame: true, surfaceAlpha: 0.45 }, annotation: { text: 'N 由 T 的导数归一化', position: 'top' } } },
  { lineId: 'cw-2', sectionId: 'caveat', scene: { id: 'cw-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'trefoil', showFrame: true, surfaceAlpha: 0.45 }, annotation: { text: '曲率为零则标架失效', position: 'bottom' } } },
  { lineId: 'cw-3', sectionId: 'caveat', scene: { id: 'cw-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'viviani', showFrame: true, surfaceAlpha: 0.45 }, annotation: { text: '直线段需换 Bishop 标架', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '难点在截面朝向', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'Frenet 标架 T/N/B', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
