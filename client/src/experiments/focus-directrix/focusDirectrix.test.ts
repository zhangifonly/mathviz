import { describe, it, expect } from 'vitest';
import {
  classify,
  KIND_LABEL,
  radiusAt,
  directrixX,
  focusDirectrixRatio,
  pointAt,
  samplePolar,
  standardParams,
  secondFocusX,
  twoFocusCheck,
  PRESETS,
  ASTRO,
} from './focusDirectrix';

const L = 2;
/** 均匀扫一圈 θ, 收集所有有定义的点 */
function sweep<T>(fn: (theta: number) => T | null, n = 720): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const v = fn((i / n) * Math.PI * 2);
    if (v !== null) out.push(v);
  }
  return out;
}

describe('focus-directrix 分类', () => {
  it('按 e 分成三类', () => {
    expect(classify(0)).toBe('ellipse');
    expect(classify(0.5)).toBe('ellipse');
    expect(classify(0.999999)).toBe('ellipse');
    expect(classify(1)).toBe('parabola');
    expect(classify(1.3)).toBe('hyperbola');
    expect(classify(10)).toBe('hyperbola');
  });

  it('e=1 附近用容差判定, 不被浮点误差挤出抛物线', () => {
    expect(classify(1 + 1e-12)).toBe('parabola');
    expect(classify(1 - 1e-12)).toBe('parabola');
    // 但真正偏离就要分开
    expect(classify(1 + 1e-6)).toBe('hyperbola');
    expect(classify(1 - 1e-6)).toBe('ellipse');
  });

  it('三类都有中文标签', () => {
    expect(KIND_LABEL.ellipse).toBe('椭圆');
    expect(KIND_LABEL.parabola).toBe('抛物线');
    expect(KIND_LABEL.hyperbola).toBe('双曲线');
  });
});

describe('focus-directrix 核心定义 |PF| = e·dist(P,准线)', () => {
  it('六个预设的比值都恒等于 e', () => {
    for (const p of PRESETS) {
      const ratios = sweep((th) => focusDirectrixRatio(p.e, L, th)).map((r) => r.ratio);
      expect(ratios.length).toBeGreaterThan(400);
      for (const r of ratios) {
        expect(Math.abs(r - p.e)).toBeLessThan(1e-12);
      }
    }
  });

  it('比值与半正焦弦 l 无关', () => {
    for (const l of [0.5, 1, 2, 7.5]) {
      const ratios = sweep((th) => focusDirectrixRatio(0.6, l, th)).map((r) => r.ratio);
      for (const r of ratios) expect(r).toBeCloseTo(0.6, 12);
    }
  });

  it('e=0 时准线在无穷远, 比值为 0', () => {
    expect(directrixX(0, L)).toBe(Infinity);
    const r = focusDirectrixRatio(0, L, 1.0);
    expect(r).not.toBeNull();
    expect(r!.pd).toBe(Infinity);
    expect(r!.ratio).toBe(0);
  });

  it('e=0 时半径恒为 l(就是圆)', () => {
    for (const th of [0, 0.7, 2.2, 4.9]) {
      expect(radiusAt(0, L, th)).toBeCloseTo(L, 12);
    }
  });

  it('准线在 x = l/e, 位于焦点右侧', () => {
    for (const e of [0.3, 0.9, 1, 2]) {
      expect(directrixX(e, L)).toBeCloseTo(L / e, 12);
      expect(directrixX(e, L)).toBeGreaterThan(0);
    }
  });
});

