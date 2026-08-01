/**
 * 空间曲线与活动标架 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSpaceCurveFrenetState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const spaceCurveFrenetScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '三个坐标函数?', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'helix' }, annotation: { text: '形状与位置无关', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'helix' }, annotation: { text: '只需两个标量函数', position: 'bottom' } } },
  { lineId: 'fr-1', sectionId: 'frame', scene: { id: 'fr-1', type: 'animation' }, lineState: { params: { kind: 'helix' }, annotation: { text: 'T: 切线方向', position: 'top' } } },
  { lineId: 'fr-2', sectionId: 'frame', scene: { id: 'fr-2', type: 'animation' }, lineState: { params: { kind: 'helix' }, annotation: { text: 'N: 弯曲方向', position: 'bottom' } } },
  { lineId: 'fr-3', sectionId: 'frame', scene: { id: 'fr-3', type: 'animation' }, lineState: { params: { kind: 'helix' }, annotation: { text: 'B = T × N', position: 'bottom' } } },
  { lineId: 'kp-1', sectionId: 'kappa', scene: { id: 'kp-1', type: 'animation' }, lineState: { params: { kind: 'circle' }, annotation: { text: '圆的曲率是 1/r', position: 'top' } } },
  { lineId: 'kp-2', sectionId: 'kappa', scene: { id: 'kp-2', type: 'animation' }, lineState: { params: { kind: 'circle' }, annotation: { text: '挠率为零 ⟺ 平面曲线', position: 'bottom' } } },
  { lineId: 'kp-3', sectionId: 'kappa', scene: { id: 'kp-3', type: 'animation' }, lineState: { params: { kind: 'helix' }, annotation: { text: '螺旋线挠率是非零常数', position: 'bottom' } } },
  { lineId: 'sr-1', sectionId: 'serret', scene: { id: 'sr-1', type: 'animation' }, lineState: { params: { kind: 'helix' }, annotation: { text: '三条公式描述标架转动', position: 'top' } } },
  { lineId: 'sr-2', sectionId: 'serret', scene: { id: 'sr-2', type: 'animation' }, lineState: { params: { kind: 'helix' }, annotation: { text: 'T\' = κN', position: 'bottom' } } },
  { lineId: 'sr-3', sectionId: 'serret', scene: { id: 'sr-3', type: 'animation' }, lineState: { params: { kind: 'trefoil' }, annotation: { text: '误差在 1e-4 量级', position: 'bottom' } } },
  { lineId: 'gl-1', sectionId: 'gallery', scene: { id: 'gl-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'line' }, annotation: { text: '直线: κ=τ=0', position: 'top' } } },
  { lineId: 'gl-2', sectionId: 'gallery', scene: { id: 'gl-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'circle' }, annotation: { text: '圆: 只弯不扭', position: 'bottom' } } },
  { lineId: 'gl-3', sectionId: 'gallery', scene: { id: 'gl-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'trefoil' }, annotation: { text: '三叶结: 都随 t 变', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'κ 与 τ 决定形状', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '挠率零 ⟺ 平面曲线', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
