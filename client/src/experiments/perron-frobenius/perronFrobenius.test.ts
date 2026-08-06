import { describe, expect, it } from 'vitest';
import {
  cAbs, classify, convergenceRate, damp, eigenvalues, eigenvaluesByModulus,
  isIrreducible, isNonnegative, isPositive, isPrimitive, isRowStochastic,
  iterate, limitSpread, matVec, norm1, normalizeProb, perronVector,
  PRESETS, primitivePower, spectralGap, stationaryUnique, trace3, transpose,
  type Mat3, type Vec3,
} from './perronFrobenius';

const POS: Mat3 = [[0.5, 0.3, 0.2], [0.2, 0.6, 0.2], [0.3, 0.3, 0.4]];
const PRIM: Mat3 = [[0, 1, 0], [0, 0, 1], [0.5, 0.5, 0]];
const PERIODIC: Mat3 = [[0, 1, 0], [0, 0, 1], [1, 0, 0]];
const REDUCIBLE: Mat3 = [[0.5, 0.5, 0], [0.5, 0.5, 0], [0, 0, 1]];

describe('矩阵性质判定', () => {
  it('全部预设都是非负行随机矩阵', () => {
    for (const p of PRESETS) {
      expect(isNonnegative(p.A)).toBe(true);
      expect(isRowStochastic(p.A)).toBe(true);
    }
  });

  it('正矩阵与含零矩阵区分正确', () => {
    expect(isPositive(POS)).toBe(true);
    expect(isPositive(PRIM)).toBe(false);
  });

  it('不可约性判定', () => {
    expect(isIrreducible(POS)).toBe(true);
    expect(isIrreducible(PRIM)).toBe(true);
    expect(isIrreducible(PERIODIC)).toBe(true); // 循环是强连通的
    expect(isIrreducible(REDUCIBLE)).toBe(false);
  });

  it('本原性判定：周期矩阵不可约但不本原', () => {
    // 这正是「不可约」与「本原」的区别所在
    expect(isPrimitive(POS)).toBe(true);
    expect(isPrimitive(PRIM)).toBe(true);
    expect(isPrimitive(PERIODIC)).toBe(false);
    expect(isPrimitive(REDUCIBLE)).toBe(false);
  });

  it('本原的幂次不超过 Wielandt 界 n²−2n+2 = 5', () => {
    expect(primitivePower(POS)).toBe(1);
    expect(primitivePower(PRIM)).toBeLessThanOrEqual(5);
  });
});

describe('特征值与谱隙', () => {
  it('行随机矩阵的谱半径恰为 1', () => {
    for (const p of PRESETS) {
      expect(cAbs(eigenvaluesByModulus(p.A)[0])).toBeCloseTo(1, 8);
    }
  });

  it('全 1 向量是行随机矩阵的右特征向量，特征值 1', () => {
    for (const p of PRESETS) {
      const v = matVec(p.A, [1, 1, 1]);
      v.forEach((c) => expect(c).toBeCloseTo(1, 10));
    }
  });

  it('特征值之和等于迹', () => {
    for (const p of PRESETS) {
      const s = eigenvalues(p.A).reduce((acc, z) => acc + z.re, 0);
      expect(s).toBeCloseTo(trace3(p.A), 8);
    }
  });

  it('本原 ⇒ 谱隙为正；周期/可约 ⇒ 谱隙为零', () => {
    expect(spectralGap(POS)).toBeGreaterThan(0.5);
    expect(spectralGap(PRIM)).toBeGreaterThan(0.2);
    expect(spectralGap(PERIODIC)).toBeLessThan(1e-8);
    expect(spectralGap(REDUCIBLE)).toBeLessThan(1e-8);
  });

  it('周期矩阵的三个特征值全在单位圆上', () => {
    for (const z of eigenvalues(PERIODIC)) {
      expect(cAbs(z)).toBeCloseTo(1, 8);
    }
  });

  it('周期矩阵确有复特征值 —— 只有复平面上才看得见', () => {
    expect(eigenvalues(PERIODIC).filter((z) => Math.abs(z.im) > 1e-8)).toHaveLength(2);
  });

  it('收敛率等于 |λ₂|/|λ₁|', () => {
    expect(convergenceRate(POS)).toBeCloseTo(0.3, 6);
    expect(convergenceRate(PERIODIC)).toBeCloseTo(1, 6);
  });
});

