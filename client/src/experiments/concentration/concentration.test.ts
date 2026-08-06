import { describe, expect, it } from 'vitest';
import {
  allBounds, bernoulliVariance, binomPmf, chebyshevBound, crossoverN,
  DEFAULT_SETUP, exactTail, hoeffdingBound, lgamma, logChoose, markovBound,
  PRESETS, sampleSize, sampleSurface,
} from './concentration';

describe('二项分布基础', () => {
  it('lgamma 与阶乘一致', () => {
    for (const n of [1, 5, 10, 20]) {
      let f = 0;
      for (let i = 2; i <= n; i++) f += Math.log(i);
      expect(lgamma(n + 1)).toBeCloseTo(f, 8);
    }
  });

  it('logChoose 与手算一致', () => {
    expect(Math.exp(logChoose(5, 2))).toBeCloseTo(10, 8);
    expect(Math.exp(logChoose(10, 5))).toBeCloseTo(252, 6);
    expect(logChoose(5, 6)).toBe(-Infinity);
  });

  it('pmf 之和为 1，即使 n 很大也不溢出', () => {
    // 直接算阶乘在 n>170 就是 Infinity，所以整条都在对数域
    for (const n of [10, 100, 500, 2000]) {
      let s = 0;
      for (let k = 0; k <= n; k++) s += binomPmf(n, k, 0.5);
      expect(s).toBeCloseTo(1, 9);
    }
  });

  it('pmf 非负且对称（p=0.5 时）', () => {
    const n = 20;
    for (let k = 0; k <= n; k++) {
      expect(binomPmf(n, k, 0.5)).toBeGreaterThanOrEqual(0);
      expect(binomPmf(n, k, 0.5)).toBeCloseTo(binomPmf(n, n - k, 0.5), 12);
    }
  });

  it('退化参数不产生 NaN', () => {
    expect(binomPmf(10, 0, 0)).toBe(1);
    expect(binomPmf(10, 10, 1)).toBe(1);
    expect(binomPmf(10, 3, 0)).toBe(0);
  });
});