describe('focus-directrix 双曲线远支(回归)', () => {
  // 这一组守住"负分母不能整段丢弃"这个 bug：
  // 早先 radiusAt 在 1+e·cosθ<0 时返回 null, 远支从未被采到,
  // 于是"比值恒为 e"的检验只看到了近支的点。
  it('远支顶点满足定义式', () => {
    const e = 1.3;
    // θ=π 给 r = l/(1-e) < 0, 落点在 x = -r = l/(e-1) > 0
    const r = radiusAt(e, L, Math.PI);
    expect(r).not.toBeNull();
    expect(r!).toBeLessThan(0);
    const p = pointAt(e, L, Math.PI)!;
    expect(p.x).toBeCloseTo(L / (e - 1), 10);
    const fd = focusDirectrixRatio(e, L, Math.PI)!;
    expect(fd.ratio).toBeCloseTo(e, 12);
  });

  it('负分母区间的点都在轨迹上', () => {
    const e = 1.5;
    const cut = Math.acos(-1 / e); // 渐近方向
    let seen = 0;
    for (let i = 1; i < 40; i++) {
      const th = cut + ((Math.PI - cut) * i) / 40; // 落在负分母区
      const denom = 1 + e * Math.cos(th);
      if (denom >= 0) continue;
      const fd = focusDirectrixRatio(e, L, th);
      expect(fd).not.toBeNull();
      expect(fd!.ratio).toBeCloseTo(e, 12);
      seen++;
    }
    expect(seen).toBeGreaterThan(20);
  });

  it('渐近方向本身无定义', () => {
    const e = 1.4;
    const cut = Math.acos(-1 / e);
    expect(radiusAt(e, L, cut)).toBeNull();
  });
});

describe('focus-directrix 采样分段', () => {
  it('椭圆与圆是单段闭合曲线', () => {
    for (const e of [0, 0.4, 0.9]) {
      expect(samplePolar(e, L).length).toBe(1);
    }
  });

  it('双曲线分成多段, 且近支与远支都出现', () => {
    for (const e of [1.3, 2]) {
      const segs = samplePolar(e, L);
      expect(segs.length).toBeGreaterThanOrEqual(2);
      const xs = segs.flat().map((p) => p.x);
      // 近顶点在 x=l/(1+e), 远顶点在 x=l/(e-1), 两者都该被采到
      const near = L / (1 + e);
      const far = L / (e - 1);
      expect(Math.min(...xs)).toBeLessThan(near + 1e-6);
      expect(Math.max(...xs)).toBeGreaterThan(Math.min(far, 40) - 1);
    }
  });

  it('不跨渐近方向连线(每段内相邻点不会突跳)', () => {
    for (const e of [1.2, 1.6, 2.5]) {
      for (const seg of samplePolar(e, L)) {
        for (let i = 1; i < seg.length; i++) {
          const d = Math.hypot(seg[i].x - seg[i - 1].x, seg[i].y - seg[i - 1].y);
          // 相邻采样点间距应远小于画布尺度
          expect(d).toBeLessThan(8);
        }
      }
    }
  });

  it('所有采样点都在 clip 半径内', () => {
    for (const e of [1.1, 1.5, 3]) {
      for (const p of samplePolar(e, L, 1441, 40).flat()) {
        expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(40 + 1e-9);
      }
    }
  });

  it('采样点确实落在轨迹上', () => {
    for (const e of [0.3, 1, 1.7]) {
      for (const p of samplePolar(e, L).flat()) {
        const pf = Math.hypot(p.x, p.y);
        const pd = Math.abs(directrixX(e, L) - p.x);
        if (e === 0) continue;
        expect(pf / pd).toBeCloseTo(e, 9);
      }
    }
  });
});

describe('focus-directrix 标准参数', () => {
  it('b² = |a² − c²|', () => {
    for (const e of [0, 0.5, 0.9, 1.3, 2]) {
      const { a, b, c } = standardParams(e, L);
      expect(b * b).toBeCloseTo(Math.abs(a * a - c * c), 9);
    }
  });

  it('c = a·e', () => {
    for (const e of [0.2, 0.7, 1.5, 4]) {
      const { a, c } = standardParams(e, L);
      expect(c).toBeCloseTo(a * e, 12);
    }
  });

  it('抛物线没有 a', () => {
    const sp = standardParams(1, L);
    expect(sp.kind).toBe('parabola');
    expect(Number.isNaN(sp.a)).toBe(true);
  });

  it('e→1 时 a 发散(两侧都发散)', () => {
    expect(standardParams(0.999, L).a).toBeGreaterThan(500);
    expect(standardParams(1.001, L).a).toBeGreaterThan(500);
    expect(standardParams(0.9, L).a).toBeLessThan(20);
  });

  it('圆的 a=b=l, c=0', () => {
    const { a, b, c } = standardParams(0, L);
    expect(a).toBeCloseTo(L, 12);
    expect(b).toBeCloseTo(L, 12);
    expect(c).toBeCloseTo(0, 12);
  });
});

