import { describe, expect, it } from 'vitest';
import {
  asymmetry, crossEntropy, decompositionResidual, entropy, jensenShannon,
  klDivergence, normalize, pinskerBound, PRESETS, sampleField,
  totalVariation, type Dist,
} from './klDivergence';

const P: Dist = [0.5, 0.3, 0.2];
const DISTS: Dist[] = [
  [0.5, 0.3, 0.2],
  [0.4, 0.35, 0.25],
  [0.98, 0.01, 0.01],
  [0.8, 0.1, 0.1],
  [1 / 3, 1 / 3, 1 / 3],
  [0.1, 0.1, 0.8],
];

describe('Gibbs 不等式 D(p‖q) ≥ 0', () => {
  // 全课的核心：用错分布只会更费，绝不会更省
  it('单纯形上 741 个采样点全部非负', () => {
    let neg = 0;
    for (let i = 1; i < 40; i++) {
      for (let j = 1; i + j < 40; j++) {
        const q: Dist = [i / 40, j / 40, 1 - i / 40 - j / 40];
        if (klDivergence(P, q) < -1e-12) neg++;
      }
    }
    expect(neg).toBe(0);
  });

  it('等号当且仅当 p = q', () => {
    for (const p of DISTS) {
      expect(klDivergence(p, p)).toBeCloseTo(0, 12);
    }
    // 稍微挪开就严格为正
    for (const p of DISTS) {
      const q = normalize(p.map((v, i) => (i === 0 ? v + 0.05 : v)));
      expect(klDivergence(p, q)).toBeGreaterThan(1e-6);
    }
  });

  it('最小值出现在 q = p 处', () => {
    let best = Infinity;
    let at: Dist = [];
    for (let i = 1; i < 40; i++) {
      for (let j = 1; i + j < 40; j++) {
        const q: Dist = [i / 40, j / 40, 1 - i / 40 - j / 40];
        const d = klDivergence(P, q);
        if (d < best) { best = d; at = q; }
      }
    }
    expect(best).toBeCloseTo(0, 10);
    at.forEach((v, i) => expect(v).toBeCloseTo(P[i], 6));
  });
});

describe('不对称：KL 不是距离', () => {
  it('存在 D(p‖q) ≠ D(q‖p) 的例子', () => {
    const q: Dist = [0.98, 0.01, 0.01];
    const a = klDivergence(P, q);
    const b = klDivergence(q, P);
    expect(Math.abs(a - b)).toBeGreaterThan(0.5);
    expect(a).toBeGreaterThan(b);
  });

  it('不满足三角不等式（举一个反例即可）', () => {
    // 距离必须满足 d(a,c) ≤ d(a,b) + d(b,c)
    const a: Dist = [0.9, 0.05, 0.05];
    const b: Dist = [1 / 3, 1 / 3, 1 / 3];
    const c: Dist = [0.05, 0.05, 0.9];
    const direct = klDivergence(a, c);
    const via = klDivergence(a, b) + klDivergence(b, c);
    expect(direct).toBeGreaterThan(via);
  });

  it('asymmetry 在 p=q 时为 0', () => {
    expect(asymmetry(P, P)).toBeCloseTo(0, 12);
  });
});

describe('交叉熵 = 熵 + KL', () => {
  it('分解式在所有分布对上成立', () => {
    for (const p of DISTS) {
      for (const q of DISTS) {
        expect(decompositionResidual(p, q)).toBeLessThan(1e-12);
      }
    }
  });

  it('交叉熵不小于熵，等号当 p=q', () => {
    for (const p of DISTS) {
      expect(crossEntropy(p, p)).toBeCloseTo(entropy(p), 12);
      for (const q of DISTS) {
        expect(crossEntropy(p, q)).toBeGreaterThanOrEqual(entropy(p) - 1e-12);
      }
    }
  });

  it('固定 p 时，最小化交叉熵等价于最小化 KL', () => {
    // 两者只差常数 H(p)，所以最优的 q 相同
    let bestCE = Infinity;
    let bestKL = Infinity;
    let qCE: Dist = [];
    let qKL: Dist = [];
    for (let i = 1; i < 30; i++) {
      for (let j = 1; i + j < 30; j++) {
        const q: Dist = [i / 30, j / 30, 1 - i / 30 - j / 30];
        const ce = crossEntropy(P, q);
        const kl = klDivergence(P, q);
        if (ce < bestCE) { bestCE = ce; qCE = q; }
        if (kl < bestKL) { bestKL = kl; qKL = q; }
      }
    }
    qCE.forEach((v, i) => expect(v).toBeCloseTo(qKL[i], 10));
  });
});

