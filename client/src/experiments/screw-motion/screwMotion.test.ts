import { describe, expect, it } from 'vitest';
import {
  applyMotion, axisAngleOf, chaslesDecompose, cross, distanceToAxis, dot,
  identity3, makeMotion, matVec, motionDiff, norm, normalize, pitchPerTurn,
  PRESETS, rotationMatrix, screwInterpolate, screwToMotion, screwTrajectory,
  sub, type Vec3,
} from './screwMotion';

const CASES: Array<[Vec3, number, Vec3]> = [
  [[0, 0, 1], Math.PI / 2, [1, 2, 3]],
  [[0, 0, 1], Math.PI / 2, [1, 2, 0]],
  [[0, 0, 1], Math.PI / 2, [0, 0, 5]],
  [[1, 1, 1], 0.4, [0.3, -1, 2]],
  [[2, -1, 0.5], 2.7, [-1, 0.5, 1.5]],
  [[0, 1, 0], Math.PI, [1, 2, 3]],
  [[-1, 0.3, 2], 1.1, [0, 0, 0]],
];

describe('旋转矩阵基础', () => {
  it('是正交阵且行列式为 1', () => {
    for (const [ax, th] of CASES) {
      const R = rotationMatrix(ax, th);
      for (let i = 0; i < 3; i++) {
        const row: Vec3 = [R[i][0], R[i][1], R[i][2]];
        expect(norm(row)).toBeCloseTo(1, 12);
      }
      const c = cross([R[0][0], R[1][0], R[2][0]], [R[0][1], R[1][1], R[2][1]]);
      const third: Vec3 = [R[0][2], R[1][2], R[2][2]];
      c.forEach((v, i) => expect(v).toBeCloseTo(third[i], 12));
    }
  });

  it('轴角往返一致', () => {
    for (const [ax, th] of CASES) {
      if (th < 1e-9) continue;
      const got = axisAngleOf(rotationMatrix(ax, th));
      expect(got.theta).toBeCloseTo(th, 9);
      const want = normalize(ax);
      // θ=π 时 +轴与 −轴等价
      const same = got.axis.every((v, i) => Math.abs(v - want[i]) < 1e-7);
      const flip = got.axis.every((v, i) => Math.abs(v + want[i]) < 1e-7);
      expect(same || flip).toBe(true);
    }
  });
});

describe('Chasles 定理', () => {
  // 全课的核心断言：任何刚体运动都能写成螺旋运动，且分解可逆
  it('分解后重建，与原运动完全一致', () => {
    for (const [ax, th, t] of CASES) {
      const m = makeMotion(ax, th, t);
      const d = motionDiff(m, screwToMotion(chaslesDecompose(m)));
      expect(d.rot).toBeLessThan(1e-12);
      expect(d.trans).toBeLessThan(1e-12);
    }
  });

  it('纯平移也能分解（螺距 = |t|，转角 0）', () => {
    const m = makeMotion([0, 0, 1], 0, [3, -1, 2]);
    const s = chaslesDecompose(m);
    expect(s.isPureTranslation).toBe(true);
    expect(s.theta).toBeCloseTo(0, 12);
    expect(s.d).toBeCloseTo(Math.hypot(3, -1, 2), 12);
    const d = motionDiff(m, screwToMotion(s));
    expect(d.rot + d.trans).toBeLessThan(1e-12);
  });

  it('螺距等于平移在轴方向的投影', () => {
    // 这是分解的定义性质：沿轴分量消不掉，垂直分量靠挪轴消掉
    for (const [ax, th, t] of CASES) {
      if (th < 1e-9) continue;
      const s = chaslesDecompose(makeMotion(ax, th, t));
      expect(s.d).toBeCloseTo(dot(t, s.axis), 10);
    }
  });

  it('平移完全沿轴时，轴不需要挪动', () => {
    const s = chaslesDecompose(makeMotion([0, 0, 1], Math.PI / 2, [0, 0, 5]));
    expect(norm(s.point)).toBeLessThan(1e-12);
    expect(s.d).toBeCloseTo(5, 12);
  });

  it('平移完全垂直于轴时，螺距为 0 —— 挪轴后是纯旋转', () => {
    const s = chaslesDecompose(makeMotion([0, 0, 1], Math.PI / 2, [1, 2, 0]));
    expect(Math.abs(s.d)).toBeLessThan(1e-12);
    expect(norm(s.point)).toBeGreaterThan(0.5);
  });

  it('轴上的点只沿轴平移，不绕转', () => {
    // 「轴」这个词的实际含义
    for (const [ax, th, t] of CASES) {
      if (th < 1e-9) continue;
      const m = makeMotion(ax, th, t);
      const s = chaslesDecompose(m);
      const moved = applyMotion(m, s.point);
      const disp = sub(moved, s.point);
      // 位移应完全沿轴：垂直分量为零
      expect(norm(cross(disp, s.axis))).toBeLessThan(1e-10);
      expect(dot(disp, s.axis)).toBeCloseTo(s.d, 10);
    }
  });

  it('轴上的点到轴距离为 0', () => {
    for (const [ax, th, t] of CASES) {
      if (th < 1e-9) continue;
      const s = chaslesDecompose(makeMotion(ax, th, t));
      expect(distanceToAxis(s, s.point)).toBeLessThan(1e-12);
    }
  });

  it('θ=π 时不产生 NaN，重建仍精确', () => {
    const m = makeMotion([0, 1, 0], Math.PI, [1, 2, 3]);
    const s = chaslesDecompose(m);
    expect(s.point.every(Number.isFinite)).toBe(true);
    expect(Number.isFinite(s.d)).toBe(true);
    const d = motionDiff(m, screwToMotion(s));
    expect(d.rot + d.trans).toBeLessThan(1e-12);
  });

  it('转角趋于 0 时轴跑向无穷 —— 螺旋退化成纯平移', () => {
    // cot(θ/2) 发散不是 bug，是几何事实
    const far = norm(chaslesDecompose(makeMotion([0, 0, 1], 1e-4, [1, 2, 3])).point);
    const near = norm(chaslesDecompose(makeMotion([0, 0, 1], 1.0, [1, 2, 3])).point);
    expect(far).toBeGreaterThan(near * 100);
  });
});

