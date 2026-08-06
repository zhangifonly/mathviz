import { describe, expect, it } from 'vitest';
import {
  add3, columnSpaceBasis, dot3, identity3, matMul, matVec, maxDiff, norm3,
  nullSpaceBasis, penroseResiduals, pinv, pinvSolve, PRESETS, projections,
  projectionResiduals, residual, rowSpaceBasis, scale3, sub3, svd, transpose,
  type Mat3, type Vec3,
} from './pseudoinverse';

const ALL = PRESETS.map((p) => p.A);
const INV: Mat3 = [[2, 1, 0], [1, 3, 1], [0, 1, 4]];
const RANK2: Mat3 = [[1, 2, 3], [2, 4, 6], [1, 1, 1]];
const RANK1: Mat3 = [[1, 2, 3], [2, 4, 6], [3, 6, 9]];
const ZERO: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

describe('SVD', () => {
  it('重构原矩阵：UΣVᵀ = A', () => {
    for (const A of ALL) {
      const { U, sigma, V } = svd(A);
      const S: Mat3 = [[sigma[0], 0, 0], [0, sigma[1], 0], [0, 0, sigma[2]]];
      expect(maxDiff(matMul(matMul(U, S), transpose(V)), A)).toBeLessThan(1e-7);
    }
  });

  it('U 与 V 都是正交阵', () => {
    for (const A of ALL) {
      const { U, V } = svd(A);
      expect(maxDiff(matMul(transpose(U), U), identity3())).toBeLessThan(1e-9);
      expect(maxDiff(matMul(transpose(V), V), identity3())).toBeLessThan(1e-9);
    }
  });

  it('奇异值非负且降序', () => {
    for (const A of ALL) {
      const { sigma } = svd(A);
      expect(sigma[0]).toBeGreaterThanOrEqual(sigma[1] - 1e-12);
      expect(sigma[1]).toBeGreaterThanOrEqual(sigma[2] - 1e-12);
      sigma.forEach((s) => expect(s).toBeGreaterThanOrEqual(-1e-12));
    }
  });

  it('秩判定正确', () => {
    expect(svd(INV).rank).toBe(3);
    expect(svd(RANK2).rank).toBe(2);
    expect(svd(RANK1).rank).toBe(1);
    expect(svd(ZERO).rank).toBe(0);
  });

  it('数值零奇异值被正确归零', () => {
    // AᵀA 使精度减半：真实为零的 σ 会算出 ~1e−8，容差太小会误判满秩
    const { sigma, rank } = svd(RANK2);
    expect(sigma[2]).toBeLessThan(1e-6);
    expect(rank).toBe(2);
  });
});

describe('四条 Penrose 条件', () => {
  // 它们唯一刻画了 A⁺，所以逐条验证等于验证「这确实是伪逆」
  it('全部满足', () => {
    for (const A of ALL) {
      for (const r of penroseResiduals(A)) {
        expect(r).toBeLessThan(1e-9);
      }
    }
  });

  it('满秩时 A⁺ 就是逆矩阵', () => {
    const P = pinv(INV);
    expect(maxDiff(matMul(INV, P), identity3())).toBeLessThan(1e-10);
    expect(maxDiff(matMul(P, INV), identity3())).toBeLessThan(1e-10);
  });

  it('零矩阵的伪逆还是零矩阵', () => {
    expect(maxDiff(pinv(ZERO), ZERO)).toBeLessThan(1e-14);
  });

  it('(A⁺)⁺ = A', () => {
    for (const A of ALL) {
      expect(maxDiff(pinv(pinv(A)), A)).toBeLessThan(1e-7);
    }
  });

  it('(Aᵀ)⁺ = (A⁺)ᵀ', () => {
    for (const A of ALL) {
      expect(maxDiff(pinv(transpose(A)), transpose(pinv(A)))).toBeLessThan(1e-8);
    }
  });
});

