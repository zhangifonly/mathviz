import { describe, expect, it } from 'vitest';
import {
  angleBetweenQuats, eulerLerp, fromAxisAngle, fromEuler, pathStats,
  PRESETS, qConj, qDot, qMul, qNeg, qNorm, qNormalize, rotate, slerp,
  toAxisAngle, toEuler, toMatrix, type Quat, type Vec3,
} from './quaternionRotation';

const close = (a: number[], b: number[], p = 10) =>
  a.forEach((v, i) => expect(v).toBeCloseTo(b[i], p));

describe('四元数代数', () => {
  it('乘法满足 i² = j² = k² = −1', () => {
    const i: Quat = [0, 1, 0, 0];
    const j: Quat = [0, 0, 1, 0];
    const k: Quat = [0, 0, 0, 1];
    close(qMul(i, i), [-1, 0, 0, 0]);
    close(qMul(j, j), [-1, 0, 0, 0]);
    close(qMul(k, k), [-1, 0, 0, 0]);
  });

  it('ijk = −1，且 ij = k 而 ji = −k（不可交换）', () => {
    const i: Quat = [0, 1, 0, 0];
    const j: Quat = [0, 0, 1, 0];
    const k: Quat = [0, 0, 0, 1];
    close(qMul(qMul(i, j), k), [-1, 0, 0, 0]);
    close(qMul(i, j), k);
    close(qMul(j, i), qNeg(k));
  });

  it('单位四元数乘积仍是单位四元数', () => {
    const a = fromAxisAngle([1, 2, 3], 0.7);
    const b = fromAxisAngle([-2, 1, 0.5], 2.1);
    expect(qNorm(qMul(a, b))).toBeCloseTo(1, 12);
  });

  it('q·q̄ = |q|²', () => {
    const q: Quat = [1, 2, -3, 0.5];
    const r = qMul(q, qConj(q));
    expect(r[0]).toBeCloseTo(qNorm(q) ** 2, 10);
    close([r[1], r[2], r[3]], [0, 0, 0]);
  });
});

describe('轴角与半角', () => {
  it('绕 z 转 90° 的四元数是 (cos45°, 0, 0, sin45°)', () => {
    // 半角是本课的关键：转 90° 用的是 45° 的余弦正弦
    const q = fromAxisAngle([0, 0, 1], Math.PI / 2);
    close(q, [Math.SQRT1_2, 0, 0, Math.SQRT1_2]);
  });

  it('轴角往返一致', () => {
    for (const [ax, ang] of [
      [[0, 0, 1], 1.2],
      [[1, 1, 1], 2.6],
      [[-3, 0.5, 2], 0.4],
    ] as Array<[Vec3, number]>) {
      const q = fromAxisAngle(ax, ang);
      const back = toAxisAngle(q);
      expect(back.angle).toBeCloseTo(ang, 10);
      const n = Math.hypot(...ax);
      close(back.axis, ax.map((v) => v / n), 10);
    }
  });

  it('零轴不产生 NaN', () => {
    const q = fromAxisAngle([0, 0, 0], 1.0);
    expect(q.every(Number.isFinite)).toBe(true);
    expect(toAxisAngle([1, 0, 0, 0]).angle).toBeCloseTo(0, 12);
  });
});

describe('旋转作用', () => {
  it('绕 z 转 90° 把 x 轴送到 y 轴', () => {
    close(rotate(fromAxisAngle([0, 0, 1], Math.PI / 2), [1, 0, 0]), [0, 1, 0]);
  });

  it('旋转保长度', () => {
    const q = fromAxisAngle([1, -2, 0.5], 1.7);
    const v: Vec3 = [3, -1, 2];
    expect(Math.hypot(...rotate(q, v))).toBeCloseTo(Math.hypot(...v), 10);
  });

  it('旋转轴自身不动', () => {
    const axis: Vec3 = [1, 2, -1];
    const q = fromAxisAngle(axis, 1.3);
    const n = Math.hypot(...axis);
    const unit = axis.map((v) => v / n) as Vec3;
    close(rotate(q, unit), unit, 10);
  });

  it('连续两次旋转等于四元数乘积', () => {
    const a = fromAxisAngle([0, 0, 1], 0.7);
    const b = fromAxisAngle([1, 0, 0], 1.1);
    const v: Vec3 = [0.3, 0.5, -0.8];
    close(rotate(qMul(b, a), v), rotate(b, rotate(a, v)), 10);
  });

  it('转成矩阵后作用相同，且矩阵正交、行列式为 1', () => {
    const q = fromAxisAngle([2, -1, 0.4], 1.9);
    const M = toMatrix(q);
    const v: Vec3 = [1, 2, 3];
    const mv = M.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
    close(mv, rotate(q, v), 10);
    // 行向量单位正交
    for (let i = 0; i < 3; i++) {
      expect(Math.hypot(...M[i])).toBeCloseTo(1, 10);
      for (let j = i + 1; j < 3; j++) {
        const d = M[i][0] * M[j][0] + M[i][1] * M[j][1] + M[i][2] * M[j][2];
        expect(d).toBeCloseTo(0, 10);
      }
    }
    const det =
      M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
      M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
      M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    expect(det).toBeCloseTo(1, 10);
  });
});

