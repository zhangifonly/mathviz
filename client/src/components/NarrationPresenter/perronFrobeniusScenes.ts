/**
 * Perron-Frobenius 定理 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选矩阵，damping 加阻尼，
 * panel 在「并排 / 单纯形 / 特征值」之间切。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultPerronFrobeniusState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const perronFrobeniusScenes: NarrationLineScene[] = [
  { lineId: 'wh-1', sectionId: 'why', scene: { id: 'wh-1', type: 'title' }, lineState: { params: { presetId: 'positive', panel: 'simplex' }, annotation: { text: '两课都断言「收敛到唯一稳态」', position: 'top' } } },
  { lineId: 'wh-2', sectionId: 'why', scene: { id: 'wh-2', type: 'animation' }, lineState: { params: { presetId: 'periodic', panel: 'simplex' }, annotation: { text: '却没说什么时候会失败', position: 'bottom' } } },
  { lineId: 'wh-3', sectionId: 'why', scene: { id: 'wh-3', type: 'animation' }, lineState: { params: { presetId: 'positive', panel: 'both' }, annotation: { text: '某幂全正 ⇒ 最大实特征值严格占优', position: 'bottom' } } },
  { lineId: 'wh-4', sectionId: 'why', scene: { id: 'wh-4', type: 'animation' }, lineState: { params: { presetId: 'positive', panel: 'both' }, annotation: { text: 'Perron 根：特征向量处处为正', position: 'bottom' } } },

  { lineId: 'gp-1', sectionId: 'gap', scene: { id: 'gp-1', type: 'animation' }, lineState: { params: { presetId: 'positive', panel: 'spectrum' }, annotation: { text: '谱隙 = |λ₁| − |λ₂|', position: 'top' } } },
  { lineId: 'gp-2', sectionId: 'gap', scene: { id: 'gp-2', type: 'animation' }, lineState: { params: { presetId: 'positive', panel: 'spectrum' }, annotation: { text: '按特征向量展开，各分量各乘各的 λ', position: 'bottom' } } },
  { lineId: 'gp-3', sectionId: 'gap', scene: { id: 'gp-3', type: 'animation' }, lineState: { params: { presetId: 'positive', panel: 'spectrum' }, annotation: { text: '每步误差乘 |λ₂|/|λ₁|', position: 'bottom' } } },
  { lineId: 'gp-4', sectionId: 'gap', scene: { id: 'gp-4', type: 'animation' }, lineState: { params: { presetId: 'positive', panel: 'spectrum' }, annotation: { text: '两圈之间的距离就是谱隙', position: 'bottom' } } },
  { lineId: 'gp-5', sectionId: 'gap', scene: { id: 'gp-5', type: 'animation' }, lineState: { params: { presetId: 'slow', panel: 'both', steps: 60 }, annotation: { text: '谱隙 0.03 ⇒ 要迭代几百步', position: 'bottom' } } },

  { lineId: 'f1-1', sectionId: 'fail1', scene: { id: 'f1-1', type: 'animation' }, lineState: { params: { presetId: 'periodic', panel: 'both' }, annotation: { text: '循环置换：1→2→3→1', position: 'top' } } },
  { lineId: 'f1-2', sectionId: 'fail1', scene: { id: 'f1-2', type: 'animation' }, lineState: { params: { presetId: 'periodic', panel: 'spectrum' }, annotation: { text: '三个特征值全在单位圆上，谱隙 = 0', position: 'bottom' } } },
  { lineId: 'f1-3', sectionId: 'fail1', scene: { id: 'f1-3', type: 'animation' }, lineState: { params: { presetId: 'periodic', panel: 'simplex', steps: 30 }, annotation: { text: '轨迹在三个顶点之间永远绕圈', position: 'bottom' } } },
  { lineId: 'f1-4', sectionId: 'fail1', scene: { id: 'f1-4', type: 'animation' }, lineState: { params: { presetId: 'periodic', panel: 'simplex' }, annotation: { text: '不可约不够，还得本原', position: 'bottom' } } },
  { lineId: 'f1-5', sectionId: 'fail1', scene: { id: 'f1-5', type: 'animation' }, lineState: { params: { presetId: 'periodic', panel: 'simplex' }, annotation: { text: '均匀分布是不动点，会把周期性盖住', position: 'bottom' } } },

  { lineId: 'f2-1', sectionId: 'fail2', scene: { id: 'f2-1', type: 'animation' }, lineState: { params: { presetId: 'reducible', panel: 'both' }, annotation: { text: '状态 3 出不去也进不来', position: 'top' } } },
  { lineId: 'f2-2', sectionId: 'fail2', scene: { id: 'f2-2', type: 'animation' }, lineState: { params: { presetId: 'reducible', panel: 'simplex', steps: 20 }, annotation: { text: '这次迭代确实收敛了', position: 'bottom' } } },
  { lineId: 'f2-3', sectionId: 'fail2', scene: { id: 'f2-3', type: 'animation' }, lineState: { params: { presetId: 'reducible', panel: 'simplex', steps: 40 }, annotation: { text: '但三条轨迹停在不同的地方', position: 'bottom' } } },
  { lineId: 'f2-4', sectionId: 'fail2', scene: { id: 'f2-4', type: 'animation' }, lineState: { params: { presetId: 'reducible', panel: 'spectrum' }, annotation: { text: '特征值 1 是重根 ⇒ 稳态不唯一', position: 'bottom' } } },
  { lineId: 'f2-5', sectionId: 'fail2', scene: { id: 'f2-5', type: 'animation' }, lineState: { params: { presetId: 'reducible', panel: 'both' }, annotation: { text: '两种失败，要两个检测手段', position: 'bottom' } } },

  { lineId: 'dp-1', sectionId: 'damping', scene: { id: 'dp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'reducible', panel: 'both' }, annotation: { text: '真实网页图两种毛病都有', position: 'top' } } },
  { lineId: 'dp-2', sectionId: 'damping', scene: { id: 'dp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'reducible', panel: 'both', damping: 0.85 }, annotation: { text: 'd 概率顺链接走，1−d 概率随机跳', position: 'bottom' } } },
  { lineId: 'dp-3', sectionId: 'damping', scene: { id: 'dp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'periodic', panel: 'both', damping: 0.85 }, annotation: { text: '强行变成正矩阵 ⇒ 一定本原', position: 'bottom' } } },
  { lineId: 'dp-4', sectionId: 'damping', scene: { id: 'dp-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'periodic', panel: 'spectrum', damping: 0.85 }, annotation: { text: '谱隙从 0 变成 0.15', position: 'bottom' } } },
  { lineId: 'dp-5', sectionId: 'damping', scene: { id: 'dp-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'slow', panel: 'spectrum', damping: 0.85 }, annotation: { text: '收敛率 ≤ d，与图结构无关', position: 'bottom' } } },
  { lineId: 'dp-6', sectionId: 'damping', scene: { id: 'dp-6', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'reducible', panel: 'both', damping: 0.6 }, annotation: { text: 'd 小收敛快，但更抹掉原始结构', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '本原 ⇒ 唯一稳态，处处为正', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '谱隙定收敛速度', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '阻尼一举消除两种失败', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
