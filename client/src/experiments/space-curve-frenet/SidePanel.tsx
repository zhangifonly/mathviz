/**
 * Frenet 标架实验的右侧面板
 *
 * 从 Experiment 抽出来，让主组件保持在 100 行以内。
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  rangeOf, curvatureOf, torsionOf, isPlanar, frenetSerretError,
  CURVE_INFO, type CurveKind,
} from './spaceCurveFrenet'

export default function SidePanel({
  kind, onPick,
}: { kind: CurveKind; onPick: (k: CurveKind) => void }) {
  const [t0, t1] = rangeOf(kind)
  const mid = (t0 + t1) / 2
  const k = curvatureOf(kind, mid)
  const tau = torsionOf(kind, mid)
  const e = frenetSerretError(kind, mid)
  const maxErr = Math.max(e.tErr, e.nErr, e.bErr)
  const planar = isPlanar(kind)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择曲线</h3>
        <div className="space-y-2">
          {CURVE_INFO.map((c) => (
            <button
              key={c.kind}
              onClick={() => onPick(c.kind)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${kind === c.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <span>{c.label}</span>
              <span className="text-xs opacity-70">{c.note}</span>
            </button>
          ))}
        </div>
      </div>

      <CurveFactsCard
        title="曲率与挠率"
        rows={[
          ['曲率 κ =', k.toFixed(4), '弯多少'],
          ['挠率 τ =', tau.toFixed(4), '扭多少'],
          ['Frenet–Serret 三式最大误差', maxErr.toExponential(1)],
        ]}
        facts={[
          [
            planar ? '挠率恒为零' : '挠率不为零',
            planar ? ' → 平面曲线，副法向量固定不动。' : ' → 真正的空间曲线。',
          ],
          ['曲线论基本定理', '：κ 与 τ 完全决定曲线形状，差一个刚体运动。'],
        ]}
      />
    </div>
  )
}
