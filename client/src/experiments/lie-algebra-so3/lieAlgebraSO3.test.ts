import { describe, expect, it } from 'vitest';
import {
  BRACKET_PAIR, bchDefect, bchSecondOrderDefect, bracket, cross, det3,
  expSO3, expSeries, hat, identity3, logSO3, matMaxDiff, matMul, matVec,
  norm3, oneParamSubgroup, orthogonalityResidual, PRESETS, skewResidual,
  transpose, vee, type Mat3, type Vec3,
} from './lieAlgebraSO3';

const SAMPLES: Vec3[] = [
  [0.3, 0, 0],
  [1, 1, 1],
  [2.5, -1.2, 0.7],
  [0, 0, Math.PI],
  [-0.8, 0.15, 2.0],
];

describe('hat 与 vee', () => {
  it('hat 得到的是反对称矩阵', () => {
    for (const w of SAMPLES) {
      expect(skewResidual(hat(w))).toBeLessThan(1e-15);
    }
  });

  it('[ω]× v = ω × v —— hat 就是叉积的矩阵形式', () => {
    const v: Vec3 = [0.4, -1.1, 2.2];
    for (const w of SAMPLES) {
      const lhs = matVec(hat(w), v);
      const rhs = cross(w, v);
      lhs.forEach((c, i) => expect(c).toBeCloseTo(rhs[i], 12));
    }
  });

  it('vee 是 hat 的逆', () => {
    for (const w of SAMPLES) {
      vee(hat(w)).forEach((c, i) => expect(c).toBeCloseTo(w[i], 12));
    }
  });

  it('K³ = −K —— 级数能收成闭式的原因', () => {
    for (const w of SAMPLES) {
      const t = norm3(w);
      const k = w.map((v) => v / t) as Vec3;
      const K = hat(k);
      const K3 = matMul(matMul(K, K), K);
      expect(matMaxDiff(K3, K.map((r) => r.map((v) => -v)))).toBeLessThan(1e-14);
    }
  });
});

describe('指数映射', () => {
  it('结果是旋转矩阵：正交且行列式为 1', () => {
    for (const w of SAMPLES) {
      const R = expSO3(w);
      expect(orthogonalityResidual(R)).toBeLessThan(1e-14);
      expect(det3(R)).toBeCloseTo(1, 12);
    }
  });

  it('exp(0) = I', () => {
    expect(matMaxDiff(expSO3([0, 0, 0]), identity3())).toBe(0);
  });

  it('Rodrigues 闭式等于幂级数的精确求和', () => {
    // 闭式不是近似：项数够多时两者到机器精度一致
    for (const w of SAMPLES) {
      expect(matMaxDiff(expSO3(w), expSeries(w, 40))).toBeLessThan(1e-13);
    }
  });

  it('项数不足时级数明显有误差 —— 说明闭式的价值', () => {
    const w: Vec3 = [0, 0, Math.PI];
    expect(matMaxDiff(expSO3(w), expSeries(w, 4))).toBeGreaterThan(0.1);
    expect(matMaxDiff(expSO3(w), expSeries(w, 16))).toBeLessThan(1e-5);
  });

  it('转轴自身不动', () => {
    for (const w of SAMPLES) {
      const R = expSO3(w);
      const t = norm3(w);
      const axis = w.map((v) => v / t) as Vec3;
      matVec(R, axis).forEach((c, i) => expect(c).toBeCloseTo(axis[i], 12));
    }
  });

  it('转角与 |ω| 一致：tr(R) = 1 + 2cos|ω|', () => {
    for (const w of SAMPLES) {
      const R = expSO3(w);
      const tr = R[0][0] + R[1][1] + R[2][2];
      expect(tr).toBeCloseTo(1 + 2 * Math.cos(norm3(w)), 10);
    }
  });

  it('exp(−ω) 是 exp(ω) 的逆（也是它的转置）', () => {
    for (const w of SAMPLES) {
      const R = expSO3(w);
      const Rn = expSO3(w.map((v) => -v) as Vec3);
      expect(matMaxDiff(Rn, transpose(R))).toBeLessThan(1e-13);
      expect(matMaxDiff(matMul(R, Rn), identity3())).toBeLessThan(1e-13);
    }
  });
});

