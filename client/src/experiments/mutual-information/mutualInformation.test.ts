import { describe, expect, it } from 'vitest';
import {
  becCapacityAnalytic, binaryEntropy, bscCapacityAnalytic, channelCapacity,
  channelMI, conditionalEntropyXgivenY, conditionalEntropyYgivenX, entropy,
  jointEntropy, makeJoint, marginalX, marginalY, mutualInformation,
  mutualInformationAsKL, PRESETS, sampleSurface, type Joint,
} from './mutualInformation';

const KINDS = ['bsc', 'bec', 'z'] as const;

describe('边缘与联合', () => {
  it('边缘分布之和为 1', () => {
    for (const kind of KINDS) {
      for (const a of [0, 0.3, 0.5, 1]) {
        for (const e of [0, 0.2, 0.5, 1]) {
          const J = makeJoint(a, e, kind);
          expect(marginalX(J).reduce((s, v) => s + v, 0)).toBeCloseTo(1, 10);
          expect(marginalY(J).reduce((s, v) => s + v, 0)).toBeCloseTo(1, 10);
        }
      }
    }
  });

  it('联合分布非负且和为 1', () => {
    for (const kind of KINDS) {
      const J = makeJoint(0.4, 0.25, kind);
      expect(J.flat().reduce((s, v) => s + v, 0)).toBeCloseTo(1, 10);
      J.flat().forEach((v) => expect(v).toBeGreaterThanOrEqual(-1e-15));
    }
  });

  it('边缘 X 就是输入分布', () => {
    for (const kind of KINDS) {
      const px = marginalX(makeJoint(0.3, 0.2, kind));
      expect(px[0]).toBeCloseTo(0.3, 10);
      expect(px[1]).toBeCloseTo(0.7, 10);
    }
  });
});

describe('互信息的四个等价写法', () => {
  // 全课的核心：四种视角，同一个量
  const cases: Joint[] = [
    makeJoint(0.5, 0.1, 'bsc'),
    makeJoint(0.3, 0.1, 'bsc'),
    makeJoint(0.5, 0.3, 'bec'),
    makeJoint(0.5, 0.3, 'z'),
    [[0.25, 0.25], [0.25, 0.25]],
    [[0.5, 0], [0, 0.5]],
  ];

  it('I = H(X) + H(Y) − H(X,Y)', () => {
    for (const J of cases) {
      const I = mutualInformation(J);
      expect(I).toBeCloseTo(
        entropy(marginalX(J)) + entropy(marginalY(J)) - jointEntropy(J), 12,
      );
    }
  });

  it('I = H(X) − H(X|Y)', () => {
    for (const J of cases) {
      expect(mutualInformation(J)).toBeCloseTo(
        entropy(marginalX(J)) - conditionalEntropyXgivenY(J), 12,
      );
    }
  });

  it('I = H(Y) − H(Y|X)（对称性）', () => {
    for (const J of cases) {
      expect(mutualInformation(J)).toBeCloseTo(
        entropy(marginalY(J)) - conditionalEntropyYgivenX(J), 12,
      );
    }
  });

  it('I = D(P_XY ‖ P_X·P_Y) —— 接回上一课的 KL', () => {
    for (const J of cases) {
      expect(mutualInformationAsKL(J)).toBeCloseTo(mutualInformation(J), 10);
    }
  });
});

describe('互信息的基本性质', () => {
  it('非负（1323 个采样点）', () => {
    let neg = 0;
    for (const kind of KINDS) {
      for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
          if (channelMI(i / 20, j / 20, kind) < -1e-12) neg++;
        }
      }
    }
    expect(neg).toBe(0);
  });

  it('独立时恰为 0', () => {
    expect(mutualInformation([[0.25, 0.25], [0.25, 0.25]])).toBeCloseTo(0, 12);
    expect(mutualInformation([[0.12, 0.28], [0.18, 0.42]])).toBeCloseTo(0, 10);
  });

  it('完全相关时等于 H(X)', () => {
    const J: Joint = [[0.5, 0], [0, 0.5]];
    expect(mutualInformation(J)).toBeCloseTo(entropy(marginalX(J)), 12);
    expect(mutualInformation(J)).toBeCloseTo(1, 12);
  });

  it('不超过 min(H(X), H(Y))', () => {
    for (const kind of KINDS) {
      for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
          const J = makeJoint(i / 20, j / 20, kind);
          const bound = Math.min(entropy(marginalX(J)), entropy(marginalY(J)));
          expect(mutualInformation(J)).toBeLessThanOrEqual(bound + 1e-9);
        }
      }
    }
  });

  it('条件熵非负', () => {
    for (const kind of KINDS) {
      for (const a of [0.2, 0.5, 0.8]) {
        for (const e of [0.1, 0.4]) {
          const J = makeJoint(a, e, kind);
          expect(conditionalEntropyXgivenY(J)).toBeGreaterThanOrEqual(-1e-12);
          expect(conditionalEntropyYgivenX(J)).toBeGreaterThanOrEqual(-1e-12);
        }
      }
    }
  });
});

