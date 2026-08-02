/**
 * 地图投影实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  tissot, areaDistortion, angleDistortion, hkProduct, gridSkew,
  isConformal, isEqualArea, mercatorAreaInflation, apparentArea,
  PROJECTION_INFO, REGIONS, type ProjectionKind,
} from './mapProjections'

const RAD = Math.PI / 180

export interface SidePanelProps {
  kind: ProjectionKind
  heatmap: 'none' | 'area' | 'angle'
  probeLat: number
  onKind: (k: ProjectionKind) => void
  onHeatmap: (h: 'none' | 'area' | 'angle') => void
  onProbeLat: (v: number) => void
}

export default function SidePanel(props: SidePanelProps) {
  const { kind, heatmap, probeLat, onKind, onHeatmap, onProbeLat } = props
  const lat = probeLat * RAD
  const { h, k } = tissot(kind, lat, 0.5)
  const area = areaDistortion(kind, lat, 0.5)
  const angle = angleDistortion(kind, lat, 0.5)
  const skew = gridSkew(kind, lat, 0.5)
  const greenland = REGIONS.find((r) => r.name === '格陵兰')!
  const africa = REGIONS.find((r) => r.name === '非洲')!

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择投影</h3>
        <div className="space-y-2">
          {PROJECTION_INFO.map((p) => (
            <button
              key={p.kind}
              onClick={() => onKind(p.kind)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kind === p.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{p.label}</span>
                <span className="text-xs opacity-70">{p.type}</span>
              </div>
              <div className="text-xs opacity-70 mt-0.5">保 {p.preserves}</div>
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          {([['none', '无底色'], ['area', '面积失真'], ['angle', '角度失真']] as const)
            .map(([v, t]) => (
              <button
                key={v}
                onClick={() => onHeatmap(v)}
                className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium ${heatmap === v ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
              >
                {t}
              </button>
            ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">探测纬度：{probeLat}°</h3>
        <input
          type="range" min={-75} max={75} step={1} value={probeLat}
          onChange={(e) => onProbeLat(Number(e.target.value))}
          className="w-full" aria-label="探测纬度"
        />
      </div>

      <CurveFactsCard
        title="Tissot 指示椭圆"
        rows={[
          ['h（沿经线伸缩）', h.toFixed(4)],
          ['k（沿纬线伸缩）', k.toFixed(4)],
          ['面积失真 |det J|/cosφ', area.toFixed(4), isEqualArea(kind) ? '等积: 恒为 1' : ''],
          ['角度失真 |h−k|/(h+k)', angle.toFixed(4), isConformal(kind) ? '等角: 恒为 0' : ''],
          ['h·k', hkProduct(kind, lat, 0.5).toFixed(4), skew > 1e-6 ? '网格斜, 不等于面积因子' : '网格正交, 等于面积因子'],
          ['网格偏斜', `${((skew * 180) / Math.PI).toFixed(2)}°`],
          ['墨卡托 1/cos²φ', mercatorAreaInflation(lat).toFixed(4), '解析对照'],
        ]}
        facts={[
          ['任何投影必然失真', '：高斯绝妙定理 —— 球面曲率不为零，摊不平。'],
          ['等角 ⟺ h=k', '，等积 ⟺ |det J|/cosφ = 1，两者不可兼得。'],
          ['h·k 只在网格正交时等于面积因子', '：正弦投影网格是斜的，必须用 Jacobian。'],
          [`格陵兰在墨卡托上放大 ${apparentArea(greenland.lat).toFixed(1)} 倍`,
            `，真实面积只有非洲的 ${(greenland.realAreaMkm2 / africa.realAreaMkm2 * 100).toFixed(0)}%，看着却差不多大。`],
        ]}
      />
    </div>
  )
}