describe('最小二乘：残差最小', () => {
  it('x⁺ 的残差不超过任何其他向量', () => {
    const A = RANK2;
    const b: Vec3 = [6, 1, 3]; // 不相容
    const x = pinvSolve(A, b);
    const r0 = residual(A, x, b);
    for (const d of [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0.7, -1.2, 0.4]] as Vec3[]) {
      for (const t of [0.3, -0.3, 1.5]) {
        expect(residual(A, add3(x, scale3(d, t)), b)).toBeGreaterThan(r0 - 1e-9);
      }
    }
  });

  it('相容时残差为零', () => {
    const A = RANK2;
    const b = matVec(A, [1, 1, 1]);
    expect(residual(A, pinvSolve(A, b), b)).toBeLessThan(1e-8);
  });

  it('残差向量与列空间正交 —— 这就是「投影」的含义', () => {
    const A = RANK2;
    const b: Vec3 = [6, 1, 3];
    const r = sub3(matVec(A, pinvSolve(A, b)), b);
    for (const u of columnSpaceBasis(A)) {
      expect(Math.abs(dot3(r, u))).toBeLessThan(1e-8);
    }
  });
});

describe('最小范数：解不唯一时取最短的', () => {
  it('沿零空间方向平移，残差不变但范数变大', () => {
    // 这正是「最小范数」的操作性定义
    const A = RANK2;
    const b = matVec(A, [1, 1, 1]);
    const x = pinvSolve(A, b);
    const r0 = residual(A, x, b);
    for (const n of nullSpaceBasis(A)) {
      for (const t of [0.5, -0.5, 2]) {
        const x2 = add3(x, scale3(n, t));
        expect(residual(A, x2, b)).toBeCloseTo(r0, 7);
        expect(norm3(x2)).toBeGreaterThan(norm3(x) - 1e-9);
      }
    }
  });

  it('x⁺ 落在行空间里（与零空间正交）', () => {
    for (const A of [RANK2, RANK1]) {
      const x = pinvSolve(A, [6, 12, 3]);
      for (const n of nullSpaceBasis(A)) {
        expect(Math.abs(dot3(x, n))).toBeLessThan(1e-8);
      }
    }
  });

  it('零矩阵时解是零向量', () => {
    expect(norm3(pinvSolve(ZERO, [1, 2, 3]))).toBeLessThan(1e-12);
  });
});

describe('两个投影', () => {
  it('A A⁺ 与 A⁺ A 都是正交投影（幂等且对称）', () => {
    for (const A of ALL) {
      const { toCol, toRow } = projections(A);
      for (const P of [toCol, toRow]) {
        const r = projectionResiduals(P);
        expect(r.idempotent).toBeLessThan(1e-9);
        expect(r.symmetric).toBeLessThan(1e-9);
      }
    }
  });

  it('投影矩阵的迹等于秩', () => {
    for (const A of ALL) {
      const { toCol, toRow } = projections(A);
      const rank = svd(A).rank;
      expect(toCol[0][0] + toCol[1][1] + toCol[2][2]).toBeCloseTo(rank, 6);
      expect(toRow[0][0] + toRow[1][1] + toRow[2][2]).toBeCloseTo(rank, 6);
    }
  });

  it('A A⁺ 把 b 投到列空间：投影后的向量确实在列空间里', () => {
    const A = RANK2;
    const b: Vec3 = [6, 1, 3];
    const pb = matVec(projections(A).toCol, b);
    // 投到列空间后应可精确求解
    expect(residual(A, pinvSolve(A, pb), pb)).toBeLessThan(1e-8);
  });

  it('满秩时两个投影都是单位阵', () => {
    const { toCol, toRow } = projections(INV);
    expect(maxDiff(toCol, identity3())).toBeLessThan(1e-10);
    expect(maxDiff(toRow, identity3())).toBeLessThan(1e-10);
  });
});

describe('子空间维数', () => {
  it('列空间维数 + 左零空间维数 = 3', () => {
    for (const A of ALL) {
      expect(columnSpaceBasis(A).length).toBe(svd(A).rank);
    }
  });

  it('行空间维数 + 零空间维数 = 3（秩零化度定理）', () => {
    for (const A of ALL) {
      expect(rowSpaceBasis(A).length + nullSpaceBasis(A).length).toBe(3);
    }
  });

  it('零空间的基确实被 A 映到零', () => {
    for (const A of ALL) {
      for (const n of nullSpaceBasis(A)) {
        expect(norm3(matVec(A, n))).toBeLessThan(1e-7);
      }
    }
  });
});

describe('预设', () => {
  it('每个预设都满足四条 Penrose 条件', () => {
    for (const p of PRESETS) {
      for (const r of penroseResiduals(p.A)) expect(r).toBeLessThan(1e-9);
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