describe('三个界都是有效上界', () => {
  // 界失效就是整门课的前提垮掉，所以覆盖面要宽
  it('真实尾概率不超过 Chebyshev 与 Hoeffding', () => {
    for (const n of [1, 5, 10, 25, 50, 100, 200, 500]) {
      for (const t of [0.05, 0.1, 0.15, 0.2, 0.3, 0.45]) {
        const b = allBounds(n, t);
        expect(b.exact).toBeLessThanOrEqual(b.chebyshev + 1e-12);
        expect(b.exact).toBeLessThanOrEqual(b.hoeffding + 1e-12);
      }
    }
  });

  it('换 p 也成立', () => {
    for (const p of [0.1, 0.3, 0.7, 0.9]) {
      for (const n of [10, 50, 200]) {
        for (const t of [0.1, 0.2]) {
          const b = allBounds(n, t, { p, a: 0, b: 1 });
          expect(b.exact).toBeLessThanOrEqual(b.chebyshev + 1e-12);
          expect(b.exact).toBeLessThanOrEqual(b.hoeffding + 1e-12);
        }
      }
    }
  });

  it('所有界都落在 [0,1]', () => {
    for (const n of [1, 10, 1000]) {
      for (const t of [0.01, 0.2, 0.9]) {
        const b = allBounds(n, t);
        for (const v of [b.exact, b.chebyshev, b.hoeffding]) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('Markov 界：P(X≥a) ≤ E[X]/a', () => {
    expect(markovBound(1, 4)).toBeCloseTo(0.25, 12);
    expect(markovBound(1, 0.5)).toBe(1); // 截断到 1
    expect(markovBound(1, 0)).toBe(1);
  });
});

describe('衰减速度', () => {
  it('Chebyshev 随 n 线性衰减', () => {
    const t = 0.1;
    const v = bernoulliVariance(0.5);
    const b1 = chebyshevBound(100, v, t);
    const b2 = chebyshevBound(200, v, t);
    expect(b1 / b2).toBeCloseTo(2, 6);
  });

  it('Hoeffding 随 n 指数衰减', () => {
    const t = 0.15;
    const r1 = hoeffdingBound(100, t, 0, 1) / hoeffdingBound(50, t, 0, 1);
    const r2 = hoeffdingBound(150, t, 0, 1) / hoeffdingBound(100, t, 0, 1);
    // 等步长的比值应相同（指数的特征）
    expect(r1).toBeCloseTo(r2, 8);
  });

  it('两个界都随 n 单调下降', () => {
    for (let n = 1; n < 200; n++) {
      expect(chebyshevBound(n + 1, 0.25, 0.1)).toBeLessThanOrEqual(chebyshevBound(n, 0.25, 0.1) + 1e-15);
      expect(hoeffdingBound(n + 1, 0.1, 0, 1)).toBeLessThanOrEqual(hoeffdingBound(n, 0.1, 0, 1) + 1e-15);
    }
  });
});

describe('交叉点：指数界不总是更紧', () => {
  // 本课要澄清的核心误解
  it('小 n 时 Chebyshev 更紧，大 n 时 Hoeffding 更紧', () => {
    const t = 0.2;
    const n0 = crossoverN(t)!;
    expect(n0).toBeGreaterThan(5);
    const before = allBounds(Math.max(1, Math.floor(n0) - 5), t);
    const after = allBounds(Math.ceil(n0) + 5, t);
    expect(before.chebyshev).toBeLessThan(before.hoeffding);
    expect(after.hoeffding).toBeLessThan(after.chebyshev);
  });

  it('交叉点随 t 变小而变大', () => {
    const a = crossoverN(0.3)!;
    const b = crossoverN(0.2)!;
    const c = crossoverN(0.1)!;
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });

  it('交叉点不落在两界都被截到 1 的区域', () => {
    // 那一段差为 0，二分会误判成交叉
    for (const t of [0.1, 0.2, 0.3]) {
      const n = crossoverN(t)!;
      const b = allBounds(Math.round(n), t);
      expect(b.chebyshev).toBeLessThan(1 - 1e-9);
      expect(b.hoeffding).toBeLessThan(1 - 1e-9);
    }
  });
});

describe('样本量反解', () => {
  it('三者的严格程度：真实 < Hoeffding < Chebyshev', () => {
    for (const [t, d] of [[0.1, 0.05], [0.05, 0.05], [0.1, 0.01]] as Array<[number, number]>) {
      const s = sampleSize(t, d);
      expect(s.exact).not.toBeNull();
      expect(s.exact!).toBeLessThan(s.hoeffding);
      expect(s.hoeffding).toBeLessThan(s.chebyshev);
    }
  });

  it('返回的 n 之后不再违规 —— 尾概率并非单调，不能取第一个满足的', () => {
    for (const [t, d] of [[0.1, 0.05], [0.1, 0.01]] as Array<[number, number]>) {
      const s = sampleSize(t, d);
      for (let n = s.exact!; n <= s.exact! + 80; n++) {
        expect(exactTail(n, DEFAULT_SETUP.p, t)).toBeLessThanOrEqual(d + 1e-12);
      }
    }
  });

  it('恰好前一个 n 是不达标的', () => {
    const s = sampleSize(0.1, 0.05);
    expect(exactTail(s.exact! - 1, 0.5, 0.1)).toBeGreaterThan(0.05);
  });

  it('Chebyshev 的公式 σ²/(δt²) 正确', () => {
    const s = sampleSize(0.1, 0.05);
    expect(s.chebyshev).toBe(Math.ceil(0.25 / (0.05 * 0.01)));
  });
});

describe('曲面采样', () => {
  it('网格尺寸正确且全部有限', () => {
    for (const kind of ['exact', 'chebyshev', 'hoeffding'] as const) {
      const g = sampleSurface(kind, 1, 200, 0.05, 0.3, 10, 12);
      expect(g).toHaveLength(11);
      expect(g[0]).toHaveLength(13);
      for (const row of g) {
        for (const v of row) {
          expect(Number.isFinite(v)).toBe(true);
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('真实曲面处处不高于两个界的曲面', () => {
    const e = sampleSurface('exact', 1, 300, 0.05, 0.3, 12, 12);
    const c = sampleSurface('chebyshev', 1, 300, 0.05, 0.3, 12, 12);
    const h = sampleSurface('hoeffding', 1, 300, 0.05, 0.3, 12, 12);
    for (let i = 0; i < e.length; i++) {
      for (let j = 0; j < e[i].length; j++) {
        expect(e[i][j]).toBeLessThanOrEqual(c[i][j] + 1e-12);
        expect(e[i][j]).toBeLessThanOrEqual(h[i][j] + 1e-12);
      }
    }
  });
});

describe('预设', () => {
  it('每个预设的交叉点与标注量级一致', () => {
    const expected: Record<string, number> = { wide: 27, mid: 48, tight: 108 };
    for (const p of PRESETS) {
      const n = crossoverN(p.t);
      if (expected[p.id] !== undefined) {
        expect(n).not.toBeNull();
        expect(Math.abs(n! - expected[p.id])).toBeLessThan(3);
      }
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
