import { describe, expect, it } from 'vitest';
import {
  colDiscs, componentCounts, connectedComponents, det3, eigenvalues,
  gershgorinBound, inDisc, inUnion, isStrictlyDiagonallyDominant, PRESETS,
  rowDiscs, spectralRadius, trace3, transpose, type Complex, type Mat3,
} from './gershgorin';

const ALL: Mat3[] = PRESETS.map((p) => p.A);

const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

describe('特征值（含复根）', () => {
  it('特征值之和等于迹', () => {
    for (const A of ALL) {
      const s = eigenvalues(A).reduce((acc, z) => acc + z.re, 0);
      expect(s).toBeCloseTo(trace3(A), 8);
    }
  });

  it('特征值之积等于行列式（虚部相消）', () => {
    for (const A of ALL) {
      const p = eigenvalues(A).reduce(cMul, { re: 1, im: 0 });
      expect(p.re).toBeCloseTo(det3(A), 7);
      expect(Math.abs(p.im)).toBeLessThan(1e-7);
    }
  });

  it('总是返回三个根', () => {
    for (const A of ALL) expect(eigenvalues(A)).toHaveLength(3);
  });

  it('复根成共轭对出现', () => {
    const ev = eigenvalues([[0, -2, 0], [2, 0, 0], [0, 0, 5]]);
    const cx = ev.filter((z) => Math.abs(z.im) > 1e-9);
    expect(cx).toHaveLength(2);
    expect(cx[0].re).toBeCloseTo(cx[1].re, 9);
    expect(cx[0].im).toBeCloseTo(-cx[1].im, 9);
  });

  it('旋转矩阵的特征值确实是 ±2i', () => {
    const ev = eigenvalues([[0, -2, 0], [2, 0, 0], [0, 0, 5]]);
    const ims = ev.map((z) => z.im).sort((a, b) => a - b);
    expect(ims[0]).toBeCloseTo(-2, 8);
    expect(ims[2]).toBeCloseTo(2, 8);
  });

  it('三重根不产生 NaN', () => {
    for (const z of eigenvalues([[2, 0, 0], [0, 2, 0], [0, 0, 2]])) {
      expect(z.re).toBeCloseTo(2, 9);
      expect(z.im).toBeCloseTo(0, 9);
    }
  });
});

describe('圆盘的定义', () => {
  it('圆心是对角元，半径是该行其余元素绝对值之和', () => {
    const A: Mat3 = [[10, 1, -3], [1, 2, 1], [1, 1, 3]];
    const d = rowDiscs(A);
    expect(d[0].center).toBe(10);
    expect(d[0].radius).toBe(4); // |1| + |−3|
    expect(d[1].radius).toBe(2);
  });

  it('列圆盘等于转置的行圆盘', () => {
    const A: Mat3 = [[1, 4, 3], [4, 2, 1], [3, 1, 5]];
    expect(colDiscs(A)).toEqual(rowDiscs(transpose(A)));
  });

  it('对称阵的行圆盘与列圆盘相同', () => {
    const A: Mat3 = [[4, 1, 2], [1, 3, 0], [2, 0, 6]];
    expect(colDiscs(A)).toEqual(rowDiscs(A));
  });
});

describe('Gershgorin 定理：包含性', () => {
  // 全课的核心断言
  it('每个特征值都落在行圆盘的并集里', () => {
    for (const A of ALL) {
      for (const z of eigenvalues(A)) {
        expect(inUnion(rowDiscs(A), z, 1e-7)).toBe(true);
      }
    }
  });

  it('每个特征值也落在列圆盘的并集里', () => {
    for (const A of ALL) {
      for (const z of eigenvalues(A)) {
        expect(inUnion(colDiscs(A), z, 1e-7)).toBe(true);
      }
    }
  });

  it('复特征值同样被圈住 —— 这是它比实轴估计强的地方', () => {
    const A: Mat3 = [[0, -2, 0], [2, 0, 0], [0, 0, 5]];
    const cx = eigenvalues(A).filter((z) => Math.abs(z.im) > 1e-9);
    expect(cx).toHaveLength(2);
    for (const z of cx) expect(inUnion(rowDiscs(A), z, 1e-7)).toBe(true);
  });

  it('随机矩阵上也成立', () => {
    // 确定性伪随机，保证可复现
    let seed = 12345;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return (seed / 2147483648) * 8 - 4;
    };
    for (let t = 0; t < 60; t++) {
      const A: Mat3 = [0, 1, 2].map(() => [rnd(), rnd(), rnd()]);
      for (const z of eigenvalues(A)) {
        expect(inUnion(rowDiscs(A), z, 1e-6)).toBe(true);
      }
    }
  });
});

