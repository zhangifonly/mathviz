/**
 * 偏微分方程讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPdeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pdeScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { diagram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-applications', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'PDE 应用领域', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-difference', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'ODE vs PDE', position: 'bottom' },
    },
  },

  // ========== classification 段落 (4行) ==========
  {
    lineId: 'classification-1',
    sectionId: 'classification',
    scene: { id: 'class-types', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '方程分类', position: 'top' },
    },
  },
  {
    lineId: 'classification-2',
    sectionId: 'classification',
    scene: { id: 'class-elliptic', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '椭圆型方程', position: 'bottom' },
    },
  },
  {
    lineId: 'classification-3',
    sectionId: 'classification',
    scene: { id: 'class-parabolic', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '抛物型方程', position: 'bottom' },
    },
  },
  {
    lineId: 'classification-4',
    sectionId: 'classification',
    scene: { id: 'class-hyperbolic', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '双曲型方程', position: 'bottom' },
    },
  },

  // ========== laplace 段落 (4行) ==========
  {
    lineId: 'laplace-1',
    sectionId: 'laplace',
    scene: { id: 'laplace-intro', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '拉普拉斯方程', position: 'top' },
    },
  },
  {
    lineId: 'laplace-2',
    sectionId: 'laplace',
    scene: { id: 'laplace-2d', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '二维拉普拉斯算子', position: 'bottom' },
    },
  },
  {
    lineId: 'laplace-3',
    sectionId: 'laplace',
    scene: { id: 'laplace-applications', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '稳态场应用', position: 'bottom' },
    },
  },
  {
    lineId: 'laplace-4',
    sectionId: 'laplace',
    scene: { id: 'laplace-harmonic', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '调和性质', position: 'bottom' },
    },
  },

  // ========== poisson 段落 (3行) ==========
  {
    lineId: 'poisson-1',
    sectionId: 'poisson',
    scene: { id: 'poisson-intro', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '泊松方程', position: 'top' },
    },
  },
  {
    lineId: 'poisson-2',
    sectionId: 'poisson',
    scene: { id: 'poisson-source', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '源项函数', position: 'bottom' },
    },
  },
  {
    lineId: 'poisson-3',
    sectionId: 'poisson',
    scene: { id: 'poisson-physics', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '物理应用', position: 'bottom' },
    },
  },

  // ========== heat 段落 (4行) ==========
  {
    lineId: 'heat-1',
    sectionId: 'heat',
    scene: { id: 'heat-intro', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '热传导方程', position: 'top' },
    },
  },
  {
    lineId: 'heat-2',
    sectionId: 'heat',
    scene: { id: 'heat-formula', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '方程形式', position: 'bottom' },
    },
  },
  {
    lineId: 'heat-3',
    sectionId: 'heat',
    scene: { id: 'heat-smoothing', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '平滑性质', position: 'bottom' },
    },
  },
  {
    lineId: 'heat-4',
    sectionId: 'heat',
    scene: { id: 'heat-diffusion', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '扩散过程', position: 'bottom' },
    },
  },

  // ========== wave 段落 (4行) ==========
  {
    lineId: 'wave-1',
    sectionId: 'wave',
    scene: { id: 'wave-intro', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '波动方程', position: 'top' },
    },
  },
  {
    lineId: 'wave-2',
    sectionId: 'wave',
    scene: { id: 'wave-formula', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '方程形式', position: 'bottom' },
    },
  },
  {
    lineId: 'wave-3',
    sectionId: 'wave',
    scene: { id: 'wave-phenomena', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '波动现象', position: 'bottom' },
    },
  },
  {
    lineId: 'wave-4',
    sectionId: 'wave',
    scene: { id: 'wave-reversible', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '可逆性', position: 'bottom' },
    },
  },

  // ========== boundary 段落 (4行) ==========
  {
    lineId: 'boundary-1',
    sectionId: 'boundary',
    scene: { id: 'boundary-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '边界条件', position: 'top' },
    },
  },
  {
    lineId: 'boundary-2',
    sectionId: 'boundary',
    scene: { id: 'boundary-dirichlet', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'Dirichlet 边界', position: 'bottom' },
    },
  },
  {
    lineId: 'boundary-3',
    sectionId: 'boundary',
    scene: { id: 'boundary-neumann', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'Neumann 边界', position: 'bottom' },
    },
  },
  {
    lineId: 'boundary-4',
    sectionId: 'boundary',
    scene: { id: 'boundary-mixed', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '混合边界', position: 'bottom' },
    },
  },

  // ========== numerical 段落 (4行) ==========
  {
    lineId: 'numerical-1',
    sectionId: 'numerical',
    scene: { id: 'numerical-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数值求解', position: 'top' },
    },
  },
  {
    lineId: 'numerical-2',
    sectionId: 'numerical',
    scene: { id: 'numerical-fdm', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '有限差分法', position: 'bottom' },
    },
  },
  {
    lineId: 'numerical-3',
    sectionId: 'numerical',
    scene: { id: 'numerical-5point', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '五点差分格式', position: 'bottom' },
    },
  },
  {
    lineId: 'numerical-4',
    sectionId: 'numerical',
    scene: { id: 'numerical-time', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '时间步进方法', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-physics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '物理学应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-engineering', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '工程应用', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-finance', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '金融数学', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-image', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '图像处理', position: 'bottom' },
    },
  },

  // ========== summary 段落 (4行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-key', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '关键概念', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-equations', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '四类基本方程', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '感谢观看!', position: 'bottom' },
    },
  },
]
