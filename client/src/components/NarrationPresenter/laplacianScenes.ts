/**
 * 拉普拉斯算子讲解场景配置
 * 每句口播对应一个函数 key（params.func）与视图模式（params.mode）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLaplacianState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const laplacianScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '拉普拉斯算子', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-bump', type: 'animation' }, lineState: { params: { func: 'bump', mode: 'field' }, annotation: { text: '凹坑还是鼓包？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-lap', type: 'animation' }, lineState: { params: { func: 'bump', mode: 'both' }, annotation: { text: '量化偏离邻域', position: 'bottom' } } },

  // ===== derive (3) =====
  { lineId: 'def-1', sectionId: 'derive', scene: { id: 'def-sum', type: 'animation' }, lineState: { params: { func: 'saddle', mode: 'field' }, annotation: { text: '∇²f = fxx + fyy', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'derive', scene: { id: 'def-curv', type: 'animation' }, lineState: { params: { func: 'saddle', mode: 'field' }, annotation: { text: '二阶导=弯曲方向', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'derive', scene: { id: 'def-both', type: 'animation' }, lineState: { params: { func: 'saddle', mode: 'both' }, annotation: { text: '两方向弯曲相加', position: 'bottom' } } },

  // ===== stencil (3) =====
  { lineId: 'sten-1', sectionId: 'stencil', scene: { id: 'sten-diff', type: 'animation' }, lineState: { params: { func: 'wave', mode: 'both' }, annotation: { text: '邻居和 - 4×中心', position: 'top' } } },
  { lineId: 'sten-2', sectionId: 'stencil', scene: { id: 'sten-five', type: 'animation' }, lineState: { params: { func: 'wave', mode: 'lap' }, annotation: { text: '五点模板', position: 'bottom' } } },
  { lineId: 'sten-3', sectionId: 'stencil', scene: { id: 'sten-avg', type: 'animation' }, lineState: { params: { func: 'wave', mode: 'both' }, annotation: { text: '=偏离邻域平均', position: 'bottom' } } },

  // ===== harmonic (3) =====
  { lineId: 'harm-1', sectionId: 'harmonic', scene: { id: 'harm-zero', type: 'animation' }, lineState: { params: { func: 'harmonic', mode: 'both' }, annotation: { text: '∇²f = 0', position: 'top' } } },
  { lineId: 'harm-2', sectionId: 'harmonic', scene: { id: 'harm-smooth', type: 'animation' }, lineState: { params: { func: 'harmonic', mode: 'lap' }, annotation: { text: '无局部极值', position: 'bottom' } } },
  { lineId: 'harm-3', sectionId: 'harmonic', scene: { id: 'harm-heat', type: 'animation' }, lineState: { params: { func: 'bump', mode: 'both' }, annotation: { text: '热扩散抹平差异', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { func: 'wave', mode: 'both' }, annotation: { text: '切换函数看变化', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-harm', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { func: 'harmonic', mode: 'lap' }, annotation: { text: '调和=纯白', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '偏离邻域平均', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-stencil', type: 'summary' }, lineState: { annotation: { text: '五点模板·调和', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
