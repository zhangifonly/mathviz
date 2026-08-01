/**
 * 球面三角形 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSphericalTriangleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sphericalTriangleScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '球面最短路径是大圆弧', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'small' }, annotation: { text: '把直线换成大圆', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'octant' }, annotation: { text: '任两大圆必相交', position: 'bottom' } } },
  { lineId: 'ex-1', sectionId: 'excess', scene: { id: 'ex-1', type: 'animation' }, lineState: { params: { kind: 'small' }, annotation: { text: '欧氏内角和恒为 180°', position: 'top' } } },
  { lineId: 'ex-2', sectionId: 'excess', scene: { id: 'ex-2', type: 'animation' }, lineState: { params: { kind: 'octant' }, annotation: { text: '球面一定更大', position: 'bottom' } } },
  { lineId: 'ex-3', sectionId: 'excess', scene: { id: 'ex-3', type: 'animation' }, lineState: { params: { kind: 'octant' }, annotation: { text: '盈余数值等于面积', position: 'bottom' } } },
  { lineId: 'oc-1', sectionId: 'octant', scene: { id: 'oc-1', type: 'animation' }, lineState: { params: { kind: 'octant' }, annotation: { text: '三个直角, 和 270°', position: 'top' } } },
  { lineId: 'oc-2', sectionId: 'octant', scene: { id: 'oc-2', type: 'animation' }, lineState: { params: { kind: 'octant' }, annotation: { text: '面积占比恰好 12.5%', position: 'bottom' } } },
  { lineId: 'oc-3', sectionId: 'octant', scene: { id: 'oc-3', type: 'animation' }, lineState: { params: { kind: 'hemisphere' }, annotation: { text: '接近半球时趋于 50%', position: 'bottom' } } },
  { lineId: 'ns-1', sectionId: 'nosimilar', scene: { id: 'ns-1', type: 'animation' }, lineState: { params: { kind: 'octant' }, annotation: { text: '面积由角度唯一决定', position: 'top' } } },
  { lineId: 'ns-2', sectionId: 'nosimilar', scene: { id: 'ns-2', type: 'animation' }, lineState: { params: { kind: 'octant', scale: 0.5 }, annotation: { text: '欧氏缩放不改变角度', position: 'bottom' } } },
  { lineId: 'ns-3', sectionId: 'nosimilar', scene: { id: 'ns-3', type: 'animation' }, lineState: { params: { kind: 'octant', scale: 0.1 }, annotation: { text: '球面一缩小角度就变', position: 'bottom' } } },
  { lineId: 'py-1', sectionId: 'pythagoras', scene: { id: 'py-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'rightAngled' }, annotation: { text: '欧氏: 斜边平方和', position: 'top' } } },
  { lineId: 'py-2', sectionId: 'pythagoras', scene: { id: 'py-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'rightAngled' }, annotation: { text: '球面: cos c = cos a·cos b', position: 'bottom' } } },
  { lineId: 'py-3', sectionId: 'pythagoras', scene: { id: 'py-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'small' }, annotation: { text: '小三角形时退化为欧氏', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '直线换成大圆', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '面积 = 球面盈余', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
