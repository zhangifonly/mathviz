import { describe, expect, it } from 'vitest';
import {
  conditionNumber, det3, detVsCond, ellipsoidAxes, identity3, inverse3,
  matMul, matVec, norm3, perturbationTest, PRESETS, singularValues, solve,
  sub3, symmetricEigen, transpose, worstDirection, worstRHS,
  type Mat3, type Vec3,
} from './conditionNumber';

const maxDiff = (A: Mat3, B: Mat3) => {
  let m = 0;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) m = Math.max(m, Math.abs(A[i][j] - B[i][j]));
  return m;
};

describe('对称特征分解', () => {
  it('还原原矩阵：V Λ Vᵀ = M', () => {
    const M: Mat3 = [[4, 1, -2], [1, 3, 0.5], [-2, 0.5, 6]];
    const { values, vectors } = symmetricEigen(M);
    const L: Mat3 = [[values[0], 0, 0], [0, values[1], 0], [0, 0, values[2]]];
    expect(maxDiff(matMul(matMul(vectors, L), transpose(vectors)), M)).toBeLessThan(1e-10);
  });

  it('特征向量正交', () => {
    const { vectors } = symmetricEigen([[4, 1, -2], [1, 3, 0.5], [-2, 0.5, 6]]);
    expect(maxDiff(matMul(transpose(vectors), vectors), identity3())).toBeLessThan(1e-10);
  });

  it('特征值降序', () => {
    const { values } = symmetricEigen([[1, 2, 3], [2, 5, 1], [3, 1, 9]]);
    expect(values[0]).toBeGreaterThanOrEqual(values[1]);
    expect(values[1]).toBeGreaterThanOrEqual(values[2]);
  });
});

describe('奇异值', () => {
  it('对角阵的奇异值就是 |对角元|（降序）', () => {
    expect(singularValues([[5, 0, 0], [0, 2, 0], [0, 0, 0.5]])).toEqual([5, 2, 0.5]);
  });

  it('正交阵的奇异值全为 1，κ = 1', () => {
    const c = Math.cos(0.7);
    const s = Math.sin(0.7);
    const R: Mat3 = [[c, -s, 0], [s, c, 0], [0, 0, 1]];
    singularValues(R).forEach((v) => expect(v).toBeCloseTo(1, 10));
    expect(conditionNumber(R)).toBeCloseTo(1, 10);
  });

  it('奇异值之积等于 |det|', () => {
    for (const p of PRESETS) {
      const s = singularValues(p.A);
      expect(s[0] * s[1] * s[2]).toBeCloseTo(Math.abs(det3(p.A)), 8);
    }
  });

  it('乘以正交阵不改变奇异值', () => {
    const A: Mat3 = [[1, 2, 0], [0, 1, 0], [0, 0, 3]];
    const c = Math.cos(0.4);
    const s = Math.sin(0.4);
    const Q: Mat3 = [[c, -s, 0], [s, c, 0], [0, 0, 1]];
    const before = singularValues(A);
    singularValues(matMul(Q, A)).forEach((v, i) => expect(v).toBeCloseTo(before[i], 9));
  });
});

describe('椭球的半轴就是奇异值', () => {
  it('半轴长等于奇异值', () => {
    for (const p of PRESETS) {
      const s = singularValues(p.A);
      ellipsoidAxes(p.A).forEach((a, i) => expect(a.length).toBeCloseTo(s[i], 9));
    }
  });

  it('单位球上任何点的像长都夹在 σmin 与 σmax 之间', () => {
    // 这正是 κ 的几何含义：椭球最长半轴比最短半轴
    const A: Mat3 = PRESETS[3].A;
    const s = singularValues(A);
    for (let i = 0; i < 500; i++) {
      const t = i * 2.399963;
      const z = 1 - (2 * i) / 500;
      const r = Math.sqrt(Math.max(0, 1 - z * z));
      const v: Vec3 = [r * Math.cos(t), r * Math.sin(t), z];
      const L = norm3(matVec(A, v));
      expect(L).toBeLessThanOrEqual(s[0] + 1e-9);
      expect(L).toBeGreaterThanOrEqual(s[2] - 1e-9);
    }
  });

  it('半轴方向两两正交', () => {
    const ax = ellipsoidAxes([[1, 2, 0], [0, 1, 0], [0, 0, 3]]);
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        const d = ax[i].dir[0] * ax[j].dir[0] + ax[i].dir[1] * ax[j].dir[1] + ax[i].dir[2] * ax[j].dir[2];
        expect(Math.abs(d)).toBeLessThan(1e-8);
      }
    }
  });
});

