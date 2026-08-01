/**
 * 高斯曲率 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultGaussianCurvatureState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gaussianCurvatureScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '朝不同方向切一刀', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'saddle', showReadout: true }, annotation: { text: '只看最弯与最不弯', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'saddle', showReadout: true }, annotation: { text: '两者相乘即 K', position: 'bottom' } } },
  { lineId: 'sg-1', sectionId: 'signs', scene: { id: 'sg-1', type: 'animation' }, lineState: { params: { kind: 'sphere', showReadout: true }, annotation: { text: '同号: 碗形, 椭圆点', position: 'top' } } },
  { lineId: 'sg-2', sectionId: 'signs', scene: { id: 'sg-2', type: 'animation' }, lineState: { params: { kind: 'saddle', showReadout: true }, annotation: { text: '反号: 鞍形, 双曲点', position: 'bottom' } } },
  { lineId: 'sg-3', sectionId: 'signs', scene: { id: 'sg-3', type: 'animation' }, lineState: { params: { kind: 'cylinder', showReadout: true }, annotation: { text: '有零: 柱形, 抛物点', position: 'bottom' } } },
  { lineId: 'gl-1', sectionId: 'gallery', scene: { id: 'gl-1', type: 'animation' }, lineState: { params: { kind: 'sphere' }, annotation: { text: '球冠通体一片红', position: 'top' } } },
  { lineId: 'gl-2', sectionId: 'gallery', scene: { id: 'gl-2', type: 'animation' }, lineState: { params: { kind: 'sphere', showReadout: true }, annotation: { text: 'K = 1/R² 处处相等', position: 'bottom' } } },
  { lineId: 'gl-3', sectionId: 'gallery', scene: { id: 'gl-3', type: 'animation' }, lineState: { params: { kind: 'cylinder' }, annotation: { text: '鞍面全蓝, 柱面全白', position: 'bottom' } } },
  { lineId: 'mx-1', sectionId: 'mixed', scene: { id: 'mx-1', type: 'animation' }, lineState: { params: { kind: 'torus' }, annotation: { text: '环面: 外红内蓝', position: 'top' } } },
  { lineId: 'mx-2', sectionId: 'mixed', scene: { id: 'mx-2', type: 'animation' }, lineState: { params: { kind: 'torus', showReadout: true }, annotation: { text: '红蓝之间有白线', position: 'bottom' } } },
  { lineId: 'mx-3', sectionId: 'mixed', scene: { id: 'mx-3', type: 'animation' }, lineState: { params: { kind: 'volcano' }, annotation: { text: '火山口: 口沿交界', position: 'bottom' } } },
  { lineId: 'eg-1', sectionId: 'egregium', scene: { id: 'eg-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'egg' }, annotation: { text: '高斯绝妙定理', position: 'top' } } },
  { lineId: 'eg-2', sectionId: 'egregium', scene: { id: 'eg-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'egg', showReadout: true }, annotation: { text: '蚂蚁爬行即可测得', position: 'bottom' } } },
  { lineId: 'eg-3', sectionId: 'egregium', scene: { id: 'eg-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'sphere', showReadout: true }, annotation: { text: '所以地图必然变形', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'K = κ₁·κ₂', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '符号定局部形状', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
