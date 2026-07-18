/**
 * 哈夫曼编码核心算法（纯函数，便于测试）
 *
 * 统计字符频率后，反复合并两个频率最小的节点，构建一棵哈夫曼树。
 * 沿树向下，左边记 0、右边记 1，得到每个字符的变长前缀码。
 * 高频字符编码短、低频字符编码长，从而压缩总位数。
 */

export interface HuffNode {
  char: string | null
  freq: number
  left: HuffNode | null
  right: HuffNode | null
}

export const SAMPLE_TEXT = 'abracadabra'

/** 统计每个字符出现的频率 */
export function countFrequencies(text: string): Record<string, number> {
  const freq: Record<string, number> = {}
  for (const ch of text) {
    freq[ch] = (freq[ch] || 0) + 1
  }
  return freq
}

/**
 * 构建哈夫曼树：反复取两个最小频率节点合并。
 * 相同频率时按字符（叶子）或先入顺序稳定排序，保证可复现。
 */
export function buildHuffmanTree(freq: Record<string, number>): HuffNode | null {
  const keys = Object.keys(freq).sort()
  const nodes: HuffNode[] = keys.map((ch) => ({ char: ch, freq: freq[ch], left: null, right: null }))
  if (nodes.length === 0) return null

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq || leafKey(a).localeCompare(leafKey(b)))
    const left = nodes.shift() as HuffNode
    const right = nodes.shift() as HuffNode
    nodes.push({ char: null, freq: left.freq + right.freq, left, right })
  }
  return nodes[0]
}

/** 取节点子树里最小的字符，作为稳定排序的次关键字 */
function leafKey(n: HuffNode): string {
  if (n.char !== null) return n.char
  const l = n.left ? leafKey(n.left) : '￿'
  const r = n.right ? leafKey(n.right) : '￿'
  return l < r ? l : r
}

/** 生成编码表：左 0 右 1；单字符树特判为 "0" */
export function generateCodes(tree: HuffNode | null): Record<string, string> {
  const codes: Record<string, string> = {}
  if (!tree) return codes
  if (tree.char !== null) {
    codes[tree.char] = '0'
    return codes
  }
  const walk = (node: HuffNode, path: string) => {
    if (node.char !== null) {
      codes[node.char] = path
      return
    }
    if (node.left) walk(node.left, path + '0')
    if (node.right) walk(node.right, path + '1')
  }
  walk(tree, '')
  return codes
}

/** 哈夫曼编码后的总位数 */
export function encodedBits(freq: Record<string, number>, codes: Record<string, string>): number {
  let bits = 0
  for (const ch of Object.keys(freq)) {
    bits += freq[ch] * (codes[ch]?.length || 0)
  }
  return bits
}

/** 定长编码位数：每字符 ceil(log2(字符种类)) 位，至少 1 位 */
export function fixedBits(freq: Record<string, number>): number {
  const alphabet = Object.keys(freq).length
  const per = Math.max(1, Math.ceil(Math.log2(Math.max(alphabet, 1)) || 0) || 1)
  const total = Object.values(freq).reduce((a, b) => a + b, 0)
  return total * per
}

/** 压缩率：哈夫曼位数占定长位数的比例（0~1，越小越省） */
export function compressionRatio(freq: Record<string, number>, codes: Record<string, string>): number {
  const fixed = fixedBits(freq)
  if (fixed === 0) return 0
  return encodedBits(freq, codes) / fixed
}

export const SAMPLE_TEXTS = ['abracadabra', 'mississippi', 'go go gophers']
