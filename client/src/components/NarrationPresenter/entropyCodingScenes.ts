/**
 * 信息熵与信源编码定理 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：p 定分布，show 三位分别控制
 * 熵/码长/冗余三张曲面。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultEntropyCodingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

const UNIFORM = [1 / 3, 1 / 3, 1 / 3]
const DYADIC = [0.5, 0.25, 0.25]
const SKEW = [0.7, 0.2, 0.1]
const NEARLY = [0.98, 0.01, 0.01]

export const entropyCodingScenes: NarrationLineScene[] = [
  { lineId: 'ga-1', sectionId: 'gap', scene: { id: 'ga-1', type: 'title' }, lineState: { params: { p: UNIFORM, show: [true, false, false] }, annotation: { text: '决策树用了熵，却没说为什么是它', position: 'top' } } },
  { lineId: 'ga-2', sectionId: 'gap', scene: { id: 'ga-2', type: 'animation' }, lineState: { params: { p: DYADIC, show: [false, true, false] }, annotation: { text: '哈夫曼造出最优码，最优到哪？', position: 'bottom' } } },
  { lineId: 'ga-3', sectionId: 'gap', scene: { id: 'ga-3', type: 'animation' }, lineState: { params: { p: SKEW, show: [true, true, false] }, annotation: { text: '熵就是编码长度的下界', position: 'bottom' } } },
  { lineId: 'ga-4', sectionId: 'gap', scene: { id: 'ga-4', type: 'animation' }, lineState: { params: { p: SKEW, show: [true, true, false] }, annotation: { text: 'H ≤ L < H + 1', position: 'bottom' } } },

  { lineId: 'wh-1', sectionId: 'why', scene: { id: 'wh-1', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [true, false, false] }, annotation: { text: '为什么必须是 −Σp log p？', position: 'top' } } },
  { lineId: 'wh-2', sectionId: 'why', scene: { id: 'wh-2', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [true, false, false] }, annotation: { text: 'Shannon：先列要求，再证唯一', position: 'bottom' } } },
  { lineId: 'wh-3', sectionId: 'why', scene: { id: 'wh-3', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [true, false, false] }, annotation: { text: '连续性 + 单调性', position: 'bottom' } } },
  { lineId: 'wh-4', sectionId: 'why', scene: { id: 'wh-4', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [true, false, false] }, annotation: { text: '可加性：独立信源的熵相加', position: 'bottom' } } },
  { lineId: 'wh-5', sectionId: 'why', scene: { id: 'wh-5', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [true, false, false] }, annotation: { text: '三条就唯一确定，只差对数的底', position: 'bottom' } } },
  { lineId: 'wh-6', sectionId: 'why', scene: { id: 'wh-6', type: 'animation' }, lineState: { params: { p: SKEW, show: [true, false, false] }, annotation: { text: '实测 H(p^k)=kH(p)，误差 1e−15', position: 'bottom' } } },

  { lineId: 'sf-1', sectionId: 'surface', scene: { id: 'sf-1', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [false, false, false] }, annotation: { text: '底面三角形 = 所有三元分布', position: 'top' } } },
  { lineId: 'sf-2', sectionId: 'surface', scene: { id: 'sf-2', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [true, false, false] }, annotation: { text: '中心最高 log₂3=1.585，顶点为 0', position: 'bottom' } } },
  { lineId: 'sf-3', sectionId: 'surface', scene: { id: 'sf-3', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [true, false, false], camYaw: 1.1 }, annotation: { text: '熵是光滑的穹顶', position: 'bottom' } } },
  { lineId: 'sf-4', sectionId: 'surface', scene: { id: 'sf-4', type: 'animation' }, lineState: { params: { p: SKEW, show: [true, true, false], camYaw: 1.1 }, annotation: { text: '码长曲面整体在熵之上', position: 'bottom' } } },
  { lineId: 'sf-5', sectionId: 'surface', scene: { id: 'sf-5', type: 'animation' }, lineState: { params: { p: SKEW, show: [false, true, false], camYaw: 1.4 }, annotation: { text: '码长是阶梯 —— 只能取整数比特', position: 'bottom' } } },
  { lineId: 'sf-6', sectionId: 'surface', scene: { id: 'sf-6', type: 'animation' }, lineState: { params: { p: SKEW, show: [false, false, true], camYaw: 1.4 }, annotation: { text: '缝隙就是整数约束的代价', position: 'bottom' } } },

  { lineId: 'ex-1', sectionId: 'exact', scene: { id: 'ex-1', type: 'animation' }, lineState: { params: { p: DYADIC, show: [true, true, false] }, annotation: { text: '有些位置两张曲面贴合', position: 'top' } } },
  { lineId: 'ex-2', sectionId: 'exact', scene: { id: 'ex-2', type: 'animation' }, lineState: { params: { p: DYADIC, show: [true, true, false] }, annotation: { text: 'H = L = 1.5，冗余精确为 0', position: 'bottom' } } },
  { lineId: 'ex-3', sectionId: 'exact', scene: { id: 'ex-3', type: 'animation' }, lineState: { params: { p: DYADIC, show: [false, false, true] }, annotation: { text: 'p 全是 2 的幂 ⇒ 理想码长本就是整数', position: 'bottom' } } },
  { lineId: 'ex-4', sectionId: 'exact', scene: { id: 'ex-4', type: 'animation' }, lineState: { params: { p: UNIFORM, show: [true, true, false] }, annotation: { text: '均匀分布：1.585 对 1.667', position: 'bottom' } } },
  { lineId: 'ex-5', sectionId: 'exact', scene: { id: 'ex-5', type: 'animation' }, lineState: { params: { p: NEARLY, show: [true, true, false] }, annotation: { text: '几乎确定时浪费 0.859，逼近上限', position: 'bottom' } } },

  { lineId: 'bl-1', sectionId: 'block', scene: { id: 'bl-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: NEARLY, show: [true, true, false] }, annotation: { text: '二元 [0.9,0.1]：H=0.469 但 L=1', position: 'top' } } },
  { lineId: 'bl-2', sectionId: 'block', scene: { id: 'bl-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: NEARLY, show: [false, false, true] }, annotation: { text: '一个符号不能用半个比特编', position: 'bottom' } } },
  { lineId: 'bl-3', sectionId: 'block', scene: { id: 'bl-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: SKEW, show: [true, true, false] }, annotation: { text: 'k=2→0.645，k=4→0.493', position: 'bottom' } } },
  { lineId: 'bl-4', sectionId: 'block', scene: { id: 'bl-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: SKEW, show: [true, true, false] }, annotation: { text: '「+1」被摊薄成「+1/k」', position: 'bottom' } } },
  { lineId: 'bl-5', sectionId: 'block', scene: { id: 'bl-5', type: 'animation' }, lineState: { params: { p: SKEW, show: [false, false, true] }, annotation: { text: '但并非每步都更好：k=3 反而比 k=2 差', position: 'bottom' } } },
  { lineId: 'bl-6', sectionId: 'block', scene: { id: 'bl-6', type: 'animation' }, lineState: { params: { p: SKEW, show: [true, true, false] }, annotation: { text: '算术编码能给分数比特，绕开取整', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '三条要求唯一确定了熵', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'H ≤ L < H+1', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '穹顶与阶梯之间就是取整的代价', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
