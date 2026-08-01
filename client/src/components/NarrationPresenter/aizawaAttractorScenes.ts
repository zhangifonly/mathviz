/**
 * 相泽吸引子 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultAizawaAttractorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const aizawaAttractorScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '球面附近缠绕', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { f: 0.1 }, annotation: { text: '六个参数', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { f: 0.1, showDiag: true }, annotation: { text: '只有一个决定对称性', position: 'bottom' } } },
  { lineId: 'cp-1', sectionId: 'complex', scene: { id: 'cp-1', type: 'animation' }, lineState: { params: { f: 0.1 }, annotation: { text: '前两个方程有交叉项', position: 'top' } } },
  { lineId: 'cp-2', sectionId: 'complex', scene: { id: 'cp-2', type: 'animation' }, lineState: { params: { f: 0.1 }, annotation: { text: '令 w = x + iy', position: 'bottom' } } },
  { lineId: 'cp-3', sectionId: 'complex', scene: { id: 'cp-3', type: 'animation' }, lineState: { params: { f: 0.1 }, annotation: { text: '误差精确为零', position: 'bottom' } } },
  { lineId: 'rt-1', sectionId: 'rotation', scene: { id: 'rt-1', type: 'animation' }, lineState: { params: { f: 0.1 }, annotation: { text: '旋转即乘模一复数', position: 'top' } } },
  { lineId: 'rt-2', sectionId: 'rotation', scene: { id: 'rt-2', type: 'animation' }, lineState: { params: { f: 0.1 }, annotation: { text: '旋转等变: 两路径同结果', position: 'bottom' } } },
  { lineId: 'rt-3', sectionId: 'rotation', scene: { id: 'rt-3', type: 'animation' }, lineState: { params: { f: 0.1 }, annotation: { text: '问题出在第三个方程', position: 'bottom' } } },
  { lineId: 'bk-1', sectionId: 'breaker', scene: { id: 'bk-1', type: 'animation' }, lineState: { params: { f: 0 }, annotation: { text: '多数项只依赖到轴距离', position: 'top' } } },
  { lineId: 'bk-2', sectionId: 'breaker', scene: { id: 'bk-2', type: 'animation' }, lineState: { params: { f: 0.25 }, annotation: { text: '唯独 f·z·x³ 依赖 x', position: 'bottom' } } },
  { lineId: 'bk-3', sectionId: 'breaker', scene: { id: 'bk-3', type: 'animation' }, lineState: { params: { f: 0 }, annotation: { text: 'f=0 时误差降到 1e-16', position: 'bottom' } } },
  { lineId: 'vf-1', sectionId: 'verify', scene: { id: 'vf-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { f: 0, showDiag: true }, annotation: { text: 'f=0: 完美回转体', position: 'top' } } },
  { lineId: 'vf-2', sectionId: 'verify', scene: { id: 'vf-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { f: 0.1, showDiag: true }, annotation: { text: 'f=0.1: 出现方向性', position: 'bottom' } } },
  { lineId: 'vf-3', sectionId: 'verify', scene: { id: 'vf-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { f: 0.25, showDiag: true }, annotation: { text: 'λ₁≈0.076, 确认混沌', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '复数形式: 实部胀缩虚部旋转', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '只有 f 破坏轴对称', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
