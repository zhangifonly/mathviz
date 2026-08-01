import { useState, useEffect, useMemo } from 'react'
import Plot from 'react-plotly.js'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pseudosphereNarration } from '../../narrations/scripts/pseudosphere'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { sampleSurface } from '../../lib/proj3d'
import { pseudosphere, U_RANGE, V_RANGE, PRESETS } from './pseudosphere'

export default function PseudosphereExperiment() {
  const [a, setA] = useState(1)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(pseudosphereNarration)
  }, [narration])

  const surface = useMemo(() => {
    const grid = sampleSurface(
      (u, v) => pseudosphere(u, v, a),
      U_RANGE, V_RANGE, 100, 40,
    )
    return {
      x: grid.map(r => r.map(p => p[0])),
      y: grid.map(r => r.map(p => p[1])),
      z: grid.map(r => r.map(p => p[2])),
    }
  }, [a])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">伪球面</h1>
            <p className="text-gray-600">常负曲率的双曲模型</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">3D 视图（可拖动旋转）</h3>
            <Plot
              data={[{
                type: 'surface',
                x: surface.x,
                y: surface.y,
                z: surface.z,
                colorscale: 'YlGnBu',
                showscale: false,
              }]}
              layout={{
                autosize: true,
                height: 480,
                margin: { t: 0, r: 0, b: 0, l: 0 },
                scene: {
                  xaxis: { showgrid: true, zeroline: false, title: { text: 'x' } },
                  yaxis: { showgrid: true, zeroline: false, title: { text: 'y' } },
                  zaxis: { showgrid: true, zeroline: false, title: { text: 'z' } },
                  aspectmode: 'data',
                  camera: { eye: { x: 1.7, y: 1.7, z: 0.9 } },
                },
              }}
              config={{ responsive: true, displaylogo: false }}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数调节</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                伪球半径 a：{a.toFixed(2)}
              </label>
              <input
                type="range" min={0.5} max={1.8} step={0.02}
                value={a} onChange={(e) => setA(Number(e.target.value))}
                className="w-full" aria-label="伪球半径 a"
              />
              <div className="mt-4 space-y-2">
                {PRESETS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setA(s.a); }}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  >
                    <span>{s.label}</span>
                    <span className="text-xs opacity-70">{s.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">概念与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 曳物线绕渐近线旋转而成，高斯曲率<b>处处等于 -1/a²</b>。</li>
                <li>• 贝尔特拉米 1868 年用它首次给出<b>非欧几何的具体实现</b>。</li>
                <li>• 球面是常正曲率，伪球面是<b>常负曲率</b>，是双曲平面的局部模型。</li>
                <li>• 总面积 <b>4πa²</b>，与同半径的球面完全相同。</li>
                <li>• 希尔伯特定理：三维空间中<b>不存在完备</b>的常负曲率曲面，所以它必有奇边。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
