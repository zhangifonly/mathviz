/**
 * 科斯塔曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultCostaSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const costaSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '两百年只找到三种', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { neckR: 0.55 }, annotation: { text: '欧拉 1744 找到悬链面', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { neckR: 0.55 }, annotation: { text: '信念持续到 1982', position: 'bottom' } } },
  { lineId: 'dc-1', sectionId: 'discovery', scene: { id: 'dc-1', type: 'animation' }, lineState: { params: { neckR: 0.55, flare: 1.35 }, annotation: { text: '科斯塔构造出第四种', position: 'top' } } },
  { lineId: 'dc-2', sectionId: 'discovery', scene: { id: 'dc-2', type: 'animation' }, lineState: { params: { neckR: 0.45 }, annotation: { text: '前三种亏格都是 0', position: 'bottom' } } },
  { lineId: 'dc-3', sectionId: 'discovery', scene: { id: 'dc-3', type: 'animation' }, lineState: { params: { neckR: 0.55, flare: 1.6 }, annotation: { text: '它是环面去掉三个点', position: 'bottom' } } },
  { lineId: 'tp-1', sectionId: 'topology', scene: { id: 'tp-1', type: 'animation' }, lineState: { params: { neckR: 0.55 }, annotation: { text: 'χ = 2 − 2g − n', position: 'top' } } },
  { lineId: 'tp-2', sectionId: 'topology', scene: { id: 'tp-2', type: 'animation' }, lineState: { params: { neckR: 0.55 }, annotation: { text: '代入得 −3', position: 'bottom' } } },
  { lineId: 'tp-3', sectionId: 'topology', scene: { id: 'tp-3', type: 'animation' }, lineState: { params: { flare: 1.9 }, annotation: { text: '两个悬链端 + 一个平面端', position: 'bottom' } } },
  { lineId: 'sm-1', sectionId: 'symmetry', scene: { id: 'sm-1', type: 'animation' }, lineState: { params: { neckR: 0.6 }, annotation: { text: '转 90° 完全复原', position: 'top' } } },
  { lineId: 'sm-2', sectionId: 'symmetry', scene: { id: 'sm-2', type: 'animation' }, lineState: { params: { neckR: 0.7 }, annotation: { text: '腰部呈四叶形', position: 'bottom' } } },
  { lineId: 'sm-3', sectionId: 'symmetry', scene: { id: 'sm-3', type: 'animation' }, lineState: { params: { neckR: 0.6 }, annotation: { text: '来自椭圆函数的周期格', position: 'bottom' } } },
  { lineId: 'hn-1', sectionId: 'honest', scene: { id: 'hn-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { neckR: 0.55 }, annotation: { text: '精确版需椭圆函数', position: 'top' } } },
  { lineId: 'hn-2', sectionId: 'honest', scene: { id: 'hn-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { neckR: 0.55 }, annotation: { text: '本演示是结构等价模型', position: 'bottom' } } },
  { lineId: 'hn-3', sectionId: 'honest', scene: { id: 'hn-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { neckR: 0.55 }, annotation: { text: '拓扑真, H≡0 仅近似', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '曾以为只有三种', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '亏格 1, 三个端, χ=−3', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
