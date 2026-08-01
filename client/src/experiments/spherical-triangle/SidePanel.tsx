/**
 * 球面三角形实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  angleSum, scaledTriangle, TRIANGLE_INFO, type TriangleKind,
} from './sphericalTriangle'
import {
  cosineRuleResidual, sineRuleSpread, sphericalDistance, pythagoreanResidual,
  triangleAngles, triangleSides, sphericalExcess,
} from '../../lib/sphere3d'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  kind: TriangleKind
  scale: number
  onKind: (k: TriangleKind) => void
  onScale: (v: number) => void
}

export default function SidePanel({ kind, scale, onKind, onScale }: SidePanelProps) {
  // 所有读数都用缩放后的三角形, 否则缩放时只有内角和变、其余不动, 自相矛盾
  const t = scaledTriangle(kind, scale)
  const sum = angleSum(t)
  const angs = triangleAngles(t)
  const sides = triangleSides(t)
  const areaFrac = sphericalExcess(t) / (4 * Math.PI)
  // 直角三角形额外验证球面勾股定理
  const hyp = sphericalDistance(t.B, t.C)
  const legB = sphericalDistance(t.C, t.A)
  const legC = sphericalDistance(t.A, t.B)
  const pyth = Math.abs(pythagoreanResidual(legB, legC, hyp))
  const euclidHyp = Math.hypot(legB, legC)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择三角形</h3>
        <div className="space-y-2">
          {TRIANGLE_INFO.map((i) => (
            <button
              key={i.kind}
              onClick={() => { onKind(i.kind); onScale(1) }}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kind === i.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div>{i.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{i.note}</div>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">缩放：{scale.toFixed(2)}</h3>
        <input
          type="range" min={0.05} max={1} step={0.01} value={scale}
          onChange={(e) => onScale(Number(e.target.value))}
          className="w-full" aria-label="缩放"
        />
        <p className="text-xs text-gray-500 mt-1">
          缩小后内角和跟着变 —— 这就是没有相似三角形的原因
        </p>
      </div>

      <CurveFactsCard
        title="球面三角学读数"
        rows={[
          ['内角和', `${(sum * DEG).toFixed(3)}°`, '欧氏恒为 180°'],
          ['球面盈余', (sum - Math.PI).toFixed(5), '等于面积'],
          ['三内角', angs.map((a) => (a * DEG).toFixed(1) + '°').join(', ')],
          ['三边长', sides.map((s) => (s * DEG).toFixed(1) + '°').join(', ')],
          ['面积占球面', `${(areaFrac * 100).toFixed(2)}%`],
          ['余弦定理残差', Math.abs(cosineRuleResidual(t)).toExponential(1), '应为 0'],
          ['正弦定理偏差', sineRuleSpread(t).toExponential(1), '应为 0'],
          ['球面勾股残差', pyth.toExponential(1), kind === 'rightAngled' ? '直角三角形成立' : '仅直角时成立'],
          ['球面斜边 vs 欧氏', `${(hyp * DEG).toFixed(1)}° vs ${(euclidHyp * DEG).toFixed(1)}°`],
        ]}
        facts={[
          ['吉拉尔定理', '：单位球上面积恰好等于球面盈余。'],
          ['没有相似三角形', '：角度决定形状也决定大小。'],
          ['球面勾股 cos c = cos a·cos b', '，没有平方项，小三角形时退化为欧氏形式。'],
          ['没有平行线', '：任意两个大圆必定相交于对径的两点。'],
        ]}
      />
    </div>
  )
}
