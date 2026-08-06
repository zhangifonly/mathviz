/**
 * Moore-Penrose 伪逆 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选情形，nullShift 沿零空间挪解，
 * panel 在「并排 / 只看 b / 只看 x」之间切。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultPseudoinverseState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pseudoinverseScenes: NarrationLineScene[] = [
  { lineId: 'ga-1', sectionId: 'gap', scene: { id: 'ga-1', type: 'title' }, lineState: { params: { presetId: 'invertible', panel: 'both' }, annotation: { text: '最小二乘只讲了一种情形', position: 'top' } } },
  { lineId: 'ga-2', sectionId: 'gap', scene: { id: 'ga-2', type: 'animation' }, lineState: { params: { presetId: 'invertible', panel: 'both' }, annotation: { text: '超定 + 列满秩：解唯一', position: 'bottom' } } },
  { lineId: 'ga-3', sectionId: 'gap', scene: { id: 'ga-3', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: '欠定？秩亏？正规方程失效', position: 'bottom' } } },
  { lineId: 'ga-4', sectionId: 'gap', scene: { id: 'ga-4', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: '残差最小；若不唯一，取范数最小', position: 'bottom' } } },
  { lineId: 'ga-5', sectionId: 'gap', scene: { id: 'ga-5', type: 'animation' }, lineState: { params: { presetId: 'zero', panel: 'both' }, annotation: { text: '一个公式管所有情况，包括零矩阵', position: 'bottom' } } },

  { lineId: 'bu-1', sectionId: 'build', scene: { id: 'bu-1', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: 'A = UΣVᵀ', position: 'top' } } },
  { lineId: 'bu-2', sectionId: 'build', scene: { id: 'bu-2', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: 'A⁺ = VΣ⁺Uᵀ，玄机全在 Σ⁺', position: 'bottom' } } },
  { lineId: 'bu-3', sectionId: 'build', scene: { id: 'bu-3', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'x' }, annotation: { text: '非零取倒数，零仍取零', position: 'bottom' } } },
  { lineId: 'bu-4', sectionId: 'build', scene: { id: 'bu-4', type: 'animation' }, lineState: { params: { presetId: 'rank1', panel: 'x' }, annotation: { text: '1/0 本该是 ∞，这里却写 0', position: 'bottom' } } },
  { lineId: 'bu-5', sectionId: 'build', scene: { id: 'bu-5', type: 'animation' }, lineState: { params: { presetId: 'rank1', panel: 'x' }, annotation: { text: '被压扁的方向恢复不了，不该乱猜', position: 'bottom' } } },
  { lineId: 'bu-6', sectionId: 'build', scene: { id: 'bu-6', type: 'animation' }, lineState: { params: { presetId: 'rank1', panel: 'x' }, annotation: { text: '那个方向取 0 ⇒ 长度最短', position: 'bottom' } } },

  { lineId: 'tp-1', sectionId: 'twoproj', scene: { id: 'tp-1', type: 'animation' }, lineState: { params: { presetId: 'rank2-incons', panel: 'both' }, annotation: { text: '两幅图 = 伪逆做的两件事', position: 'top' } } },
  { lineId: 'tp-2', sectionId: 'twoproj', scene: { id: 'tp-2', type: 'animation' }, lineState: { params: { presetId: 'rank2-incons', panel: 'b' }, annotation: { text: '蓝面 = 列空间；b 不在上面 ⇒ 无解', position: 'bottom' } } },
  { lineId: 'tp-3', sectionId: 'twoproj', scene: { id: 'tp-3', type: 'animation' }, lineState: { params: { presetId: 'rank2-incons', panel: 'b' }, annotation: { text: '红虚线 = 残差，与列空间垂直', position: 'bottom' } } },
  { lineId: 'tp-4', sectionId: 'twoproj', scene: { id: 'tp-4', type: 'animation' }, lineState: { params: { presetId: 'rank2-incons', panel: 'b' }, annotation: { text: 'AA⁺ = 到列空间的正交投影', position: 'bottom' } } },
  { lineId: 'tp-5', sectionId: 'twoproj', scene: { id: 'tp-5', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'x' }, annotation: { text: '粉面 = 零空间：沿它挪残差不变', position: 'bottom' } } },
  { lineId: 'tp-6', sectionId: 'twoproj', scene: { id: 'tp-6', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'x', nullShift: 1.2 }, annotation: { text: '整张面上都是同样好的解', position: 'bottom' } } },
  { lineId: 'tp-7', sectionId: 'twoproj', scene: { id: 'tp-7', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'rank2', panel: 'x', nullShift: 2.2 }, annotation: { text: '残差不动，长度变大 ⇒ x⁺ 最短', position: 'bottom' } } },

  { lineId: 'pe-1', sectionId: 'penrose', scene: { id: 'pe-1', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: 'SVD 不唯一，伪逆会不会也不唯一？', position: 'top' } } },
  { lineId: 'pe-2', sectionId: 'penrose', scene: { id: 'pe-2', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: '不会：四条件唯一刻画了 A⁺', position: 'bottom' } } },
  { lineId: 'pe-3', sectionId: 'penrose', scene: { id: 'pe-3', type: 'animation' }, lineState: { params: { presetId: 'zerocol', panel: 'both' }, annotation: { text: 'AA⁺A = A，A⁺AA⁺ = A⁺', position: 'bottom' } } },
  { lineId: 'pe-4', sectionId: 'penrose', scene: { id: 'pe-4', type: 'animation' }, lineState: { params: { presetId: 'zerocol', panel: 'both' }, annotation: { text: '两个乘积都对称 ⇒ 正交投影', position: 'bottom' } } },
  { lineId: 'pe-5', sectionId: 'penrose', scene: { id: 'pe-5', type: 'animation' }, lineState: { params: { presetId: 'zerocol', panel: 'both' }, annotation: { text: '实测偏差都在 1e−15 量级', position: 'bottom' } } },

  { lineId: 'pr-1', sectionId: 'practice', scene: { id: 'pr-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'invertible', panel: 'both' }, annotation: { text: '教科书上的两个公式', position: 'top' } } },
  { lineId: 'pr-2', sectionId: 'practice', scene: { id: 'pr-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'rank1', panel: 'both' }, annotation: { text: '秩亏时全废，只有 SVD 版本管用', position: 'bottom' } } },
  { lineId: 'pr-3', sectionId: 'practice', scene: { id: 'pr-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'rank1', panel: 'both' }, annotation: { text: '正规方程还会把条件数平方', position: 'bottom' } } },
  { lineId: 'pr-4', sectionId: 'practice', scene: { id: 'pr-4', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: '本课自己也在同一个坑边上', position: 'bottom' } } },
  { lineId: 'pr-5', sectionId: 'practice', scene: { id: 'pr-5', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: '容差 1e−10 曾把秩 2 判成满秩', position: 'bottom' } } },
  { lineId: 'pr-6', sectionId: 'practice', scene: { id: 'pr-6', type: 'animation' }, lineState: { params: { presetId: 'rank2', panel: 'both' }, annotation: { text: '「多小算零」这个阈值必须显式暴露', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '残差最小；若不唯一，范数最小', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'A⁺ = VΣ⁺Uᵀ，零仍取零', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '两个投影，四条 Penrose 条件', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
