/**
 * 二角形实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import { sphericalExcess, type SphericalTriangle } from '../../lib/sphere3d'
import {
  luneArea, luneFraction, numericLuneArea, polygonArea, polygonAngleSum,
  polygonAreaResidual, planarAngleSum, regularSphericalPolygon,
  totalLuneAreaFor, girardIdentityResidual, LUNE_PRESETS,
} from './sphericalLune'
import type { LuneMode } from './scene'

const DEG = 180 / Math.PI
/**
 * 八分之一球面, 用来展示二角形如何推出吉拉尔定理。
 * ⚠️ 不能加 as const —— 那会让元组变成 readonly, 与 Vec3 不匹配(build 才报)。
 */
const OCTANT: SphericalTriangle = { A: [1, 0, 0], B: [0, 1, 0], C: [0, 0, 1] }

export interface SidePanelProps {
  mode: LuneMode
  alpha: number
  n: number
  latDeg: number
  onMode: (m: LuneMode) => void
  onAlpha: (v: number) => void
  onN: (v: number) => void
  onLat: (v: number) => void
}

export default function SidePanel(props: SidePanelProps) {
  const { mode, alpha, n, latDeg, onMode, onAlpha, onN, onLat } = props
  const poly = regularSphericalPolygon(n, (latDeg * Math.PI) / 180)
  const rows: Array<[string, string, string?]> = mode === 'lune'
    ? [
      ['面积 2α', luneArea(alpha).toFixed(6), '解析式'],
      ['数值积分', numericLuneArea(alpha, 100).toFixed(6), '独立验证'],
      ['占球面', `${(luneFraction(alpha) * 100).toFixed(2)}%`, '= α/(2π)'],
      ['三对二角形总和', totalLuneAreaFor(OCTANT).toFixed(4), '八分之一球面'],
      ['4π + 4·面积', (4 * Math.PI + 4 * sphericalExcess(OCTANT)).toFixed(4), '两者相等'],
      ['吉拉尔恒等式残差', girardIdentityResidual(OCTANT).toExponential(1), '应为 0'],
    ]
    : [
      ['内角和', `${(polygonAngleSum(poly) * DEG).toFixed(2)}°`, `平面 ${(planarAngleSum(n) * DEG).toFixed(0)}°`],
      ['面积（切三角）', polygonArea(poly).toFixed(6)],
      ['面积（内角和公式）', (polygonAngleSum(poly) - planarAngleSum(n)).toFixed(6)],
      ['两法残差', polygonAreaResidual(poly).toExponential(1), '应为 0'],
      ['占球面', `${((polygonArea(poly) / (4 * Math.PI)) * 100).toFixed(2)}%`],
    ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2 mb-3">
          {(['lune', 'polygon'] as LuneMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onMode(m)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${mode === m ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              {m === 'lune' ? '二角形' : '正 n 边形'}
            </button>
          ))}
        </div>
        {mode === 'lune' ? (
          <>
            <h3 className="text-lg font-semibold mb-2">夹角 α：{(alpha * DEG).toFixed(0)}°</h3>
            <input
              type="range" min={0.1} max={Math.PI} step={0.02} value={alpha}
              onChange={(e) => onAlpha(Number(e.target.value))}
              className="w-full" aria-label="夹角"
            />
            <div className="mt-3 space-y-2">
              {LUNE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => onAlpha(p.alpha)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${Math.abs(alpha - p.alpha) < 1e-9 ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <span>{p.label}</span><span className="text-xs opacity-70">{p.note}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">边数 n：{n}</h3>
            <input
              type="range" min={3} max={10} step={1} value={n}
              onChange={(e) => onN(Number(e.target.value))}
              className="w-full" aria-label="边数"
            />
            <h3 className="text-lg font-semibold mb-2 mt-3">顶点纬度：{latDeg}°</h3>
            <input
              type="range" min={5} max={85} step={1} value={latDeg}
              onChange={(e) => onLat(Number(e.target.value))}
              className="w-full" aria-label="顶点纬度"
            />
            <p className="text-xs text-gray-500 mt-1">纬度越高多边形越小，越接近平面情形</p>
          </>
        )}
      </div>

      <CurveFactsCard
        title={mode === 'lune' ? '二角形与吉拉尔定理' : '多边形面积公式'}
        rows={rows}
        facts={[
          ['二角形面积 = 2α', '，推导只需一步比例：面积/4π = α/2π。'],
          ['平面上没有二角形', '，两条直线最多交于一点，围不出图形。'],
          ['n 边形面积 = 内角和 − (n−2)π', '，平面上这个量恒为 0。'],
          ['三对二角形能推出吉拉尔定理', '：总和 = 4π + 4·三角形面积。'],
        ]}
      />
    </div>
  )
}
