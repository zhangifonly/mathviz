/**
 * 旋转曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSurfaceRevolutionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const surfaceRevolutionScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '陶轮上的几何', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'vase', showProfile: true, sweep: 0.4 }, annotation: { text: '母线绕轴转一圈', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'vase', showProfile: true }, annotation: { text: '这个构造极其强大', position: 'bottom' } } },
  { lineId: 'un-1', sectionId: 'unified', scene: { id: 'un-1', type: 'animation' }, lineState: { params: { kind: 'sphere', showProfile: true }, annotation: { text: '母线写成 r(t) 与 z(t)', position: 'top' } } },
  { lineId: 'un-2', sectionId: 'unified', scene: { id: 'un-2', type: 'animation' }, lineState: { params: { kind: 'sphere', showProfile: true, sweep: 0.6 }, annotation: { text: '再引入绕轴角度 u', position: 'bottom' } } },
  { lineId: 'un-3', sectionId: 'unified', scene: { id: 'un-3', type: 'animation' }, lineState: { params: { kind: 'sphere' }, annotation: { text: '换母线即换曲面', position: 'bottom' } } },
  { lineId: 'ga-1', sectionId: 'gallery', scene: { id: 'ga-1', type: 'animation' }, lineState: { params: { kind: 'sphere', showProfile: true }, annotation: { text: '半圆转出球面', position: 'top' } } },
  { lineId: 'ga-2', sectionId: 'gallery', scene: { id: 'ga-2', type: 'animation' }, lineState: { params: { kind: 'catenoid', showProfile: true }, annotation: { text: 'cosh 转出悬链面', position: 'bottom' } } },
  { lineId: 'ga-3', sectionId: 'gallery', scene: { id: 'ga-3', type: 'animation' }, lineState: { params: { kind: 'torus', showProfile: true }, annotation: { text: '圆不过轴则有洞', position: 'bottom' } } },
  { lineId: 'pp-1', sectionId: 'pappus', scene: { id: 'pp-1', type: 'animation' }, lineState: { params: { kind: 'sphere', showMeasure: true }, annotation: { text: '帕普斯定理', position: 'top' } } },
  { lineId: 'pp-2', sectionId: 'pappus', scene: { id: 'pp-2', type: 'animation' }, lineState: { params: { kind: 'sphere', showMeasure: true }, annotation: { text: '面积与体积的积分式', position: 'bottom' } } },
  { lineId: 'pp-3', sectionId: 'pappus', scene: { id: 'pp-3', type: 'animation' }, lineState: { params: { kind: 'sphere', showMeasure: true }, annotation: { text: '单位球: 4π 与 4π/3', position: 'bottom' } } },
  { lineId: 'vf-1', sectionId: 'verify', scene: { id: 'vf-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'torus', showMeasure: true }, annotation: { text: '切换母线看读数', position: 'top' } } },
  { lineId: 'vf-2', sectionId: 'verify', scene: { id: 'vf-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'paraboloid', showMeasure: true }, annotation: { text: '抛物面体积可手算', position: 'bottom' } } },
  { lineId: 'vf-3', sectionId: 'verify', scene: { id: 'vf-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'pseudosphere', showMeasure: true }, annotation: { text: '数字都对得上', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '只需 r(t) 与 z(t)', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '六种经典曲面皆是特例', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
