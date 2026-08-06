/**
 * 螺旋运动与 Chasles 定理 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选刚体运动，u 沿螺旋走，
 * showTrails/showDecomp 控制螺旋线与 t 的分解箭头。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultScrewMotionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const screwMotionScenes: NarrationLineScene[] = [
  { lineId: 'cl-1', sectionId: 'claim', scene: { id: 'cl-1', type: 'title' }, lineState: { params: { presetId: 'general', u: 0.3, showTrails: false, showDecomp: false }, annotation: { text: '上一课说的「旋量」是什么', position: 'top' } } },
  { lineId: 'cl-2', sectionId: 'claim', scene: { id: 'cl-2', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.5, showTrails: true, showDecomp: false }, annotation: { text: '任何刚体运动都是「拧螺丝」', position: 'bottom' } } },
  { lineId: 'cl-3', sectionId: 'claim', scene: { id: 'cl-3', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.7, showTrails: true, showDecomp: true }, annotation: { text: '转轴与平移方向凭什么重合？', position: 'bottom' } } },
  { lineId: 'cl-4', sectionId: 'claim', scene: { id: 'cl-4', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.7, showTrails: true, showDecomp: true }, annotation: { text: '因为轴的位置可以挪', position: 'bottom' } } },

  { lineId: 'sp-1', sectionId: 'split', scene: { id: 'sp-1', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.4, showTrails: false, showDecomp: true }, annotation: { text: '先取出轴方向与转角（log）', position: 'top' } } },
  { lineId: 'sp-2', sectionId: 'split', scene: { id: 'sp-2', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.4, showTrails: false, showDecomp: true }, annotation: { text: '粉=t，黄=沿轴，青=垂直', position: 'bottom' } } },
  { lineId: 'sp-3', sectionId: 'split', scene: { id: 'sp-3', type: 'animation' }, lineState: { params: { presetId: 'along', u: 0.5, showTrails: true, showDecomp: true }, annotation: { text: '沿轴那部分消不掉 = 螺距', position: 'bottom' } } },
  { lineId: 'sp-4', sectionId: 'split', scene: { id: 'sp-4', type: 'animation' }, lineState: { params: { presetId: 'perp', u: 0.5, showTrails: true, showDecomp: true }, annotation: { text: '垂直那部分靠挪轴消掉', position: 'bottom' } } },
  { lineId: 'sp-5', sectionId: 'split', scene: { id: 'sp-5', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.6, showTrails: true, showDecomp: true }, annotation: { text: '(I−R)c = t⊥，限制到垂直平面可逆', position: 'bottom' } } },

  { lineId: 'ax-1', sectionId: 'axis', scene: { id: 'ax-1', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.5, showTrails: true, showDecomp: false }, annotation: { text: '紫线 = 螺旋轴，一般不过原点', position: 'top' } } },
  { lineId: 'ax-2', sectionId: 'axis', scene: { id: 'ax-2', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.65, showTrails: true, showDecomp: false }, annotation: { text: '轴上的点应只沿轴平移', position: 'bottom' } } },
  { lineId: 'ax-3', sectionId: 'axis', scene: { id: 'ax-3', type: 'animation' }, lineState: { params: { presetId: 'general', u: 0.85, showTrails: true, showDecomp: false }, annotation: { text: '绿=直线段，蓝=螺旋线', position: 'bottom' } } },
  { lineId: 'ax-4', sectionId: 'axis', scene: { id: 'ax-4', type: 'animation' }, lineState: { params: { presetId: 'general', u: 1, showTrails: true, showDecomp: false }, annotation: { text: '离轴越远半径越大，螺距不变', position: 'bottom' } } },
  { lineId: 'ax-5', sectionId: 'axis', scene: { id: 'ax-5', type: 'animation' }, lineState: { params: { presetId: 'perp', u: 1, showTrails: true, showDecomp: false }, annotation: { text: '螺距 0：挪轴后成纯旋转', position: 'bottom' } } },

  { lineId: 'de-1', sectionId: 'degenerate', scene: { id: 'de-1', type: 'animation' }, lineState: { params: { presetId: 'tiny', u: 0.5, showTrails: true, showDecomp: true }, annotation: { text: '转角为 0：没有轴可言', position: 'top' } } },
  { lineId: 'de-2', sectionId: 'degenerate', scene: { id: 'de-2', type: 'animation' }, lineState: { params: { presetId: 'tiny', u: 0.6, showTrails: true, showDecomp: true }, annotation: { text: '公式里的 cot(θ/2) 会发散', position: 'bottom' } } },
  { lineId: 'de-3', sectionId: 'degenerate', scene: { id: 'de-3', type: 'animation' }, lineState: { params: { presetId: 'tiny', u: 0.8, showTrails: true, showDecomp: false }, annotation: { text: 'θ=0.08：轴已经被推得很远', position: 'bottom' } } },
  { lineId: 'de-4', sectionId: 'degenerate', scene: { id: 'de-4', type: 'animation' }, lineState: { params: { presetId: 'tiny', u: 1, showTrails: true, showDecomp: false }, annotation: { text: '纯平移 = 绕无穷远轴转无穷小角', position: 'bottom' } } },
  { lineId: 'de-5', sectionId: 'degenerate', scene: { id: 'de-5', type: 'animation' }, lineState: { params: { presetId: 'tilted', u: 0.6, showTrails: true, showDecomp: false }, annotation: { text: 'θ=π：取轴要换分支', position: 'bottom' } } },

  { lineId: 'us-1', sectionId: 'use', scene: { id: 'us-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'tilted', u: 0.5, showTrails: true, showDecomp: false }, annotation: { text: '机器人：旋量与指数积公式', position: 'top' } } },
  { lineId: 'us-2', sectionId: 'use', scene: { id: 'us-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'general', u: 0.4, showTrails: true, showDecomp: false }, annotation: { text: '运动插补：沿螺旋走最自然', position: 'bottom' } } },
  { lineId: 'us-3', sectionId: 'use', scene: { id: 'us-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'along', u: 0.8, showTrails: true, showDecomp: false }, annotation: { text: '螺旋副（丝杠）：固定螺距', position: 'bottom' } } },
  { lineId: 'us-4', sectionId: 'use', scene: { id: 'us-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'tilted', u: 1, showTrails: true, showDecomp: false }, annotation: { text: 'DNA 双螺旋的对称群', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '刚体运动 = 螺旋运动', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '沿轴消不掉，垂直靠挪轴消掉', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '轴上走直线，其余走螺旋线', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
