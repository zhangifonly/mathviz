/**
 * 互信息与信道容量 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：kind 选信道，a/e 定输入与噪声，
 * showRidge 控制容量脊线。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultMutualInformationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const mutualInformationScenes: NarrationLineScene[] = [
  { lineId: 'tw-1', sectionId: 'two', scene: { id: 'tw-1', type: 'title' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.1, showRidge: false }, annotation: { text: '前两课：熵与 KL', position: 'top' } } },
  { lineId: 'tw-2', sectionId: 'two', scene: { id: 'tw-2', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.1, showRidge: false }, annotation: { text: '只能观测 Y，想知道 X', position: 'bottom' } } },
  { lineId: 'tw-3', sectionId: 'two', scene: { id: 'tw-3', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.1, showRidge: false }, annotation: { text: 'I = H(X) − H(X|Y)', position: 'bottom' } } },
  { lineId: 'tw-4', sectionId: 'two', scene: { id: 'tw-4', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.2, showRidge: false }, annotation: { text: '对称：所以叫「互」信息', position: 'bottom' } } },
  { lineId: 'tw-5', sectionId: 'two', scene: { id: 'tw-5', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.2, showRidge: false }, annotation: { text: '决策树的信息增益就是它', position: 'bottom' } } },

  { lineId: 'fr-1', sectionId: 'four', scene: { id: 'fr-1', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.15, showRidge: false }, annotation: { text: '四个等价写法', position: 'top' } } },
  { lineId: 'fr-2', sectionId: 'four', scene: { id: 'fr-2', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.15, showRidge: false }, annotation: { text: 'H(X)−H(X|Y) 与 H(Y)−H(Y|X)', position: 'bottom' } } },
  { lineId: 'fr-3', sectionId: 'four', scene: { id: 'fr-3', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.15, showRidge: false }, annotation: { text: 'H(X)+H(Y)−H(X,Y)：两圆交集', position: 'bottom' } } },
  { lineId: 'fr-4', sectionId: 'four', scene: { id: 'fr-4', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.15, showRidge: false }, annotation: { text: 'D(P_XY ‖ P_X·P_Y)：离独立多远', position: 'bottom' } } },
  { lineId: 'fr-5', sectionId: 'four', scene: { id: 'fr-5', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.5, showRidge: false }, annotation: { text: 'I ≥ 0 来自 Gibbs；独立时恰为 0', position: 'bottom' } } },
  { lineId: 'fr-6', sectionId: 'four', scene: { id: 'fr-6', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.3, e: 0.1, showRidge: false }, annotation: { text: '四个写法实测一致到 1e−16', position: 'bottom' } } },

  { lineId: 'ch-1', sectionId: 'channel', scene: { id: 'ch-1', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.1, showRidge: false }, annotation: { text: '信道 = 把 X 变 Y 的随机映射', position: 'top' } } },
  { lineId: 'ch-2', sectionId: 'channel', scene: { id: 'ch-2', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.1, showRidge: false }, annotation: { text: 'BSC：以概率 e 翻转', position: 'bottom' } } },
  { lineId: 'ch-3', sectionId: 'channel', scene: { id: 'ch-3', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.1, showRidge: false, camYaw: 1.0 }, annotation: { text: 'I 还取决于你怎么用它', position: 'bottom' } } },
  { lineId: 'ch-4', sectionId: 'channel', scene: { id: 'ch-4', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.3, showRidge: false, camYaw: 1.0 }, annotation: { text: '沿 e 单调降，沿 a 有个峰', position: 'bottom' } } },
  { lineId: 'ch-5', sectionId: 'channel', scene: { id: 'ch-5', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.3, showRidge: true, camYaw: 1.0 }, annotation: { text: '红线 = 峰顶连成的容量脊线', position: 'bottom' } } },
  { lineId: 'ch-6', sectionId: 'channel', scene: { id: 'ch-6', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.1, showRidge: true }, annotation: { text: 'C = 1 − H(e)，均匀输入取到', position: 'bottom' } } },
  { lineId: 'ch-7', sectionId: 'channel', scene: { id: 'ch-7', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.3, e: 0.1, showRidge: true }, annotation: { text: 'a=0.3 只有 0.456 < 0.531', position: 'bottom' } } },

  { lineId: 'cp-1', sectionId: 'compare', scene: { id: 'cp-1', type: 'animation' }, lineState: { params: { kind: 'bec', a: 0.5, e: 0.1, showRidge: true }, annotation: { text: '擦除信道：变成「不知道」', position: 'top' } } },
  { lineId: 'cp-2', sectionId: 'compare', scene: { id: 'cp-2', type: 'animation' }, lineState: { params: { kind: 'bec', a: 0.5, e: 0.1, showRidge: true }, annotation: { text: 'C = 1−e = 0.900，远高于 0.531', position: 'bottom' } } },
  { lineId: 'cp-3', sectionId: 'compare', scene: { id: 'cp-3', type: 'animation' }, lineState: { params: { kind: 'bec', a: 0.5, e: 0.4, showRidge: true }, annotation: { text: '擦除时知道丢了哪位，翻转时不知道', position: 'bottom' } } },
  { lineId: 'cp-4', sectionId: 'compare', scene: { id: 'cp-4', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.5, showRidge: true }, annotation: { text: 'e=0.5：容量精确为 0', position: 'bottom' } } },
  { lineId: 'cp-5', sectionId: 'compare', scene: { id: 'cp-5', type: 'animation' }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.5, showRidge: true }, annotation: { text: '输出与输入独立，跟抛硬币一样', position: 'bottom' } } },
  { lineId: 'cp-6', sectionId: 'compare', scene: { id: 'cp-6', type: 'animation' }, lineState: { params: { kind: 'z', a: 0.58, e: 0.3, showRidge: true, camYaw: 1.1 }, annotation: { text: 'Z 信道：最优输入不是 0.5', position: 'bottom' } } },

  { lineId: 'us-1', sectionId: 'use', scene: { id: 'us-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.15, showRidge: true }, annotation: { text: '码率低于容量 ⇒ 错误率可任意小', position: 'top' } } },
  { lineId: 'us-2', sectionId: 'use', scene: { id: 'us-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'bsc', a: 0.5, e: 0.15, showRidge: true }, annotation: { text: '但它只说存在——五十年后才造出来', position: 'bottom' } } },
  { lineId: 'us-3', sectionId: 'use', scene: { id: 'us-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'bsc', a: 0.4, e: 0.2, showRidge: true }, annotation: { text: '特征选择：能捕捉非线性关系', position: 'bottom' } } },
  { lineId: 'us-4', sectionId: 'use', scene: { id: 'us-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'bec', a: 0.5, e: 0.25, showRidge: true }, annotation: { text: '信息瓶颈：够用但不冗余', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '互信息 = 离独立有多远', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '容量 = max over 输入分布', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: 'e=0.5 时根本传不了', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
