/**
 * 棱柱与反棱柱实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  eulerCount, isEquilateral, isSpherical, volumeOf, faceSizeHistogram,
} from '../../lib/polyhedron'
import {
  solidOf, predictCounts, prismHeight, antiprismHeight, baseEdge,
  sideFaceCount, isCubeCase, isOctahedronCase, SOLID_INFO, type SolidKind,
} from './prismAntiprism'

export interface SidePanelProps {
  kind: SolidKind
  n: number
  onKind: (k: SolidKind) => void
  onN: (v: number) => void
}

export default function SidePanel({ kind, n, onKind, onN }: SidePanelProps) {
  const p = solidOf(kind, n)
  const c = eulerCount(p)
  const pred = predictCounts(kind, n)
  const match = c.V === pred.V && c.E === pred.E && c.F === pred.F
  const h = kind === 'prism' ? prismHeight(n) : antiprismHeight(n)
  const hist = faceSizeHistogram(p)
  const histText = Object.entries(hist).map(([s, k]) => `${k}×${s}边`).join(' + ')
  const special = kind === 'prism' && isCubeCase(n)
    ? '就是立方体'
    : kind === 'antiprism' && isOctahedronCase(n)
      ? '就是正八面体'
      : ''

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择族</h3>
        <div className="space-y-2">
          {SOLID_INFO.map((i) => (
            <button
              key={i.kind}
              onClick={() => onKind(i.kind)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kind === i.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{i.label}</span>
                <span className="text-xs opacity-70">侧面{i.sideShape}</span>
              </div>
              <div className="text-xs opacity-70 mt-0.5">{i.note}</div>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">
          底面边数 n：{n}{special && <span className="text-emerald-600 text-sm"> · {special}</span>}
        </h3>
        <input
          type="range" min={3} max={12} step={1} value={n}
          onChange={(e) => onN(Number(e.target.value))}
          className="w-full" aria-label="底面边数"
        />
      </div>

      <CurveFactsCard
        title="验证读数"
        rows={[
          ['V − E + F =', String(c.chi), '任意 n 都是 2'],
          ['实际 V/E/F =', `${c.V}/${c.E}/${c.F}`],
          ['公式预测 =', `${pred.V}/${pred.E}/${pred.F}`, match ? '一致' : '不符'],
          ['面型', histText],
          ['侧面数', String(sideFaceCount(kind, n))],
          ['底面边长', baseEdge(n).toFixed(4)],
          ['高度', h.toFixed(4), kind === 'prism' ? '等于边长' : '由勾股定理定'],
          ['等棱 / 共球', `${isEquilateral(p, 1e-9) ? '✓' : '✗'} / ${isSpherical(p, 1e-9) ? '✓' : '✗'}`],
          ['体积', volumeOf(p).toFixed(4), 'n=4 处最大'],
        ]}
        facts={[
          ['各有无穷多个', '，因此被单列而不计入阿基米德的十三种。'],
          ['反棱柱错开 π/n', '，侧面才被分割成等边三角形。'],
          ['体积非单调', '：外接圆半径固定时 n=4 达峰，之后压成薄片趋于 0。'],
        ]}
      />
    </div>
  )
}
