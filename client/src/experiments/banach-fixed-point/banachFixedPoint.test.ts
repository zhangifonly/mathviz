import { describe, expect, it } from 'vitest';
import {
  add2, aPosterioriBound, aPrioriBound, applyMap, errorSequence, fixedPoint,
  isContraction, norm2, orbit, PRESETS, spectralNorm, spectralRadius,
  stepsNeeded, sub2, type Mat2, type Vec2,
} from './banachFixedPoint';

const STRONG: Mat2 = [[0.3, 0.1], [0.0, 0.4]];
const ROT: Mat2 = [[0.5, -0.5], [0.5, 0.5]];
const SHEAR: Mat2 = [[0.5, 3.0], [0.0, 0.5]];
const DIV: Mat2 = [[1.1, 0.0], [0.0, 0.5]];

describe('谱范数与谱半径', () => {
  it('对角阵：范数与半径都是最大对角元的绝对值', () => {
    expect(spectralNorm([[0.3, 0], [0, 0.4]])).toBeCloseTo(0.4, 10);
    expect(spectralRadius([[0.3, 0], [0, 0.4]])).toBeCloseTo(0.4, 10);
  });

  it('旋转缩放阵：范数等于半径（正规矩阵）', () => {
    expect(spectralNorm(ROT)).toBeCloseTo(spectralRadius(ROT), 8);
    expect(spectralRadius(ROT)).toBeCloseTo(Math.SQRT1_2, 8);
  });

  it('剪切阵：范数远大于半径（非正规）', () => {
    expect(spectralNorm(SHEAR)).toBeGreaterThan(3);
    expect(spectralRadius(SHEAR)).toBeCloseTo(0.5, 10);
  });

  it('谱半径不超过谱范数', () => {
    for (const p of PRESETS) {
      expect(spectralRadius(p.A)).toBeLessThanOrEqual(spectralNorm(p.A) + 1e-12);
    }
  });

  it('复特征值时半径是 √|det|', () => {
    // 旋转阵的特征值是复的
    expect(spectralRadius([[0, -0.6], [0.6, 0]])).toBeCloseTo(0.6, 10);
  });
});

describe('不动点', () => {
  it('确实满足 T(x*) = x*', () => {
    for (const p of PRESETS) {
      const star = fixedPoint(p.A, p.b);
      expect(star).not.toBeNull();
      const img = applyMap(p.A, p.b, star!);
      expect(norm2(sub2(img, star!))).toBeLessThan(1e-10);
    }
  });

  it('I−A 奇异时返回 null', () => {
    expect(fixedPoint([[1, 0], [0, 0.5]], [1, 1])).toBeNull();
  });

  it('唯一性：不同初值收敛到同一点', () => {
    const b: Vec2 = [1, 2];
    const star = fixedPoint(STRONG, b)!;
    for (const x0 of [[0, 0], [10, -10], [-3, 7]] as Vec2[]) {
      const path = orbit(STRONG, b, x0, 80);
      const last = path[path.length - 1];
      expect(norm2(sub2(last, star))).toBeLessThan(1e-9);
    }
  });
});

