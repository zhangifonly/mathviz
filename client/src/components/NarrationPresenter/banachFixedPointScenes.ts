/**
 * Banach 不动点定理 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选映射，steps 定迭代步数，
 * showCone 控制误差包络。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultBanachFixedPointState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const banachFixedPointScenes: NarrationLineScene[] = [
  { lineId: 'ga-1', sectionId: 'gap', scene: { id: 'ga-1', type: 'title' }, lineState: { params: { presetId: 'strong', steps: 12, showCone: false }, annotation: { text: '上一课：一维的 |g′|<1', position: 'top' } } },
  { lineId: 'ga-2', sectionId: 'gap', scene: { id: 'ga-2', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 16, showCone: false }, annotation: { text: '不动点真的存在吗？', position: 'bottom' } } },
  { lineId: 'ga-3', sectionId: 'gap', scene: { id: 'ga-3', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 20, showCone: false }, annotation: { text: '唯一吗？换初值会不会跑别处？', position: 'bottom' } } },
  { lineId: 'ga-4', sectionId: 'gap', scene: { id: 'ga-4', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 24, showCone: true }, annotation: { text: '能事先算出要迭代多少次吗？', position: 'bottom' } } },
  { lineId: 'ga-5', sectionId: 'gap', scene: { id: 'ga-5', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 24, showCone: true }, annotation: { text: '定理一次回答全部三个', position: 'bottom' } } },

  { lineId: 'th-1', sectionId: 'theorem', scene: { id: 'th-1', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 24, showCone: false }, annotation: { text: 'd(Tx,Ty) ≤ q·d(x,y)，q<1', position: 'top' } } },
  { lineId: 'th-2', sectionId: 'theorem', scene: { id: 'th-2', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 24, showCone: false }, annotation: { text: '存在、唯一、任何初值都收敛', position: 'bottom' } } },
  { lineId: 'th-3', sectionId: 'theorem', scene: { id: 'th-3', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 30, showCone: false }, annotation: { text: '序列是柯西列，完备性给出极限', position: 'bottom' } } },
  { lineId: 'th-4', sectionId: 'theorem', scene: { id: 'th-4', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 30, showCone: false }, annotation: { text: '有理数上的 √2：压缩却收敛不到', position: 'bottom' } } },
  { lineId: 'th-5', sectionId: 'theorem', scene: { id: 'th-5', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 24, showCone: true }, annotation: { text: 'd(xₙ,x*) ≤ qⁿ/(1−q)·d(x₁,x₀)', position: 'bottom' } } },
  { lineId: 'th-6', sectionId: 'theorem', scene: { id: 'th-6', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 24, showCone: true }, annotation: { text: '只用第一步 ⇒ 先验界', position: 'bottom' } } },

  { lineId: 'sp-1', sectionId: 'space', scene: { id: 'sp-1', type: 'animation' }, lineState: { params: { presetId: 'rotate', steps: 20, showCone: false, camPitch: 0.1 }, annotation: { text: '底面虚线 = 平面轨迹', position: 'top' } } },
  { lineId: 'sp-2', sectionId: 'space', scene: { id: 'sp-2', type: 'animation' }, lineState: { params: { presetId: 'rotate', steps: 20, showCone: false }, annotation: { text: '把步数拉成第三个方向', position: 'bottom' } } },
  { lineId: 'sp-3', sectionId: 'space', scene: { id: 'sp-3', type: 'animation' }, lineState: { params: { presetId: 'rotate', steps: 24, showCone: false }, annotation: { text: '绿线 = 不动点，越上越近', position: 'bottom' } } },
  { lineId: 'sp-4', sectionId: 'space', scene: { id: 'sp-4', type: 'animation' }, lineState: { params: { presetId: 'rotate', steps: 24, showCone: true }, annotation: { text: '黄圈 = 每步的先验误差界', position: 'bottom' } } },
  { lineId: 'sp-5', sectionId: 'space', scene: { id: 'sp-5', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 30, showCone: true }, annotation: { text: '40 步内一次也没越过，且不松', position: 'bottom' } } },
  { lineId: 'sp-6', sectionId: 'space', scene: { id: 'sp-6', type: 'animation' }, lineState: { params: { presetId: 'rotate', steps: 30, showCone: true, camYaw: 1.2 }, annotation: { text: '旋转收缩：螺旋着收进去', position: 'bottom' } } },

  { lineId: 'ap-1', sectionId: 'apriori', scene: { id: 'ap-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'strong', steps: 20, showCone: true }, annotation: { text: '反解：给定精度求步数', position: 'top' } } },
  { lineId: 'ap-2', sectionId: 'apriori', scene: { id: 'ap-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'strong', steps: 18, showCone: true }, annotation: { text: 'q≈0.42：1e−3 要 10 步，1e−6 要 18 步', position: 'bottom' } } },
  { lineId: 'ap-3', sectionId: 'apriori', scene: { id: 'ap-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'weak', steps: 40, showCone: true }, annotation: { text: '但估计是保守的', position: 'bottom' } } },
  { lineId: 'ap-4', sectionId: 'apriori', scene: { id: 'ap-4', type: 'animation' }, lineState: { params: { presetId: 'weak', steps: 50, showCone: true }, annotation: { text: 'q=0.9919：要求 1400 步，实际 387 步就够', position: 'bottom' } } },
  { lineId: 'ap-5', sectionId: 'apriori', scene: { id: 'ap-5', type: 'animation' }, lineState: { params: { presetId: 'weak', steps: 50, showCone: true }, annotation: { text: '后验界更紧：80.5 对 15.4', position: 'bottom' } } },
  { lineId: 'ap-6', sectionId: 'apriori', scene: { id: 'ap-6', type: 'animation' }, lineState: { params: { presetId: 'strong', steps: 24, showCone: true }, annotation: { text: '先验做规划，后验做停止判据', position: 'bottom' } } },

  { lineId: 'nc-1', sectionId: 'necessary', scene: { id: 'nc-1', type: 'animation' }, lineState: { params: { presetId: 'shear', steps: 30, showCone: false }, annotation: { text: '压缩是充分，不是必要', position: 'top' } } },
  { lineId: 'nc-2', sectionId: 'necessary', scene: { id: 'nc-2', type: 'animation' }, lineState: { params: { presetId: 'shear', steps: 30, showCone: false }, annotation: { text: 'A = [[0.5,3],[0,0.5]]', position: 'bottom' } } },
  { lineId: 'nc-3', sectionId: 'necessary', scene: { id: 'nc-3', type: 'animation' }, lineState: { params: { presetId: 'shear', steps: 30, showCone: false }, annotation: { text: '‖A‖=3.08：定理完全用不上', position: 'bottom' } } },
  { lineId: 'nc-4', sectionId: 'necessary', scene: { id: 'nc-4', type: 'animation' }, lineState: { params: { presetId: 'shear', steps: 50, showCone: false }, annotation: { text: '但 ρ=0.5，60 步后误差精确为 0', position: 'bottom' } } },
  { lineId: 'nc-5', sectionId: 'necessary', scene: { id: 'nc-5', type: 'animation' }, lineState: { params: { presetId: 'shear', steps: 50, showCone: false, camYaw: 1.3 }, annotation: { text: '收敛看谱半径，压缩看谱范数', position: 'bottom' } } },
  { lineId: 'nc-6', sectionId: 'necessary', scene: { id: 'nc-6', type: 'animation' }, lineState: { params: { presetId: 'diverge', steps: 24, showCone: false }, annotation: { text: 'ρ=1.1 才真发散；不动点仍在，只是不吸引', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '存在 + 唯一 + 收敛', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '先验界能事先算步数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '压缩充分不必要', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
