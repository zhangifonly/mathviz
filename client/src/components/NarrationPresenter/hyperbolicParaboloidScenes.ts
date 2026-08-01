/**
 * 双曲抛物面 讲解场景配置
 *
 * params.family1 / family2 控制是否高亮两族直线,
 * surfaceAlpha 调低可以让直线看得更清楚。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultHyperbolicParaboloidState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const hyperbolicParaboloidScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '薯片的形状', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { annotation: { text: 'z = x²/a² − y²/b²', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { annotation: { text: '藏着一个反直觉事实', position: 'bottom' } } },

  { lineId: 'sad-1', sectionId: 'saddle', scene: { id: 'sad-1', type: 'animation' }, lineState: { annotation: { text: 'x 向上凸, y 向下凹', position: 'top' } } },
  { lineId: 'sad-2', sectionId: 'saddle', scene: { id: 'sad-2', type: 'animation' }, lineState: { annotation: { text: '主曲率乘积为负', position: 'bottom' } } },
  { lineId: 'sad-3', sectionId: 'saddle', scene: { id: 'sad-3', type: 'animation' }, lineState: { annotation: { text: '处处是鞍点, 无例外', position: 'bottom' } } },

  { lineId: 'rul-1', sectionId: 'ruled', scene: { id: 'rul-1', type: 'animation' }, lineState: { params: { family1: true, surfaceAlpha: 0.55 }, annotation: { text: '第一族: 全是直线', position: 'top' } } },
  { lineId: 'rul-2', sectionId: 'ruled', scene: { id: 'rul-2', type: 'animation' }, lineState: { params: { family1: true, family2: true, surfaceAlpha: 0.45 }, annotation: { text: '竟然有两族', position: 'bottom' } } },
  { lineId: 'rul-3', sectionId: 'ruled', scene: { id: 'rul-3', type: 'animation' }, lineState: { params: { family1: true, family2: true, surfaceAlpha: 0.45 }, annotation: { text: '每点恰有两条直线', position: 'bottom' } } },

  { lineId: 'prf-1', sectionId: 'proof', scene: { id: 'prf-1', type: 'animation' }, lineState: { params: { family1: true, family2: true, surfaceAlpha: 0.5 }, annotation: { text: 'x=a(s+t), y=b(s−t), z=4st', position: 'top' } } },
  { lineId: 'prf-2', sectionId: 'proof', scene: { id: 'prf-2', type: 'animation' }, lineState: { params: { family1: true, surfaceAlpha: 0.5 }, annotation: { text: '固定 t: 三坐标都是 s 的一次式', position: 'bottom' } } },
  { lineId: 'prf-3', sectionId: 'proof', scene: { id: 'prf-3', type: 'animation' }, lineState: { params: { family2: true, surfaceAlpha: 0.5 }, annotation: { text: '固定 s: 同理得第二族', position: 'bottom' } } },

  { lineId: 'app-1', sectionId: 'apply', scene: { id: 'app-1', type: 'animation' }, lineState: { annotation: { text: '想盖曲面屋顶', position: 'top' } } },
  { lineId: 'app-2', sectionId: 'apply', scene: { id: 'app-2', type: 'animation' }, lineState: { params: { family1: true, family2: true, surfaceAlpha: 0.35 }, annotation: { text: '用笔直的梁交叉搭', position: 'bottom' } } },
  { lineId: 'app-3', sectionId: 'apply', scene: { id: 'app-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.5, b: 0.7, family1: true, family2: true, surfaceAlpha: 0.4 }, annotation: { text: '调参数, 直线族始终存在', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'K < 0 处处成立', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '双直纹面', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
