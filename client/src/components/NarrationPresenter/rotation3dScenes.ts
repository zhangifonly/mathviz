/**
 * 三维旋转矩阵讲解场景配置
 * 每句口播对应一组欧拉角（params.ax / ay / az，角度制）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRotation3dState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const rotation3dScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '三维旋转矩阵', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-space', type: 'animation' }, lineState: { params: { ax: 20, ay: 30, az: 0 }, annotation: { text: '俯仰·偏转·翻滚', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-matrix', type: 'animation' }, lineState: { params: { ax: 30, ay: 45, az: 0 }, annotation: { text: '请出旋转矩阵', position: 'bottom' } } },

  // ===== axis (3) =====
  { lineId: 'def-1', sectionId: 'axis', scene: { id: 'def-single', type: 'animation' }, lineState: { params: { ax: 45, ay: 0, az: 0 }, annotation: { text: '绕单轴转动', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'axis', scene: { id: 'def-three', type: 'animation' }, lineState: { params: { ax: 0, ay: 60, az: 0 }, annotation: { text: 'sin 与 cos 拼成', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'axis', scene: { id: 'def-apply', type: 'animation' }, lineState: { params: { ax: 0, ay: 0, az: 60 }, annotation: { text: '矩阵乘坐标', position: 'bottom' } } },

  // ===== euler (3) =====
  { lineId: 'eul-1', sectionId: 'euler', scene: { id: 'eul-compose', type: 'animation' }, lineState: { params: { ax: 30, ay: 40, az: 20 }, annotation: { text: '三旋转相乘', position: 'top' } } },
  { lineId: 'eul-2', sectionId: 'euler', scene: { id: 'eul-name', type: 'animation' }, lineState: { params: { ax: 40, ay: 50, az: 30 }, annotation: { text: '这就是欧拉角', position: 'bottom' } } },
  { lineId: 'eul-3', sectionId: 'euler', scene: { id: 'eul-order', type: 'animation' }, lineState: { params: { ax: 60, ay: 20, az: 40 }, annotation: { text: '顺序不可换', position: 'bottom' } } },

  // ===== gimbal (3) =====
  { lineId: 'gim-1', sectionId: 'gimbal', scene: { id: 'gim-align', type: 'animation' }, lineState: { params: { ax: 45, ay: 90, az: 0 }, annotation: { text: 'Y 轴转到 90 度', position: 'top' } } },
  { lineId: 'gim-2', sectionId: 'gimbal', scene: { id: 'gim-lock', type: 'animation' }, lineState: { params: { ax: 0, ay: 90, az: 45 }, annotation: { text: '丢失一个自由度', position: 'bottom' } } },
  { lineId: 'gim-3', sectionId: 'gimbal', scene: { id: 'gim-quat', type: 'animation' }, lineState: { params: { ax: 30, ay: 90, az: 30 }, annotation: { text: '四元数来救场', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-sliders', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ax: 30, ay: 30, az: 30 }, annotation: { text: '拖动三个滑块', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-spin', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ax: 55, ay: 65, az: 25 }, annotation: { text: '立方体自由翻转', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-blocks', type: 'summary' }, lineState: { annotation: { text: '三块基本砖块', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-compose', type: 'summary' }, lineState: { annotation: { text: '组合出任意朝向', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
