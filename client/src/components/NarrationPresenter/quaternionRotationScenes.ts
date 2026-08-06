/**
 * 四元数与三维旋转 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选两端姿态，t 定插值位置，
 * mode 在「并排对照 / 只看四元数」之间切，camYaw/camPitch 转视角。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultQuaternionRotationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const quaternionRotationScenes: NarrationLineScene[] = [
  { lineId: 'wh-1', sectionId: 'why', scene: { id: 'wh-1', type: 'title' }, lineState: { params: { presetId: 'wide', t: 0, mode: 'single' }, annotation: { text: '接着「万向锁」那句往下讲', position: 'top' } } },
  { lineId: 'wh-2', sectionId: 'why', scene: { id: 'wh-2', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.2, mode: 'single' }, annotation: { text: '哈密顿：三个数不够，得用四个', position: 'bottom' } } },
  { lineId: 'wh-3', sectionId: 'why', scene: { id: 'wh-3', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.4, mode: 'single' }, annotation: { text: 'i² = j² = k² = ijk = −1', position: 'bottom' } } },
  { lineId: 'wh-4', sectionId: 'why', scene: { id: 'wh-4', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.6, mode: 'single' }, annotation: { text: 'ij = k 但 ji = −k：不可交换', position: 'bottom' } } },

  { lineId: 'ha-1', sectionId: 'half', scene: { id: 'ha-1', type: 'animation' }, lineState: { params: { presetId: 'small', t: 0.5, mode: 'single' }, annotation: { text: 'q = (cos(θ/2), sin(θ/2)·n)', position: 'top' } } },
  { lineId: 'ha-2', sectionId: 'half', scene: { id: 'ha-2', type: 'animation' }, lineState: { params: { presetId: 'small', t: 0.7, mode: 'single' }, annotation: { text: '这个 1/2 不是硬凑的', position: 'bottom' } } },
  { lineId: 'ha-3', sectionId: 'half', scene: { id: 'ha-3', type: 'animation' }, lineState: { params: { presetId: 'small', t: 1, mode: 'single' }, annotation: { text: '作用方式是共轭 v′ = q v q⁻¹', position: 'bottom' } } },
  { lineId: 'ha-4', sectionId: 'half', scene: { id: 'ha-4', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.5, mode: 'single' }, annotation: { text: 'q 用了两次，各贡献半个角', position: 'bottom' } } },
  { lineId: 'ha-5', sectionId: 'half', scene: { id: 'ha-5', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.5, mode: 'single', camYaw: 1.1 }, annotation: { text: '绕z转90° → (0.707,0,0,0.707)', position: 'bottom' } } },

  { lineId: 'do-1', sectionId: 'double', scene: { id: 'do-1', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.35, mode: 'single', camYaw: 0.9 }, annotation: { text: '把 q 换成 −q 会怎样？', position: 'top' } } },
  { lineId: 'do-2', sectionId: 'double', scene: { id: 'do-2', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.35, mode: 'single', camYaw: 1.3 }, annotation: { text: '共轭里两个负号相消 → 同一旋转', position: 'bottom' } } },
  { lineId: 'do-3', sectionId: 'double', scene: { id: 'do-3', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.55, mode: 'single', camYaw: 1.7 }, annotation: { text: 'S³ 是 SO(3) 的双重覆盖', position: 'bottom' } } },
  { lineId: 'do-4', sectionId: 'double', scene: { id: 'do-4', type: 'animation' }, lineState: { params: { presetId: 'far', t: 0.8, mode: 'single', camYaw: 2.1 }, annotation: { text: '转 360° 得 −1，转 720° 才回到 1', position: 'bottom' } } },
  { lineId: 'do-5', sectionId: 'double', scene: { id: 'do-5', type: 'animation' }, lineState: { params: { presetId: 'far', t: 1, mode: 'single', camYaw: 2.5 }, annotation: { text: '电子自旋、腰带把戏，同一件事', position: 'bottom' } } },

  { lineId: 'sl-1', sectionId: 'slerp', scene: { id: 'sl-1', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0, mode: 'compare' }, annotation: { text: '躲万向锁只是好处之一', position: 'top' } } },
  { lineId: 'sl-2', sectionId: 'slerp', scene: { id: 'sl-2', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.25, mode: 'compare' }, annotation: { text: '真正的问题是插值', position: 'bottom' } } },
  { lineId: 'sl-3', sectionId: 'slerp', scene: { id: 'sl-3', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.5, mode: 'compare' }, annotation: { text: '左 SLERP，右 欧拉逐分量线性', position: 'bottom' } } },
  { lineId: 'sl-4', sectionId: 'slerp', scene: { id: 'sl-4', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.65, mode: 'compare' }, annotation: { text: '点距均匀 = 转速均匀', position: 'bottom' } } },
  { lineId: 'sl-5', sectionId: 'slerp', scene: { id: 'sl-5', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 0.8, mode: 'compare' }, annotation: { text: 'max/min：1.000 对 1.297', position: 'bottom' } } },
  { lineId: 'sl-6', sectionId: 'slerp', scene: { id: 'sl-6', type: 'animation' }, lineState: { params: { presetId: 'wide', t: 1, mode: 'compare' }, annotation: { text: '欧拉插值多走 15% 的冤枉路', position: 'bottom' } } },
  { lineId: 'sl-7', sectionId: 'slerp', scene: { id: 'sl-7', type: 'animation' }, lineState: { params: { presetId: 'gimbal', t: 0.2, mode: 'compare' }, annotation: { text: 'pitch≈90°：yaw 与 roll 是同一自由度', position: 'top' } } },
  { lineId: 'sl-8', sectionId: 'slerp', scene: { id: 'sl-8', type: 'animation' }, lineState: { params: { presetId: 'gimbal', t: 0.5, mode: 'compare' }, annotation: { text: '18° 的活，欧拉插值转了 343°', position: 'bottom' } } },
  { lineId: 'sl-9', sectionId: 'slerp', scene: { id: 'sl-9', type: 'animation' }, lineState: { params: { presetId: 'gimbal', t: 0.85, mode: 'compare' }, annotation: { text: '快慢比看匀不匀，总转角看冤不冤', position: 'bottom' } } },

  { lineId: 'ho-1', sectionId: 'how', scene: { id: 'ho-1', type: 'animation' }, lineState: { params: { presetId: 'far', t: 0.3, mode: 'compare' }, annotation: { text: '单位四元数住在 S³ 上', position: 'top' } } },
  { lineId: 'ho-2', sectionId: 'how', scene: { id: 'ho-2', type: 'animation' }, lineState: { params: { presetId: 'far', t: 0.55, mode: 'compare' }, annotation: { text: '球面上最短路是大圆弧', position: 'bottom' } } },
  { lineId: 'ho-3', sectionId: 'how', scene: { id: 'ho-3', type: 'animation' }, lineState: { params: { presetId: 'far', t: 0.75, mode: 'compare' }, annotation: { text: '坑一：点积为负要取反', position: 'bottom' } } },
  { lineId: 'ho-4', sectionId: 'how', scene: { id: 'ho-4', type: 'animation' }, lineState: { params: { presetId: 'far', t: 1, mode: 'compare' }, annotation: { text: '不取近路就要走 337° 而非 22.9°', position: 'bottom' } } },
  { lineId: 'ho-5', sectionId: 'how', scene: { id: 'ho-5', type: 'animation' }, lineState: { params: { presetId: 'small', t: 0.5, mode: 'compare' }, annotation: { text: '坑二：几乎重合时退回线性插值', position: 'bottom' } } },

  { lineId: 'us-1', sectionId: 'use', scene: { id: 'us-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'wide', t: 0.4, mode: 'compare' }, annotation: { text: '游戏骨骼动画：关键帧之间用 SLERP', position: 'top' } } },
  { lineId: 'us-2', sectionId: 'use', scene: { id: 'us-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'gimbal', t: 0.5, mode: 'compare' }, annotation: { text: '无人机姿态解算：极点附近不爆', position: 'bottom' } } },
  { lineId: 'us-3', sectionId: 'use', scene: { id: 'us-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'gimbal', t: 0.75, mode: 'compare' }, annotation: { text: '航天器姿态控制', position: 'bottom' } } },
  { lineId: 'us-4', sectionId: 'use', scene: { id: 'us-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'wide', t: 0.6, mode: 'single' }, annotation: { text: '归一化四个数即可，无需重正交化', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'q = (cos(θ/2), sin(θ/2)·n)', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'q 与 −q 同一旋转：双重覆盖', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: 'SLERP：匀速且最短', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
