/**
 * 共焦二次曲面 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：point 定交点，yaw/pitch 定视角，
 * show 三位分别控制椭球/单叶/双叶是否显示（讲哪一张就只留哪一张）。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultConfocalQuadricsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

const P0 = [1.2, 0.9, 0.6]
const P1 = [2.0, 1.1, 0.4]

export const confocalQuadricsScenes: NarrationLineScene[] = [
  { lineId: 'fa-1', sectionId: 'family', scene: { id: 'fa-1', type: 'title' }, lineState: { params: { point: P0, yaw: 0.7, pitch: 0.45, show: [true, false, false] }, annotation: { text: '固定 a>b>c，让 λ 变', position: 'top' } } },
  { lineId: 'fa-2', sectionId: 'family', scene: { id: 'fa-2', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.0, pitch: 0.45, show: [true, false, false] }, annotation: { text: 'λ 只出现在分母里', position: 'bottom' } } },
  { lineId: 'fa-3', sectionId: 'family', scene: { id: 'fa-3', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.3, pitch: 0.4, show: [true, true, false] }, annotation: { text: '整族共用同一组焦点', position: 'bottom' } } },
  { lineId: 'fa-4', sectionId: 'family', scene: { id: 'fa-4', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.6, pitch: 0.45, show: [true, true, true] }, annotation: { text: '这个结论只在三维里成立', position: 'bottom' } } },

  { lineId: 'th-1', sectionId: 'three', scene: { id: 'th-1', type: 'animation' }, lineState: { params: { point: P0, yaw: 0.8, pitch: 0.45, show: [false, false, false] }, annotation: { text: '关键是三个分母的正负号', position: 'top' } } },
  { lineId: 'th-2', sectionId: 'three', scene: { id: 'th-2', type: 'animation' }, lineState: { params: { point: P0, yaw: 0.8, pitch: 0.45, show: [true, false, false] }, annotation: { text: 'λ<c²：三项全正 → 椭球面', position: 'bottom' } } },
  { lineId: 'th-3', sectionId: 'three', scene: { id: 'th-3', type: 'animation' }, lineState: { params: { point: P0, yaw: 0.8, pitch: 0.45, show: [false, true, false] }, annotation: { text: 'c²<λ<b²：两正一负 → 单叶双曲面', position: 'bottom' } } },
  { lineId: 'th-4', sectionId: 'three', scene: { id: 'th-4', type: 'animation' }, lineState: { params: { point: P0, yaw: 0.8, pitch: 0.45, show: [false, false, true] }, annotation: { text: 'b²<λ<a²：一正两负 → 双叶，裂成两片', position: 'bottom' } } },
  { lineId: 'th-5', sectionId: 'three', scene: { id: 'th-5', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.1, pitch: 0.45, show: [true, true, true] }, annotation: { text: 'λ>a² 无实点：恰好三段', position: 'bottom' } } },

  { lineId: 'ja-1', sectionId: 'jacobi', scene: { id: 'ja-1', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.2, pitch: 0.4, show: [false, false, false] }, annotation: { text: '给定 P，有几张面过它？', position: 'top' } } },
  { lineId: 'ja-2', sectionId: 'jacobi', scene: { id: 'ja-2', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.2, pitch: 0.4, show: [true, false, false] }, annotation: { text: '代入后是关于 λ 的三次方程', position: 'bottom' } } },
  { lineId: 'ja-3', sectionId: 'jacobi', scene: { id: 'ja-3', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.2, pitch: 0.4, show: [true, true, false] }, annotation: { text: 'f 在 c²、b² 两侧异号 ⇒ 每段一根', position: 'bottom' } } },
  { lineId: 'ja-4', sectionId: 'jacobi', scene: { id: 'ja-4', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.4, pitch: 0.45, show: [true, true, true] }, annotation: { text: '恰好三张：一种一张', position: 'bottom' } } },
  { lineId: 'ja-5', sectionId: 'jacobi', scene: { id: 'ja-5', type: 'animation' }, lineState: { params: { point: P1, yaw: 1.7, pitch: 0.45, show: [true, true, true] }, annotation: { text: '换个 P，仍然是这三种', position: 'bottom' } } },

  { lineId: 'or-1', sectionId: 'ortho', scene: { id: 'or-1', type: 'animation' }, lineState: { params: { point: P0, yaw: 0.9, pitch: 0.5, show: [true, true, true], showNormals: false }, annotation: { text: '三张面的交角是多少？', position: 'top' } } },
  { lineId: 'or-2', sectionId: 'ortho', scene: { id: 'or-2', type: 'animation' }, lineState: { params: { point: P0, yaw: 0.9, pitch: 0.5, show: [true, true, true], alpha: 0.3 }, annotation: { text: '三条箭头 = 三张面的法向量', position: 'bottom' } } },
  { lineId: 'or-3', sectionId: 'ortho', scene: { id: 'or-3', type: 'animation' }, lineState: { params: { point: P0, yaw: 1.5, pitch: 0.5, show: [true, true, true], alpha: 0.25 }, annotation: { text: '两两点积化简后恰好为 0', position: 'bottom' } } },
  { lineId: 'or-4', sectionId: 'ortho', scene: { id: 'or-4', type: 'animation' }, lineState: { params: { point: P1, yaw: 2.1, pitch: 0.4, show: [true, true, true], alpha: 0.25 }, annotation: { text: '三个夹角都是 90.000000°', position: 'bottom' } } },
  { lineId: 'or-5', sectionId: 'ortho', scene: { id: 'or-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { point: P0, yaw: 2.5, pitch: 0.45, show: [true, true, true], alpha: 0.3 }, annotation: { text: '正交来自共焦条件本身', position: 'bottom' } } },

  { lineId: 'co-1', sectionId: 'coord', scene: { id: 'co-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { point: P0, yaw: 0.7, pitch: 0.45, show: [true, true, true], alpha: 0.35 }, annotation: { text: '(λ₁,λ₂,λ₃) 唯一确定一点', position: 'top' } } },
  { lineId: 'co-2', sectionId: 'coord', scene: { id: 'co-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { point: P1, yaw: 1.1, pitch: 0.45, show: [true, true, true], alpha: 0.35 }, annotation: { text: '椭球坐标：一套正交坐标系', position: 'bottom' } } },
  { lineId: 'co-3', sectionId: 'coord', scene: { id: 'co-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { point: P0, yaw: 1.5, pitch: 0.5, show: [true, true, true], alpha: 0.35 }, annotation: { text: '拉普拉斯方程在其中可分离', position: 'bottom' } } },
  { lineId: 'co-4', sectionId: 'coord', scene: { id: 'co-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { point: [1.6, 1.0, 0.15], yaw: 1.9, pitch: 0.35, show: [true, true, true], alpha: 0.35 }, annotation: { text: '算椭球形地球的引力势', position: 'bottom' } } },
  { lineId: 'co-5', sectionId: 'coord', scene: { id: 'co-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { point: P0, yaw: 2.3, pitch: 0.45, show: [true, false, true], alpha: 0.4 }, annotation: { text: '测地线与共焦族相切 ⇒ 可积', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '一个 λ，三段取值，三种曲面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '过任一点恰有三张，两两垂直', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '这个结论只有在空间里才看得见', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