describe('对数映射', () => {
  it('exp 与 log 往返一致', () => {
    for (const w of SAMPLES) {
      const back = logSO3(expSO3(w));
      back.forEach((c, i) => expect(c).toBeCloseTo(w[i], 8));
    }
  });

  it('log(I) = 0', () => {
    expect(logSO3(identity3())).toEqual([0, 0, 0]);
  });

  it('θ 恰为 π 时不产生 NaN，且往返仍成立', () => {
    // 常用公式在这里除以 sin π = 0，必须换分支
    for (const w of [
      [0, 0, Math.PI],
      [Math.PI, 0, 0],
      [Math.PI / Math.sqrt(3), Math.PI / Math.sqrt(3), Math.PI / Math.sqrt(3)],
    ] as Vec3[]) {
      const back = logSO3(expSO3(w));
      expect(back.every(Number.isFinite)).toBe(true);
      // θ=π 时 +ω 与 −ω 是同一个旋转，比较其一即可
      const same = back.every((c, i) => Math.abs(c - w[i]) < 1e-6);
      const flipped = back.every((c, i) => Math.abs(c + w[i]) < 1e-6);
      expect(same || flipped).toBe(true);
    }
  });

  it('极小角度不产生 NaN', () => {
    const back = logSO3(expSO3([1e-9, 0, 0]));
    expect(back.every(Number.isFinite)).toBe(true);
  });
});

describe('李括号', () => {
  it('[[a]×,[b]×] = [a×b]× —— 括号就是叉积', () => {
    for (const [a, b] of [
      [[1, 0, 0], [0, 1, 0]],
      [[0.3, -1.2, 0.5], [2, 0.4, -0.7]],
      [[1, 1, 1], [-0.5, 2, 0.25]],
    ] as Array<[Vec3, Vec3]>) {
      vee(bracket(hat(a), hat(b))).forEach((c, i) => {
        expect(c).toBeCloseTo(cross(a, b)[i], 12);
      });
    }
  });

  it('反对称性 [A,B] = −[B,A]', () => {
    const A = hat([1, 2, 3]);
    const B = hat([-0.5, 1, 0.2]);
    expect(matMaxDiff(bracket(A, B), bracket(B, A).map((r) => r.map((v) => -v)) as Mat3))
      .toBeLessThan(1e-14);
  });

  it('雅可比恒等式', () => {
    const A = hat([1, 0.3, -2]);
    const B = hat([0.5, -1, 0.7]);
    const C = hat([-0.2, 2, 1.1]);
    const sum = bracket(A, bracket(B, C));
    const s2 = bracket(B, bracket(C, A));
    const s3 = bracket(C, bracket(A, B));
    const total = sum.map((row, i) => row.map((v, j) => v + s2[i][j] + s3[i][j]));
    expect(matMaxDiff(total as Mat3, [[0, 0, 0], [0, 0, 0], [0, 0, 0]])).toBeLessThan(1e-13);
  });

  it('括号非零 ⟺ 不可交换', () => {
    const { a, b } = BRACKET_PAIR;
    expect(norm3(cross(a, b))).toBeGreaterThan(0.1);
    expect(bchDefect(a, b)).toBeGreaterThan(0.1);
  });

  it('同轴时括号为零，exp 可加', () => {
    expect(bchDefect([0.5, 0, 0], [1.1, 0, 0])).toBeLessThan(1e-14);
  });

  it('BCH 二阶修正明显更准 —— 修正项正是 ½[A,B]', () => {
    for (const scale of [0.2, 0.05]) {
      const a: Vec3 = [scale, 0, 0];
      const b: Vec3 = [0, scale, 0];
      expect(bchSecondOrderDefect(a, b)).toBeLessThan(bchDefect(a, b) / 5);
    }
  });
});

describe('单参数子群', () => {
  it('exp(s·ω)·exp(t·ω) = exp((s+t)·ω)', () => {
    const w: Vec3 = [0.4, -0.9, 1.3];
    const A = matMul(oneParamSubgroup(w, 0.3), oneParamSubgroup(w, 0.8));
    expect(matMaxDiff(A, oneParamSubgroup(w, 1.1))).toBeLessThan(1e-13);
  });

  it('t=0 给出单位阵', () => {
    expect(matMaxDiff(oneParamSubgroup([1, 2, 3], 0), identity3())).toBe(0);
  });

  it('沿途始终是旋转矩阵', () => {
    for (let i = 0; i <= 10; i++) {
      const R = oneParamSubgroup([0.7, 0.2, -1.4], i / 2);
      expect(orthogonalityResidual(R)).toBeLessThan(1e-13);
      expect(det3(R)).toBeCloseTo(1, 11);
    }
  });
});

describe('预设', () => {
  it('每个预设都给出合法旋转', () => {
    for (const p of PRESETS) {
      const R = expSO3(p.omega);
      expect(orthogonalityResidual(R)).toBeLessThan(1e-13);
      expect(det3(R)).toBeCloseTo(1, 11);
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
