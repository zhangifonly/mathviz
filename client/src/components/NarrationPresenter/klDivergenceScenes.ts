/**
 * KL 散度与交叉熵 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：p/q 定两个分布，
 * show 三位分别控制 D(p‖q)、D(q‖p)、JS 三张高度场。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultKlDivergenceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

const P = [0.5, 0.3, 0.2]
const Q_SAME = [0.5, 0.3, 0.2]
const Q_CLOSE = [0.4, 0.35, 0.25]
const Q_ASYM = [0.98, 0.01, 0.01]
const Q_ZERO = [0.6, 0.4, 0]

export const klDivergenceScenes: NarrationLineScene[] = [
  { lineId: 'as-1', sectionId: 'ask', scene: { id: 'as-1', type: 'title' }, lineState: { params: { p: P, q: Q_SAME, show: [true, false, false] }, annotation: { text: '上一课：熵是用对分布时的下界', position: 'top' } } },
  { lineId: 'as-2', sectionId: 'ask', scene: { id: 'as-2', type: 'animation' }, lineState: { params: { p: P, q: Q_CLOSE, show: [true, false, false] }, annotation: { text: '以为是 q，实际是 p，多花多少？', position: 'bottom' } } },
  { lineId: 'as-3', sectionId: 'ask', scene: { id: 'as-3', type: 'animation' }, lineState: { params: { p: P, q: Q_CLOSE, show: [true, false, false] }, annotation: { text: 'D(p‖q) = Σ p log(p/q)', position: 'bottom' } } },
  { lineId: 'as-4', sectionId: 'ask', scene: { id: 'as-4', type: 'animation' }, lineState: { params: { p: P, q: Q_ASYM, show: [true, false, false] }, annotation: { text: '交叉熵 = 熵 + KL', position: 'bottom' } } },
  { lineId: 'as-5', sectionId: 'ask', scene: { id: 'as-5', type: 'animation' }, lineState: { params: { p: P, q: Q_ASYM, show: [true, false, false] }, annotation: { text: '「对数损失」的来历，这里说清', position: 'bottom' } } },

  { lineId: 'gb-1', sectionId: 'gibbs', scene: { id: 'gb-1', type: 'animation' }, lineState: { params: { p: P, q: Q_CLOSE, show: [true, false, false] }, annotation: { text: 'D ≥ 0，等号仅当 p = q', position: 'top' } } },
  { lineId: 'gb-2', sectionId: 'gibbs', scene: { id: 'gb-2', type: 'animation' }, lineState: { params: { p: P, q: Q_CLOSE, show: [true, false, false] }, annotation: { text: '用错分布只会更费，绝不会更省', position: 'bottom' } } },
  { lineId: 'gb-3', sectionId: 'gibbs', scene: { id: 'gb-3', type: 'animation' }, lineState: { params: { p: P, q: Q_SAME, show: [true, false, false], camYaw: 1.1 }, annotation: { text: '整张曲面只在 q=p 处触底', position: 'bottom' } } },
  { lineId: 'gb-4', sectionId: 'gibbs', scene: { id: 'gb-4', type: 'animation' }, lineState: { params: { p: P, q: Q_SAME, show: [true, false, false], camYaw: 1.1 }, annotation: { text: '741 个采样点，零个负值', position: 'bottom' } } },
  { lineId: 'gb-5', sectionId: 'gibbs', scene: { id: 'gb-5', type: 'animation' }, lineState: { params: { p: P, q: Q_CLOSE, show: [true, false, false] }, annotation: { text: '极大似然为什么对：就靠这条', position: 'bottom' } } },

  { lineId: 'am-1', sectionId: 'asym', scene: { id: 'am-1', type: 'animation' }, lineState: { params: { p: P, q: Q_ASYM, show: [true, false, false] }, annotation: { text: 'D(p‖q) ≠ D(q‖p)', position: 'top' } } },
  { lineId: 'am-2', sectionId: 'asym', scene: { id: 'am-2', type: 'animation' }, lineState: { params: { p: P, q: Q_ASYM, show: [true, true, false] }, annotation: { text: '1.851 对 0.859，差一倍多', position: 'bottom' } } },
  { lineId: 'am-3', sectionId: 'asym', scene: { id: 'am-3', type: 'animation' }, lineState: { params: { p: P, q: Q_ASYM, show: [true, true, false], camYaw: 1.4 }, annotation: { text: '蓝色边界急升，粉色平缓', position: 'bottom' } } },
  { lineId: 'am-4', sectionId: 'asym', scene: { id: 'am-4', type: 'animation' }, lineState: { params: { p: P, q: Q_ASYM, show: [true, true, false], camYaw: 1.4 }, annotation: { text: '三角不等式也不满足 ⇒ 不是距离', position: 'bottom' } } },
  { lineId: 'am-5', sectionId: 'asym', scene: { id: 'am-5', type: 'animation' }, lineState: { params: { p: P, q: Q_ASYM, show: [false, false, true] }, annotation: { text: 'JS 散度：对称、有界、可开方成距离', position: 'bottom' } } },

  { lineId: 'if-1', sectionId: 'infinity', scene: { id: 'if-1', type: 'animation' }, lineState: { params: { p: P, q: Q_ZERO, show: [true, false, false] }, annotation: { text: '有个退化必须单独说', position: 'top' } } },
  { lineId: 'if-2', sectionId: 'infinity', scene: { id: 'if-2', type: 'animation' }, lineState: { params: { p: P, q: Q_ZERO, show: [true, false, false] }, annotation: { text: 'q=0 而 p>0 ⇒ KL = ∞（真发散）', position: 'bottom' } } },
  { lineId: 'if-3', sectionId: 'infinity', scene: { id: 'if-3', type: 'animation' }, lineState: { params: { p: P, q: Q_ZERO, show: [true, false, false] }, annotation: { text: '模型说不可能的事发生了', position: 'bottom' } } },
  { lineId: 'if-4', sectionId: 'infinity', scene: { id: 'if-4', type: 'animation' }, lineState: { params: { p: P, q: Q_ZERO, show: [true, true, false] }, annotation: { text: '反过来 p=0 却有限 —— 单向的', position: 'bottom' } } },
  { lineId: 'if-5', sectionId: 'infinity', scene: { id: 'if-5', type: 'animation' }, lineState: { params: { p: P, q: Q_ZERO, show: [true, false, false], camYaw: 1.6 }, annotation: { text: '边界淡色区实为 ∞，图上只是截断', position: 'bottom' } } },
  { lineId: 'if-6', sectionId: 'infinity', scene: { id: 'if-6', type: 'animation' }, lineState: { params: { p: P, q: Q_ZERO, show: [false, false, true] }, annotation: { text: 'JS 天然免疫：中介覆盖了两者', position: 'bottom' } } },

  { lineId: 'ml-1', sectionId: 'ml', scene: { id: 'ml-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: P, q: Q_CLOSE, show: [true, false, false] }, annotation: { text: 'H(p) 与模型无关 ⇒ 两者等价', position: 'top' } } },
  { lineId: 'ml-2', sectionId: 'ml', scene: { id: 'ml-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: P, q: Q_CLOSE, show: [true, false, false] }, annotation: { text: '分类损失就是在逼近真实分布', position: 'bottom' } } },
  { lineId: 'ml-3', sectionId: 'ml', scene: { id: 'ml-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: P, q: Q_ASYM, show: [true, false, false], camYaw: 1.2 }, annotation: { text: '前向：q 必须覆盖 p ⇒ 趋向平均', position: 'bottom' } } },
  { lineId: 'ml-4', sectionId: 'ml', scene: { id: 'ml-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: P, q: Q_ASYM, show: [false, true, false], camYaw: 1.2 }, annotation: { text: '反向：q 可缩到一个峰 ⇒ 挑模式', position: 'bottom' } } },
  { lineId: 'ml-5', sectionId: 'ml', scene: { id: 'ml-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: P, q: Q_ASYM, show: [true, true, false], camYaw: 1.2 }, annotation: { text: '变分推断低估方差，就是这么来的', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'D ≥ 0，等号仅当 p = q', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '不对称、非距离、可能是 ∞', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '前向覆盖，反向挑峰', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
