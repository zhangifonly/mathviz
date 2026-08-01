/**
 * 星形多面体实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import { eulerCount, circumradius, volumeOf } from '../../lib/polyhedron'
import { platonicOf, PLATONIC_INFO } from '../platonic-solids/platonicSolids'
import {
  stellatedOf, predictCounts, spikeCount, STELLATE_INFO, KEPLER_POINSOT,
  type StellateBase,
} from './stellatedPolyhedra'

export interface SidePanelProps {
  base: StellateBase
  h: number
  onBase: (b: StellateBase) => void
  onH: (v: number) => void
}

export default function SidePanel({ base, h, onBase, onH }: SidePanelProps) {
  const orig = PLATONIC_INFO.find((p) => p.kind === base)!
  const pred = predictCounts(orig.V, orig.E, orig.F)
  const poly = stellatedOf(base, h)
  const c = eulerCount(poly)
  const match = c.V === pred.V && c.E === pred.E && c.F === pred.F
  const growth = volumeOf(poly) / volumeOf(platonicOf(base))
  const kp = KEPLER_POINSOT.find((k) => k.name === '小星形十二面体')!

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">基础立体</h3>
        <div className="space-y-2">
          {STELLATE_INFO.map((i) => (
            <button
              key={i.base}
              onClick={() => onBase(i.base)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${base === i.base ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <span>{i.label}</span>
              <span className="text-xs opacity-70">{i.note}</span>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">尖刺高度 h：{h.toFixed(2)}</h3>
        <input
          type="range" min={0} max={2} step={0.02} value={h}
          onChange={(e) => onH(Number(e.target.value))}
          className="w-full" aria-label="尖刺高度"
        />
      </div>

      <CurveFactsCard
        title="验证读数"
        rows={[
          ['V − E + F =', String(c.chi), '星化前后都是 2'],
          ['实际 V/E/F =', `${c.V}/${c.E}/${c.F}`],
          ['公式预测 =', `${pred.V}/${pred.E}/${pred.F}`, match ? '一致' : '不符'],
          ['原立体 V/E/F =', `${orig.V}/${orig.E}/${orig.F}`],
          ['尖刺个数', String(spikeCount(base)), '等于原面数'],
          ['外接半径', circumradius(poly).toFixed(3)],
          ['体积倍数', `${growth.toFixed(2)}×`, '相对原立体'],
        ]}
        facts={[
          ['V+F, 3E, 2E', '：三个变化恰好抵消，故 χ 不变。'],
          ['星化不改变拓扑', '：没戳穿也没粘合，曲面仍与球面同构。'],
          ['开普勒-普安索立体不同', `：面自相交，小星形十二面体 χ=${kp.chi}。`],
        ]}
      />
    </div>
  )
}
