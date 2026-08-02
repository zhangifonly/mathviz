/**
 * 双曲三角形实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  triangleOf, angleSum, angularDefect, triangleArea, triangleAngles,
  triangleSides, euclideanAngleSum, areaFraction, edgeLengthSpread,
  MAX_TRIANGLE_AREA, TRIANGLE_PRESETS, GEOMETRY_COMPARISON,
} from './hyperbolicTriangle'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  scale: number
  showGrid: boolean
  onScale: (v: number) => void
  onToggleGrid: () => void
}

export default function SidePanel({
  scale, showGrid, onScale, onToggleGrid,
}: SidePanelProps) {
  const t = triangleOf(scale)
  const angs = triangleAngles(t)
  const sides = triangleSides(t)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">预设三角形</h3>
        <div className="space-y-2">
          {TRIANGLE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onScale(p.scale)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${Math.abs(scale - p.scale) < 1e-9 ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div>{p.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{p.note}</div>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">
          顶点半径：{scale.toFixed(3)}
        </h3>
        <input
          type="range" min={0.05} max={0.999} step={0.005} value={scale}
          onChange={(e) => onScale(Number(e.target.value))}
          className="w-full" aria-label="顶点半径"
        />
        <p className="text-xs text-gray-500 mt-1">
          顶点越靠近边界（无穷远），内角越小、面积越大
        </p>
        <button
          onClick={onToggleGrid}
          className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${showGrid ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {showGrid ? '✓ 显示测地线网格' : '显示测地线网格'}
        </button>
      </div>

      <CurveFactsCard
        title="角亏就是面积"
        rows={[
          ['三内角', angs.map((a) => (a * DEG).toFixed(1) + '°').join(', ')],
          ['内角和', `${(angleSum(t) * DEG).toFixed(3)}°`, '双曲: 恒 < 180°'],
          ['欧氏对照', `${(euclideanAngleSum(t) * DEG).toFixed(1)}°`, '同一组顶点当平面点'],
          ['角亏 π − 内角和', angularDefect(t).toFixed(5)],
          ['面积', triangleArea(t).toFixed(5), '与角亏精确相等'],
          ['占上界 π 的比例', `${(areaFraction(t) * 100).toFixed(2)}%`],
          ['三边长（双曲）', sides.map((s) => s.toFixed(3)).join(', ')],
          ['等边性（边长极差）', edgeLengthSpread(t).toExponential(1)],
          ['面积上界', MAX_TRIANGLE_AREA.toFixed(5), '= π，永不达到'],
        ]}
        facts={[
          ['角亏 = 面积', '：高斯–博内定理在 K=−1 下的形式，是球面盈余的镜像。'],
          ['面积有上界 π', '：三角趋于 0 时逼近但永不达到，双曲平面没有任意大的三角形。'],
          ['边越长角反而越小', '：负曲率让三角形「瘪」下去，这是欧氏直觉的反面。'],
          [`三种几何统一`,
            `：${GEOMETRY_COMPARISON.map((g) => `${g.name} ${g.areaFormula}`).join('，')}。`],
        ]}
      />
    </div>
  )
}
