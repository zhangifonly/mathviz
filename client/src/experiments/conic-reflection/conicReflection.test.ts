import { describe, expect, it } from 'vitest';
import {
  angleBetween,
  billiardPath,
  convergenceRatio,
  ellipseBounce,
  focalC,
  foci,
  gradientCheck,
  measureReflection,
  normalize,
  pointAt,
  PRESETS,
  sampleCurve,
  tangentAt,
  type Conic,
} from './conicReflection';

const ELL: Conic = { kind: 'ellipse', a: 5, b: 3 };
const PAR: Conic = { kind: 'parabola', a: 1.5, b: 0 };
const HYP: Conic = { kind: 'hyperbola', a: 2, b: 1.5 };

describe('向量基础', () => {
  it('零向量单位化不产生 NaN', () => {
    const z = normalize({ x: 0, y: 0 });
    expect(Number.isFinite(z.x)).toBe(true);
    expect(Number.isFinite(z.y)).toBe(true);
  });

  it('夹角在接近 0 与 π 时仍精确', () => {
    // acos(点积) 在这里会掉到 √ε≈1e-8, atan2 版本应保住 1e-15
    const a = { x: 1, y: 0 };
    const tiny = { x: Math.cos(1e-9), y: Math.sin(1e-9) };
    expect(angleBetween(a, tiny)).toBeCloseTo(1e-9, 15);
    const near = { x: Math.cos(Math.PI - 1e-9), y: Math.sin(Math.PI - 1e-9) };
    expect(angleBetween(a, near)).toBeCloseTo(Math.PI - 1e-9, 12);
  });
});

describe('曲线与焦点', () => {
  it('椭圆点落在曲线上', () => {
    for (const t of [0, 0.7, 2.2, 4.9]) {
      const p = pointAt(ELL, t);
      expect((p.x * p.x) / 25 + (p.y * p.y) / 9).toBeCloseTo(1, 12);
    }
  });

  it('双曲线两支都满足方程', () => {
    for (const br of [1, -1] as const) {
      for (const t of [-1.3, 0, 0.8]) {
        const p = pointAt(HYP, t, br);
        expect((p.x * p.x) / 4 - (p.y * p.y) / 2.25).toBeCloseTo(1, 12);
      }
    }
  });

  it('抛物线满足 y² = 4fx', () => {
    for (const t of [-2, 0.5, 3]) {
      const p = pointAt(PAR, t);
      expect(p.y * p.y).toBeCloseTo(4 * PAR.a * p.x, 12);
    }
  });

  it('椭圆焦点满足 a² = b² + c²', () => {
    const c = focalC(ELL);
    expect(c * c + ELL.b * ELL.b).toBeCloseTo(ELL.a * ELL.a, 12);
  });

  it('抛物线没有有限第二焦点', () => {
    expect(foci(PAR).f2).toBeNull();
  });

  it('切向量与曲线相切: 有限差分逼近', () => {
    const h = 1e-6;
    const t = 1.1;
    const p1 = pointAt(ELL, t - h);
    const p2 = pointAt(ELL, t + h);
    const fd = normalize({ x: (p2.x - p1.x) / (2 * h), y: (p2.y - p1.y) / (2 * h) });
    const tg = normalize(tangentAt(ELL, t));
    expect(angleBetween(fd, tg)).toBeLessThan(1e-8);
  });
});

describe('反射性质: 入射角 = 反射角', () => {
  // 全课的核心断言。三种曲线共用同一段代码, 精度要求同样严格。
  it('椭圆: 从 F₁ 出发的光经反射指向 F₂', () => {
    for (const t of [0.3, 1.1, 2.4, 4.0, 5.5]) {
      const m = measureReflection(ELL, t);
      expect(Math.abs(m.gap)).toBeLessThan(1e-12);
      // 真算出的反射方向应与「指向 F₂」重合
      expect(angleBetween(m.reflected, m.target)).toBeLessThan(1e-12);
    }
  });

  it('抛物线: 从焦点出发的光反射后平行于轴', () => {
    for (const t of [-3, 0.5, 2, 5]) {
      const m = measureReflection(PAR, t);
      expect(Math.abs(m.gap)).toBeLessThan(1e-12);
      // 平行于 x 轴: y 分量为 0
      expect(Math.abs(normalize(m.reflected).y)).toBeLessThan(1e-12);
      expect(normalize(m.reflected).x).toBeCloseTo(1, 12);
    }
  });

  it('双曲线: 反射线落在 F₂P 的延长线上(像从 F₂ 发出)', () => {
    for (const br of [1, -1] as const) {
      for (const t of [0.2, 0.9, 1.6]) {
        const m = measureReflection(HYP, t, br);
        expect(Math.abs(m.gap)).toBeLessThan(1e-12);
        expect(angleBetween(m.reflected, m.target)).toBeLessThan(1e-12);
      }
    }
  });

  it('等角性质与曲线尺度无关', () => {
    for (const k of [
      { kind: 'ellipse', a: 100, b: 99 },
      { kind: 'ellipse', a: 0.02, b: 0.001 },
    ] as Conic[]) {
      expect(Math.abs(measureReflection(k, 1.0).gap)).toBeLessThan(1e-12);
    }
  });
});

