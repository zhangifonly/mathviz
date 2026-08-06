/**
 * SO(3) 的拓扑 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：turns 定圈数，t 沿环路走，
 * liftOnly 只留左侧提升曲线（讲提升本身时把物体收掉）。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSo3TopologyState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const so3TopologyScenes: NarrationLineScene[] = [
  { lineId: 'lo-1', sectionId: 'loop', scene: { id: 'lo-1', type: 'title' }, lineState: { params: { turns: 1, t: 0.3 }, annotation: { text: '接着上一课那句话讲', position: 'top' } } },
  { lineId: 'lo-2', sectionId: 'loop', scene: { id: 'lo-2', type: 'animation' }, lineState: { params: { turns: 1, t: 0.45 }, annotation: { text: '连续转动 = SO(3) 里的一条道路', position: 'bottom' } } },
  { lineId: 'lo-3', sectionId: 'loop', scene: { id: 'lo-3', type: 'animation' }, lineState: { params: { turns: 1, t: 1 }, annotation: { text: '转满一圈：首尾同一姿态，成环路', position: 'bottom' } } },
  { lineId: 'lo-4', sectionId: 'loop', scene: { id: 'lo-4', type: 'animation' }, lineState: { params: { turns: 1, t: 1 }, annotation: { text: '它能连续收缩成一点吗？', position: 'bottom' } } },

  { lineId: 'li-1', sectionId: 'lift', scene: { id: 'li-1', type: 'animation' }, lineState: { params: { turns: 1, t: 0.2, liftOnly: true }, annotation: { text: '借双重覆盖，提到 S³ 上', position: 'top' } } },
  { lineId: 'li-2', sectionId: 'lift', scene: { id: 'li-2', type: 'animation' }, lineState: { params: { turns: 1, t: 0.4, liftOnly: true }, annotation: { text: 'q(θ) = (cos(θ/2), sin(θ/2)·n)', position: 'bottom' } } },
  { lineId: 'li-3', sectionId: 'lift', scene: { id: 'li-3', type: 'animation' }, lineState: { params: { turns: 1, t: 1, liftOnly: true }, annotation: { text: 'θ=360° → 半角180° → w = −1', position: 'bottom' } } },
  { lineId: 'li-4', sectionId: 'lift', scene: { id: 'li-4', type: 'animation' }, lineState: { params: { turns: 1, t: 1, liftOnly: true }, annotation: { text: '姿态复原，提升却没回起点', position: 'bottom' } } },
  { lineId: 'li-5', sectionId: 'lift', scene: { id: 'li-5', type: 'animation' }, lineState: { params: { turns: 2, t: 1, liftOnly: true }, annotation: { text: 'θ=720° → w = +1，闭合', position: 'bottom' } } },

  { lineId: 'se-1', sectionId: 'see', scene: { id: 'se-1', type: 'animation' }, lineState: { params: { turns: 1, t: 0.5, liftOnly: true }, annotation: { text: '立体投影：把 S³ 铺到三维', position: 'top' } } },
  { lineId: 'se-2', sectionId: 'see', scene: { id: 'se-2', type: 'animation' }, lineState: { params: { turns: 1, t: 0.5, liftOnly: true }, annotation: { text: '1 在原点，−1 在无穷远', position: 'bottom' } } },
  { lineId: 'se-3', sectionId: 'see', scene: { id: 'se-3', type: 'animation' }, lineState: { params: { turns: 1, t: 1, liftOnly: true, camYaw: 1.2 }, annotation: { text: '转 1 圈：一路冲出画面，不闭合', position: 'bottom' } } },
  { lineId: 'se-4', sectionId: 'see', scene: { id: 'se-4', type: 'animation' }, lineState: { params: { turns: 2, t: 1, liftOnly: true, camYaw: 1.2 }, annotation: { text: '转 2 圈：绕一趟回到原点，闭合', position: 'bottom' } } },
  { lineId: 'se-5', sectionId: 'see', scene: { id: 'se-5', type: 'animation' }, lineState: { params: { turns: 2, t: 1 }, annotation: { text: '右边姿态一样，区别只在提升', position: 'bottom' } } },

  { lineId: 'p1-1', sectionId: 'pi1', scene: { id: 'p1-1', type: 'animation' }, lineState: { params: { turns: 2, t: 0.6, liftOnly: true }, annotation: { text: 'S³ 单连通：闭环都能收缩', position: 'top' } } },
  { lineId: 'p1-2', sectionId: 'pi1', scene: { id: 'p1-2', type: 'animation' }, lineState: { params: { turns: 1, t: 1, liftOnly: true }, annotation: { text: '提升不闭合 ⇒ 收缩要移动端点', position: 'bottom' } } },
  { lineId: 'p1-3', sectionId: 'pi1', scene: { id: 'p1-3', type: 'animation' }, lineState: { params: { turns: 3, t: 1, liftOnly: true }, annotation: { text: '奇数圈同类，偶数圈同类', position: 'bottom' } } },
  { lineId: 'p1-4', sectionId: 'pi1', scene: { id: 'p1-4', type: 'animation' }, lineState: { params: { turns: 4, t: 1, liftOnly: true }, annotation: { text: '运算是模 2 加法 ⇒ ℤ₂', position: 'bottom' } } },
  { lineId: 'p1-5', sectionId: 'pi1', scene: { id: 'p1-5', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { turns: 2, t: 1, liftOnly: true }, annotation: { text: '[1]+[1]=[0]：非平凡元是自己的逆', position: 'bottom' } } },

  { lineId: 'ph-1', sectionId: 'phys', scene: { id: 'ph-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { turns: 1, t: 1 }, annotation: { text: '电子转一圈波函数变号', position: 'top' } } },
  { lineId: 'ph-2', sectionId: 'phys', scene: { id: 'ph-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { turns: 1, t: 1, liftOnly: true }, annotation: { text: '物理态住在 S³ 上，不是 SO(3)', position: 'bottom' } } },
  { lineId: 'ph-3', sectionId: 'phys', scene: { id: 'ph-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { turns: 1, t: 1 }, annotation: { text: '腰带拧 360°：捋不平', position: 'bottom' } } },
  { lineId: 'ph-4', sectionId: 'phys', scene: { id: 'ph-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { turns: 2, t: 1 }, annotation: { text: '拧 720° 反而能捋平', position: 'bottom' } } },
  { lineId: 'ph-5', sectionId: 'phys', scene: { id: 'ph-5', type: 'animation' }, lineState: { params: { turns: 2, t: 1, liftOnly: true }, annotation: { text: '本课展示提升曲线，不做示意动画', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '提升终点 = (−1)^圈数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '闭合才可收缩', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: 'π₁(SO(3)) = ℤ₂', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