describe('focus-directrix 两焦点性质(回归)', () => {
  // 守住"第二焦点符号"这个 bug：
  // 早先按 f2x=-2c 一律放左侧, 双曲线的 |PF₁−PF₂| 与 2a 偏差 5.53。
  it('椭圆的第二焦点在左, 双曲线在右', () => {
    expect(secondFocusX(0.5, L)).toBeLessThan(0);
    expect(secondFocusX(0.9, L)).toBeLessThan(0);
    expect(secondFocusX(1.3, L)).toBeGreaterThan(0);
    expect(secondFocusX(2, L)).toBeGreaterThan(0);
  });

  it('抛物线的第二焦点退到无穷远', () => {
    expect(secondFocusX(1, L)).toBe(Infinity);
  });

  it('椭圆: |PF₁|+|PF₂| 恒等于 2a', () => {
    for (const e of [0, 0.3, 0.7, 0.95]) {
      const { a } = standardParams(e, L);
      for (const t of sweep((th) => twoFocusCheck(e, L, th))) {
        expect(t.sumOrDiff).toBeCloseTo(2 * a, 9);
        expect(t.expected2a).toBeCloseTo(2 * a, 12);
      }
    }
  });

  it('双曲线: ||PF₁|−|PF₂|| 恒等于 2a', () => {
    for (const e of [1.2, 1.3, 2, 3]) {
      const { a } = standardParams(e, L);
      const ts = sweep((th) => twoFocusCheck(e, L, th));
      expect(ts.length).toBeGreaterThan(400);
      for (const t of ts) {
        expect(Math.abs(t.sumOrDiff - 2 * a)).toBeLessThan(1e-9);
      }
    }
  });

  it('抛物线没有两焦点性质', () => {
    expect(twoFocusCheck(1, L, 1.0)).toBeNull();
  });

  it('圆的两焦点重合于原点', () => {
    expect(secondFocusX(0, L)).toBeCloseTo(0, 12);
  });
});

describe('focus-directrix 预设与天体数据', () => {
  it('六个预设覆盖三种类型', () => {
    const kinds = new Set(PRESETS.map((p) => classify(p.e)));
    expect(kinds.has('ellipse')).toBe(true);
    expect(kinds.has('parabola')).toBe(true);
    expect(kinds.has('hyperbola')).toBe(true);
  });

  it('预设的 e 单调递增, 便于滑块演示', () => {
    for (let i = 1; i < PRESETS.length; i++) {
      expect(PRESETS[i].e).toBeGreaterThan(PRESETS[i - 1].e);
    }
  });

  it('每个预设都有标签与注解', () => {
    for (const p of PRESETS) {
      expect(p.label.length).toBeGreaterThan(1);
      expect(p.note.length).toBeGreaterThan(1);
      expect(p.e).toBeGreaterThanOrEqual(0);
    }
  });

  it('天体离心率跨越三种类型', () => {
    expect(ASTRO.some((a) => a.e < 0.1)).toBe(true); // 近圆
    expect(ASTRO.some((a) => a.e > 0.9 && a.e < 1)).toBe(true); // 长周期彗星
    expect(ASTRO.some((a) => a.e > 1)).toBe(true); // 星际天体
  });

  it('地球轨道接近圆', () => {
    const earth = ASTRO.find((a) => a.name === '地球')!;
    expect(earth.e).toBeLessThan(0.02);
    expect(classify(earth.e)).toBe('ellipse');
  });

  it('星际天体是双曲轨道', () => {
    const borisov = ASTRO.find((a) => a.name.includes('Borisov'))!;
    expect(classify(borisov.e)).toBe('hyperbola');
  });
});
