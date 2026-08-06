import { describe, expect, it } from 'vitest';
import {
  additivityResidual, blockCodeLength, entropy, huffmanAverageLength,
  huffmanLengths, isDyadic, kraftSum, maxEntropy, normalize, PRESETS,
  productDist, redundancy, sampleSimplex, type Dist,
} from './entropyCoding';

const DISTS: Dist[] = [
  [1 / 3, 1 / 3, 1 / 3],
  [0.5, 0.25, 0.25],
  [0.7, 0.2, 0.1],
  [0.9, 0.07, 0.03],
  [0.98, 0.01, 0.01],
  [0.5, 0.5],
  [0.9, 0.1],
  [0.5, 0.25, 0.125, 0.125],
  [0.4, 0.3, 0.2, 0.1],
];

describe('熵', () => {
  it('均匀分布的熵是 log₂n，且是最大值', () => {
    for (const n of [2, 3, 4, 8]) {
      const u = new Array(n).fill(1 / n);
      expect(entropy(u)).toBeCloseTo(Math.log2(n), 10);
      expect(entropy(u)).toBeCloseTo(maxEntropy(n), 10);
    }
  });

  it('确定分布的熵是 0', () => {
    expect(entropy([1, 0, 0])).toBe(0);
    expect(entropy([0, 1])).toBe(0);
  });

  it('零概率不产生 NaN —— 单纯形边界上必须算得出', () => {
    // 0·log0 的极限是 0，直接算是 NaN
    for (const p of [[1, 0, 0], [0.5, 0.5, 0], [0, 0, 1]]) {
      expect(Number.isFinite(entropy(p))).toBe(true);
    }
  });

  it('熵非负，且不超过 log₂n', () => {
    for (const p of DISTS) {
      expect(entropy(p)).toBeGreaterThanOrEqual(-1e-12);
      expect(entropy(p)).toBeLessThanOrEqual(maxEntropy(p.length) + 1e-12);
    }
  });

  it('可加性：H(独立乘积) = k·H', () => {
    // 这是熵之所以"唯一合理"的核心要求
    for (const p of [[0.5, 0.5], [0.7, 0.2, 0.1], [0.4, 0.6]]) {
      for (const k of [2, 3, 4]) {
        expect(additivityResidual(p, k)).toBeLessThan(1e-12);
      }
    }
  });

  it('乘积分布的长度是 n^k 且和为 1', () => {
    const p = [0.7, 0.2, 0.1];
    for (const k of [1, 2, 3]) {
      const q = productDist(p, k);
      expect(q).toHaveLength(Math.pow(3, k));
      expect(q.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    }
  });

  it('normalize 把任意非负向量变成分布', () => {
    const p = normalize([3, 1, 0, 2]);
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
    expect(p[0]).toBeCloseTo(0.5, 12);
  });
});

describe('哈夫曼编码', () => {
  it('码长都是正整数（单符号除外）', () => {
    for (const p of DISTS) {
      for (const L of huffmanLengths(p)) {
        expect(Number.isInteger(L)).toBe(true);
        expect(L).toBeGreaterThan(0);
      }
    }
    expect(huffmanLengths([1])).toEqual([0]);
  });

  it('Kraft 不等式取到等号 —— 哈夫曼把码树填满', () => {
    for (const p of DISTS) {
      expect(kraftSum(huffmanLengths(p))).toBeCloseTo(1, 10);
    }
  });

  it('概率大的符号码长不更长', () => {
    for (const p of DISTS) {
      const L = huffmanLengths(p);
      for (let i = 0; i < p.length; i++) {
        for (let j = 0; j < p.length; j++) {
          if (p[i] > p[j] + 1e-12) expect(L[i]).toBeLessThanOrEqual(L[j]);
        }
      }
    }
  });

  it('均匀分布且 n 是 2 的幂时，码长全部相等', () => {
    for (const n of [2, 4, 8]) {
      const L = huffmanLengths(new Array(n).fill(1 / n));
      expect(new Set(L).size).toBe(1);
      expect(L[0]).toBe(Math.log2(n));
    }
  });
});

describe('信源编码定理 H ≤ L < H+1', () => {
  // 全课的核心断言
  it('所有分布都满足', () => {
    for (const p of DISTS) {
      const h = entropy(p);
      const L = huffmanAverageLength(p);
      expect(L).toBeGreaterThanOrEqual(h - 1e-12);
      expect(L).toBeLessThan(h + 1);
    }
  });

  it('在单纯形上大量采样也满足', () => {
    for (let i = 1; i < 20; i++) {
      for (let j = 1; i + j < 20; j++) {
        const p: Dist = [i / 20, j / 20, 1 - i / 20 - j / 20];
        const h = entropy(p);
        const L = huffmanAverageLength(p);
        expect(L).toBeGreaterThanOrEqual(h - 1e-12);
        expect(L).toBeLessThan(h + 1);
      }
    }
  });

  it('二进制概率时精确达到 H，冗余为 0', () => {
    for (const p of [[0.5, 0.5], [0.5, 0.25, 0.25], [0.5, 0.25, 0.125, 0.125]]) {
      expect(isDyadic(p)).toBe(true);
      expect(redundancy(p)).toBeCloseTo(0, 10);
    }
  });

  it('非二进制概率时有正的冗余', () => {
    for (const p of [[0.7, 0.2, 0.1], [1 / 3, 1 / 3, 1 / 3]]) {
      expect(isDyadic(p)).toBe(false);
      expect(redundancy(p)).toBeGreaterThan(0.01);
    }
  });

  it('冗余恒在 [0, 1)', () => {
    for (const p of DISTS) {
      const r = redundancy(p);
      expect(r).toBeGreaterThanOrEqual(-1e-12);
      expect(r).toBeLessThan(1);
    }
  });

  it('单个符号不可能少于 1 比特 —— 这才需要分组', () => {
    // H=0.469 但哈夫曼只能给 1
    expect(entropy([0.9, 0.1])).toBeLessThan(0.5);
    expect(huffmanAverageLength([0.9, 0.1])).toBe(1);
  });
});

describe('分组编码', () => {
  it('每符号码长落在 [H, H + 1/k)', () => {
    for (const p of [[0.9, 0.1], [0.7, 0.2, 0.1]]) {
      const h = entropy(p);
      for (const k of [1, 2, 3, 4]) {
        const L = blockCodeLength(p, k);
        expect(L).toBeGreaterThanOrEqual(h - 1e-12);
        expect(L).toBeLessThan(h + 1 / k + 1e-12);
      }
    }
  });

  it('k 增大时上界收紧，但实际值并非单调', () => {
    // p=[0.7,0.2,0.1] 时 k=3 反而比 k=2 差：码长必须取整
    const p = [0.7, 0.2, 0.1];
    const L2 = blockCodeLength(p, 2);
    const L3 = blockCodeLength(p, 3);
    expect(L3).toBeGreaterThan(L2);
    // 但 k=4 又更好了
    expect(blockCodeLength(p, 4)).toBeLessThan(L2);
  });

  it('分组显著缩小缺口', () => {
    const p = [0.9, 0.1];
    const h = entropy(p);
    expect(blockCodeLength(p, 1) - h).toBeGreaterThan(0.5);
    expect(blockCodeLength(p, 4) - h).toBeLessThan(0.05);
  });
});

describe('单纯形采样', () => {
  it('所有格点都是合法概率分布', () => {
    for (const kind of ['entropy', 'huffman', 'redundancy'] as const) {
      for (const row of sampleSimplex(kind, 10)) {
        for (const s of row) {
          expect(s.p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
          s.p.forEach((v) => expect(v).toBeGreaterThanOrEqual(-1e-12));
          expect(Number.isFinite(s.value)).toBe(true);
        }
      }
    }
  });

  it('熵的取值范围合理', () => {
    let mx = -Infinity;
    for (const row of sampleSimplex('entropy', 20)) {
      for (const s of row) mx = Math.max(mx, s.value);
    }
    expect(mx).toBeLessThanOrEqual(Math.log2(3) + 1e-9);
    expect(mx).toBeGreaterThan(1.5);
  });

  it('冗余曲面处处非负', () => {
    for (const row of sampleSimplex('redundancy', 14)) {
      for (const s of row) expect(s.value).toBeGreaterThanOrEqual(-1e-12);
    }
  });
});

describe('预设', () => {
  it('标注的二进制性与实际一致', () => {
    expect(isDyadic(PRESETS.find((x) => x.id === 'dyadic')!.p)).toBe(true);
    expect(isDyadic(PRESETS.find((x) => x.id === 'skew')!.p)).toBe(false);
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
