/**
 * 海螺曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSeashellSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const seashellSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '幼体到成体形状不变', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { alpha: 1.47 }, annotation: { text: '每圈乘同一倍数', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { alpha: 1.47 }, annotation: { text: '对应对数螺线', position: 'bottom' } } },
  { lineId: 'lg-1', sectionId: 'logspiral', scene: { id: 'lg-1', type: 'animation' }, lineState: { params: { alpha: 1.5 }, annotation: { text: '径向与切线', position: 'top' } } },
  { lineId: 'lg-2', sectionId: 'logspiral', scene: { id: 'lg-2', type: 'animation' }, lineState: { params: { alpha: 1.5 }, annotation: { text: '夹角处处相同', position: 'bottom' } } },
  { lineId: 'lg-3', sectionId: 'logspiral', scene: { id: 'lg-3', type: 'animation' }, lineState: { params: { alpha: 1.5 }, annotation: { text: '这个角就是 α', position: 'bottom' } } },
  { lineId: 'gr-1', sectionId: 'growth', scene: { id: 'gr-1', type: 'animation' }, lineState: { params: { alpha: 1.47 }, annotation: { text: '半径按指数增长', position: 'top' } } },
  { lineId: 'gr-2', sectionId: 'growth', scene: { id: 'gr-2', type: 'animation' }, lineState: { params: { alpha: 1.47 }, annotation: { text: '每圈放大 exp(2π cot α)', position: 'bottom' } } },
  { lineId: 'gr-3', sectionId: 'growth', scene: { id: 'gr-3', type: 'animation' }, lineState: { params: { alpha: 1.47 }, annotation: { text: '截面跟着放大', position: 'bottom' } } },
  { lineId: 'vf-1', sectionId: 'verify', scene: { id: 'vf-1', type: 'animation' }, lineState: { params: { alpha: 1.44 }, annotation: { text: '取转一整圈的两点', position: 'top' } } },
  { lineId: 'vf-2', sectionId: 'verify', scene: { id: 'vf-2', type: 'animation' }, lineState: { params: { alpha: 1.44 }, annotation: { text: '比较 x,y 坐标之比', position: 'bottom' } } },
  { lineId: 'vf-3', sectionId: 'verify', scene: { id: 'vf-3', type: 'animation' }, lineState: { params: { alpha: 1.44 }, annotation: { text: '吻合到小数点后八位', position: 'bottom' } } },
  { lineId: 'tn-1', sectionId: 'tune', scene: { id: 'tn-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { alpha: 1.53 }, annotation: { text: 'α 越大越扁平', position: 'top' } } },
  { lineId: 'tn-2', sectionId: 'tune', scene: { id: 'tn-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { alpha: 1.47 }, annotation: { text: '标准海螺 α=1.47', position: 'bottom' } } },
  { lineId: 'tn-3', sectionId: 'tune', scene: { id: 'tn-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { alpha: 1.38 }, annotation: { text: 'α 太小会占满画面', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '自相似: 形状不变', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '定角性质是根源', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
