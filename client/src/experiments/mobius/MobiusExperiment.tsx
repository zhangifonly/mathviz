import { useState, useEffect, useMemo } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { mobiusNarration } from '../../narrations/scripts/mobius'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { buildSurface, SURFACE_INFO, type SurfaceKind } from './surfaces'

const FORMULAS: Record<SurfaceKind, string[]> = {
  mobius: [
    'x = (1 + \\tfrac{v}{2}\\cos\\tfrac{u}{2})\\cos u',
    'y = (1 + \\tfrac{v}{2}\\cos\\tfrac{u}{2})\\sin u',
    'z = \\tfrac{v}{2}\\sin\\tfrac{u}{2}',
  ],
  klein: [
    'x = (r + \\cos v\\sin\\tfrac{u}{2} - \\sin v\\sin u)\\cos u',
    'y = (r + \\cos v\\sin\\tfrac{u}{2} - \\sin v\\sin u)\\sin u',
    'z = \\cos v\\cos\\tfrac{u}{2} + \\sin v\\cos u',
  ],
  torus: [
    'x = (R + r\\cos v)\\cos u',
    'y = (R + r\\cos v)\\sin u',
    'z = r\\sin v',
  ],
}

export default function MobiusExperiment() {
  const [kind, setKind] = useState<SurfaceKind>('mobius')

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit: handleExitPresenter } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(mobiusNarration)
  }, [narration])

  const surface = useMemo(() => buildSurface(kind), [kind])
  const info = SURFACE_INFO.find((s) => s.kind === kind)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExitPresenter} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">莫比乌斯环与克莱因瓶</h1>
            <p className="text-gray-600">只有一个面的神奇曲面</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 3D 视图（可拖动旋转）</h3>
            <Plot
              data={[{
                type: 'surface',
                x: surface.x,
                y: surface.y,
                z: surface.z,
                colorscale: 'Viridis',
                showscale: false,
              }]}
              layout={{
                autosize: true,
                height: 480,
                margin: { t: 0, r: 0, b: 0, l: 0 },
                scene: {
                  xaxis: { showgrid: false, zeroline: false, showticklabels: false, title: { text: '' } },
                  yaxis: { showgrid: false, zeroline: false, showticklabels: false, title: { text: '' } },
                  zaxis: { showgrid: false, zeroline: false, showticklabels: false, title: { text: '' } },
                  aspectmode: 'data',
                  camera: { eye: { x: 1.6, y: 1.6, z: 1.0 } },
                },
              }}
              config={{ responsive: true, displaylogo: false }}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择曲面</h3>
              <div className="space-y-2">
                {SURFACE_INFO.map((s) => (
                  <button
                    key={s.kind}
                    onClick={() => setKind(s.kind)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between items-center ${kind === s.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <span>{s.label}</span>
                    <span className={`text-xs ${kind === s.kind ? 'text-indigo-100' : 'text-indigo-400'}`}>{s.sided}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数方程</h3>
              <div className="p-3 bg-indigo-50 rounded-lg space-y-2 text-sm">
                {FORMULAS[kind].map((f, i) => <MathFormula key={i} formula={f} />)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">拓扑趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b>莫比乌斯环</b>：沿中线画一条线，绕两圈才回到起点 —— 证明它只有一个面。</li>
                <li>• 沿中线剪开莫比乌斯环，不会断成两个，而是变成一个更大的双扭环。</li>
                <li>• <b>克莱因瓶</b>：没有内外之分，瓶口"穿过"瓶身与底部相连，真实形态存在于四维空间。</li>
                <li>• 这些是<b>不可定向曲面</b>，是拓扑学研究的核心对象。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
