import { describe, expect, it } from 'vitest';
import {
  analyze, det3, eigenGroups, eigenvalues, identity3, isDiagonalizable,
  jordanChain, matSub, matVec, norm3, nullSpace, orbit, perturbationSpread,
  PRESETS, rref, scaleMat, solveSingular, trace3, type Mat3, type Vec3,
} from './jordanForm';

const J2: Mat3 = [[2, 1, 0], [0, 2, 0], [0, 0, 5]];
const J3: Mat3 = [[1, 1, 0], [0, 1, 1], [0, 0, 1]];
const DIAG: Mat3 = [[1, 0, 0], [0, 2, 0], [0, 0, 3]];

describe('特征值', () => {
  it('对角阵的特征值就是对角元', () => {
    // 三角解法走 cos/acos，结果是浮点数（1 会算成 0.9999999999999998），
    // 所以断言用 toBeCloseTo 而不是 toEqual
    eigenvalues(DIAG).forEach((v, i) => expect(v).toBeCloseTo([1, 2, 3][i], 9));
  });

  it('重根被正确识别', () => {
    eigenvalues(J3).forEach((v) => expect(v).toBeCloseTo(1, 9));
    const g = eigenGroups(J3);
    expect(g).toHaveLength(1);
    expect(g[0].algebraic).toBe(3);
  });

  it('特征值之和 = 迹，之积 = 行列式', () => {
    for (const p of PRESETS) {
      const ev = eigenvalues(p.A);
      if (ev.length < 3) continue; // 有复根时不适用
      expect(ev.reduce((a, b) => a + b, 0)).toBeCloseTo(trace3(p.A), 8);
      expect(ev.reduce((a, b) => a * b, 1)).toBeCloseTo(det3(p.A), 8);
    }
  });

  it('复特征值情形只返回那一个实根', () => {
    const ev = eigenvalues([[0, -1, 0], [1, 0, 0], [0, 0, 2]]);
    expect(ev).toHaveLength(1);
    expect(ev[0]).toBeCloseTo(2, 9);
  });

  it('零矩阵不产生 NaN', () => {
    eigenvalues([[0, 0, 0], [0, 0, 0], [0, 0, 0]]).forEach((v) => {
      expect(Number.isFinite(v)).toBe(true);
    });
  });

  it('每个特征值确实使 det(A−λI) = 0', () => {
    for (const p of PRESETS) {
      for (const lam of eigenvalues(p.A)) {
        expect(Math.abs(det3(matSub(p.A, scaleMat(identity3(), lam))))).toBeLessThan(1e-8);
      }
    }
  });
});

describe('秩与零空间', () => {
  it('满秩矩阵的零空间是空的', () => {
    expect(rref(DIAG).rank).toBe(3);
    expect(nullSpace(DIAG)).toHaveLength(0);
  });

  it('零空间的基确实被映到零', () => {
    const M = matSub(J3, identity3());
    for (const v of nullSpace(M)) {
      matVec(M, v).forEach((c) => expect(Math.abs(c)).toBeLessThan(1e-9));
    }
  });

  it('秩 + 零度 = 3', () => {
    for (const p of PRESETS) {
      for (const lam of eigenvalues(p.A)) {
        const M = matSub(p.A, scaleMat(identity3(), lam));
        expect(rref(M, 1e-7).rank + nullSpace(M, 1e-7).length).toBe(3);
      }
    }
  });
});

describe('代数重数与几何重数', () => {
  // 全课的核心：几何 < 代数 就是亏损
  it('几何重数总不超过代数重数', () => {
    for (const p of PRESETS) {
      for (const e of analyze(p.A)) {
        expect(e.geometric).toBeGreaterThanOrEqual(1);
        expect(e.geometric).toBeLessThanOrEqual(e.algebraic);
      }
    }
  });

  it('2×2 Jordan 块：λ=2 代数 2、几何 1', () => {
    const e = analyze(J2).find((x) => Math.abs(x.value - 2) < 1e-6)!;
    expect(e.algebraic).toBe(2);
    expect(e.geometric).toBe(1);
    expect(e.defective).toBe(true);
  });

  it('3×3 Jordan 块：整个空间只有一条特征方向', () => {
    const e = analyze(J3)[0];
    expect(e.algebraic).toBe(3);
    expect(e.geometric).toBe(1);
  });

  it('纯剪切：代数 3、几何 2（亏损但没那么厉害）', () => {
    const e = analyze([[1, 1, 0], [0, 1, 0], [0, 0, 1]])[0];
    expect(e.algebraic).toBe(3);
    expect(e.geometric).toBe(2);
  });

  it('对角阵与对称阵可对角化，Jordan 块不可', () => {
    expect(isDiagonalizable(DIAG)).toBe(true);
    expect(isDiagonalizable([[2, 1, 0], [1, 2, 0], [0, 0, 3]])).toBe(true);
    expect(isDiagonalizable(J2)).toBe(false);
    expect(isDiagonalizable(J3)).toBe(false);
  });

  it('含复特征值时实域上不可对角化', () => {
    expect(isDiagonalizable([[0, -1, 0], [1, 0, 0], [0, 0, 2]])).toBe(false);
  });
});

