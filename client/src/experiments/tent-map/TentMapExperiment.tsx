import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { tentMapNarration } from '../../narrations/scripts/tent-map'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { MU_VALUES } from './tentMap'
import { drawTentMap } from './draw'

const W = 600
const H = 480

export default function TentMapExperiment() {
  const [mu, setMu] = useState(2)
  const [start, setStart] = useState(0.2)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(tentMapNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawTentMap(canvas, mu, start, 40)
  }, [mu, start])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">帐篷映射</h1>
            <p className="text-gray-600">分段线性的混沌</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">蛛网图 + 时间序列 · μ = {mu.toFixed(2)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数 μ</h3>
              <div className="space-y-2">
                {MU_VALUES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMu(m)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${mu === m ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    μ = {m}{m === 2 ? ' （满混沌）' : ' （收敛）'}
                  </button>
                ))}
              </div>
              <label className="block text-sm text-gray-600 mt-4 mb-1">连续调节 μ：{mu.toFixed(2)}</label>
              <input type="range" min={0.5} max={2} step={0.01} value={mu} onChange={(e) => setMu(Number(e.target.value))} className="w-full" />
              <label className="block text-sm text-gray-600 mt-3 mb-1">起点 x₀：{start.toFixed(3)}</label>
              <input type="range" min={0.01} max={0.99} step={0.001} value={start} onChange={(e) => setStart(Number(e.target.value))} className="w-full" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• tent(x) 在 x=0.5 处折起，形如<b>帐篷</b>。</li>
                <li>• μ=2 时区间被<b>拉伸两倍再折叠</b>，产生混沌。</li>
                <li>• 起点差之毫厘，轨迹<b>失之千里</b>。</li>
                <li>• 蛛网图在曲线与对角线间弹跳，展示迭代轨迹。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