describe('Banach 误差界', () => {
  it('先验界在 40 步内从未被违反', () => {
    for (const p of PRESETS) {
      if (!isContraction(p.A)) continue;
      const errs = errorSequence(p.A, p.b, p.x0, 40);
      for (let n = 1; n < errs.length; n++) {
        expect(errs[n]).toBeLessThanOrEqual(aPrioriBound(p.A, p.b, p.x0, n) + 1e-12);
      }
    }
  });

  it('后验界也从未被违反，且更紧', () => {
    for (const p of PRESETS) {
      if (!isContraction(p.A)) continue;
      const errs = errorSequence(p.A, p.b, p.x0, 30);
      for (let n = 1; n < errs.length; n++) {
        const post = aPosterioriBound(p.A, p.b, p.x0, n);
        expect(errs[n]).toBeLessThanOrEqual(post + 1e-12);
        expect(post).toBeLessThanOrEqual(aPrioriBound(p.A, p.b, p.x0, n) + 1e-12);
      }
    }
  });

  it('q ≥ 1 时返回 Infinity 而不是硬算', () => {
    expect(aPrioriBound(SHEAR, [1, 1], [0, 0], 5)).toBe(Infinity);
    expect(aPrioriBound(DIV, [1, 1], [0, 0], 5)).toBe(Infinity);
  });

  it('stepsNeeded 给出的步数确实达标', () => {
    for (const p of PRESETS) {
      if (!isContraction(p.A)) continue;
      for (const tol of [1e-3, 1e-6]) {
        const n = stepsNeeded(p.A, p.b, p.x0, tol);
        expect(n).not.toBeNull();
        const errs = errorSequence(p.A, p.b, p.x0, n! + 2);
        expect(errs[n!]).toBeLessThanOrEqual(tol);
      }
    }
  });

  it('q 接近 1 时先验估计保守约 3.6 倍', () => {
    // 实测 q=0.9919：先验要求 n=1400，而实际在 n=387 就跌破 1e−3
    const weak = PRESETS.find((p) => p.id === 'weak')!;
    const n = stepsNeeded(weak.A, weak.b, weak.x0, 1e-3)!;
    const errs = errorSequence(weak.A, weak.b, weak.x0, n);
    const first = errs.findIndex((e) => e < 1e-3);
    expect(n).toBe(1400);
    expect(first).toBe(387);
    expect(n / first).toBeGreaterThan(3);
  });
});

describe('压缩是充分不必要', () => {
  // 全课要澄清的核心
  it('剪切阵不是压缩，但迭代收敛', () => {
    expect(isContraction(SHEAR)).toBe(false);
    const errs = errorSequence(SHEAR, [1, 1], [0, 0], 60);
    expect(errs[5]).toBeGreaterThan(1);
    expect(errs[40]).toBeLessThan(1e-8);
  });

  it('收敛与否由谱半径决定，不是谱范数', () => {
    expect(spectralRadius(SHEAR)).toBeLessThan(1);
    expect(spectralNorm(SHEAR)).toBeGreaterThan(1);
    // 谱半径 > 1 才真的发散
    expect(spectralRadius(DIV)).toBeGreaterThan(1);
    const errs = errorSequence(DIV, [1, 1], [0.5, 0.5], 30);
    expect(errs[30]).toBeGreaterThan(errs[0]);
  });

  it('发散时不动点仍然存在，只是不吸引', () => {
    const star = fixedPoint(DIV, [1, 1]);
    expect(star).not.toBeNull();
    expect(norm2(sub2(applyMap(DIV, [1, 1], star!), star!))).toBeLessThan(1e-10);
  });
});

describe('轨迹', () => {
  it('压缩时误差单调不增', () => {
    for (const p of PRESETS) {
      if (!isContraction(p.A)) continue;
      const errs = errorSequence(p.A, p.b, p.x0, 30);
      for (let i = 1; i < errs.length; i++) {
        expect(errs[i]).toBeLessThanOrEqual(errs[i - 1] + 1e-12);
      }
    }
  });

  it('轨迹点全部有限，发散时提前截断', () => {
    for (const p of PRESETS) {
      for (const x of orbit(p.A, p.b, p.x0, 200)) {
        expect(Number.isFinite(x[0])).toBe(true);
        expect(Number.isFinite(x[1])).toBe(true);
      }
    }
  });

  it('每步确实是 T 作用一次', () => {
    const path = orbit(STRONG, [1, 2], [3, -1], 5);
    for (let i = 1; i < path.length; i++) {
      const want = applyMap(STRONG, [1, 2], path[i - 1]);
      expect(norm2(sub2(path[i], want))).toBeLessThan(1e-12);
    }
  });
});

describe('向量运算与预设', () => {
  it('add2 / sub2 / norm2', () => {
    expect(add2([1, 2], [3, 4])).toEqual([4, 6]);
    expect(sub2([1, 2], [3, 4])).toEqual([-2, -2]);
    expect(norm2([3, 4])).toBeCloseTo(5, 12);
  });

  it('预设的压缩性与标注一致', () => {
    expect(isContraction(PRESETS.find((p) => p.id === 'strong')!.A)).toBe(true);
    expect(isContraction(PRESETS.find((p) => p.id === 'shear')!.A)).toBe(false);
    expect(isContraction(PRESETS.find((p) => p.id === 'diverge')!.A)).toBe(false);
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