describe('加强版：k 个圆盘含 k 个特征值', () => {
  it('每个连通分量里的特征值个数等于圆盘个数', () => {
    for (const A of ALL) {
      for (const c of componentCounts(A)) {
        expect(c.eigCount).toBe(c.discCount);
      }
    }
  });

  it('孤立圆盘里恰好一个特征值', () => {
    const A: Mat3 = [[10, 1, 1], [1, 2, 1], [1, 1, 3]];
    const comps = componentCounts(A);
    const solo = comps.find((c) => c.discCount === 1);
    expect(solo).toBeDefined();
    expect(solo!.eigCount).toBe(1);
  });

  it('全部相交时只有一个分量', () => {
    const A: Mat3 = [[1, 4, 3], [4, 2, 1], [3, 1, 5]];
    expect(connectedComponents(rowDiscs(A))).toHaveLength(1);
  });

  it('对角阵的三个圆盘互不相交（半径为 0）', () => {
    const A: Mat3 = [[1, 0, 0], [0, 5, 0], [0, 0, 9]];
    expect(connectedComponents(rowDiscs(A))).toHaveLength(3);
    for (const c of componentCounts(A)) expect(c.eigCount).toBe(1);
  });
});

describe('推论', () => {
  it('严格对角占优 ⇒ 可逆（det ≠ 0）', () => {
    for (const A of ALL) {
      if (isStrictlyDiagonallyDominant(A)) {
        expect(Math.abs(det3(A))).toBeGreaterThan(1e-9);
      }
    }
  });

  it('严格对角占优时圆盘都不含原点', () => {
    const A: Mat3 = [[5, 1, 0], [1, 6, 1], [0, 1, 7]];
    expect(isStrictlyDiagonallyDominant(A)).toBe(true);
    for (const d of rowDiscs(A)) {
      expect(inDisc(d, { re: 0, im: 0 })).toBe(false);
    }
  });

  it('谱半径不超过 Gershgorin 上界', () => {
    for (const A of ALL) {
      expect(spectralRadius(A)).toBeLessThanOrEqual(gershgorinBound(A) + 1e-9);
    }
  });

  it('几乎对角时估计很紧', () => {
    const A: Mat3 = [[2, 0.05, 0.02], [0.03, 5, 0.04], [0.01, 0.02, 9]];
    // 上界与真实谱半径相差不到 0.1
    expect(gershgorinBound(A) - spectralRadius(A)).toBeLessThan(0.1);
  });

  it('非对角元大时估计很松', () => {
    const A: Mat3 = [[1, 4, 3], [4, 2, 1], [3, 1, 5]];
    expect(gershgorinBound(A) - spectralRadius(A)).toBeGreaterThan(0.5);
  });
});

describe('预设', () => {
  it('标注的占优性与实际一致', () => {
    expect(isStrictlyDiagonallyDominant(PRESETS[0].A)).toBe(true);
    expect(isStrictlyDiagonallyDominant(PRESETS[1].A)).toBe(false);
  });

  it('每个预设都满足包含性与加强版', () => {
    for (const p of PRESETS) {
      for (const z of eigenvalues(p.A)) {
        expect(inUnion(rowDiscs(p.A), z, 1e-7)).toBe(true);
      }
      for (const c of componentCounts(p.A)) expect(c.eigCount).toBe(c.discCount);
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
