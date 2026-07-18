/**
 * 埃氏筛法讲解场景配置
 * 每句口播对应上界 n 与揭示进度 reveal（params）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSieveEratosthenesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sieveEratosthenesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '埃氏筛法', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-atom', type: 'animation' }, lineState: { params: { n: 50, reveal: 0 }, annotation: { text: '整数的原子', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { n: 50, reveal: 0 }, annotation: { text: '如何一网打尽？', position: 'bottom' } } },

  // ===== principle (4) =====
  { lineId: 'prin-1', sectionId: 'principle', scene: { id: 'prin-start', type: 'animation' }, lineState: { params: { n: 50, reveal: 0 }, annotation: { text: '古希腊的妙招', position: 'top' } } },
  { lineId: 'prin-2', sectionId: 'principle', scene: { id: 'prin-two', type: 'animation' }, lineState: { params: { n: 50, reveal: 2 }, annotation: { text: '划掉 2 的倍数', position: 'bottom' } } },
  { lineId: 'prin-3', sectionId: 'principle', scene: { id: 'prin-three', type: 'animation' }, lineState: { params: { n: 50, reveal: 3 }, annotation: { text: '再划 3 的倍数', position: 'bottom' } } },
  { lineId: 'prin-4', sectionId: 'principle', scene: { id: 'prin-sieve', type: 'animation' }, lineState: { params: { n: 50, reveal: 7 }, annotation: { text: '漏下的即素数', position: 'bottom' } } },

  // ===== observe (3) =====
  { lineId: 'obs-1', sectionId: 'observe', scene: { id: 'obs-dense', type: 'animation' }, lineState: { params: { n: 100, reveal: 0 }, annotation: { text: '开头很密集', position: 'top' } } },
  { lineId: 'obs-2', sectionId: 'observe', scene: { id: 'obs-sparse', type: 'animation' }, lineState: { params: { n: 200, reveal: 0 }, annotation: { text: '越往后越稀', position: 'bottom' } } },
  { lineId: 'obs-3', sectionId: 'observe', scene: { id: 'obs-theorem', type: 'animation' }, lineState: { params: { n: 200, reveal: 0 }, annotation: { text: '素数定理', position: 'bottom' } } },

  // ===== efficiency (3) =====
  { lineId: 'eff-1', sectionId: 'efficiency', scene: { id: 'eff-trial', type: 'animation' }, lineState: { params: { n: 100, reveal: 0 }, annotation: { text: '逐个试除很慢', position: 'top' } } },
  { lineId: 'eff-2', sectionId: 'efficiency', scene: { id: 'eff-sqrt', type: 'animation' }, lineState: { params: { n: 100, reveal: 0 }, annotation: { text: '只需筛到 √n', position: 'bottom' } } },
  { lineId: 'eff-3', sectionId: 'efficiency', scene: { id: 'eff-why', type: 'animation' }, lineState: { params: { n: 100, reveal: 0 }, annotation: { text: '大合数早被划掉', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-bound', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 200, reveal: 0 }, annotation: { text: '调整上界', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 100, reveal: 5 }, annotation: { text: '单步筛除', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '划倍数找素数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-legacy', type: 'summary' }, lineState: { annotation: { text: '古老而不朽', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '我们下次再见！', position: 'bottom' } } },
]
