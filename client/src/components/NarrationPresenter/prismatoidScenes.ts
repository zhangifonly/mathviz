/**
 * Prismatoid 公式 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultPrismatoidState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const prismatoidScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { solidId: 'frustum' }, annotation: { text: '一条公式，五种立体', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { solidId: 'frustum' }, annotation: { text: 'V = h(S₀ + 4Sₘ + S₁)/6', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { solidId: 'frustum' }, annotation: { text: '只要上、中、下三个截面', position: 'bottom' } } },
  { lineId: 'ex-1', sectionId: 'exact', scene: { id: 'ex-1', type: 'animation' }, lineState: { params: { solidId: 'cone' }, annotation: { text: '截面积按 t 的多项式变化', position: 'top' } } },
  { lineId: 'ex-2', sectionId: 'exact', scene: { id: 'ex-2', type: 'animation' }, lineState: { params: { solidId: 'cubic' }, annotation: { text: '次数 ≤ 3 时，公式精确', position: 'bottom' } } },
  { lineId: 'ex-3', sectionId: 'exact', scene: { id: 'ex-3', type: 'animation' }, lineState: { params: { solidId: 'quartic' }, annotation: { text: '四次就失效了', position: 'bottom' } } },
  { lineId: 'cs-1', sectionId: 'cases', scene: { id: 'cs-1', type: 'animation' }, lineState: { params: { solidId: 'prism' }, annotation: { text: '柱体：三个截面都一样', position: 'top' } } },
  { lineId: 'cs-2', sectionId: 'cases', scene: { id: 'cs-2', type: 'animation' }, lineState: { params: { solidId: 'cone' }, annotation: { text: '锥体：顶端收成一点', position: 'bottom' } } },
  { lineId: 'cs-3', sectionId: 'cases', scene: { id: 'cs-3', type: 'animation' }, lineState: { params: { solidId: 'wedge' }, annotation: { text: '楔体、台体也都对上了', position: 'bottom' } } },
  { lineId: 'sp-1', sectionId: 'sphere', scene: { id: 'sp-1', type: 'animation' }, lineState: { params: { solidId: 'sphere' }, annotation: { text: '球最出人意料', position: 'top' } } },
  { lineId: 'sp-2', sectionId: 'sphere', scene: { id: 'sp-2', type: 'animation' }, lineState: { params: { solidId: 'sphere' }, annotation: { text: '两端截面都是 0', position: 'bottom' } } },
  { lineId: 'sp-3', sectionId: 'sphere', scene: { id: 'sp-3', type: 'animation' }, lineState: { params: { solidId: 'sphere' }, annotation: { text: '靠中间一刀定出 4πr³/3', position: 'bottom' } } },
  { lineId: 'lm-1', sectionId: 'limit', scene: { id: 'lm-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'quartic' }, annotation: { text: '四次截面：公式给 8.667', position: 'top' } } },
  { lineId: 'lm-2', sectionId: 'limit', scene: { id: 'lm-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'quartic' }, annotation: { text: '真值是 8.4，差了 3%', position: 'bottom' } } },
  { lineId: 'lm-3', sectionId: 'limit', scene: { id: 'lm-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'cubic' }, annotation: { text: '知道边界在哪，才算懂', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '三个截面定一个体积', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '中学五个公式都是它的特例', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
