import { describe, it } from 'vitest'
import {
  PRESETS, presetOf, dandelinSpheres, foci, cutPoint, focalSum,
  focalSumSpread, generatrixSegment, tangentLengthGap, tangentCircle,
  semiMajor, semiMinor, focalHalfDistance, eccentricity,
  eccentricityAnalytic, isEllipse, planeDistance, dist,
} from '../experiments/dandelin/dandelin'

describe('Dandelin 校验', () => {
  it('诊断', () => {
    console.log('--- 各配置：双球与焦点 ---')
    for (const p of PRESETS) {
      const cut = presetOf(p.id)
      if (!isEllipse(cut)) {
        console.log(`  ${p.label.padEnd(14)} 不是椭圆（θ 太大），跳过`)
        continue
      }
      const [up, low] = dandelinSpheres(cut)
      const [f1, f2] = foci(cut)
      console.log(`  ${p.label.padEnd(14)} α=${cut.alpha.toFixed(2)} θ=${cut.theta.toFixed(2)}`)
      console.log(`     上球 c=${up.center[2].toFixed(5)} r=${up.radius.toFixed(5)} 到平面距=${Math.abs(planeDistance(up.center, cut)).toFixed(5)}`)
      console.log(`     下球 c=${low.center[2].toFixed(5)} r=${low.radius.toFixed(5)} 到平面距=${Math.abs(planeDistance(low.center, cut)).toFixed(5)}`)
      console.log(`     焦点距 2c=${dist(f1, f2).toFixed(6)}`)
    }
    console.log('--- 核心断言：PF₁+PF₂ 是否与 P 无关 ---')
    for (const p of PRESETS) {
      const cut = presetOf(p.id)
      if (!isEllipse(cut)) continue
      const seg = generatrixSegment(cut)
      const sums = [0, 0.7, 1.6, 2.9, 4.4, 5.7].map((phi) => focalSum(cut, phi))
      console.log(`  ${p.label.padEnd(14)} T₁T₂=${seg.toFixed(8)}`)
      console.log(`     PF₁+PF₂ = [${sums.map((s) => s.toFixed(8)).join(', ')}]`)
      console.log(`     全曲线极差=${focalSumSpread(cut).toExponential(2)} 与 T₁T₂ 差=${Math.abs(sums[0] - seg).toExponential(2)}`)
    }
    console.log('--- 切线段等长 ---')
    for (const p of PRESETS.slice(0, 3)) {
      const cut = presetOf(p.id)
      if (!isEllipse(cut)) continue
      const gaps = [0, 1.2, 2.5, 4.0].map((phi) => Math.max(
        tangentLengthGap(cut, phi, true), tangentLengthGap(cut, phi, false),
      ))
      console.log(`  ${p.label.padEnd(14)} |PF−PT| 最大=${Math.max(...gaps).toExponential(2)}`)
    }
    console.log('--- 椭圆参数与离心率 ---')
    for (const p of PRESETS) {
      const cut = presetOf(p.id)
      if (!isEllipse(cut)) continue
      const a = semiMajor(cut)
      const b = semiMinor(cut)
      const c = focalHalfDistance(cut)
      console.log(`  ${p.label.padEnd(14)} a=${a.toFixed(5)} b=${b.toFixed(5)} c=${c.toFixed(5)}`)
      console.log(`     e=${eccentricity(cut).toFixed(8)} 解析 sinθ/cosα=${eccentricityAnalytic(cut).toFixed(8)} 差=${Math.abs(eccentricity(cut) - eccentricityAnalytic(cut)).toExponential(2)}`)
    }
    console.log('--- 切圆位置 ---')
    const cut = presetOf('mild')
    const [up, low] = dandelinSpheres(cut)
    for (const [name, s] of [['上球', up], ['下球', low]] as const) {
      const tc = tangentCircle(s, cut.alpha)
      console.log(`  ${name} 切圆 z=${tc.z.toFixed(5)} 半径=${tc.radius.toFixed(5)}`)
    }
    console.log('--- 切口点确实在锥面与平面上 ---')
    for (const phi of [0, 1.5, 3.0]) {
      const q = cutPoint(cut, phi)!
      const onCone = Math.abs(Math.hypot(q[0], q[1]) - q[2] * Math.tan(cut.alpha))
      const onPlane = Math.abs(planeDistance(q, cut))
      console.log(`  φ=${phi}: 锥面偏差=${onCone.toExponential(2)} 平面偏差=${onPlane.toExponential(2)}`)
    }
  })
})