describe('迭代行为', () => {
  it('每步都保持是概率分布', () => {
    for (const p of PRESETS) {
      for (const v of iterate(p.A, [1, 0, 0], 20)) {
        expect(v.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 9);
        v.forEach((x) => expect(x).toBeGreaterThanOrEqual(-1e-12));
      }
    }
  });

  it('本原时迭代收敛', () => {
    expect(perronVector(POS).converged).toBe(true);
    expect(perronVector(PRIM).converged).toBe(true);
  });

  it('周期时迭代不收敛 —— 永远打转', () => {
    // ⚠️ 起点不能取均匀分布：它是循环置换的不动点，会把周期性盖住
    expect(perronVector(PERIODIC).converged).toBe(false);
    const path = iterate(PERIODIC, [1, 0, 0], 30);
    const a = path[path.length - 1];
    const b = path[path.length - 2];
    expect(norm1([a[0] - b[0], a[1] - b[1], a[2] - b[2]] as Vec3)).toBeGreaterThan(1);
  });

  it('周期矩阵每 3 步回到原处', () => {
    const path = iterate(PERIODIC, [1, 0, 0], 9);
    for (const k of [3, 6, 9]) {
      path[k].forEach((v, i) => expect(v).toBeCloseTo([1, 0, 0][i], 9));
    }
  });

  it('稳态确实是不动点', () => {
    for (const A of [POS, PRIM]) {
      const v = perronVector(A).vector;
      const next = normalizeProb(matVec(transpose(A), v));
      next.forEach((c, i) => expect(c).toBeCloseTo(v[i], 7));
    }
  });
});

describe('两种失败模式需要两个检测手段', () => {
  // 可约情形迭代本身收敛，只有换初值才暴露；缺一不可
  it('本原：不同初值殊途同归', () => {
    expect(limitSpread(POS)).toBeLessThan(1e-6);
    expect(limitSpread(PRIM)).toBeLessThan(1e-6);
  });

  it('周期：不同初值各转各的圈', () => {
    expect(limitSpread(PERIODIC)).toBeGreaterThan(1);
  });

  it('可约：迭代收敛，但极限依赖初值', () => {
    const path = iterate(REDUCIBLE, [1, 0, 0], 100);
    const a = path[path.length - 1];
    const b = path[path.length - 2];
    // 收敛
    expect(norm1([a[0] - b[0], a[1] - b[1], a[2] - b[2]] as Vec3)).toBeLessThan(1e-9);
    // 但不唯一
    expect(limitSpread(REDUCIBLE)).toBeGreaterThan(1);
  });

  it('特征值判据与迭代判据一致', () => {
    for (const p of PRESETS) {
      const unique = stationaryUnique(p.A);
      const spread = limitSpread(p.A);
      expect(unique).toBe(spread < 1e-6);
    }
  });
});

describe('PageRank 阻尼', () => {
  it('阻尼后一定是正矩阵', () => {
    for (const p of PRESETS) {
      expect(isPositive(damp(p.A, 0.85))).toBe(true);
    }
  });

  it('阻尼后仍是行随机矩阵', () => {
    for (const p of PRESETS) {
      expect(isRowStochastic(damp(p.A, 0.85))).toBe(true);
    }
  });

  it('阻尼修好了周期与可约两种失败', () => {
    for (const A of [PERIODIC, REDUCIBLE]) {
      const d = damp(A, 0.85);
      expect(spectralGap(d)).toBeGreaterThan(0.1);
      expect(stationaryUnique(d)).toBe(true);
      expect(limitSpread(d)).toBeLessThan(1e-6);
    }
  });

  it('阻尼后收敛率有与图结构无关的上界 d', () => {
    // 这才是 0.85 真正买到的东西
    for (const p of PRESETS) {
      expect(convergenceRate(damp(p.A, 0.85))).toBeLessThan(0.85 + 1e-9);
    }
  });

  it('d 越小收敛越快', () => {
    expect(convergenceRate(damp(PERIODIC, 0.5)))
      .toBeLessThan(convergenceRate(damp(PERIODIC, 0.9)));
  });

  it('d = 1 时退回原矩阵', () => {
    const d = damp(PERIODIC, 1);
    d.forEach((row, i) => row.forEach((v, j) => expect(v).toBeCloseTo(PERIODIC[i][j], 12)));
  });
});

describe('分类与预设', () => {
  it('classify 的判词与实际一致', () => {
    expect(classify(POS).verdict).toContain('本原');
    expect(classify(PERIODIC).verdict).toContain('周期');
    expect(classify(REDUCIBLE).verdict).toContain('可约');
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });

  it('每个预设的谱隙与本原性一致', () => {
    for (const p of PRESETS) {
      const c = classify(p.A);
      expect(c.primitive).toBe(c.gap > 1e-8);
    }
  });
});