describe('双重覆盖', () => {
  // S³ 是 SO(3) 的双重覆盖：q 与 −q 是同一个旋转
  it('q 与 −q 给出完全相同的旋转', () => {
    const q = fromAxisAngle([1, 2, 3], 2.2);
    for (const v of [[1, 0, 0], [0.3, -0.7, 0.2], [0, 0, 1]] as Vec3[]) {
      close(rotate(qNeg(q), v), rotate(q, v), 12);
    }
  });

  it('转 360° 得到 −1（不是 1），转 720° 才回到 1', () => {
    const q360 = fromAxisAngle([0, 0, 1], Math.PI * 2);
    close(q360, [-1, 0, 0, 0], 12);
    const q720 = fromAxisAngle([0, 0, 1], Math.PI * 4);
    close(q720, [1, 0, 0, 0], 12);
  });

  it('但 360° 与 720° 作为旋转是同一个', () => {
    const v: Vec3 = [1, 2, 3];
    close(rotate(fromAxisAngle([0, 0, 1], Math.PI * 2), v), v, 10);
  });
});

describe('欧拉角互转', () => {
  it('欧拉角往返一致（远离万向锁时）', () => {
    for (const [y, p, r] of [[0.6, 0.3, -0.9], [2.1, -0.4, 1.2]]) {
      const e = toEuler(fromEuler(y, p, r));
      expect(e.yaw).toBeCloseTo(y, 8);
      expect(e.pitch).toBeCloseTo(p, 8);
      expect(e.roll).toBeCloseTo(r, 8);
    }
  });

  it('万向锁处 pitch 取 ±90°，不产生 NaN', () => {
    const e = toEuler(fromEuler(0.8, Math.PI / 2, 0.5));
    expect(Math.abs(e.pitch)).toBeCloseTo(Math.PI / 2, 8);
    expect(Number.isFinite(e.yaw)).toBe(true);
    expect(Number.isFinite(e.roll)).toBe(true);
  });
});

describe('SLERP', () => {
  it('端点复原', () => {
    const a = fromEuler(0.2, -0.5, 1.1);
    const b = fromEuler(2.0, 0.6, -0.7);
    close(slerp(a, b, 0), qNormalize(a), 10);
    close(slerp(a, b, 1), qNormalize(b), 10);
  });

  it('全程保持单位长度', () => {
    const a = fromEuler(0, 0, 0);
    const b = fromEuler(2.2, 1.1, -1.6);
    for (let i = 0; i <= 10; i++) {
      expect(qNorm(slerp(a, b, i / 10))).toBeCloseTo(1, 10);
    }
  });

  it('角速度恒定：每步转角完全相等', () => {
    // 这是 SLERP 的定义性质，也是它优于欧拉插值的地方
    const a = fromEuler(0, 0, 0);
    const b = fromEuler(2.2, 1.1, -1.6);
    const s = pathStats((t) => slerp(a, b, t));
    expect(s.ratio).toBeCloseTo(1, 6);
  });

  it('走的是最短路径：总转角等于两姿态夹角', () => {
    const a = fromEuler(0, 0, 0);
    const b = fromEuler(2.2, 1.1, -1.6);
    const s = pathStats((t) => slerp(a, b, t), 64);
    expect(s.total).toBeCloseTo(angleBetweenQuats(a, b), 6);
  });

  it('dot<0 时取近路，不绕远', () => {
    const a = fromEuler(0, 0, 0);
    const b = qNeg(fromEuler(0.4, 0, 0)); // 同一旋转，但点积为负
    expect(qDot(a, b)).toBeLessThan(0);
    const s = pathStats((t) => slerp(a, b, t), 32);
    // 近路约 0.4 rad；绕远会是 2π−0.4
    expect(s.total).toBeLessThan(0.5);
  });

  it('两姿态几乎重合时不产生 NaN', () => {
    const a = fromEuler(0.5, 0.2, 0.1);
    const b = fromEuler(0.5 + 1e-11, 0.2, 0.1);
    const m = slerp(a, b, 0.5);
    expect(m.every(Number.isFinite)).toBe(true);
    expect(qNorm(m)).toBeCloseTo(1, 10);
  });
});

