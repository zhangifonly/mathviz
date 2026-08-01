import { useState, useEffect, useMemo, useRef } from 'react'
import Plot from 'react-plotly.js'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { helicoidCatenoidNarration } from '../../narrations/scripts/helicoid-catenoid'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { sampleSurface } from '../../lib/proj3d'
import {
  associateFamily, meanCurvature, firstFundamental, STAGES, U_RANGE, V_RANGE,
} from './helicoidCatenoid'

export default function HelicoidCatenoidExperiment() {
  const [theta, setTheta] = useState(0)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef(0)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(helicoidCatenoidNarration)
  }, [narration])

  // 自动播放变形: 在 0~PI/2 之间来回摆
  useEffect(() => {
    if (!playing) return
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const t = ((ts - start) / 4000) % 2
      setTheta((t < 1 ? t : 2 - t) * (Math.PI / 2))
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  const surface = useMemo(() => {
    const grid = sampleSurface(
      (u, v) => associateFamily(u, v, theta), U_RANGE, V_RANGE, 90, 24,
    )
    return {
      x: grid.map(r => r.map(p => p[0])),
      y: grid.map(r => r.map(p => p[1])),
      z: grid.map(r => r.map(p => p[2])),
    }
  }, [theta])

  // 抽样点上的 H 与第一基本形式, 用来实证「极小」与「等距」
  const check = useMemo(() => {
    const pts: Array<[number, number]> = [[0.4, 0.3], [-1.1, 0.6], [2.0, -0.5]]
    const maxH = Math.max(...pts.map(([u, v]) => Math.abs(meanCurvature(u, v, theta))))
    const { E, F, G } = firstFundamental(0.4, 0.3, theta)
    return { maxH, E, F, G }
  }, [theta])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">螺旋面与悬链面</h1>
            <p className="text-gray-600">两张极小曲面之间的等距变形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              θ = {((theta * 180) / Math.PI).toFixed(0)}° · 3D 视图（可拖动旋转）
            </h3>
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
                  xaxis: { range: [-2.2, 2.2], showgrid: true, zeroline: false, title: { text: 'x' } },
                  yaxis: { range: [-2.2, 2.2], showgrid: true, zeroline: false, title: { text: 'y' } },
                  zaxis: { range: [-3.4, 3.4], showgrid: true, zeroline: false, title: { text: 'z' } },
                  aspectmode: 'cube',
                  camera: { eye: { x: 1.7, y: 1.7, z: 0.9 } },
                },
              }}
              config={{ responsive: true, displaylogo: false }}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">变形参数 θ</h3>
              <input
                type="range" min={0} max={Math.PI / 2} step={0.01} value={theta}
                onChange={(e) => { setPlaying(false); setTheta(Number(e.target.value)) }}
                className="w-full"
                aria-label="伴随族参数"
              />
              <button
                onClick={() => setPlaying(p => !p)}
                className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              >
                {playing ? '⏸ 暂停变形' : '▶ 自动变形'}
              </button>
              <div className="mt-3 space-y-2">
                {STAGES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setPlaying(false); setTheta(s.theta) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${Math.abs(theta - s.theta) < 0.03 ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <span>{s.label}</span>
                    <span className="text-xs opacity-70">{s.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">实时验证</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 平均曲率最大值 <b>{check.maxH.toExponential(1)}</b>（≈0 即极小曲面）</li>
                <li>• 第一基本形式 <b>E={check.E.toFixed(3)}</b>，<b>G={check.G.toFixed(3)}</b></li>
                <li>• <b>F={check.F.toFixed(3)}</b>，E=G 且 F=0 说明是等温参数化</li>
                <li>• 拖动滑块时 E、G 不变，这就是<b>等距</b>：曲面上的距离全程不改。</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">概念与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 极小曲面是<b>肥皂膜</b>的形状：表面张力使面积局部最小。</li>
                <li>• 螺旋面是<b>直纹面</b>，弯曲的面却由直线织成。</li>
                <li>• 悬链面由<b>悬链线</b>旋转而成，是除平面外最早发现的极小旋转面。</li>
                <li>• 两张面<b>互为伴随</b>，中间每一张都仍是极小曲面。</li>
                <li>• 因为变形等距，纸上画的图案卷过去<b>不会变形</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
