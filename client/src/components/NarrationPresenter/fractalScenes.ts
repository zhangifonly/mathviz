/**
 * 分形几何讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFractalState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const fractalScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { diagram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-coastline', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '海岸线的自相似性', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-tree', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '树枝的分形结构', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-concept', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '自相似性', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-self-similar', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '无限放大的相似结构', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-dimension', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '非整数维度', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-mandelbrot', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '曼德博 (1975)', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-explore', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '开始探索', position: 'bottom' },
    },
  },

  // ========== koch 段落 (4行) ==========
  {
    lineId: 'koch-1',
    sectionId: 'koch',
    scene: { id: 'koch-intro', type: 'animation' },
    lineState: {
      params: { iteration: 0 },
      show: { diagram: true },
      annotation: { text: '科赫雪花', position: 'top' },
    },
  },
  {
    lineId: 'koch-2',
    sectionId: 'koch',
    scene: { id: 'koch-construction', type: 'animation' },
    lineState: {
      params: { iteration: 1 },
      show: { diagram: true },
      annotation: { text: '构造规则', position: 'bottom' },
    },
  },
  {
    lineId: 'koch-3',
    sectionId: 'koch',
    scene: { id: 'koch-iterate', type: 'animation' },
    lineState: {
      params: { iteration: 4 },
      show: { diagram: true },
      annotation: { text: '无限迭代', position: 'bottom' },
    },
  },
  {
    lineId: 'koch-4',
    sectionId: 'koch',
    scene: { id: 'koch-paradox', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['perimeter', 'area'],
      annotation: { text: '无限周长,有限面积', position: 'bottom' },
    },
  },

  // ========== mandelbrot 段落 (4行) ==========
  {
    lineId: 'mandel-1',
    sectionId: 'mandelbrot',
    scene: { id: 'mandel-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '曼德博集合', position: 'top' },
    },
  },
  {
    lineId: 'mandel-2',
    sectionId: 'mandelbrot',
    scene: { id: 'mandel-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'z = z² + c', position: 'bottom' },
    },
  },
  {
    lineId: 'mandel-3',
    sectionId: 'mandelbrot',
    scene: { id: 'mandel-set', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['mandelbrot'],
      annotation: { text: '有界点的集合', position: 'bottom' },
    },
  },
  {
    lineId: 'mandel-4',
    sectionId: 'mandelbrot',
    scene: { id: 'mandel-zoom', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      show: { diagram: true },
      annotation: { text: '无穷精细结构', position: 'bottom' },
    },
  },

  // ========== nature 段落 (4行) ==========
  {
    lineId: 'nature-1',
    sectionId: 'nature',
    scene: { id: 'nature-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '自然界中的分形', position: 'top' },
    },
  },
  {
    lineId: 'nature-2',
    sectionId: 'nature',
    scene: { id: 'nature-bio', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '树木、河流、血管', position: 'bottom' },
    },
  },
  {
    lineId: 'nature-3',
    sectionId: 'nature',
    scene: { id: 'nature-geo', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '闪电、山脉、云朵', position: 'bottom' },
    },
  },
  {
    lineId: 'nature-4',
    sectionId: 'nature',
    scene: { id: 'nature-preference', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '自然偏爱分形', position: 'bottom' },
    },
  },

  // ========== summary 段落 (4行) ==========
  {
    lineId: 'sum-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'sum-2',
    sectionId: 'summary',
    scene: { id: 'summary-beauty', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '简单规则创造无限复杂', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-connection', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数学与自然的联系', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-4',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '感谢观看!', position: 'bottom' },
    },
  },
]