describe('梯度即角平分线(反射性质的理由)', () => {
  it('椭圆: û₁+û₂ 落在内角平分线上, 且垂直于切线', () => {
    for (const t of [0.4, 1.7, 3.9]) {
      const g = gradientCheck(ELL, t);
      expect(g).not.toBeNull();
      expect(g!.bisectorGap).toBeLessThan(1e-12);
      expect(g!.perpGap).toBeLessThan(1e-12);
    }
  });

  it('双曲线: û₁−û₂ 落在外角平分线上, 且垂直于切线', () => {
    for (const t of [0.3, 1.2]) {
      const g = gradientCheck(HYP, t);
      expect(g!.bisectorGap).toBeLessThan(1e-12);
      expect(g!.perpGap).toBeLessThan(1e-12);
    }
  });

  it('抛物线无有限第二焦点, 该检验不适用', () => {
    expect(gradientCheck(PAR, 1)).toBeNull();
  });
});

describe('椭圆台球', () => {
  it('从焦点击出, 第一次撞壁后必过另一焦点', () => {
    const { f1, f2 } = foci(ELL);
    for (const ang of [0.5, 1.4, 2.6]) {
      const path = billiardPath(ELL, f1, { x: Math.cos(ang), y: Math.sin(ang) }, 2);
      const seg = { x: path[2].x - path[1].x, y: path[2].y - path[1].y };
      const toF2 = { x: f2!.x - path[1].x, y: f2!.y - path[1].y };
      expect(angleBetween(seg, toF2)).toBeLessThan(1e-12);
    }
  });

  it('轨迹按 (1−e)/(1+e) 等比贴近长轴', () => {
    const { f1 } = foci(ELL);
    const path = billiardPath(ELL, f1, { x: Math.cos(0.9), y: Math.sin(0.9) }, 6);
    const ys = path.slice(1).map((p) => Math.abs(p.y));
    const r = ys[3] / ys[2];
    expect(r).toBeCloseTo(convergenceRatio(ELL), 4);
  });

  it('收敛率闭式: e=0.8 时为 1/9', () => {
    expect(convergenceRatio(ELL)).toBeCloseTo(1 / 9, 12);
  });

  it('贴到长轴后停止, 不输出被放大的浮点噪声', () => {
    // a=5,b=1.6 时误差每弹放大约 37 倍, 不设阈值会画出「重新张开」的假轨迹
    const k: Conic = { kind: 'ellipse', a: 5, b: 1.6 };
    const path = billiardPath(k, foci(k).f1, { x: Math.cos(0.9), y: Math.sin(0.9) }, 20);
    const ys = path.slice(1).map((p) => Math.abs(p.y));
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i]).toBeLessThan(ys[i - 1]);
    }
  });

  it('射线射不到曲线时返回 null 而不是抛错', () => {
    expect(ellipseBounce(PAR, { x: 0, y: 0 }, { x: 1, y: 0 })).toBeNull();
  });
});

describe('采样与预设', () => {
  it('双曲线采样返回两支', () => {
    expect(sampleCurve(HYP).length).toBe(2);
    expect(sampleCurve(ELL).length).toBe(1);
  });

  it('采样点全部有限', () => {
    for (const p of PRESETS) {
      for (const seg of sampleCurve(p.conic)) {
        for (const q of seg) {
          expect(Number.isFinite(q.x)).toBe(true);
          expect(Number.isFinite(q.y)).toBe(true);
        }
      }
    }
  });

  it('每个预设都满足反射性质', () => {
    for (const p of PRESETS) {
      expect(Math.abs(measureReflection(p.conic, 0.8).gap)).toBeLessThan(1e-12);
    }
  });

  it('预设 id 唯一', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
  });
});