describe('Jordan 链', () => {
  it('链长等于 Jordan 块大小', () => {
    const e2 = analyze(J2).find((x) => Math.abs(x.value - 2) < 1e-6)!;
    expect(jordanChain(J2, e2.value, e2.eigenvectors[0])).toHaveLength(2);
    const e3 = analyze(J3)[0];
    expect(jordanChain(J3, e3.value, e3.eigenvectors[0])).toHaveLength(3);
  });

  it('链的定义式：(A−λI)v_{k+1} = v_k，且 (A−λI)v₁ = 0', () => {
    const e = analyze(J3)[0];
    const chain = jordanChain(J3, e.value, e.eigenvectors[0]);
    const M = matSub(J3, scaleMat(identity3(), e.value));
    matVec(M, chain[0]).forEach((c) => expect(Math.abs(c)).toBeLessThan(1e-9));
    for (let k = 1; k < chain.length; k++) {
      matVec(M, chain[k]).forEach((c, i) => expect(c).toBeCloseTo(chain[k - 1][i], 8));
    }
  });

  it('链上第 k 个向量满足 (A−λI)^k v = 0', () => {
    const e = analyze(J3)[0];
    const chain = jordanChain(J3, e.value, e.eigenvectors[0]);
    const M = matSub(J3, scaleMat(identity3(), e.value));
    chain.forEach((v, k) => {
      let w = v;
      for (let i = 0; i <= k; i++) w = matVec(M, w);
      w.forEach((c) => expect(Math.abs(c)).toBeLessThan(1e-8));
    });
  });

  it('可对角化时链长为 1（没有广义特征向量）', () => {
    const e = analyze(DIAG)[0];
    expect(jordanChain(DIAG, e.value, e.eigenvectors[0])).toHaveLength(1);
  });
});

describe('解奇异方程组', () => {
  it('无解时返回 null 而不是 NaN', () => {
    // (A−λI)x = b 中 b 不在像空间里
    const M = matSub(J3, identity3());
    expect(solveSingular(M, [0, 0, 1])).toBeNull();
  });

  it('有解时确实满足方程', () => {
    const M = matSub(J3, identity3());
    const x = solveSingular(M, [1, 0, 0])!;
    matVec(M, x).forEach((c, i) => expect(c).toBeCloseTo([1, 0, 0][i], 9));
  });
});

describe('亏损的数值脆弱性', () => {
  it('2×2 块：偏离量正比于 √eps，而不是 eps', () => {
    // 实测比值恒为 1.000：eps=1e−12 的扰动让特征值偏离 1e−6
    for (const eps of [1e-6, 1e-9, 1e-12]) {
      const spread = perturbationSpread(J2, eps, 2);
      expect(spread / Math.sqrt(eps)).toBeCloseTo(1, 2);
    }
  });

  it('1e−12 的扰动被放大到 1e−6', () => {
    expect(perturbationSpread(J2, 1e-12, 2)).toBeGreaterThan(1e-7);
  });

  it('可对角化矩阵不敏感：同样扰动几乎不动', () => {
    // 对照组，说明脆弱性是亏损特有的
    expect(perturbationSpread(DIAG, 1e-6, 3)).toBeLessThan(1e-5);
  });
});

describe('轨道', () => {
  it('特征向量的轨道沿自身方向伸缩', () => {
    const e = analyze(J2).find((x) => Math.abs(x.value - 2) < 1e-6)!;
    const v = e.eigenvectors[0];
    const path = orbit(J2, v, 4);
    path.forEach((p, k) => {
      const want = Math.pow(2, k);
      expect(norm3(p)).toBeCloseTo(want * norm3(v), 6);
    });
  });

  it('轨道点全部有限，且不会溢出', () => {
    for (const p of PRESETS) {
      for (const q of orbit(p.A, [1, 1, 1], 30)) {
        expect(q.every(Number.isFinite)).toBe(true);
      }
    }
  });

  it('一般向量在亏损矩阵下会偏向唯一的特征方向', () => {
    const path = orbit(J3, [0, 0, 1], 40);
    const last = path[path.length - 1];
    const dir = last.map((v) => v / norm3(last)) as Vec3;
    // 唯一特征方向是 (1,0,0)
    expect(Math.abs(dir[0])).toBeGreaterThan(0.95);
  });
});

describe('预设', () => {
  it('标注的可对角化性与实际一致', () => {
    expect(isDiagonalizable(PRESETS[0].A)).toBe(true);
    expect(isDiagonalizable(PRESETS[1].A)).toBe(true);
    expect(isDiagonalizable(PRESETS[2].A)).toBe(false);
    expect(isDiagonalizable(PRESETS[3].A)).toBe(false);
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
