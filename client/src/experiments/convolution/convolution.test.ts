import { describe, it, expect } from 'vitest'
import { convolve, frames, KERNELS, SIGNAL } from './convolution'

describe('一维离散卷积', () => {
  it('恒等核 [1] 返回信号本身', () => {
    const sig = [1, 2, 3, 4]
    expect(convolve(sig, [1])).toEqual(sig)
  })

  it('输出长度等于信号长度（same 模式）', () => {
    expect(convolve(SIGNAL, KERNELS.gaussian.taps).length).toBe(SIGNAL.length)
    expect(convolve([1, 2, 3], [1, 1, 1, 1, 1]).length).toBe(3)
  })

  it('移动平均核对常数信号保持不变', () => {
    const flat = [5, 5, 5, 5, 5]
    const out = convolve(flat, KERNELS.average.taps)
    // 内部点应等于 5（边界因补零略小）
    expect(out[2]).toBeCloseTo(5, 6)
  })

  it('与脉冲卷积复现核本身（区别于相关的翻转特性）', () => {
    const sig = [0, 0, 1, 0, 0]
    const asym = [1, 2, 3]
    // 卷积的定义 f[m]g[n-m] 使脉冲响应正好复现未翻转的核，中心对齐；
    // 若是相关运算则会得到翻转后的 [3,2,1]。
    const out = convolve(sig, asym)
    expect(out).toEqual([0, 1, 2, 3, 0])
  })

  it('frames 每帧乘积长度等于核长度，sum 与乘积和一致', () => {
    const fs = frames(SIGNAL, KERNELS.edge.taps)
    expect(fs.length).toBe(SIGNAL.length)
    for (const f of fs) {
      expect(f.products.length).toBe(KERNELS.edge.taps.length)
      const s = f.products.reduce((a, b) => a + b, 0)
      expect(f.sum).toBeCloseTo(s, 9)
    }
  })

  it('边缘检测核在台阶处产生非零响应，在平坦处近似为零', () => {
    const out = convolve([0, 0, 0, 5, 5, 5], KERNELS.edge.taps)
    expect(Math.abs(out[0])).toBeLessThan(1e-9)
    // 台阶附近存在明显响应
    expect(Math.max(...out.map((v) => Math.abs(v)))).toBeGreaterThan(0)
  })

  it('KERNELS 都能对 SIGNAL 正常卷积', () => {
    for (const key of Object.keys(KERNELS)) {
      expect(convolve(SIGNAL, KERNELS[key].taps).length).toBe(SIGNAL.length)
    }
  })
})
