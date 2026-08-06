/**
 * 圆锥曲线的反射性质 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选曲线，t 定反射点，
 * mode 在「单条光线 / 光线扇 / 台球」之间切。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultConicReflectionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const conicReflectionScenes: NarrationLineScene[] = [
  { lineId: 'th-1', sectionId: 'three', scene: { id: 'th-1', type: 'title' }, lineState: { params: { presetId: 'ellipse', t: 1.1, mode: 'single' }, annotation: { text: '椭圆：从一个焦点到另一个焦点', position: 'top' } } },
  { lineId: 'th-2', sectionId: 'three', scene: { id: 'th-2', type: 'animation' }, lineState: { params: { presetId: 'parabola', t: 2.0, mode: 'single' }, annotation: { text: '抛物线：焦点 → 平行于轴', position: 'bottom' } } },
  { lineId: 'th-3', sectionId: 'three', scene: { id: 'th-3', type: 'animation' }, lineState: { params: { presetId: 'hyperbola', t: 0.9, mode: 'single' }, annotation: { text: '双曲线：像是从另一焦点发出', position: 'bottom' } } },
  { lineId: 'th-4', sectionId: 'three', scene: { id: 'th-4', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 2.4, mode: 'single' }, annotation: { text: '三条其实是同一条', position: 'bottom' } } },

  { lineId: 'eq-1', sectionId: 'equal', scene: { id: 'eq-1', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.1, mode: 'single' }, annotation: { text: '镜面 = 该点的切线', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equal', scene: { id: 'eq-2', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.1, mode: 'single' }, annotation: { text: '切线与两条焦半径等角', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equal', scene: { id: 'eq-3', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 0.6, mode: 'single' }, annotation: { text: '两段圆弧 = 两个角', position: 'bottom' } } },
  { lineId: 'eq-4', sectionId: 'equal', scene: { id: 'eq-4', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 3.7, mode: 'single' }, annotation: { text: '点在动，两角始终相等', position: 'bottom' } } },

  { lineId: 'wh-1', sectionId: 'why', scene: { id: 'wh-1', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.4, mode: 'single' }, annotation: { text: '换个角度看定义', position: 'top' } } },
  { lineId: 'wh-2', sectionId: 'why', scene: { id: 'wh-2', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.4, mode: 'single' }, annotation: { text: '椭圆 = |PF₁|+|PF₂| 的等值线', position: 'bottom' } } },
  { lineId: 'wh-3', sectionId: 'why', scene: { id: 'wh-3', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.4, mode: 'single' }, annotation: { text: '梯度 = û₁ + û₂', position: 'bottom' } } },
  { lineId: 'wh-4', sectionId: 'why', scene: { id: 'wh-4', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 2.0, mode: 'single' }, annotation: { text: '菱形对角线平分顶角', position: 'bottom' } } },
  { lineId: 'wh-5', sectionId: 'why', scene: { id: 'wh-5', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 2.0, mode: 'single' }, annotation: { text: '等值线 ⊥ 梯度 ⇒ 等角', position: 'bottom' } } },

  { lineId: 'ot-1', sectionId: 'other', scene: { id: 'ot-1', type: 'animation' }, lineState: { params: { presetId: 'hyperbola', t: 0.6, mode: 'single' }, annotation: { text: '和 → 差，其余不改', position: 'top' } } },
  { lineId: 'ot-2', sectionId: 'other', scene: { id: 'ot-2', type: 'animation' }, lineState: { params: { presetId: 'hyperbola', t: 0.9, mode: 'single' }, annotation: { text: 'û₁ − û₂ 落在外角平分线', position: 'bottom' } } },
  { lineId: 'ot-3', sectionId: 'other', scene: { id: 'ot-3', type: 'animation' }, lineState: { params: { presetId: 'hyperbola', t: 1.3, mode: 'single' }, annotation: { text: '虚线 = 反向延长线过 F₂', position: 'bottom' } } },
  { lineId: 'ot-4', sectionId: 'other', scene: { id: 'ot-4', type: 'animation' }, lineState: { params: { presetId: 'parabola', t: 1.5, mode: 'single' }, annotation: { text: 'F₂ 退到无穷远', position: 'bottom' } } },
  { lineId: 'ot-5', sectionId: 'other', scene: { id: 'ot-5', type: 'animation' }, lineState: { params: { presetId: 'parabola', t: 3.0, mode: 'fan' }, annotation: { text: '「过 F₂」读作「平行于轴」', position: 'bottom' } } },

  { lineId: 'bi-1', sectionId: 'billiard', scene: { id: 'bi-1', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.1, mode: 'billiard' }, annotation: { text: '从焦点开球，方向随便', position: 'top' } } },
  { lineId: 'bi-2', sectionId: 'billiard', scene: { id: 'bi-2', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.1, mode: 'billiard' }, annotation: { text: '每次撞壁都过另一焦点', position: 'bottom' } } },
  { lineId: 'bi-3', sectionId: 'billiard', scene: { id: 'bi-3', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.1, mode: 'billiard' }, annotation: { text: '轨迹越来越贴近长轴', position: 'bottom' } } },
  { lineId: 'bi-4', sectionId: 'billiard', scene: { id: 'bi-4', type: 'animation' }, lineState: { params: { presetId: 'ellipse', t: 1.1, mode: 'billiard' }, annotation: { text: '(1−e)/(1+e) = 1/9 每弹一次', position: 'bottom' } } },
  { lineId: 'bi-5', sectionId: 'billiard', scene: { id: 'bi-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'ellipse-flat', t: 1.1, mode: 'billiard' }, annotation: { text: 'e 越大，塌得越快', position: 'bottom' } } },

  { lineId: 'ma-1', sectionId: 'made', scene: { id: 'ma-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'parabola', t: 2.0, mode: 'fan' }, annotation: { text: '抛物面天线：平行光汇到焦点', position: 'top' } } },
  { lineId: 'ma-2', sectionId: 'made', scene: { id: 'ma-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'parabola', t: 2.0, mode: 'fan' }, annotation: { text: '反过来用：车灯射出平行光', position: 'bottom' } } },
  { lineId: 'ma-3', sectionId: 'made', scene: { id: 'ma-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'ellipse', t: 1.1, mode: 'fan' }, annotation: { text: '回音壁：两焦点互通', position: 'bottom' } } },
  { lineId: 'ma-4', sectionId: 'made', scene: { id: 'ma-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'ellipse-flat', t: 1.1, mode: 'fan' }, annotation: { text: '碎石机：能量聚到结石上', position: 'bottom' } } },
  { lineId: 'ma-5', sectionId: 'made', scene: { id: 'ma-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'hyperbola', t: 0.9, mode: 'single' }, annotation: { text: '卡塞格林望远镜的双曲面副镜', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '切线与两条焦半径等角', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '等值线 ⊥ 梯度，梯度沿角平分线', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '一条事实，三种曲线，四种发明', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
