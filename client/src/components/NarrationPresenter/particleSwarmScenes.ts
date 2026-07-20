/**
 * 粒子群优化讲解场景配置
 * 每句口播对应迭代步数(params.iter),数值越大粒子越聚拢到全局最优
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultParticleSwarmState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const particleSwarmScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '粒子群优化', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-flock', type: 'animation' }, lineState: { params: { iter: 0 }, annotation: { text: '鸟群觅食', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { iter: 4 }, annotation: { text: '群体智慧成算法', position: 'bottom' } } },

  // ===== position (3) =====
  { lineId: 'pos-1', sectionId: 'position', scene: { id: 'pos-particle', type: 'animation' }, lineState: { params: { iter: 0 }, annotation: { text: '每个粒子=位置+速度', position: 'top' } } },
  { lineId: 'pos-2', sectionId: 'position', scene: { id: 'pos-obj', type: 'animation' }, lineState: { params: { iter: 2 }, annotation: { text: '找目标函数最小处', position: 'bottom' } } },
  { lineId: 'pos-3', sectionId: 'position', scene: { id: 'pos-vel', type: 'animation' }, lineState: { params: { iter: 4 }, annotation: { text: '速度决定去向', position: 'bottom' } } },

  // ===== best (3) =====
  { lineId: 'best-1', sectionId: 'best', scene: { id: 'best-p', type: 'animation' }, lineState: { params: { iter: 6 }, annotation: { text: '个体最优', position: 'top' } } },
  { lineId: 'best-2', sectionId: 'best', scene: { id: 'best-g', type: 'animation' }, lineState: { params: { iter: 10 }, annotation: { text: '全局最优(红环)', position: 'bottom' } } },
  { lineId: 'best-3', sectionId: 'best', scene: { id: 'best-pull', type: 'animation' }, lineState: { params: { iter: 14 }, annotation: { text: '两记忆牵引群体', position: 'bottom' } } },

  // ===== update (3) =====
  { lineId: 'upd-1', sectionId: 'update', scene: { id: 'upd-inertia', type: 'animation' }, lineState: { params: { iter: 8 }, annotation: { text: '惯性:保持方向', position: 'top' } } },
  { lineId: 'upd-2', sectionId: 'update', scene: { id: 'upd-cog', type: 'animation' }, lineState: { params: { iter: 16 }, annotation: { text: '认知+社会两项', position: 'bottom' } } },
  { lineId: 'upd-3', sectionId: 'update', scene: { id: 'upd-sum', type: 'animation' }, lineState: { params: { iter: 22 }, annotation: { text: '加权合成新速度', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { iter: 28 }, annotation: { text: '单步看聚集', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { iter: 40 }, annotation: { text: '换分布再试', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '协作逼近最小值', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-force', type: 'summary' }, lineState: { annotation: { text: '三力合成寻优', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美!', position: 'bottom' } } },
]
