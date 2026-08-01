/**
 * 博伊曲面 讲解场景配置
 *
 * 它没有可调的形状参数, 所以用 params.pitch 切换视角:
 * 讲三重对称时抬到接近俯视, 讲自交结构时回到侧视。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultBoySurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const boySurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '希尔伯特出的题', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { annotation: { text: '博伊找到了反例', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { annotation: { text: '推翻导师的猜测', position: 'bottom' } } },

  { lineId: 'sm-1', sectionId: 'smooth', scene: { id: 'sm-1', type: 'animation' }, lineState: { annotation: { text: '它确实有自交', position: 'top' } } },
  { lineId: 'sm-2', sectionId: 'smooth', scene: { id: 'sm-2', type: 'animation' }, lineState: { annotation: { text: '光滑 = 没有分支点', position: 'bottom' } } },
  { lineId: 'sm-3', sectionId: 'smooth', scene: { id: 'sm-3', type: 'animation' }, lineState: { annotation: { text: '每小块都平滑', position: 'bottom' } } },

  { lineId: 'con-1', sectionId: 'construct', scene: { id: 'con-1', type: 'animation' }, lineState: { annotation: { text: 'Bryant-Kusner 参数化', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'construct', scene: { id: 'con-2', type: 'animation' }, lineState: { annotation: { text: '分母含根号五', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'construct', scene: { id: 'con-3', type: 'animation' }, lineState: { params: { pitch: 1.15 }, annotation: { text: '三重对称 + 消掉分支点', position: 'bottom' } } },

  { lineId: 'proj-1', sectionId: 'projective', scene: { id: 'proj-1', type: 'animation' }, lineState: { annotation: { text: '定义域是单位圆盘', position: 'top' } } },
  { lineId: 'proj-2', sectionId: 'projective', scene: { id: 'proj-2', type: 'animation' }, lineState: { params: { showGap: true }, annotation: { text: 'w 与 -w 映到同点', position: 'bottom' } } },
  { lineId: 'proj-3', sectionId: 'projective', scene: { id: 'proj-3', type: 'animation' }, lineState: { params: { showGap: true }, annotation: { text: '确实是射影平面', position: 'bottom' } } },

  { lineId: 'exp-1', sectionId: 'explore', scene: { id: 'exp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pitch: 1.25 }, annotation: { text: '从上方俯视', position: 'top' } } },
  { lineId: 'exp-2', sectionId: 'explore', scene: { id: 'exp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pitch: 1.25 }, annotation: { text: '转 120° 半径不变', position: 'bottom' } } },
  { lineId: 'exp-3', sectionId: 'explore', scene: { id: 'exp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pitch: 0.5 }, annotation: { text: '自交线拧成三叶', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '有自交但处处光滑', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '博伊 1901 的反例', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
