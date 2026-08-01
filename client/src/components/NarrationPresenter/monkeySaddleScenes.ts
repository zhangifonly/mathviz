/**
 * 猴鞍面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultMonkeySaddleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const monkeySaddleScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { order: 2 }, annotation: { text: '马鞍只够放两条腿', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: 'z = x³ − 3xy²', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { order: 3, showSlopes: True }, annotation: { text: '三上三下交替', position: 'bottom' } } },
  { lineId: 'pl-1', sectionId: 'polar', scene: { id: 'pl-1', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '换成极坐标', position: 'top' } } },
  { lineId: 'pl-2', sectionId: 'polar', scene: { id: 'pl-2', type: 'animation' }, lineState: { params: { order: 3, showSlopes: True }, annotation: { text: '转 120° 完全复原', position: 'bottom' } } },
  { lineId: 'pl-3', sectionId: 'polar', scene: { id: 'pl-3', type: 'animation' }, lineState: { params: { order: 3, showSlopes: True }, annotation: { text: '转 60° 上下颠倒', position: 'bottom' } } },
  { lineId: 'dg-1', sectionId: 'degenerate', scene: { id: 'dg-1', type: 'animation' }, lineState: { params: { order: 2, showHessian: True }, annotation: { text: '看 Hesse 行列式', position: 'top' } } },
  { lineId: 'dg-2', sectionId: 'degenerate', scene: { id: 'dg-2', type: 'animation' }, lineState: { params: { order: 2, showHessian: True }, annotation: { text: '普通鞍面: det = −4', position: 'bottom' } } },
  { lineId: 'dg-3', sectionId: 'degenerate', scene: { id: 'dg-3', type: 'animation' }, lineState: { params: { order: 3, showHessian: True }, annotation: { text: '猴鞍面: det = 0, 失效', position: 'bottom' } } },
  { lineId: 'hg-1', sectionId: 'higher', scene: { id: 'hg-1', type: 'animation' }, lineState: { params: { order: 3, showHessian: True }, annotation: { text: '最低次项是三次的', position: 'top' } } },
  { lineId: 'hg-2', sectionId: 'higher', scene: { id: 'hg-2', type: 'animation' }, lineState: { params: { order: 3, showHessian: True }, annotation: { text: '退化临界点', position: 'bottom' } } },
  { lineId: 'hg-3', sectionId: 'higher', scene: { id: 'hg-3', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '奇点理论的起点', position: 'bottom' } } },
  { lineId: 'gn-1', sectionId: 'general', scene: { id: 'gn-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 4, showSlopes: True }, annotation: { text: 'Re((x+iy)ⁿ) 给出 n 重', position: 'top' } } },
  { lineId: 'gn-2', sectionId: 'general', scene: { id: 'gn-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 4, showSlopes: True }, annotation: { text: 'n=4: 四上四下', position: 'bottom' } } },
  { lineId: 'gn-3', sectionId: 'general', scene: { id: 'gn-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 5, showHessian: True }, annotation: { text: 'n≥3 判别法一律失效', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'z = r³cos3θ', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'Hesse 全为零', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