describe('与欧拉线性插值的对照', () => {
  it('欧拉插值角速度不匀，SLERP 匀', () => {
    const from = { yaw: 0, pitch: 0, roll: 0 };
    const to = { yaw: 2.2, pitch: 1.1, roll: -1.6 };
    const a = fromEuler(from.yaw, from.pitch, from.roll);
    const b = fromEuler(to.yaw, to.pitch, to.roll);
    const sq = pathStats((t) => slerp(a, b, t));
    const se = pathStats((t) => eulerLerp(from, to, t));
    expect(sq.ratio).toBeCloseTo(1, 6);
    expect(se.ratio).toBeGreaterThan(1.1);
  });

  it('欧拉插值走的路更长', () => {
    const from = { yaw: 0, pitch: 0, roll: 0 };
    const to = { yaw: 2.2, pitch: 1.1, roll: -1.6 };
    const a = fromEuler(from.yaw, from.pitch, from.roll);
    const b = fromEuler(to.yaw, to.pitch, to.roll);
    const sq = pathStats((t) => slerp(a, b, t), 64);
    const se = pathStats((t) => eulerLerp(from, to, t), 64);
    expect(se.total).toBeGreaterThan(sq.total * 1.05);
  });

  it('万向锁附近：欧拉插值绕远路，但快慢仍是匀的', () => {
    /*
     * 这个用例钉住两件事:
     * 1. pitch≈90° 且 yaw/roll 反向时, 欧拉插值走的路是 SLERP 的十几倍
     *    —— 这才是万向锁的真实代价。
     * 2. 此时它的 max/min 却接近 1(全程匀速)。所以「匀速」与「最短」
     *    是两个独立的指标, 只测其一会漏掉这种失败。
     */
    const from = { yaw: -1.5, pitch: 1.5, roll: 1.5 };
    const to = { yaw: 1.5, pitch: 1.5, roll: -1.5 };
    const a = fromEuler(from.yaw, from.pitch, from.roll);
    const b = fromEuler(to.yaw, to.pitch, to.roll);
    const sq = pathStats((t) => slerp(a, b, t), 64);
    const se = pathStats((t) => eulerLerp(from, to, t), 64);
    expect(se.total).toBeGreaterThan(sq.total * 10);
    expect(se.ratio).toBeLessThan(1.05);
    expect(sq.ratio).toBeCloseTo(1, 5);
  });

  it('两种插值的端点相同', () => {
    const from = { yaw: 0.2, pitch: -0.3, roll: 0.6 };
    const to = { yaw: 1.5, pitch: 0.4, roll: -0.2 };
    const a = fromEuler(from.yaw, from.pitch, from.roll);
    const b = fromEuler(to.yaw, to.pitch, to.roll);
    const v: Vec3 = [1, 0.5, -0.3];
    close(rotate(eulerLerp(from, to, 0), v), rotate(a, v), 8);
    close(rotate(eulerLerp(from, to, 1), v), rotate(b, v), 8);
  });
});

describe('预设', () => {
  it('每个预设两端姿态确实不同', () => {
    for (const p of PRESETS) {
      const a = fromEuler(p.from.yaw, p.from.pitch, p.from.roll);
      const b = fromEuler(p.to.yaw, p.to.pitch, p.to.roll);
      expect(angleBetweenQuats(a, b)).toBeGreaterThan(0.05);
    }
  });

  it('每个预设上 SLERP 都是匀速的', () => {
    for (const p of PRESETS) {
      const a = fromEuler(p.from.yaw, p.from.pitch, p.from.roll);
      const b = fromEuler(p.to.yaw, p.to.pitch, p.to.roll);
      expect(pathStats((t) => slerp(a, b, t)).ratio).toBeCloseTo(1, 5);
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
