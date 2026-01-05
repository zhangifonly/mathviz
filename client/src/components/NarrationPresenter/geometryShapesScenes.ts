/**
 * 基础几何图形讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 44 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultGeometryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置 - 每行口播对应一个场景
export const geometryShapesScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: {
      show: { shape: false, formula: false, measurements: false },
    },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-shapes', type: 'title' },
    lineState: {
      show: { shape: false, formula: false, measurements: false },
      annotation: { text: '身边的几何图形', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-examples', type: 'animation' },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 60 },
      show: { shape: true, formula: false, measurements: false },
      annotation: { text: '窗户、钟表、三明治', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-start', type: 'animation' },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-intro', type: 'animation' },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 60 },
      show: { shape: true, formula: false, measurements: false },
      annotation: { text: '面积和周长', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-area', type: 'animation' },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 60 },
      show: { shape: true, formula: false, measurements: false },
      highlight: ['area'],
      annotation: { text: '面积 = 涂满需要多少颜料', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-perimeter', type: 'animation' },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 60 },
      show: { shape: true, formula: false, measurements: true },
      highlight: ['perimeter'],
      annotation: { text: '周长 = 蚂蚁走一圈的距离', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-units', type: 'formula' },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '面积:平方单位 周长:长度单位', position: 'bottom' },
    },
  },

  // ========== triangle 段落 (5行) ==========
  {
    lineId: 'tri-1',
    sectionId: 'triangle',
    scene: { id: 'tri-intro', type: 'animation' },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: false, measurements: true },
      annotation: { text: '三条边、三个角', position: 'top' },
    },
  },
  {
    lineId: 'tri-2',
    sectionId: 'triangle',
    scene: { id: 'tri-area', type: 'formula' },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'S = 底×高÷2', position: 'bottom' },
    },
  },
  {
    lineId: 'tri-3',
    sectionId: 'triangle',
    scene: { id: 'tri-why', type: 'animation' },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '三角形=长方形的一半', position: 'bottom' },
    },
  },
  {
    lineId: 'tri-4',
    sectionId: 'triangle',
    scene: { id: 'tri-combine', type: 'animation' },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      highlight: ['shape'],
      annotation: { text: '两个三角形=一个长方形', position: 'bottom' },
    },
  },
  {
    lineId: 'tri-5',
    sectionId: 'triangle',
    scene: { id: 'tri-perimeter', type: 'formula' },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'C = a + b + c', position: 'bottom' },
    },
  },

  // ========== rectangle 段落 (5行) ==========
  {
    lineId: 'rect-1',
    sectionId: 'rectangle',
    scene: { id: 'rect-intro', type: 'animation' },
    lineState: {
      params: { shape: 'rectangle', param1: 120, param2: 70 },
      show: { shape: true, formula: false, measurements: true },
      annotation: { text: '四条边、四个直角', position: 'top' },
    },
  },
  {
    lineId: 'rect-2',
    sectionId: 'rectangle',
    scene: { id: 'rect-area', type: 'formula' },
    lineState: {
      params: { shape: 'rectangle', param1: 120, param2: 70 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'S = 长×宽', position: 'bottom' },
    },
  },
  {
    lineId: 'rect-3',
    sectionId: 'rectangle',
    scene: { id: 'rect-perimeter', type: 'formula' },
    lineState: {
      params: { shape: 'rectangle', param1: 120, param2: 70 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'C = 2×(长+宽)', position: 'bottom' },
    },
  },
  {
    lineId: 'rect-4',
    sectionId: 'rectangle',
    scene: { id: 'square-intro', type: 'animation' },
    lineState: {
      params: { shape: 'square', param1: 80 },
      show: { shape: true, formula: false, measurements: true },
      annotation: { text: '正方形=特殊长方形', position: 'top' },
    },
  },
  {
    lineId: 'rect-5',
    sectionId: 'rectangle',
    scene: { id: 'square-formulas', type: 'formula' },
    lineState: {
      params: { shape: 'square', param1: 80 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'S=边长² C=4×边长', position: 'bottom' },
    },
  },

  // ========== circle 段落 (5行) ==========
  {
    lineId: 'circle-1',
    sectionId: 'circle',
    scene: { id: 'circle-intro', type: 'animation' },
    lineState: {
      params: { shape: 'circle', param1: 60 },
      show: { shape: true, formula: false, measurements: false },
      annotation: { text: '没有角、边是弯曲的', position: 'top' },
    },
  },
  {
    lineId: 'circle-2',
    sectionId: 'circle',
    scene: { id: 'circle-radius', type: 'animation' },
    lineState: {
      params: { shape: 'circle', param1: 60 },
      show: { shape: true, formula: false, measurements: true },
      highlight: ['radius'],
      annotation: { text: '半径r=圆心到边的距离', position: 'bottom' },
    },
  },
  {
    lineId: 'circle-3',
    sectionId: 'circle',
    scene: { id: 'circle-area', type: 'formula' },
    lineState: {
      params: { shape: 'circle', param1: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'S = πr² (π≈3.14)', position: 'bottom' },
    },
  },
  {
    lineId: 'circle-4',
    sectionId: 'circle',
    scene: { id: 'circle-circumference', type: 'formula' },
    lineState: {
      params: { shape: 'circle', param1: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'C = 2πr', position: 'bottom' },
    },
  },
  {
    lineId: 'circle-5',
    sectionId: 'circle',
    scene: { id: 'circle-pi', type: 'formula' },
    lineState: {
      params: { shape: 'circle', param1: 60 },
      show: { shape: true, formula: true, measurements: true },
      highlight: ['formula'],
      annotation: { text: 'π=圆周÷直径，永远不变！', position: 'bottom' },
    },
  },

  // ========== parallelogram 段落 (5行) ==========
  {
    lineId: 'para-1',
    sectionId: 'parallelogram',
    scene: { id: 'para-intro', type: 'animation' },
    lineState: {
      params: { shape: 'parallelogram', param1: 100, param2: 60 },
      show: { shape: true, formula: false, measurements: true },
      annotation: { text: '对边平行且相等', position: 'top' },
    },
  },
  {
    lineId: 'para-2',
    sectionId: 'parallelogram',
    scene: { id: 'para-area', type: 'formula' },
    lineState: {
      params: { shape: 'parallelogram', param1: 100, param2: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'S = 底×高', position: 'bottom' },
    },
  },
  {
    lineId: 'para-3',
    sectionId: 'parallelogram',
    scene: { id: 'para-height', type: 'animation' },
    lineState: {
      params: { shape: 'parallelogram', param1: 100, param2: 60 },
      show: { shape: true, formula: true, measurements: true },
      highlight: ['height'],
      annotation: { text: '高是垂直高度，不是斜边', position: 'bottom' },
    },
  },
  {
    lineId: 'para-4',
    sectionId: 'parallelogram',
    scene: { id: 'trap-intro', type: 'animation' },
    lineState: {
      params: { shape: 'trapezoid', param1: 120, param2: 80, param3: 60 },
      show: { shape: true, formula: false, measurements: true },
      annotation: { text: '梯形：只有一组对边平行', position: 'top' },
    },
  },
  {
    lineId: 'para-5',
    sectionId: 'parallelogram',
    scene: { id: 'trap-area', type: 'formula' },
    lineState: {
      params: { shape: 'trapezoid', param1: 120, param2: 80, param3: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: 'S=(上底+下底)×高÷2', position: 'bottom' },
    },
  },

  // ========== parameters 段落 (5行) ==========
  {
    lineId: 'param-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '轮到你了！', position: 'top' },
    },
  },
  {
    lineId: 'param-2',
    sectionId: 'parameters',
    scene: { id: 'param-select', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '选择不同的图形', position: 'bottom' },
    },
  },
  {
    lineId: 'param-3',
    sectionId: 'parameters',
    scene: { id: 'param-slider', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { shape: 'circle', param1: 50 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '拖动滑块改变大小', position: 'bottom' },
    },
  },
  {
    lineId: 'param-4',
    sectionId: 'parameters',
    scene: { id: 'param-double', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { shape: 'square', param1: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '边长×2，面积变几倍？', position: 'bottom' },
    },
  },
  {
    lineId: 'param-5',
    sectionId: 'parameters',
    scene: { id: 'param-grid', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { shape: 'parallelogram', param1: 100, param2: 60 },
      show: { shape: true, formula: true, measurements: true, grid: true },
      annotation: { text: '打开网格和标注', position: 'bottom' },
    },
  },

  // ========== application 段落 (5行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { shape: false, formula: false, measurements: false },
      annotation: { text: '生活中的几何', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-floor', type: 'application' },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '装修房间→计算地板面积', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-fence', type: 'application' },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      highlight: ['perimeter'],
      annotation: { text: '围栅栏→计算周长', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-pizza', type: 'application' },
    lineState: {
      params: { shape: 'circle', param1: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '披萨大小=圆面积', position: 'bottom' },
    },
  },
  {
    lineId: 'app-5',
    sectionId: 'application',
    scene: { id: 'app-summary', type: 'application' },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '学好几何解决实际问题！', position: 'bottom' },
    },
  },

  // ========== summary 段落 (6行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { shape: false, formula: false, measurements: false },
      annotation: { text: '总结六种图形', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-triangle', type: 'animation' },
    lineState: {
      params: { shape: 'triangle', param1: 100, param2: 80 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '三角形: S=底×高÷2', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-rect', type: 'animation' },
    lineState: {
      params: { shape: 'rectangle', param1: 100, param2: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '长方形S=长×宽 正方形S=边长²', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-circle', type: 'animation' },
    lineState: {
      params: { shape: 'circle', param1: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '圆: S=πr² C=2πr', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-para', type: 'animation' },
    lineState: {
      params: { shape: 'parallelogram', param1: 100, param2: 60 },
      show: { shape: true, formula: true, measurements: true },
      annotation: { text: '平行四边形S=底×高 梯形S=(上+下)×高÷2', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-6',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { shape: false, formula: false, measurements: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
