import { describe, it, expect } from 'vitest'
import {
  countFrequencies,
  buildHuffmanTree,
  generateCodes,
  encodedBits,
  fixedBits,
  compressionRatio,
  SAMPLE_TEXT,
  SAMPLE_TEXTS,
} from './huffmanCoding'

describe('哈夫曼编码', () => {
  it('countFrequencies 正确统计频率', () => {
    const f = countFrequencies('abracadabra')
    expect(f.a).toBe(5)
    expect(f.b).toBe(2)
    expect(f.r).toBe(2)
    expect(f.c).toBe(1)
    expect(f.d).toBe(1)
  })

  it('buildHuffmanTree 根节点频率等于总字符数', () => {
    const f = countFrequencies(SAMPLE_TEXT)
    const tree = buildHuffmanTree(f)
    expect(tree).not.toBeNull()
    const total = Object.values(f).reduce((a, b) => a + b, 0)
    expect(tree?.freq).toBe(total)
  })

  it('generateCodes 是前缀码：无编码是另一个的前缀', () => {
    const f = countFrequencies('mississippi')
    const codes = generateCodes(buildHuffmanTree(f))
    const list = Object.values(codes)
    for (const a of list) {
      for (const b of list) {
        if (a !== b) expect(b.startsWith(a)).toBe(false)
      }
    }
  })

  it('高频字符编码不长于低频字符', () => {
    const f = countFrequencies('abracadabra')
    const codes = generateCodes(buildHuffmanTree(f))
    // a 出现最多，其编码应最短
    expect(codes.a.length).toBeLessThanOrEqual(codes.c.length)
    expect(codes.a.length).toBeLessThanOrEqual(codes.d.length)
  })

  it('哈夫曼位数不超过定长位数，压缩率在 0~1', () => {
    for (const text of SAMPLE_TEXTS) {
      const f = countFrequencies(text)
      const codes = generateCodes(buildHuffmanTree(f))
      const huff = encodedBits(f, codes)
      const fixed = fixedBits(f)
      expect(huff).toBeLessThanOrEqual(fixed)
      const ratio = compressionRatio(f, codes)
      expect(ratio).toBeGreaterThan(0)
      expect(ratio).toBeLessThanOrEqual(1)
    }
  })

  it('单字符文本编码为 "0"', () => {
    const f = countFrequencies('aaaa')
    const codes = generateCodes(buildHuffmanTree(f))
    expect(codes.a).toBe('0')
    expect(encodedBits(f, codes)).toBe(4)
  })

  it('空文本树为 null，编码表为空', () => {
    const f = countFrequencies('')
    expect(buildHuffmanTree(f)).toBeNull()
    expect(Object.keys(generateCodes(null)).length).toBe(0)
  })
})
