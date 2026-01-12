/**
 * 排列组合场景配置
 */

import type { SceneState, NarrationLineScene } from './types'

export const defaultPermutationCombinationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const permutationCombinationScenes: NarrationLineScene[] = [
  // intro 部分
  {
    sectionId: 'intro',
    lineId: 'intro-1',
    scene: {
      type: 'title',
      id: 'permutation-combination-title',
    },
  },
  {
    sectionId: 'intro',
    lineId: 'intro-2',
    scene: {
      type: 'animation',
      id: 'permutation-combination-intro',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'intro',
    lineId: 'intro-3',
    scene: {
      type: 'animation',
      id: 'permutation-combination-overview',
      initialState: { isAnimating: true },
    },
  },

  // permutation 部分
  {
    sectionId: 'permutation',
    lineId: 'permutation-1',
    scene: {
      type: 'animation',
      id: 'permutation-definition',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'permutation',
    lineId: 'permutation-2',
    scene: {
      type: 'formula',
      id: 'permutation-formula',
      initialState: { highlightedElements: ['factorial'] },
    },
  },
  {
    sectionId: 'permutation',
    lineId: 'permutation-3',
    scene: {
      type: 'animation',
      id: 'permutation-example',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'permutation',
    lineId: 'permutation-4',
    scene: {
      type: 'animation',
      id: 'permutation-order-matters',
      initialState: { highlightedElements: ['ABC', 'BAC'] },
    },
  },

  // combination 部分
  {
    sectionId: 'combination',
    lineId: 'combination-1',
    scene: {
      type: 'animation',
      id: 'combination-definition',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'combination',
    lineId: 'combination-2',
    scene: {
      type: 'formula',
      id: 'combination-formula',
      initialState: { highlightedElements: ['n-choose-r'] },
    },
  },
  {
    sectionId: 'combination',
    lineId: 'combination-3',
    scene: {
      type: 'animation',
      id: 'combination-example',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'combination',
    lineId: 'combination-4',
    scene: {
      type: 'animation',
      id: 'combination-order-irrelevant',
      initialState: { highlightedElements: ['AB', 'BA'] },
    },
  },

  // pascal-triangle 部分
  {
    sectionId: 'pascal-triangle',
    lineId: 'pascal-triangle-1',
    scene: {
      type: 'animation',
      id: 'pascal-triangle-intro',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'pascal-triangle',
    lineId: 'pascal-triangle-2',
    scene: {
      type: 'animation',
      id: 'pascal-triangle-recursion',
      initialState: { isAnimating: true, highlightedElements: ['recursion'] },
    },
  },
  {
    sectionId: 'pascal-triangle',
    lineId: 'pascal-triangle-3',
    scene: {
      type: 'animation',
      id: 'pascal-triangle-binomial',
      initialState: { highlightedElements: ['binomial-coefficients'] },
    },
  },
  {
    sectionId: 'pascal-triangle',
    lineId: 'pascal-triangle-4',
    scene: {
      type: 'animation',
      id: 'pascal-triangle-fibonacci',
      initialState: { isAnimating: true, highlightedElements: ['fibonacci'] },
    },
  },

  // applications 部分
  {
    sectionId: 'applications',
    lineId: 'applications-1',
    scene: {
      type: 'application',
      id: 'permutation-combination-password',
    },
  },
  {
    sectionId: 'applications',
    lineId: 'applications-2',
    scene: {
      type: 'animation',
      id: 'permutation-combination-password-calc',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'applications',
    lineId: 'applications-3',
    scene: {
      type: 'application',
      id: 'permutation-combination-lottery',
    },
  },
  {
    sectionId: 'applications',
    lineId: 'applications-4',
    scene: {
      type: 'application',
      id: 'permutation-combination-cs',
    },
  },

  // summary 部分
  {
    sectionId: 'summary',
    lineId: 'summary-1',
    scene: {
      type: 'animation',
      id: 'permutation-combination-difference',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'summary',
    lineId: 'summary-2',
    scene: {
      type: 'animation',
      id: 'permutation-combination-relation',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'summary',
    lineId: 'summary-3',
    scene: {
      type: 'animation',
      id: 'pascal-triangle-beauty',
      initialState: { isAnimating: true },
    },
  },
  {
    sectionId: 'summary',
    lineId: 'summary-4',
    scene: {
      type: 'title',
      id: 'permutation-combination-end',
    },
  },
]
