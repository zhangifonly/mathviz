/**
 * 欧几里得算法讲解场景配置
 * 每句口播对应一组数对（params.pairIndex 索引 SAMPLES）与展示步数（params.maxStep）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEuclideanAlgorithmState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const euclideanAlgorithmScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '欧几里得算法', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-gcd', type: 'animation' }, lineState: { params: { pairIndex: 0, maxStep: -1 }, annotation: { text: 'gcd(48,36)=12', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-euclid', type: 'animation' }, lineState: { params: { pairIndex: 0, maxStep: -1 }, annotation: { text: '两千年前的智慧', position: 'bottom' } } },

  // ===== divide (3) =====
  { lineId: 'def-1', sectionId: 'divide', scene: { id: 'def-mod', type: 'animation' }, lineState: { params: { pairIndex: 1, maxStep: 0 }, annotation: { text: '大数除以小数取余', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'divide', scene: { id: 'def-loop', type: 'animation' }, lineState: { params: { pairIndex: 1, maxStep: 2 }, annotation: { text: '辗转反复', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'divide', scene: { id: 'def-result', type: 'animation' }, lineState: { params: { pairIndex: 1, maxStep: -1 }, annotation: { text: '末除数即答案', position: 'bottom' } } },

  // ===== geometry (3) =====
  { lineId: 'geo-1', sectionId: 'geometry', scene: { id: 'geo-first', type: 'animation' }, lineState: { params: { pairIndex: 0, maxStep: 0 }, annotation: { text: '切最大正方形', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geometry', scene: { id: 'geo-recurse', type: 'animation' }, lineState: { params: { pairIndex: 0, maxStep: 1 }, annotation: { text: '剩余矩形再切', position: 'bottom' } } },
  { lineId: 'geo-3', sectionId: 'geometry', scene: { id: 'geo-final', type: 'animation' }, lineState: { params: { pairIndex: 0, maxStep: -1 }, annotation: { text: '末正方形=gcd', position: 'bottom' } } },

  // ===== extend (2) =====
  { lineId: 'ext-1', sectionId: 'extend', scene: { id: 'ext-coef', type: 'animation' }, lineState: { params: { pairIndex: 2, maxStep: -1 }, annotation: { text: '求出系数 x,y', position: 'top' } } },
  { lineId: 'ext-2', sectionId: 'extend', scene: { id: 'ext-bezout', type: 'animation' }, lineState: { params: { pairIndex: 2, maxStep: -1 }, annotation: { text: 'ax+by=gcd', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-choose', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pairIndex: 1, maxStep: -1 }, annotation: { text: '试不同的数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-fill', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pairIndex: 0, maxStep: -1 }, annotation: { text: '正方形填满矩形', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '古老而高效', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-forms', type: 'summary' }, lineState: { annotation: { text: '几何与代数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
