/**
 * 四面体体积实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  tripleProduct, determinant3, parallelepipedVolume, tetrahedronVolume,
  volumeByBaseHeight, volumeResidual, areCoplanar, signedVolume,
  cyclicSymmetryError, swapAntisymmetryError, simplexDivisor,
  tetraFromEdges, PRESETS, type PresetId,
} from './tetrahedronVolume'
import type { Vec3 } from '../../lib/proj3d'

export interface SidePanelProps {
  presetId: PresetId
  showBox: boolean
  showSix: boolean
  onPreset: (id: PresetId) => void
  onToggleBox: () => void
  onToggleSix: () => void
  a: Vec3
  b: Vec3
  c: Vec3
}

export default function SidePanel(props: SidePanelProps) {
  const {
    presetId, showBox, showSix, onPreset, onToggleBox, onToggleSix, a, b, c,
  } = props
  const t = tetraFromEdges(a, b, c)
  const det = tripleProduct(a, b, c)
  const box = parallelepipedVolume(a, b, c)
  const tet = tetrahedronVolume(a, b, c)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择三棱向量</h3>
        <div className="space-y-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPreset(p.id)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${presetId === p.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div>{p.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{p.note}</div>
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onToggleBox}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${showBox ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {showBox ? '✓ 六面体' : '显示六面体'}
          </button>
          <button
            onClick={onToggleSix}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${showSix ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {showSix ? '✓ 切成 6 块' : '切成 6 块'}
          </button>
        </div>
      </div>

      <CurveFactsCard
        title="行列式与体积"
        rows={[
          ['三重积 a·(b×c)', det.toFixed(6)],
          ['行列式展开 det[a b c]', determinant3(a, b, c).toFixed(6), '两者相同'],
          ['平行六面体体积', box.toFixed(6), '= |det|'],
          ['四面体体积', tet.toFixed(6), `= |det| / ${simplexDivisor(3)}`],
          ['六面体 ÷ 四面体', box > 1e-12 ? (box / tet).toFixed(4) : '—', '恒为 6'],
          ['底面积×高/3', volumeByBaseHeight(t).toFixed(6), '独立算法'],
          ['两算法残差', volumeResidual(t).toExponential(1), '应为 0'],
          ['带符号体积', signedVolume(t).toFixed(6), det < 0 ? '负 → 反定向' : '正 → 右手系'],
          ['循环对称误差', cyclicSymmetryError(a, b, c).toExponential(1)],
          ['交换变号误差', swapAntisymmetryError(a, b, c).toExponential(1)],
          ['三棱共面', areCoplanar(a, b, c) ? '是（体积为 0）' : '否'],
        ]}
        facts={[
          ['六面体体积 = |行列式|', '，四面体是它的 1/6。'],
          ['那个 6 就是 3!', '：n 维单纯形体积 = |det| / n!。'],
          ['符号表示定向', '：交换任意两棱，行列式变号而体积不变。'],
          ['行列式为零 ⟺ 三棱共面', '，此时四面体压成平面图形。'],
        ]}
      />
    </div>
  )
}
