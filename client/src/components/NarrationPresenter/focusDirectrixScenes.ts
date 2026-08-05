/**
 * 焦点准线统一定义 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultFocusDirectrixState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const focusDirectrixScenes: NarrationLineScene[] = [
  { lineId: 'pr-1', sectionId: 'problem', scene: { id: 'pr-1', type: 'title' }, lineState: { params: { e: 0.5, theta: 1.1, showRatio: false }, annotation: { text: '课本给了三个定义', position: 'top' } } },
  { lineId: 'pr-2', sectionId: 'problem', scene: { id: 'pr-2', type: 'animation' }, lineState: { params: { e: 1.4, theta: 1.1, showRatio: false }, annotation: { text: '形式完全不同', position: 'bottom' } } },
  { lineId: 'pr-3', sectionId: 'problem', scene: { id: 'pr-3', type: 'animation' }, lineState: { params: { e: 0.5, theta: 1.1, showRatio: true }, annotation: { text: '其实一条就够', position: 'bottom' } } },
  { lineId: 'un-1', sectionId: 'unified', scene: { id: 'un-1', type: 'animation' }, lineState: { params: { e: 0.5, theta: 0.7, showRatio: true }, annotation: { text: '|PF| ÷ d(P,准线) = 定值', position: 'top' } } },
  { lineId: 'un-2', sectionId: 'unified', scene: { id: 'un-2', type: 'animation' }, lineState: { params: { e: 0.5, theta: 1.9, showRatio: true }, annotation: { text: '这个定值就是离心率 e', position: 'bottom' } } },
  { lineId: 'un-3', sectionId: 'unified', scene: { id: 'un-3', type: 'animation' }, lineState: { params: { e: 0.5, theta: 3.6, showRatio: true }, annotation: { text: '两段都在变，比值不动', position: 'bottom' } } },
  { lineId: 'th-1', sectionId: 'three', scene: { id: 'th-1', type: 'animation' }, lineState: { params: { e: 0.75, theta: 1.1, showRatio: true }, annotation: { text: 'e<1：椭圆', position: 'top' } } },
  { lineId: 'th-2', sectionId: 'three', scene: { id: 'th-2', type: 'animation' }, lineState: { params: { e: 0, theta: 1.1, showRatio: true }, annotation: { text: 'e=0：准线退到无穷远，成圆', position: 'bottom' } } },
  { lineId: 'th-3', sectionId: 'three', scene: { id: 'th-3', type: 'animation' }, lineState: { params: { e: 1, theta: 1.1, showRatio: true }, annotation: { text: 'e=1：抛物线，恰好不闭合', position: 'bottom' } } },
  { lineId: 'po-1', sectionId: 'polar', scene: { id: 'po-1', type: 'animation' }, lineState: { params: { e: 0.6, theta: 0.9, showRatio: true }, annotation: { text: 'r = l / (1 + e·cos θ)', position: 'top' } } },
  { lineId: 'po-2', sectionId: 'polar', scene: { id: 'po-2', type: 'animation' }, lineState: { params: { e: 0.6, theta: 2.4, showRatio: true }, annotation: { text: 'l 定大小，e 定形状', position: 'bottom' } } },
  { lineId: 'po-3', sectionId: 'polar', scene: { id: 'po-3', type: 'animation' }, lineState: { params: { e: 0.9, theta: 2.4, showRatio: true }, annotation: { text: '焦点恒在原点 —— 天体力学用它', position: 'bottom' } } },
  { lineId: 'fa-1', sectionId: 'far', scene: { id: 'fa-1', type: 'animation' }, lineState: { params: { e: 1.3, theta: 0.4, showRatio: true }, annotation: { text: 'e>1：分母会变负', position: 'top' } } },
  { lineId: 'fa-2', sectionId: 'far', scene: { id: 'fa-2', type: 'animation' }, lineState: { params: { e: 1.3, theta: 3.14159, showRatio: true }, annotation: { text: '负 r = 沿反方向量，落在远支', position: 'bottom' } } },
  { lineId: 'fa-3', sectionId: 'far', scene: { id: 'fa-3', type: 'animation' }, lineState: { params: { e: 1.3, theta: 3.14159, showRatio: true }, annotation: { text: '远支同样满足 6.667/5.128 = 1.3', position: 'bottom' } } },
  { lineId: 'as-1', sectionId: 'astro', scene: { id: 'as-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { e: 0.0167, theta: 1.1, showRatio: true }, annotation: { text: '地球 e=0.0167，近乎正圆', position: 'top' } } },
  { lineId: 'as-2', sectionId: 'astro', scene: { id: 'as-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { e: 0.967, theta: 1.1, showRatio: true }, annotation: { text: '哈雷彗星 e=0.967，极扁', position: 'bottom' } } },
  { lineId: 'as-3', sectionId: 'astro', scene: { id: 'as-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { e: 2.4, theta: 1.1, showRatio: true }, annotation: { text: '2I/Borisov e=3.36，双曲轨道', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '|PF| / d = e，一条定义', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'e 的取值决定三种类型', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
