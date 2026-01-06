/**
 * 向量场讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultVectorFieldState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const vectorFieldScenes: NarrationLineScene[] = [
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
    scene: { id: 'intro-weather', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '天气预报风向图', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-arrows', type: 'animation' },
    lineState: {
      show: { diagram: true, arrow: true },
      annotation: { text: '箭头表示风向风速', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-vector-field', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '向量场', position: 'bottom' },
    },
  },

  // ========== concept 段落 (4行) ==========
  {
    lineId: 'concept-1',
    sectionId: 'concept',
    scene: { id: 'concept-definition', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '每点对应一个向量', position: 'top' },
    },
  },
  {
    lineId: 'concept-2',
    sectionId: 'concept',
    scene: { id: 'concept-physical', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '速度场、力场、电场', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-3',
    sectionId: 'concept',
    scene: { id: 'concept-viz', type: 'animation' },
    lineState: {
      show: { diagram: true, arrow: true },
      annotation: { text: '箭头或流线', position: 'bottom' },
    },
  },
  {
    lineId: 'concept-4',
    sectionId: 'concept',
    scene: { id: 'concept-examples', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '观察例子', position: 'bottom' },
    },
  },

  // ========== streamlines 段落 (4行) ==========
  {
    lineId: 'stream-1',
    sectionId: 'streamlines',
    scene: { id: 'stream-definition', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '流线', position: 'top' },
    },
  },
  {
    lineId: 'stream-2',
    sectionId: 'streamlines',
    scene: { id: 'stream-fluid', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '流体质点轨迹', position: 'bottom' },
    },
  },
  {
    lineId: 'stream-3',
    sectionId: 'streamlines',
    scene: { id: 'stream-structure', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '展示整体结构', position: 'bottom' },
    },
  },
  {
    lineId: 'stream-4',
    sectionId: 'streamlines',
    scene: { id: 'stream-no-cross', type: 'animation' },
    lineState: {
      show: { diagram: true, curve: true },
      annotation: { text: '流线不相交', position: 'bottom' },
    },
  },

  // ========== divergence-curl 段落 (4行) ==========
  {
    lineId: 'div-1',
    sectionId: 'divergence-curl',
    scene: { id: 'div-concept', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['divergence'],
      annotation: { text: '散度', position: 'top' },
    },
  },
  {
    lineId: 'div-2',
    sectionId: 'divergence-curl',
    scene: { id: 'div-source-sink', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['source', 'sink'],
      annotation: { text: '源和汇', position: 'bottom' },
    },
  },
  {
    lineId: 'div-3',
    sectionId: 'divergence-curl',
    scene: { id: 'curl-concept', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['curl'],
      annotation: { text: '旋度', position: 'bottom' },
    },
  },
  {
    lineId: 'div-4',
    sectionId: 'divergence-curl',
    scene: { id: 'div-curl-tools', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '分析工具', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'app-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '物理学', position: 'top' },
    },
  },
  {
    lineId: 'app-2',
    sectionId: 'application',
    scene: { id: 'app-fluid', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '流体力学', position: 'bottom' },
    },
  },
  {
    lineId: 'app-3',
    sectionId: 'application',
    scene: { id: 'app-em', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '电场和磁场', position: 'bottom' },
    },
  },
  {
    lineId: 'app-4',
    sectionId: 'application',
    scene: { id: 'app-graphics', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算机图形学', position: 'bottom' },
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
    scene: { id: 'summary-tool', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '描述方向性物理量', position: 'bottom' },
    },
  },
  {
    lineId: 'sum-3',
    sectionId: 'summary',
    scene: { id: 'summary-div-curl', type: 'animation' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '散度和旋度', position: 'bottom' },
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
