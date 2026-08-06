/**
 * 亏损矩阵与 Jordan 标准型 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选矩阵，steps 控制轨道长度，
 * showChain/showOrbits 控制广义特征向量与轨道。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultJordanFormState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const jordanFormScenes: NarrationLineScene[] = [
  { lineId: 'ga-1', sectionId: 'gap', scene: { id: 'ga-1', type: 'title' }, lineState: { params: { presetId: 'symmetric', showChain: false, showOrbits: false }, annotation: { text: '对称矩阵总能对角化', position: 'top' } } },
  { lineId: 'ga-2', sectionId: 'gap', scene: { id: 'ga-2', type: 'animation' }, lineState: { params: { presetId: 'jordan2', showChain: false, showOrbits: false }, annotation: { text: '不对称的呢？什么时候失败？', position: 'bottom' } } },
  { lineId: 'ga-3', sectionId: 'gap', scene: { id: 'ga-3', type: 'animation' }, lineState: { params: { presetId: 'jordan3', showChain: false, showOrbits: false }, annotation: { text: '原因只有一个：特征向量不够用', position: 'bottom' } } },
  { lineId: 'ga-4', sectionId: 'gap', scene: { id: 'ga-4', type: 'animation' }, lineState: { params: { presetId: 'jordan3', showChain: false, showOrbits: false }, annotation: { text: '这种矩阵叫「亏损」', position: 'bottom' } } },

  { lineId: 'tw-1', sectionId: 'two', scene: { id: 'tw-1', type: 'animation' }, lineState: { params: { presetId: 'jordan2', showChain: false, showOrbits: false }, annotation: { text: '先分开两个容易混的概念', position: 'top' } } },
  { lineId: 'tw-2', sectionId: 'two', scene: { id: 'tw-2', type: 'animation' }, lineState: { params: { presetId: 'jordan2', showChain: false, showOrbits: false }, annotation: { text: '代数重数 = 特征多项式的根重数', position: 'bottom' } } },
  { lineId: 'tw-3', sectionId: 'two', scene: { id: 'tw-3', type: 'animation' }, lineState: { params: { presetId: 'jordan2', showChain: false, showOrbits: false }, annotation: { text: '几何重数 = dim ker(A−λI)', position: 'bottom' } } },
  { lineId: 'tw-4', sectionId: 'two', scene: { id: 'tw-4', type: 'animation' }, lineState: { params: { presetId: 'diag', showChain: false, showOrbits: false }, annotation: { text: '相等 ⇒ 可对角化；几何<代数 ⇒ 亏损', position: 'bottom' } } },
  { lineId: 'tw-5', sectionId: 'two', scene: { id: 'tw-5', type: 'animation' }, lineState: { params: { presetId: 'jordan2', showChain: false, showOrbits: false }, annotation: { text: '代数 2 / 几何 1：少了一条方向', position: 'bottom' } } },

  { lineId: 'wh-1', sectionId: 'why', scene: { id: 'wh-1', type: 'animation' }, lineState: { params: { presetId: 'diag', showChain: false, showOrbits: false }, annotation: { text: '可对角化：三条绿箭头撑满空间', position: 'top' } } },
  { lineId: 'wh-2', sectionId: 'why', scene: { id: 'wh-2', type: 'animation' }, lineState: { params: { presetId: 'jordan3', showChain: false, showOrbits: false }, annotation: { text: '三阶块：整个空间只剩一条', position: 'bottom' } } },
  { lineId: 'wh-3', sectionId: 'why', scene: { id: 'wh-3', type: 'animation' }, lineState: { params: { presetId: 'shear', showChain: false, showOrbits: false }, annotation: { text: '剪切：竖直方向被推歪了', position: 'bottom' } } },
  { lineId: 'wh-4', sectionId: 'why', scene: { id: 'wh-4', type: 'animation' }, lineState: { params: { presetId: 'diag', showChain: false, showOrbits: true, steps: 12 }, annotation: { text: '蓝线 = 轨道，已归一化到球面', position: 'bottom' } } },
  { lineId: 'wh-5', sectionId: 'why', scene: { id: 'wh-5', type: 'animation' }, lineState: { params: { presetId: 'jordan3', showChain: false, showOrbits: true, steps: 16 }, annotation: { text: '亏损时轨道全挤到同一条方向', position: 'bottom' } } },

  { lineId: 'fi-1', sectionId: 'fix', scene: { id: 'fi-1', type: 'animation' }, lineState: { params: { presetId: 'jordan2', showChain: false, showOrbits: false }, annotation: { text: '凑不出特征向量，那就退一步', position: 'top' } } },
  { lineId: 'fi-2', sectionId: 'fix', scene: { id: 'fi-2', type: 'animation' }, lineState: { params: { presetId: 'jordan2', showChain: true, showOrbits: false }, annotation: { text: '(A−λI)v₂ = v₁，不是 = 0', position: 'bottom' } } },
  { lineId: 'fi-3', sectionId: 'fix', scene: { id: 'fi-3', type: 'animation' }, lineState: { params: { presetId: 'jordan2', showChain: true, showOrbits: false }, annotation: { text: '粉色虚线 = 广义特征向量', position: 'bottom' } } },
  { lineId: 'fi-4', sectionId: 'fix', scene: { id: 'fi-4', type: 'animation' }, lineState: { params: { presetId: 'jordan3', showChain: true, showOrbits: false }, annotation: { text: '串成 Jordan 链，链长 = 块大小', position: 'bottom' } } },
  { lineId: 'fi-5', sectionId: 'fix', scene: { id: 'fi-5', type: 'animation' }, lineState: { params: { presetId: 'jordan3', showChain: true, showOrbits: false }, annotation: { text: '上对角线那个 1 = 差的那一点', position: 'bottom' } } },

  { lineId: 'fr-1', sectionId: 'fragile', scene: { id: 'fr-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'jordan2', showChain: true, showOrbits: false }, annotation: { text: '理论完美：相似变换的完全不变量', position: 'top' } } },
  { lineId: 'fr-2', sectionId: 'fragile', scene: { id: 'fr-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'jordan2', showChain: true, showOrbits: false }, annotation: { text: '但亏损极其脆弱', position: 'bottom' } } },
  { lineId: 'fr-3', sectionId: 'fragile', scene: { id: 'fr-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'jordan2', showChain: true, showOrbits: false }, annotation: { text: '偏离 ∝ √eps，不是 eps', position: 'bottom' } } },
  { lineId: 'fr-4', sectionId: 'fragile', scene: { id: 'fr-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'jordan2', showChain: true, showOrbits: false }, annotation: { text: '1e−12 的扰动 → 1e−6 的偏离', position: 'bottom' } } },
  { lineId: 'fr-5', sectionId: 'fragile', scene: { id: 'fr-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'diag', showChain: false, showOrbits: false }, annotation: { text: '所以数值软件宁可用 Schur 分解', position: 'bottom' } } },
  { lineId: 'fr-6', sectionId: 'fragile', scene: { id: 'fr-6', type: 'animation' }, lineState: { params: { presetId: 'jordan3', showChain: true, showOrbits: false }, annotation: { text: '本课求根器自己也有分辨率极限', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '几何重数 < 代数重数 = 亏损', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'Jordan 链补上缺的方向', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '理论完美，数值上慎用', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
