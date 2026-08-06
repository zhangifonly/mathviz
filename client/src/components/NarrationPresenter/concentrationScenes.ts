/**
 * 集中不等式 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：t 定容差，nMax 定 n 轴范围，
 * show 三位分别控制真实/Chebyshev/Hoeffding 三张曲面。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultConcentrationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const concentrationScenes: NarrationLineScene[] = [
  { lineId: 'as-1', sectionId: 'ask', scene: { id: 'as-1', type: 'title' }, lineState: { params: { t: 0.2, nMax: 120, show: [true, false, false] }, annotation: { text: '大数定律只说「会收敛」', position: 'top' } } },
  { lineId: 'as-2', sectionId: 'ask', scene: { id: 'as-2', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 120, show: [true, false, false] }, annotation: { text: '偏离超过 t 的概率有多大？', position: 'bottom' } } },
  { lineId: 'as-3', sectionId: 'ask', scene: { id: 'as-3', type: 'animation' }, lineState: { params: { t: 0.1, nMax: 400, show: [true, false, false] }, annotation: { text: '要多少样本才有 95% 把握？', position: 'bottom' } } },
  { lineId: 'as-4', sectionId: 'ask', scene: { id: 'as-4', type: 'animation' }, lineState: { params: { t: 0.1, nMax: 400, show: [true, true, true] }, annotation: { text: '三个界，一个比一个紧', position: 'bottom' } } },

  { lineId: 'th-1', sectionId: 'three', scene: { id: 'th-1', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 120, show: [true, false, false] }, annotation: { text: 'Markov：P(X≥a) ≤ E[X]/a', position: 'top' } } },
  { lineId: 'th-2', sectionId: 'three', scene: { id: 'th-2', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 120, show: [true, false, false] }, annotation: { text: '它是另外两个的来源', position: 'bottom' } } },
  { lineId: 'th-3', sectionId: 'three', scene: { id: 'th-3', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 120, show: [true, true, false] }, annotation: { text: 'Chebyshev：用在 (X−μ)² 上', position: 'bottom' } } },
  { lineId: 'th-4', sectionId: 'three', scene: { id: 'th-4', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 200, show: [true, true, false] }, annotation: { text: 'σ²/(nt²)：随 n 线性衰减', position: 'bottom' } } },
  { lineId: 'th-5', sectionId: 'three', scene: { id: 'th-5', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 200, show: [true, false, true] }, annotation: { text: 'Hoeffding：用在 e^(λX) 上', position: 'bottom' } } },
  { lineId: 'th-6', sectionId: 'three', scene: { id: 'th-6', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 200, show: [true, true, true] }, annotation: { text: '2e^(−2nt²)：指数衰减，但要有界', position: 'bottom' } } },

  { lineId: 'sh-1', sectionId: 'shape', scene: { id: 'sh-1', type: 'animation' }, lineState: { params: { t: 0.15, nMax: 300, show: [true, true, true] }, annotation: { text: '底面是 (n, t) 两个方向', position: 'top' } } },
  { lineId: 'sh-2', sectionId: 'shape', scene: { id: 'sh-2', type: 'animation' }, lineState: { params: { t: 0.15, nMax: 300, show: [true, true, true] }, annotation: { text: '竖轴是对数：跨几十个数量级', position: 'bottom' } } },
  { lineId: 'sh-3', sectionId: 'shape', scene: { id: 'sh-3', type: 'animation' }, lineState: { params: { t: 0.15, nMax: 300, show: [true, true, true] }, annotation: { text: '两个界都在真实值之上', position: 'bottom' } } },
  { lineId: 'sh-4', sectionId: 'shape', scene: { id: 'sh-4', type: 'animation' }, lineState: { params: { t: 0.15, nMax: 400, show: [false, true, true], camYaw: 1.2 }, annotation: { text: '黄=缓坡，蓝=陡崖', position: 'bottom' } } },
  { lineId: 'sh-5', sectionId: 'shape', scene: { id: 'sh-5', type: 'animation' }, lineState: { params: { t: 0.15, nMax: 400, show: [true, true, true], camYaw: 1.5 }, annotation: { text: '两张曲面的交线，二维画不出', position: 'bottom' } } },

  { lineId: 'cr-1', sectionId: 'cross', scene: { id: 'cr-1', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 120, show: [false, true, true] }, annotation: { text: '「指数一定更紧」是错的', position: 'top' } } },
  { lineId: 'cr-2', sectionId: 'cross', scene: { id: 'cr-2', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 60, show: [false, true, true] }, annotation: { text: 'n=10, t=0.2：0.625 对 0.899', position: 'bottom' } } },
  { lineId: 'cr-3', sectionId: 'cross', scene: { id: 'cr-3', type: 'animation' }, lineState: { params: { t: 0.2, nMax: 60, show: [false, true, true] }, annotation: { text: 'Hoeffding 前面压着一个 2', position: 'bottom' } } },
  { lineId: 'cr-4', sectionId: 'cross', scene: { id: 'cr-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { t: 0.1, nMax: 400, show: [false, true, true] }, annotation: { text: '交叉点：t=0.3→12，t=0.1→108', position: 'bottom' } } },
  { lineId: 'cr-5', sectionId: 'cross', scene: { id: 'cr-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { t: 0.1, nMax: 400, show: [true, true, true] }, annotation: { text: '「n 够大时更好」，而够大取决于 t', position: 'bottom' } } },

  { lineId: 'sa-1', sectionId: 'sample', scene: { id: 'sa-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { t: 0.1, nMax: 600, show: [true, true, true] }, annotation: { text: '反过来：给定精度解 n', position: 'top' } } },
  { lineId: 'sa-2', sectionId: 'sample', scene: { id: 'sa-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { t: 0.1, nMax: 600, show: [false, true, true] }, annotation: { text: 'Cheb 要 500，Hoef 要 185', position: 'bottom' } } },
  { lineId: 'sa-3', sectionId: 'sample', scene: { id: 'sa-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { t: 0.1, nMax: 600, show: [true, true, true] }, annotation: { text: '真实只要 106', position: 'bottom' } } },
  { lineId: 'sa-4', sectionId: 'sample', scene: { id: 'sa-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { t: 0.1, nMax: 600, show: [false, false, true] }, annotation: { text: '但真实概率要先知道分布', position: 'bottom' } } },
  { lineId: 'sa-5', sectionId: 'sample', scene: { id: 'sa-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { t: 0.1, nMax: 600, show: [false, false, true] }, annotation: { text: '能推广到鞅、到矩阵', position: 'bottom' } } },
  { lineId: 'sa-6', sectionId: 'sample', scene: { id: 'sa-6', type: 'animation' }, lineState: { params: { t: 0.1, nMax: 200, show: [true, false, false] }, annotation: { text: '尾概率并非单调：120 步里 48 次回升', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'Markov → Chebyshev → Hoeffding', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '线性衰减 vs 指数衰减，有交叉点', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '松，但不需要知道分布', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