describe('螺旋插值', () => {
  it('u=0 是恒等，u=1 回到原运动', () => {
    for (const [ax, th, t] of CASES) {
      const m = makeMotion(ax, th, t);
      const s = chaslesDecompose(m);
      const at0 = screwInterpolate(s, 0);
      expect(motionDiff(at0, { R: identity3(), t: [0, 0, 0] }).rot).toBeLessThan(1e-12);
      expect(motionDiff(at0, { R: identity3(), t: [0, 0, 0] }).trans).toBeLessThan(1e-12);
      const at1 = screwInterpolate(s, 1);
      const d = motionDiff(m, at1);
      expect(d.rot + d.trans).toBeLessThan(1e-11);
    }
  });

  it('沿途始终是刚体运动：保持两点距离', () => {
    const s = chaslesDecompose(makeMotion([1, 1, 1], 1.6, [0.3, -1, 2]));
    const p: Vec3 = [1, 0.5, -2];
    const q: Vec3 = [-0.4, 2, 1];
    const d0 = norm(sub(p, q));
    for (let i = 0; i <= 8; i++) {
      const m = screwInterpolate(s, i / 8);
      expect(norm(sub(applyMotion(m, p), applyMotion(m, q)))).toBeCloseTo(d0, 10);
    }
  });

  it('轨迹点全部有限', () => {
    for (const [ax, th, t] of CASES) {
      const s = chaslesDecompose(makeMotion(ax, th, t));
      for (const p of screwTrajectory(s, [1, 0.5, -1], 20)) {
        expect(p.every(Number.isFinite)).toBe(true);
      }
    }
  });

  it('轴上点的轨迹是一条直线段', () => {
    const s = chaslesDecompose(makeMotion([0, 0, 1], Math.PI / 2, [1, 2, 3]));
    const traj = screwTrajectory(s, s.point, 12);
    // 每一点都应仍在轴上
    for (const p of traj) {
      expect(distanceToAxis(s, p)).toBeLessThan(1e-10);
    }
  });
});

describe('螺距', () => {
  it('每转一圈前进 2π·d/θ', () => {
    const s = chaslesDecompose(makeMotion([0, 0, 1], Math.PI / 2, [1, 2, 3]));
    expect(pitchPerTurn(s)).toBeCloseTo((3 / (Math.PI / 2)) * Math.PI * 2, 10);
  });

  it('纯平移的螺距是无穷', () => {
    const s = chaslesDecompose(makeMotion([0, 0, 1], 0, [1, 0, 0]));
    expect(pitchPerTurn(s)).toBe(Infinity);
  });
});

describe('预设', () => {
  it('每个预设都能正确分解并重建', () => {
    for (const p of PRESETS) {
      const m = makeMotion(p.axis, p.theta, p.t);
      const d = motionDiff(m, screwToMotion(chaslesDecompose(m)));
      expect(d.rot).toBeLessThan(1e-11);
      expect(d.trans).toBeLessThan(1e-11);
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });

  it('matVec 与手算一致', () => {
    expect(matVec([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [1, 0, -1])).toEqual([-2, -2, -2]);
  });
});
