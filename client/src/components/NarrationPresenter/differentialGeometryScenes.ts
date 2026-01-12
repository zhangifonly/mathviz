/**
 * 微分几何讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDifferentialGeometryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const differentialGeometryScenes: NarrationLineScene[] = [
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
      annotation: { text: '微分几何应用', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-relativity', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '广义相对论', position: 'bottom' },
    },
  },

  // ========== curvature 段落 (4行) ==========
  {
    lineId: 'curvature-1',
    sectionId: 'curvature',
    scene: { id: 'curvature-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '曲率概念', position: 'top' },
    },
  },
  {
    lineId: 'curvature-2',
    sectionId: 'curvature',
    scene: { id: 'curvature-examples', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '直线与圆的曲率', position: 'bottom' },
    },
  },
  {
    lineId: 'curvature-3',
    sectionId: 'curvature',
    scene: { id: 'curvature-osculating', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '密切圆', position: 'bottom' },
    },
  },
  {
    lineId: 'curvature-4',
    sectionId: 'curvature',
    scene: { id: 'curvature-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '曲率公式', position: 'bottom' },
    },
  },

  // ========== torsion 段落 (3行) ==========
  {
    lineId: 'torsion-1',
    sectionId: 'torsion',
    scene: { id: 'torsion-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '挠率概念', position: 'top' },
    },
  },
  {
    lineId: 'torsion-2',
    sectionId: 'torsion',
    scene: { id: 'torsion-definition', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '挠率定义', position: 'bottom' },
    },
  },
  {
    lineId: 'torsion-3',
    sectionId: 'torsion',
    scene: { id: 'torsion-theorem', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '曲线基本定理', position: 'bottom' },
    },
  },

  // ========== frenet-frame 段落 (3行) ==========
  {
    lineId: 'frenet-1',
    sectionId: 'frenet-frame',
    scene: { id: 'frenet-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'Frenet标架', position: 'top' },
    },
  },
  {
    lineId: 'frenet-2',
    sectionId: 'frenet-frame',
    scene: { id: 'frenet-serret', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'Frenet-Serret公式', position: 'bottom' },
    },
  },
  {
    lineId: 'frenet-3',
    sectionId: 'frenet-frame',
    scene: { id: 'frenet-formulas', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '基本公式', position: 'bottom' },
    },
  },

  // ========== surface-basics 段落 (3行) ==========
  {
    lineId: 'surface-1',
    sectionId: 'surface-basics',
    scene: { id: 'surface-param', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '参数曲面', position: 'top' },
    },
  },
  {
    lineId: 'surface-2',
    sectionId: 'surface-basics',
    scene: { id: 'surface-tangent', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '切平面', position: 'bottom' },
    },
  },
  {
    lineId: 'surface-3',
    sectionId: 'surface-basics',
    scene: { id: 'surface-normal', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '法向量', position: 'bottom' },
    },
  },

  // ========== first-fundamental-form 段落 (3行) ==========
  {
    lineId: 'first-form-1',
    sectionId: 'first-fundamental-form',
    scene: { id: 'first-form-intro', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '第一基本形式', position: 'top' },
    },
  },
  {
    lineId: 'first-form-2',
    sectionId: 'first-fundamental-form',
    scene: { id: 'first-form-expression', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '表达式', position: 'bottom' },
    },
  },
  {
    lineId: 'first-form-3',
    sectionId: 'first-fundamental-form',
    scene: { id: 'first-form-coefficients', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '基本量 E, F, G', position: 'bottom' },
    },
  },

  // ========== second-fundamental-form 段落 (3行) ==========
  {
    lineId: 'second-form-1',
    sectionId: 'second-fundamental-form',
    scene: { id: 'second-form-intro', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '第二基本形式', position: 'top' },
    },
  },
  {
    lineId: 'second-form-2',
    sectionId: 'second-fundamental-form',
    scene: { id: 'second-form-expression', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '表达式', position: 'bottom' },
    },
  },
  {
    lineId: 'second-form-3',
    sectionId: 'second-fundamental-form',
    scene: { id: 'second-form-coefficients', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '基本量 L, M, N', position: 'bottom' },
    },
  },

  // ========== gaussian-curvature 段落 (4行) ==========
  {
    lineId: 'gaussian-1',
    sectionId: 'gaussian-curvature',
    scene: { id: 'gaussian-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '高斯曲率', position: 'top' },
    },
  },
  {
    lineId: 'gaussian-2',
    sectionId: 'gaussian-curvature',
    scene: { id: 'gaussian-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '计算公式', position: 'bottom' },
    },
  },
  {
    lineId: 'gaussian-3',
    sectionId: 'gaussian-curvature',
    scene: { id: 'gaussian-theorem', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '高斯绝妙定理', position: 'bottom' },
    },
  },
  {
    lineId: 'gaussian-4',
    sectionId: 'gaussian-curvature',
    scene: { id: 'gaussian-examples', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '曲面示例', position: 'bottom' },
    },
  },

  // ========== mean-curvature 段落 (3行) ==========
  {
    lineId: 'mean-1',
    sectionId: 'mean-curvature',
    scene: { id: 'mean-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '平均曲率', position: 'top' },
    },
  },
  {
    lineId: 'mean-2',
    sectionId: 'mean-curvature',
    scene: { id: 'mean-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '计算公式', position: 'bottom' },
    },
  },
  {
    lineId: 'mean-3',
    sectionId: 'mean-curvature',
    scene: { id: 'mean-minimal', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '极小曲面', position: 'bottom' },
    },
  },

  // ========== geodesic 段落 (4行) ==========
  {
    lineId: 'geodesic-1',
    sectionId: 'geodesic',
    scene: { id: 'geodesic-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '测地线', position: 'top' },
    },
  },
  {
    lineId: 'geodesic-2',
    sectionId: 'geodesic',
    scene: { id: 'geodesic-examples', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '球面与圆柱面', position: 'bottom' },
    },
  },
  {
    lineId: 'geodesic-3',
    sectionId: 'geodesic',
    scene: { id: 'geodesic-equation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '测地线方程', position: 'bottom' },
    },
  },
  {
    lineId: 'geodesic-4',
    sectionId: 'geodesic',
    scene: { id: 'geodesic-applications', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '应用领域', position: 'bottom' },
    },
  },

  // ========== gauss-bonnet 段落 (3行) ==========
  {
    lineId: 'gauss-bonnet-1',
    sectionId: 'gauss-bonnet',
    scene: { id: 'gauss-bonnet-intro', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'Gauss-Bonnet定理', position: 'top' },
    },
  },
  {
    lineId: 'gauss-bonnet-2',
    sectionId: 'gauss-bonnet',
    scene: { id: 'gauss-bonnet-statement', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '定理表述', position: 'bottom' },
    },
  },
  {
    lineId: 'gauss-bonnet-3',
    sectionId: 'gauss-bonnet',
    scene: { id: 'gauss-bonnet-meaning', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '拓扑不变量', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-relativity', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '广义相对论', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-graphics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算机图形学', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-vision', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算机视觉', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-robotics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '机器人学', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
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
    scene: { id: 'summary-curves', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '曲线性质', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-surfaces', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '曲面性质', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-theorem', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'Gauss-Bonnet定理', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '感谢观看!', position: 'bottom' },
    },
  },
]