describe('条件数与行列式是两回事', () => {
  // 全课要澄清的核心误解
  it('行列式极小但完全良态', () => {
    const A: Mat3 = [[0.001, 0, 0], [0, 0.001, 0], [0, 0, 0.001]];
    expect(Math.abs(det3(A))).toBeLessThan(1e-8);
    expect(conditionNumber(A)).toBeCloseTo(1, 8);
  });

  it('行列式为 1 却不是良态', () => {
    const A: Mat3 = [[1, 2, 0], [0, 1, 0], [0, 0, 1]];
    expect(det3(A)).toBeCloseTo(1, 10);
    expect(conditionNumber(A)).toBeGreaterThan(5);
  });

  it('det 是奇异值之积，κ 是最大与最小之比', () => {
    const d = detVsCond([[1, 0.999, 0], [0.999, 1, 0], [0, 0, 1]]);
    expect(d.sigmas[0] * d.sigmas[1] * d.sigmas[2]).toBeCloseTo(Math.abs(d.det), 8);
    expect(d.cond).toBeCloseTo(d.sigmas[0] / d.sigmas[2], 6);
  });

  it('整体缩放改变 det 但不改变 κ', () => {
    const A: Mat3 = [[3, 1, 0], [0, 2, 0], [0, 0, 1]];
    const B: Mat3 = A.map((r) => r.map((v) => v * 100));
    expect(conditionNumber(B)).toBeCloseTo(conditionNumber(A), 6);
    expect(Math.abs(det3(B) / det3(A))).toBeCloseTo(1e6, 0);
  });
});

describe('扰动放大与 κ 的上界', () => {
  it('最坏方向的放大倍数达到 κ', () => {
    for (const p of PRESETS) {
      const k = conditionNumber(p.A);
      if (!Number.isFinite(k)) continue;
      const r = perturbationTest(p.A, worstRHS(p.A), worstDirection(p.A));
      expect(r).not.toBeNull();
      expect(r!.amplification).toBeGreaterThan(k * 0.99);
      expect(r!.amplification).toBeLessThan(k * 1.01);
    }
  });

  it('任意方向的放大都不超过 κ', () => {
    // κ 是上界，这是它作为「条件数」的定义性质
    const A: Mat3 = PRESETS[3].A;
    const k = conditionNumber(A);
    const b = worstRHS(A);
    for (const dir of [
      [1, 0, 0], [0, 1, 0], [0, 0, 1], [0.3, -0.7, 0.5], [-1, 2, 0.4],
    ] as Vec3[]) {
      const r = perturbationTest(A, b, dir);
      expect(r!.amplification).toBeLessThan(k * 1.001);
    }
  });

  it('良态矩阵不放大误差', () => {
    const r = perturbationTest(identity3(), [1, 2, 3], [0.4, -1, 0.2]);
    expect(r!.amplification).toBeCloseTo(1, 6);
  });

  it('病态矩阵把 1e−6 的输入误差放大到百分级', () => {
    const A: Mat3 = PRESETS[3].A;
    const r = perturbationTest(A, worstRHS(A), worstDirection(A), 1e-6);
    // κ≈2000，故相对误差约 2e−3
    expect(r!.amplification * 1e-6).toBeGreaterThan(1e-4);
  });
});

describe('求解与求逆', () => {
  it('A·A⁻¹ = I', () => {
    for (const p of PRESETS) {
      const inv = inverse3(p.A);
      if (!inv) continue;
      expect(maxDiff(matMul(p.A, inv), identity3())).toBeLessThan(1e-6);
    }
  });

  it('solve 得到的 x 满足 Ax = b', () => {
    const A: Mat3 = [[2, 1, 0], [1, 3, 1], [0, 1, 4]];
    const b: Vec3 = [1, -2, 3];
    const x = solve(A, b)!;
    sub3(matVec(A, x), b).forEach((v) => expect(Math.abs(v)).toBeLessThan(1e-10));
  });

  it('奇异矩阵返回 null 而不是 NaN', () => {
    expect(inverse3([[1, 2, 3], [2, 4, 6], [0, 0, 1]])).toBeNull();
    expect(solve([[1, 2, 3], [2, 4, 6], [0, 0, 1]], [1, 1, 1])).toBeNull();
  });

  it('奇异矩阵的条件数是无穷', () => {
    expect(conditionNumber([[1, 2, 3], [2, 4, 6], [0, 0, 1]])).toBe(Infinity);
  });
});

describe('预设', () => {
  it('κ 单调覆盖良态到病态', () => {
    expect(conditionNumber(PRESETS[0].A)).toBeCloseTo(1, 8);
    expect(conditionNumber(PRESETS[3].A)).toBeGreaterThan(100);
    expect(conditionNumber(PRESETS[4].A)).toBeGreaterThan(1000);
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
