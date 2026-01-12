/**
 * 拉普拉斯变换场景配置
 */

import type { SceneState, NarrationLineScene } from './types'

export const defaultLaplaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const laplaceScenes: NarrationLineScene[] = [
  // intro 部分
  {
    sectionId: 'intro',
    lineId: 'intro-1',
    scene: {
      type: 'title',
      id: 'laplace-title',
    },
  },
  {
    sectionId: 'intro',
    lineId: 'intro-2',
    scene: {
      type: 'animation',
      id: 'laplace-intro-concept',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'intro',
    lineId: 'intro-3',
    scene: {
      type: 'animation',
      id: 'laplace-history',
      initialState: { isAnimating: true },
    },
  },

  // definition 部分
  {
    sectionId: 'definition',
    lineId: 'definition-1',
    scene: {
      type: 'formula',
      id: 'laplace-definition-formula',
      initialState: { highlightedElements: ['integral'] },
    },
  },
  {
    sectionId: 'definition',
    lineId: 'definition-2',
    scene: {
      type: 'formula',
      id: 'laplace-complex-s',
      initialState: { highlightedElements: ['complex-plane'] },
    },
  },
  {
    sectionId: 'definition',
    lineId: 'definition-3',
    scene: {
      type: 'animation',
      id: 'laplace-domain-mapping',
      initialState: { isAnimating: true },
    },
  },

  // basic-transforms 部分
  {
    sectionId: 'basic-transforms',
    lineId: 'basic-transforms-1',
    scene: {
      type: 'formula',
      id: 'laplace-step-transform',
      initialState: { highlightedElements: ['step-function'] },
    },
  },
  {
    sectionId: 'basic-transforms',
    lineId: 'basic-transforms-2',
    scene: {
      type: 'formula',
      id: 'laplace-ramp-exp-transform',
      initialState: { highlightedElements: ['ramp', 'exponential'] },
    },
  },
  {
    sectionId: 'basic-transforms',
    lineId: 'basic-transforms-3',
    scene: {
      type: 'formula',
      id: 'laplace-trig-transform',
      initialState: { highlightedElements: ['sine', 'cosine'] },
    },
  },
  {
    sectionId: 'basic-transforms',
    lineId: 'basic-transforms-4',
    scene: {
      type: 'animation',
      id: 'laplace-transform-table',
      initialState: { isAnimating: true },
    },
  },

  // system-analysis 部分
  {
    sectionId: 'system-analysis',
    lineId: 'system-analysis-1',
    scene: {
      type: 'animation',
      id: 'laplace-transfer-function',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'system-analysis',
    lineId: 'system-analysis-2',
    scene: {
      type: 'animation',
      id: 'laplace-first-order',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'system-analysis',
    lineId: 'system-analysis-3',
    scene: {
      type: 'animation',
      id: 'laplace-second-order',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'system-analysis',
    lineId: 'system-analysis-4',
    scene: {
      type: 'animation',
      id: 'laplace-damping',
      initialState: { isAnimating: true },
    },
  },

  // pole-zero 部分
  {
    sectionId: 'pole-zero',
    lineId: 'pole-zero-1',
    scene: {
      type: 'animation',
      id: 'laplace-s-plane',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'pole-zero',
    lineId: 'pole-zero-2',
    scene: {
      type: 'animation',
      id: 'laplace-pole-zero-plot',
      initialState: { highlightedElements: ['poles', 'zeros'] },
    },
  },
  {
    sectionId: 'pole-zero',
    lineId: 'pole-zero-3',
    scene: {
      type: 'animation',
      id: 'laplace-stability',
      initialState: { highlightedElements: ['left-half-plane'] },
    },
  },
  {
    sectionId: 'pole-zero',
    lineId: 'pole-zero-4',
    scene: {
      type: 'animation',
      id: 'laplace-pole-location',
      initialState: { isAnimating: true },
    },
  },

  // applications 部分
  {
    sectionId: 'applications',
    lineId: 'applications-1',
    scene: {
      type: 'application',
      id: 'laplace-circuit-analysis',
    },
  },
  {
    sectionId: 'applications',
    lineId: 'applications-2',
    scene: {
      type: 'application',
      id: 'laplace-control-systems',
    },
  },
  {
    sectionId: 'applications',
    lineId: 'applications-3',
    scene: {
      type: 'application',
      id: 'laplace-signal-processing',
    },
  },

  // summary 部分
  {
    sectionId: 'summary',
    lineId: 'summary-1',
    scene: {
      type: 'animation',
      id: 'laplace-summary-bridge',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'summary',
    lineId: 'summary-2',
    scene: {
      type: 'animation',
      id: 'laplace-summary-methods',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'summary',
    lineId: 'summary-3',
    scene: {
      type: 'animation',
      id: 'laplace-summary-stability',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'summary',
    lineId: 'summary-4',
    scene: {
      type: 'title',
      id: 'laplace-end',
    },
  },
]
