/**
 * 二次曲面分类 讲解场景配置
 *
 * params.kind 指定当前展示哪一种二次曲面, 与讲解内容同步切换。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultQuadricSurfacesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const quadricSurfacesScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '平面上只有三类圆锥曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'ellipsoid' }, annotation: { text: '升到三维会怎样?', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'ellipsoid' }, annotation: { text: '答案: 只有六类', position: 'bottom' } } },

  { lineId: 'bd-1', sectionId: 'bounded', scene: { id: 'bd-1', type: 'animation' }, lineState: { params: { kind: 'ellipsoid' }, annotation: { text: '三个平方项全同号', position: 'top' } } },
  { lineId: 'bd-2', sectionId: 'bounded', scene: { id: 'bd-2', type: 'animation' }, lineState: { params: { kind: 'ellipsoid' }, annotation: { text: '唯一有界的一类', position: 'bottom' } } },
  { lineId: 'bd-3', sectionId: 'bounded', scene: { id: 'bd-3', type: 'animation' }, lineState: { params: { kind: 'ellipsoid', a: 1.35 }, annotation: { text: '地球近似是椭球面', position: 'bottom' } } },

  { lineId: 'hy-1', sectionId: 'hyperboloid', scene: { id: 'hy-1', type: 'animation' }, lineState: { params: { kind: 'hyperboloid1' }, annotation: { text: '一个符号变负', position: 'top' } } },
  { lineId: 'hy-2', sectionId: 'hyperboloid', scene: { id: 'hy-2', type: 'animation' }, lineState: { params: { kind: 'hyperboloid1' }, annotation: { text: '冷却塔 · 直纹面', position: 'bottom' } } },
  { lineId: 'hy-3', sectionId: 'hyperboloid', scene: { id: 'hy-3', type: 'animation' }, lineState: { params: { kind: 'hyperboloid2' }, annotation: { text: '两个负号: 断成两片', position: 'bottom' } } },

  { lineId: 'pa-1', sectionId: 'paraboloid', scene: { id: 'pa-1', type: 'animation' }, lineState: { params: { kind: 'paraboloid' }, annotation: { text: 'z 只出现一次方', position: 'top' } } },
  { lineId: 'pa-2', sectionId: 'paraboloid', scene: { id: 'pa-2', type: 'animation' }, lineState: { params: { kind: 'paraboloid' }, annotation: { text: '卫星天线聚焦', position: 'bottom' } } },
  { lineId: 'pa-3', sectionId: 'paraboloid', scene: { id: 'pa-3', type: 'animation' }, lineState: { params: { kind: 'saddle' }, annotation: { text: '马鞍面 · 双直纹', position: 'bottom' } } },

  { lineId: 'co-1', sectionId: 'cone', scene: { id: 'co-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'cone' }, annotation: { text: '右边的 1 变成 0', position: 'top' } } },
  { lineId: 'co-2', sectionId: 'cone', scene: { id: 'co-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'cone' }, annotation: { text: '腰部收缩成一点', position: 'bottom' } } },
  { lineId: 'co-3', sectionId: 'cone', scene: { id: 'co-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'cone' }, annotation: { text: '切它得三类圆锥曲线', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '只有六类', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '符号组合决定类型', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
