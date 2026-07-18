/**
 * 哈夫曼编码讲解场景配置
 * 每句口播对应一段示例文本（params.text）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHuffmanCodingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const huffmanCodingScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '哈夫曼编码', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fixed', type: 'animation' }, lineState: { params: { text: 'abracadabra' }, annotation: { text: '定长太浪费', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-freq', type: 'animation' }, lineState: { params: { text: 'abracadabra' }, annotation: { text: '频率有高低', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { text: 'abracadabra' }, annotation: { text: '最优答案', position: 'bottom' } } },

  // ===== variable (3) =====
  { lineId: 'var-1', sectionId: 'variable', scene: { id: 'var-short', type: 'animation' }, lineState: { params: { text: 'abracadabra' }, annotation: { text: '高频用短码', position: 'top' } } },
  { lineId: 'var-2', sectionId: 'variable', scene: { id: 'var-total', type: 'animation' }, lineState: { params: { text: 'mississippi' }, annotation: { text: '总位数下降', position: 'bottom' } } },
  { lineId: 'var-3', sectionId: 'variable', scene: { id: 'var-morse', type: 'animation' }, lineState: { params: { text: 'mississippi' }, annotation: { text: '如摩尔斯电码', position: 'bottom' } } },

  // ===== prefix (3) =====
  { lineId: 'pre-1', sectionId: 'prefix', scene: { id: 'pre-split', type: 'animation' }, lineState: { params: { text: 'mississippi' }, annotation: { text: '从哪里断开？', position: 'top' } } },
  { lineId: 'pre-2', sectionId: 'prefix', scene: { id: 'pre-code', type: 'animation' }, lineState: { params: { text: 'mississippi' }, annotation: { text: '互不为前缀', position: 'bottom' } } },
  { lineId: 'pre-3', sectionId: 'prefix', scene: { id: 'pre-decode', type: 'animation' }, lineState: { params: { text: 'mississippi' }, annotation: { text: '解码无歧义', position: 'bottom' } } },

  // ===== greedy (4) =====
  { lineId: 'gre-1', sectionId: 'greedy', scene: { id: 'gre-nodes', type: 'animation' }, lineState: { params: { text: 'abracadabra' }, annotation: { text: '每字符一个节点', position: 'top' } } },
  { lineId: 'gre-2', sectionId: 'greedy', scene: { id: 'gre-merge', type: 'animation' }, lineState: { params: { text: 'abracadabra' }, annotation: { text: '合并两个最小', position: 'bottom' } } },
  { lineId: 'gre-3', sectionId: 'greedy', scene: { id: 'gre-root', type: 'animation' }, lineState: { params: { text: 'abracadabra' }, annotation: { text: '直到剩一个根', position: 'bottom' } } },
  { lineId: 'gre-4', sectionId: 'greedy', scene: { id: 'gre-path', type: 'animation' }, lineState: { params: { text: 'abracadabra' }, annotation: { text: '左0右1得编码', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-text', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { text: 'go go gophers' }, annotation: { text: '换文本看变化', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-ratio', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { text: 'mississippi' }, annotation: { text: '对比压缩率', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '变长前缀码', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-greedy', type: 'summary' }, lineState: { annotation: { text: '贪心即最优', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
