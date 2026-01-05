/**
 * 回归分析讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRegressionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const regressionScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { graph: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-data', type: 'animation' },
    lineState: {
      show: { graph: true, points: true },
      annotation: { text: '数据点呈线性关系', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-problem', type: 'animation' },
    lineState: {
      show: { graph: true, points: true },
      annotation: { text: '找最佳直线', position: 'bottom' },
    },
  },

  // ========== scatter-plot 段落 (4行) ==========
  {
    lineId: 'scatter-plot-1',
    sectionId: 'scatter-plot',
    scene: { id: 'sp-draw', type: 'animation' },
    lineState: {
      show: { graph: true, points: true },
      annotation: { text: '散点图', position: 'top' },
    },
  },
  {
    lineId: 'scatter-plot-2',
    sectionId: 'scatter-plot',
    scene: { id: 'sp-point', type: 'animation' },
    lineState: {
      show: { graph: true, points: true },
      annotation: { text: '每点=(x,y)', position: 'bottom' },
    },
  },
  {
    lineId: 'scatter-plot-3',
    sectionId: 'scatter-plot',
    scene: { id: 'sp-linear', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, trendLine: true },
      annotation: { text: '线性关系', position: 'bottom' },
    },
  },
  {
    lineId: 'scatter-plot-4',
    sectionId: 'scatter-plot',
    scene: { id: 'sp-error', type: 'animation' },
    lineState: {
      show: { graph: true, points: true },
      annotation: { text: '测量误差', position: 'bottom' },
    },
  },

  // ========== best-fit 段落 (4行) ==========
  {
    lineId: 'best-fit-1',
    sectionId: 'best-fit',
    scene: { id: 'bf-goal', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true },
      annotation: { text: 'y=ax+b 拟合', position: 'top' },
    },
  },
  {
    lineId: 'best-fit-2',
    sectionId: 'best-fit',
    scene: { id: 'bf-standard', type: 'animation' },
    lineState: {
      show: { graph: true, points: true },
      annotation: { text: '衡量标准', position: 'bottom' },
    },
  },
  {
    lineId: 'best-fit-3',
    sectionId: 'best-fit',
    scene: { id: 'bf-lsq', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true, residuals: true },
      annotation: { text: '最小二乘法', position: 'bottom' },
    },
  },
  {
    lineId: 'best-fit-4',
    sectionId: 'best-fit',
    scene: { id: 'bf-residual', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true, residuals: true },
      highlight: ['residuals'],
      annotation: { text: '残差平方和', position: 'bottom' },
    },
  },

  // ========== least-squares 段落 (4行) ==========
  {
    lineId: 'least-squares-1',
    sectionId: 'least-squares',
    scene: { id: 'ls-formula', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: '计算公式', position: 'top' },
    },
  },
  {
    lineId: 'least-squares-2',
    sectionId: 'least-squares',
    scene: { id: 'ls-slope', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: 'a=协方差/方差', position: 'bottom' },
    },
  },
  {
    lineId: 'least-squares-3',
    sectionId: 'least-squares',
    scene: { id: 'ls-intercept', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true },
      annotation: { text: 'b=ȳ-aẍ', position: 'bottom' },
    },
  },
  {
    lineId: 'least-squares-4',
    sectionId: 'least-squares',
    scene: { id: 'ls-mean', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true, meanPoint: true },
      highlight: ['meanPoint'],
      annotation: { text: '过均值点', position: 'bottom' },
    },
  },

  // ========== demo 段落 (4行) ==========
  {
    lineId: 'demo-1',
    sectionId: 'demo',
    scene: { id: 'demo-show', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true },
      annotation: { text: '蓝点+红线', position: 'top' },
    },
  },
  {
    lineId: 'demo-2',
    sectionId: 'demo',
    scene: { id: 'demo-residual', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true, residuals: true },
      annotation: { text: '绿色残差', position: 'bottom' },
    },
  },
  {
    lineId: 'demo-3',
    sectionId: 'demo',
    scene: { id: 'demo-drag', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      show: { graph: true, points: true, line: true, residuals: true },
      annotation: { text: '拖动点观察', position: 'bottom' },
    },
  },
  {
    lineId: 'demo-4',
    sectionId: 'demo',
    scene: { id: 'demo-sse', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true, sse: true },
      annotation: { text: 'SSE 最小', position: 'bottom' },
    },
  },

  // ========== correlation 段落 (4行) ==========
  {
    lineId: 'correlation-1',
    sectionId: 'correlation',
    scene: { id: 'cor-r', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, rValue: true },
      annotation: { text: '相关系数 r', position: 'top' },
    },
  },
  {
    lineId: 'correlation-2',
    sectionId: 'correlation',
    scene: { id: 'cor-range', type: 'animation' },
    lineState: {
      show: { graph: true, rValue: true },
      annotation: { text: '-1 ≤ r ≤ 1', position: 'bottom' },
    },
  },
  {
    lineId: 'correlation-3',
    sectionId: 'correlation',
    scene: { id: 'cor-meaning', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, rValue: true },
      annotation: { text: '正/负/无相关', position: 'bottom' },
    },
  },
  {
    lineId: 'correlation-4',
    sectionId: 'correlation',
    scene: { id: 'cor-r2', type: 'formula' },
    lineState: {
      show: { graph: true, formula: true, r2Value: true },
      annotation: { text: 'R²=决定系数', position: 'bottom' },
    },
  },

  // ========== prediction 段落 (4行) ==========
  {
    lineId: 'prediction-1',
    sectionId: 'prediction',
    scene: { id: 'pred-intro', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true },
      annotation: { text: '预测', position: 'top' },
    },
  },
  {
    lineId: 'prediction-2',
    sectionId: 'prediction',
    scene: { id: 'pred-calc', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      show: { graph: true, points: true, line: true, prediction: true },
      annotation: { text: '输入x预测y', position: 'bottom' },
    },
  },
  {
    lineId: 'prediction-3',
    sectionId: 'prediction',
    scene: { id: 'pred-range', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true, dataRange: true },
      annotation: { text: '数据范围内可靠', position: 'bottom' },
    },
  },
  {
    lineId: 'prediction-4',
    sectionId: 'prediction',
    scene: { id: 'pred-extrap', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true, extrapolation: true },
      annotation: { text: '外推不准确', position: 'bottom' },
    },
  },

  // ========== caution 段落 (4行) ==========
  {
    lineId: 'caution-1',
    sectionId: 'caution',
    scene: { id: 'cau-intro', type: 'animation' },
    lineState: {
      show: { graph: true },
      annotation: { text: '注意事项', position: 'top' },
    },
  },
  {
    lineId: 'caution-2',
    sectionId: 'caution',
    scene: { id: 'cau-cause', type: 'animation' },
    lineState: {
      show: { graph: true, points: true },
      annotation: { text: '相关≠因果', position: 'bottom' },
    },
  },
  {
    lineId: 'caution-3',
    sectionId: 'caution',
    scene: { id: 'cau-outlier', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, outlier: true },
      highlight: ['outlier'],
      annotation: { text: '异常值影响', position: 'bottom' },
    },
  },
  {
    lineId: 'caution-4',
    sectionId: 'caution',
    scene: { id: 'cau-nonlinear', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, nonlinearCurve: true },
      annotation: { text: '非线性不适用', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '广泛应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-econ', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '经济学', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-med', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '医学', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-ml', type: 'application' },
    lineState: {
      show: { graph: true },
      annotation: { text: '机器学习', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { graph: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-line', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true },
      annotation: { text: '直线拟合数据', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-lsq', type: 'animation' },
    lineState: {
      show: { graph: true, points: true, line: true, residuals: true },
      annotation: { text: '最小二乘法', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-cor', type: 'animation' },
    lineState: {
      show: { graph: true, rValue: true },
      annotation: { text: '相关≠因果', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { graph: false },
      annotation: { text: '更直观理解回归分析！', position: 'bottom' },
    },
  },
]