describe('无穷的处理', () => {
  it('q 有零分量而 p 没有 ⇒ KL = ∞', () => {
    expect(klDivergence([0.5, 0.5], [1, 0])).toBe(Infinity);
    expect(crossEntropy([0.5, 0.5], [1, 0])).toBe(Infinity);
  });

  it('p 有零分量 ⇒ 该项跳过，结果有限', () => {
    // 这个不对称正是要点：模型说不可能的事发生了才是灾难
    expect(klDivergence([1, 0], [0.5, 0.5])).toBeCloseTo(1, 10);
    expect(Number.isFinite(klDivergence([0.5, 0.5, 0], [0.4, 0.4, 0.2]))).toBe(true);
  });

  it('不返回 NaN', () => {
    for (const p of [...DISTS, [1, 0, 0], [0.5, 0.5, 0]]) {
      for (const q of [...DISTS, [1, 0, 0], [0.5, 0.5, 0]]) {
        expect(Number.isNaN(klDivergence(p, q))).toBe(false);
        expect(Number.isNaN(crossEntropy(p, q))).toBe(false);
      }
    }
  });
});

describe('Jensen-Shannon 是真正的对称度量', () => {
  it('对称', () => {
    for (const p of DISTS) {
      for (const q of DISTS) {
        expect(jensenShannon(p, q)).toBeCloseTo(jensenShannon(q, p), 12);
      }
    }
  });

  it('非负，且 p=q 时为 0', () => {
    for (const p of DISTS) {
      expect(jensenShannon(p, p)).toBeCloseTo(0, 12);
      for (const q of DISTS) {
        expect(jensenShannon(p, q)).toBeGreaterThanOrEqual(-1e-12);
      }
    }
  });

  it('即使 KL 是 ∞ 也保持有限', () => {
    expect(Number.isFinite(jensenShannon([0.5, 0.5], [1, 0]))).toBe(true);
    expect(jensenShannon([0.5, 0.5], [1, 0])).toBeLessThan(1);
  });

  it('上界为 1 比特', () => {
    for (const p of DISTS) {
      for (const q of DISTS) {
        expect(jensenShannon(p, q)).toBeLessThanOrEqual(1 + 1e-9);
      }
    }
  });
});

describe('Pinsker 不等式', () => {
  it('TV ≤ √(D·ln2/2)，300 个采样点全部满足', () => {
    let bad = 0;
    for (let i = 1; i < 25; i++) {
      for (let j = 1; i + j < 25; j++) {
        const q: Dist = [i / 25, j / 25, 1 - i / 25 - j / 25];
        if (totalVariation(P, q) > pinskerBound(P, q) + 1e-9) bad++;
      }
    }
    expect(bad).toBe(0);
  });

  it('总变差是真正的距离：对称且满足三角不等式', () => {
    const a: Dist = [0.9, 0.05, 0.05];
    const b: Dist = [1 / 3, 1 / 3, 1 / 3];
    const c: Dist = [0.05, 0.05, 0.9];
    expect(totalVariation(a, b)).toBeCloseTo(totalVariation(b, a), 12);
    expect(totalVariation(a, c)).toBeLessThanOrEqual(
      totalVariation(a, b) + totalVariation(b, c) + 1e-12,
    );
  });
});

describe('高度场采样', () => {
  it('所有格点都是合法分布，值有限', () => {
    for (const kind of ['kl-pq', 'kl-qp', 'js', 'cross'] as const) {
      for (const row of sampleField(P, kind, 10, 4)) {
        for (const s of row) {
          expect(s.q.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
          expect(Number.isFinite(s.value)).toBe(true);
          expect(s.value).toBeLessThanOrEqual(4 + 1e-12);
        }
      }
    }
  });

  it('两个方向的截断数不同 —— 不对称的可视证据', () => {
    const count = (kind: 'kl-pq' | 'kl-qp') =>
      sampleField(P, kind, 12, 4).flat().filter((s) => s.clipped).length;
    expect(count('kl-pq')).toBeGreaterThan(count('kl-qp'));
  });

  it('JS 场不需要截断', () => {
    expect(sampleField(P, 'js', 12, 4).flat().every((s) => !s.clipped)).toBe(true);
  });
});

describe('预设', () => {
  it('标注与实际一致', () => {
    const zero = PRESETS.find((s) => s.id === 'zero')!;
    expect(klDivergence(zero.p, zero.q)).toBe(Infinity);
    const same = PRESETS.find((s) => s.id === 'same')!;
    expect(klDivergence(same.p, same.q)).toBeCloseTo(0, 12);
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((s) => s.id)).size).toBe(PRESETS.length);
  });
});
