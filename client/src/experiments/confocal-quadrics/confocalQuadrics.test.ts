import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CONFOCAL,
  dot3,
  gradient,
  kindOf,
  norm3,
  orthogonality,
  PRESETS,
  residual,
  sampleQuadric,
  semiAxesSq,
  solveLambdas,
  type Confocal,
} from './confocalQuadrics';

const Q: Confocal = DEFAULT_CONFOCAL; // a=3 b=2 c=1

const SAMPLE_POINTS: Array<[number, number, number]> = [
  [1.2, 0.9, 0.6],
  [2.0, 1.1, 0.4],
  [0.5, 0.4, 0.3],
  [4.0, 3.0, 2.0],
  [0.05, 0.05, 0.05],
  [-1.4, 0.7, -0.8],
];

describe('曲面类型的分段', () => {
  it('λ 落在哪一段就是哪种曲面', () => {
    expect(kindOf(Q, 0.5)).toBe('ellipsoid');      // < c²=1
    expect(kindOf(Q, 2.5)).toBe('hyperboloid1');   // 1 < λ < 4
    expect(kindOf(Q, 6)).toBe('hyperboloid2');     // 4 < λ < 9
    expect(kindOf(Q, 12)).toBe('empty');           // > a²=9
  });

  it('λ 为负仍是椭球（远离原点的点）', () => {
    expect(kindOf(Q, -23)).toBe('ellipsoid');
  });

  it('半轴平方的符号与类型一致', () => {
    // 单叶: 前两项正、第三项负
    const [sa, sb, sc] = semiAxesSq(Q, 2.5);
    expect(sa).toBeGreaterThan(0);
    expect(sb).toBeGreaterThan(0);
    expect(sc).toBeLessThan(0);
  });
});

describe('过一点的三张曲面', () => {
  it('每个点都解出三个根', () => {
    for (const p of SAMPLE_POINTS) {
      expect(solveLambdas(Q, p)).not.toBeNull();
    }
  });

  it('三根分别落在 λ₁<c²<λ₂<b²<λ₃<a²', () => {
    for (const p of SAMPLE_POINTS) {
      const [l1, l2, l3] = solveLambdas(Q, p)!;
      expect(l1).toBeLessThan(Q.c * Q.c);
      expect(l2).toBeGreaterThan(Q.c * Q.c);
      expect(l2).toBeLessThan(Q.b * Q.b);
      expect(l3).toBeGreaterThan(Q.b * Q.b);
      expect(l3).toBeLessThan(Q.a * Q.a);
    }
  });

  it('三张面恰好是椭球 + 单叶 + 双叶各一张', () => {
    for (const p of SAMPLE_POINTS) {
      const kinds = solveLambdas(Q, p)!.map((l) => kindOf(Q, l));
      expect(kinds).toEqual(['ellipsoid', 'hyperboloid1', 'hyperboloid2']);
    }
  });

  it('三个根都确实使点落在曲面上', () => {
    for (const p of SAMPLE_POINTS) {
      for (const l of solveLambdas(Q, p)!) {
        expect(Math.abs(residual(Q, p, l))).toBeLessThan(1e-10);
      }
    }
  });

  it('点在坐标平面上时退化，返回 null 而不是给出错误的根', () => {
    expect(solveLambdas(Q, [1.2, 0.9, 0])).toBeNull();
    expect(solveLambdas(Q, [0, 0.9, 0.6])).toBeNull();
    expect(solveLambdas(Q, [1.2, 0, 0.6])).toBeNull();
  });
});

describe('Jacobi 正交性', () => {
  // 全课的核心断言：三张共焦曲面在交点处两两垂直
  it('三对法向量两两正交', () => {
    for (const p of SAMPLE_POINTS) {
      const o = orthogonality(Q, p)!;
      expect(o.pairs).toHaveLength(3);
      expect(o.maxDev).toBeLessThan(1e-9);
    }
  });

  it('换一组 a,b,c 仍然正交', () => {
    for (const q of [
      { a: 5, b: 3.5, c: 2 },
      { a: 1.4, b: 1.2, c: 0.3 },
    ] as Confocal[]) {
      const o = orthogonality(q, [0.8, 0.55, 0.2])!;
      expect(o.maxDev).toBeLessThan(1e-9);
    }
  });

  it('梯度非零，正交结论才有意义', () => {
    const p: [number, number, number] = [1.2, 0.9, 0.6];
    for (const l of solveLambdas(Q, p)!) {
      expect(norm3(gradient(Q, p, l))).toBeGreaterThan(1e-6);
    }
  });

  it('正交是共焦族特有的：随便挪一个 λ 就不再垂直', () => {
    // 对照组。若把某张面换成同族里别的 λ，交角立刻偏离 90°，
    // 说明「三面正交」来自共焦这个条件本身，不是任意曲面都有的巧合。
    const p: [number, number, number] = [1.2, 0.9, 0.6];
    const [l1, l2] = solveLambdas(Q, p)!;
    const g1 = gradient(Q, p, l1);
    const gBad = gradient(Q, p, l2 + 0.3);
    const cosA = dot3(g1, gBad) / (norm3(g1) * norm3(gBad));
    expect(Math.abs(Math.acos(cosA) - Math.PI / 2)).toBeGreaterThan(1e-3);
  });

  it('坐标平面上的点无法定义三面正交', () => {
    expect(orthogonality(Q, [1, 1, 0])).toBeNull();
  });
});

describe('曲面采样', () => {
  it('椭球与单叶各一片，双叶两片', () => {
    expect(sampleQuadric(Q, 0.5).length).toBe(1);
    expect(sampleQuadric(Q, 2.5).length).toBe(1);
    expect(sampleQuadric(Q, 6).length).toBe(2);
    expect(sampleQuadric(Q, 12).length).toBe(0);
  });

  it('采样点全部落在对应曲面上', () => {
    for (const l of [0.5, 2.5, 6]) {
      for (const sheet of sampleQuadric(Q, l, 20, 10)) {
        for (const row of sheet) {
          for (const pt of row) {
            expect(Math.abs(residual(Q, pt, l))).toBeLessThan(1e-9);
          }
        }
      }
    }
  });

  it('采样点全部有限', () => {
    for (const l of [0.5, 2.5, 6, -23]) {
      for (const sheet of sampleQuadric(Q, l, 16, 8)) {
        for (const row of sheet) {
          for (const pt of row) {
            expect(pt.every((v) => Number.isFinite(v))).toBe(true);
          }
        }
      }
    }
  });

  it('双叶的两片分居 x 的两侧', () => {
    const [s1, s2] = sampleQuadric(Q, 6, 12, 6);
    expect(s1[0][0][0]).toBeGreaterThan(0);
    expect(s2[0][0][0]).toBeLessThan(0);
  });
});

describe('预设', () => {
  it('每个预设都能解出三张正交曲面', () => {
    for (const p of PRESETS) {
      const o = orthogonality(Q, p.point);
      expect(o).not.toBeNull();
      expect(o!.maxDev).toBeLessThan(1e-9);
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
