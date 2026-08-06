/**
 * Gershgorin 圆盘定理 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选矩阵，showCols 控制列圆盘层，
 * showComponents 控制连通分量配色。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultGershgorinState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gershgorinScenes: NarrationLineScene[] = [
  { lineId: 'as-1', sectionId: 'ask', scene: { id: 'as-1', type: 'title' }, lineState: { params: { presetId: 'isolated', showCols: false, showComponents: false }, annotation: { text: '上一课：特征值算不准', position: 'top' } } },
  { lineId: 'as-2', sectionId: 'ask', scene: { id: 'as-2', type: 'animation' }, lineState: { params: { presetId: 'isolated', showCols: false, showComponents: false }, annotation: { text: '不算，也能把它们圈起来', position: 'bottom' } } },
  { lineId: 'as-3', sectionId: 'ask', scene: { id: 'as-3', type: 'animation' }, lineState: { params: { presetId: 'isolated', showCols: false, showComponents: false }, annotation: { text: '圆心 = 对角元，半径 = 该行其余之和', position: 'bottom' } } },
  { lineId: 'as-4', sectionId: 'ask', scene: { id: 'as-4', type: 'animation' }, lineState: { params: { presetId: 'isolated', showCols: false, showComponents: true }, annotation: { text: '每个特征值都跑不出这些圆盘', position: 'bottom' } } },

  { lineId: 'pf-1', sectionId: 'proof', scene: { id: 'pf-1', type: 'animation' }, lineState: { params: { presetId: 'symmetric', showCols: false, showComponents: true }, annotation: { text: '证明短得可以背下来', position: 'top' } } },
  { lineId: 'pf-2', sectionId: 'proof', scene: { id: 'pf-2', type: 'animation' }, lineState: { params: { presetId: 'symmetric', showCols: false, showComponents: true }, annotation: { text: '盯住特征向量里模最大的分量 xᵢ', position: 'bottom' } } },
  { lineId: 'pf-3', sectionId: 'proof', scene: { id: 'pf-3', type: 'animation' }, lineState: { params: { presetId: 'symmetric', showCols: false, showComponents: true }, annotation: { text: '(λ − aᵢᵢ)xᵢ = Σ aᵢⱼxⱼ', position: 'bottom' } } },
  { lineId: 'pf-4', sectionId: 'proof', scene: { id: 'pf-4', type: 'animation' }, lineState: { params: { presetId: 'symmetric', showCols: false, showComponents: true }, annotation: { text: '除以 xᵢ：其余比值都 ≤ 1', position: 'bottom' } } },
  { lineId: 'pf-5', sectionId: 'proof', scene: { id: 'pf-5', type: 'animation' }, lineState: { params: { presetId: 'symmetric', showCols: false, showComponents: true }, annotation: { text: '|λ − aᵢᵢ| ≤ Rᵢ，证完', position: 'bottom' } } },
  { lineId: 'pf-6', sectionId: 'proof', scene: { id: 'pf-6', type: 'animation' }, lineState: { params: { presetId: 'complex', showCols: false, showComponents: true }, annotation: { text: '没假设 λ 是实数 —— 复平面上一样成立', position: 'bottom' } } },

  { lineId: 'cx-1', sectionId: 'complex', scene: { id: 'cx-1', type: 'animation' }, lineState: { params: { presetId: 'complex', showCols: false, showComponents: true }, annotation: { text: '旋转矩阵：λ = ±2i 和 5', position: 'top' } } },
  { lineId: 'cx-2', sectionId: 'complex', scene: { id: 'cx-2', type: 'animation' }, lineState: { params: { presetId: 'complex', showCols: false, showComponents: true, camPitch: 1.2 }, annotation: { text: '两个黄点浮在虚轴方向', position: 'bottom' } } },
  { lineId: 'cx-3', sectionId: 'complex', scene: { id: 'cx-3', type: 'animation' }, lineState: { params: { presetId: 'complex', showCols: false, showComponents: true, camPitch: 1.2 }, annotation: { text: '正好落在半径 2 的圆盘边界上', position: 'bottom' } } },
  { lineId: 'cx-4', sectionId: 'complex', scene: { id: 'cx-4', type: 'animation' }, lineState: { params: { presetId: 'complex', showCols: false, showComponents: true }, annotation: { text: '不需要事先知道特征值是实是复', position: 'bottom' } } },
  { lineId: 'cx-5', sectionId: 'complex', scene: { id: 'cx-5', type: 'animation' }, lineState: { params: { presetId: 'complex', showCols: true, showComponents: true }, annotation: { text: '下层是列圆盘，取交更紧', position: 'bottom' } } },

  { lineId: 'st-1', sectionId: 'strong', scene: { id: 'st-1', type: 'animation' }, lineState: { params: { presetId: 'loose', showCols: false, showComponents: true }, annotation: { text: '「至少落在某个盘里」还不够好用', position: 'top' } } },
  { lineId: 'st-2', sectionId: 'strong', scene: { id: 'st-2', type: 'animation' }, lineState: { params: { presetId: 'isolated', showCols: false, showComponents: true }, annotation: { text: 'k 个连成一片 ⇒ 恰好 k 个特征值', position: 'bottom' } } },
  { lineId: 'st-3', sectionId: 'strong', scene: { id: 'st-3', type: 'animation' }, lineState: { params: { presetId: 'isolated', showCols: false, showComponents: true }, annotation: { text: '第一个盘：圆心 10，半径 2，孤立', position: 'bottom' } } },
  { lineId: 'st-4', sectionId: 'strong', scene: { id: 'st-4', type: 'animation' }, lineState: { params: { presetId: 'isolated', showCols: false, showComponents: true }, annotation: { text: '里面恰好 1 个：λ = 10.2955', position: 'bottom' } } },
  { lineId: 'st-5', sectionId: 'strong', scene: { id: 'st-5', type: 'animation' }, lineState: { params: { presetId: 'isolated', showCols: false, showComponents: true }, annotation: { text: '同色 = 同一分量，盘数永远等于值数', position: 'bottom' } } },
  { lineId: 'st-6', sectionId: 'strong', scene: { id: 'st-6', type: 'animation' }, lineState: { params: { presetId: 'tight', showCols: false, showComponents: true }, annotation: { text: '这才能把特征值一个个隔离', position: 'bottom' } } },

  { lineId: 'us-1', sectionId: 'use', scene: { id: 'us-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'dominant', showCols: false, showComponents: true }, annotation: { text: '严格对角占优', position: 'top' } } },
  { lineId: 'us-2', sectionId: 'use', scene: { id: 'us-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'dominant', showCols: false, showComponents: true }, annotation: { text: '圆盘都不含 0 ⇒ 必可逆', position: 'bottom' } } },
  { lineId: 'us-3', sectionId: 'use', scene: { id: 'us-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'dominant', showCols: true, showComponents: true }, annotation: { text: 'Jacobi / Gauss-Seidel 收敛的经典条件', position: 'bottom' } } },
  { lineId: 'us-4', sectionId: 'use', scene: { id: 'us-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'symmetric', showCols: false, showComponents: true }, annotation: { text: '圆盘全在左半平面 ⇒ 系统稳定', position: 'bottom' } } },
  { lineId: 'us-5', sectionId: 'use', scene: { id: 'us-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'loose', showCols: false, showComponents: true }, annotation: { text: '非对角元大 ⇒ 界很松（9 对 8.12）', position: 'bottom' } } },
  { lineId: 'us-6', sectionId: 'use', scene: { id: 'us-6', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'tight', showCols: false, showComponents: true }, annotation: { text: '几乎对角 ⇒ 估计非常准', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '|λ − aᵢᵢ| ≤ Rᵢ', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'k 个盘连成一片 ⇒ 恰好 k 个值', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '不解方程也能说确定的话', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
