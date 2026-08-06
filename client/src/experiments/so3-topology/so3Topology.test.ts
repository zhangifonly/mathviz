import { describe, expect, it } from 'vitest';
import {
  classAdd, homotopyClass, isContractible, liftEndpointW, liftPath,
  PRESETS, projectedLift, qNorm, quatAxisAngle, rotateVec, stereographic,
  type Vec3,
} from './so3Topology';

describe('提升道路', () => {
  it('起点恒为单位元', () => {
    for (const turns of [1, 2, 3, 4]) {
      const p = liftPath(turns);
      expect(p[0].q[0]).toBeCloseTo(1, 12);
      expect(Math.hypot(p[0].q[1], p[0].q[2], p[0].q[3])).toBeCloseTo(0, 12);
    }
  });

  it('终点是 (−1)^turns —— 全课的关键', () => {
    for (const turns of [1, 2, 3, 4, 5, 6]) {
      const p = liftPath(turns);
      const end = p[p.length - 1].q;
      expect(end[0]).toBeCloseTo(liftEndpointW(turns), 10);
      expect(end[0]).toBeCloseTo(turns % 2 === 0 ? 1 : -1, 10);
    }
  });

  it('全程保持在单位球面上', () => {
    for (const pt of liftPath(3, [1, 2, -1])) {
      expect(qNorm(pt.q)).toBeCloseTo(1, 12);
    }
  });

  it('提升是连续的：相邻点之间没有跳变', () => {
    const p = liftPath(2, [0, 0, 1], 400);
    for (let i = 1; i < p.length; i++) {
      const a = p[i - 1].q;
      const b = p[i].q;
      // 提升上的距离不取绝对值：q 与 −q 在 S³ 上相隔最远
      const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
      expect(2 * Math.acos(Math.max(-1, Math.min(1, d)))).toBeLessThan(0.1);
    }
  });

  it('换旋转轴不改变终点的符号', () => {
    for (const axis of [[1, 0, 0], [0, 1, 0], [1, 1, 1], [-2, 0.5, 3]] as Vec3[]) {
      for (const turns of [1, 2]) {
        const p = liftPath(turns, axis);
        expect(p[p.length - 1].q[0]).toBeCloseTo(turns % 2 === 0 ? 1 : -1, 10);
      }
    }
  });

  it('作为旋转，整数圈全都回到原姿态', () => {
    // 提升的符号不同，但落到 SO(3) 上都是恒等 —— 双重覆盖的意思正在于此
    const v: Vec3 = [0.3, -0.7, 0.5];
    for (const turns of [1, 2, 3]) {
      const q = quatAxisAngle([0, 0, 1], turns * Math.PI * 2);
      const r = rotateVec(q, v);
      r.forEach((c, i) => expect(c).toBeCloseTo(v[i], 10));
    }
  });
});

describe('π₁(SO(3)) = ℤ₂', () => {
  it('偶数圈可收缩，奇数圈不可', () => {
    expect(isContractible(0)).toBe(true);
    expect(isContractible(1)).toBe(false);
    expect(isContractible(2)).toBe(true);
    expect(isContractible(3)).toBe(false);
    expect(isContractible(-1)).toBe(false);
    expect(isContractible(-2)).toBe(true);
  });

  it('同伦类只有两个', () => {
    const classes = new Set([0, 1, 2, 3, 4, 5, 6, 7].map(homotopyClass));
    expect(classes).toEqual(new Set([0, 1]));
  });

  it('群运算是模 2 加法', () => {
    expect(classAdd(1, 1)).toBe(0); // 两次 360° = 720°，平凡
    expect(classAdd(1, 2)).toBe(1);
    expect(classAdd(2, 2)).toBe(0);
    expect(classAdd(3, 5)).toBe(0); // 都是奇数，相加为偶
  });

  it('非平凡元素是自己的逆 —— ℤ₂ 的特征', () => {
    expect(classAdd(1, 1)).toBe(0);
  });
});

describe('立体投影', () => {
  it('单位元落在原点', () => {
    const p = stereographic([1, 0, 0, 0]);
    expect(p).not.toBeNull();
    p!.forEach((c) => expect(c).toBeCloseTo(0, 12));
  });

  it('对跖点 −1 在无穷远，返回 null', () => {
    expect(stereographic([-1, 0, 0, 0])).toBeNull();
  });

  it('球面上的点投影后有限（远离 −1 时）', () => {
    for (const a of [0.3, 1.5, 2.5]) {
      const p = stereographic(quatAxisAngle([1, 0, 0], a));
      expect(p).not.toBeNull();
      expect(p!.every(Number.isFinite)).toBe(true);
    }
  });

  it('超出 clip 半径的点被截断', () => {
    // 逼近 −1 时投影发散
    expect(stereographic(quatAxisAngle([0, 0, 1], Math.PI * 2 - 1e-4), 6)).toBeNull();
  });
});

describe('投影后的道路', () => {
  it('偶数圈：末点回到原点（闭合）', () => {
    for (const turns of [2, 4]) {
      const segs = projectedLift(turns);
      const last = segs[segs.length - 1].slice(-1)[0];
      expect(Math.hypot(...last)).toBeLessThan(0.05);
    }
  });

  it('奇数圈：末点跑向远处（不闭合）', () => {
    for (const turns of [1, 3]) {
      const segs = projectedLift(turns);
      const last = segs[segs.length - 1].slice(-1)[0];
      expect(Math.hypot(...last)).toBeGreaterThan(3);
    }
  });

  it('每经过一次 −1，曲线断开一次', () => {
    // turns 圈里穿过 −1 的次数 = turns（含终点那次）
    expect(projectedLift(1).length).toBe(1);
    expect(projectedLift(2).length).toBe(2);
    expect(projectedLift(4).length).toBe(3);
  });

  it('所有采样点有限', () => {
    for (const turns of [1, 2, 3, 4]) {
      for (const seg of projectedLift(turns)) {
        for (const p of seg) {
          expect(p.every(Number.isFinite)).toBe(true);
        }
      }
    }
  });
});

describe('预设', () => {
  it('覆盖两个同伦类', () => {
    const cls = new Set(PRESETS.map((p) => homotopyClass(p.turns)));
    expect(cls).toEqual(new Set([0, 1]));
  });

  it('每个预设的终点符号与标注一致', () => {
    for (const p of PRESETS) {
      const path = liftPath(p.turns);
      const w = path[path.length - 1].q[0];
      expect(w).toBeCloseTo(p.turns % 2 === 0 ? 1 : -1, 10);
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