describe('信道容量', () => {
  it('BSC 的数值容量等于解析值 1 − H(e)', () => {
    for (const e of [0, 0.05, 0.1, 0.25, 0.4, 0.5]) {
      const c = channelCapacity(e, 'bsc');
      expect(c.capacity).toBeCloseTo(bscCapacityAnalytic(e), 8);
    }
  });

  it('BSC 的最优输入是均匀分布', () => {
    for (const e of [0.05, 0.1, 0.25, 0.4]) {
      expect(channelCapacity(e, 'bsc').aStar).toBeCloseTo(0.5, 3);
    }
  });

  it('BEC 的容量等于 1 − e，比 BSC 温和', () => {
    for (const e of [0, 0.1, 0.3, 0.5, 0.9]) {
      expect(channelCapacity(e, 'bec').capacity).toBeCloseTo(becCapacityAnalytic(e), 8);
    }
    // 同样的 e，擦除信道容量更高
    for (const e of [0.1, 0.3]) {
      expect(becCapacityAnalytic(e)).toBeGreaterThan(bscCapacityAnalytic(e));
    }
  });

  it('e=0.5 的 BSC 容量为 0 —— 一个比特也传不了', () => {
    expect(channelCapacity(0.5, 'bsc').capacity).toBeCloseTo(0, 10);
    for (const a of [0, 0.2, 0.5, 0.8, 1]) {
      expect(channelMI(a, 0.5, 'bsc')).toBeCloseTo(0, 10);
    }
  });

  it('容量为 0 时不报一个看似精确的 a*', () => {
    // 所有 a 并列，扫描会挑到任意值，容易误导
    expect(channelCapacity(0.5, 'bsc').aStar).toBe(0.5);
  });

  it('Z 信道不对称：最优输入不是 0.5', () => {
    for (const e of [0.1, 0.3, 0.5, 0.7]) {
      const c = channelCapacity(e, 'z');
      expect(Math.abs(c.aStar - 0.5)).toBeGreaterThan(0.02);
      expect(c.aStar).toBeGreaterThan(0.5);
    }
  });

  it('容量确实是最大值：任何输入都达不到更高', () => {
    for (const kind of KINDS) {
      for (const e of [0.1, 0.3]) {
        const c = channelCapacity(e, kind);
        for (let i = 0; i <= 50; i++) {
          expect(channelMI(i / 50, e, kind)).toBeLessThanOrEqual(c.capacity + 1e-9);
        }
      }
    }
  });

  it('次优输入严格低于容量', () => {
    // a=0.3 时 BSC(0.1) 只有 0.456 < 0.531
    expect(channelMI(0.3, 0.1, 'bsc')).toBeLessThan(bscCapacityAnalytic(0.1) - 0.05);
  });
});

describe('二元熵函数', () => {
  it('H(0)=H(1)=0，H(0.5)=1', () => {
    expect(binaryEntropy(0)).toBe(0);
    expect(binaryEntropy(1)).toBe(0);
    expect(binaryEntropy(0.5)).toBeCloseTo(1, 12);
  });

  it('对称：H(e) = H(1−e)', () => {
    for (const e of [0.1, 0.3, 0.45]) {
      expect(binaryEntropy(e)).toBeCloseTo(binaryEntropy(1 - e), 12);
    }
  });
});

describe('曲面采样与预设', () => {
  it('曲面尺寸正确且值有限非负', () => {
    for (const kind of KINDS) {
      const g = sampleSurface(kind, 10, 12);
      expect(g).toHaveLength(11);
      expect(g[0]).toHaveLength(13);
      for (const row of g) {
        for (const v of row) {
          expect(Number.isFinite(v)).toBe(true);
          expect(v).toBeGreaterThanOrEqual(-1e-12);
        }
      }
    }
  });

  it('每个预设的互信息与标注一致', () => {
    const clean = PRESETS.find((p) => p.id === 'clean')!;
    expect(channelMI(clean.a, clean.e, clean.kind)).toBeCloseTo(1, 10);
    const useless = PRESETS.find((p) => p.id === 'useless')!;
    expect(channelMI(useless.a, useless.e, useless.kind)).toBeCloseTo(0, 10);
    const erasure = PRESETS.find((p) => p.id === 'erasure')!;
    expect(channelMI(erasure.a, erasure.e, erasure.kind)).toBeCloseTo(0.7, 10);
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
