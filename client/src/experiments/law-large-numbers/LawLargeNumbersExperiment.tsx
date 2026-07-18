import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { lawLargeNumbersNarration } from '../../narrations/scripts/law-large-numbers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DISTRIBUTIONS, SAMPLE_COUNTS } from './lawLargeNumbers'
import { drawLawLargeNumbers } from './draw'

const W = 600
const H = 480

export default function LawLargeNumbersExperiment() {
  const [distId, setDistId] = useState('dice')
  const [n, setN] = useState(200)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(lawLargeNumbersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLawLargeNumbers(canvas, distId, n, 3, seed)
  }, [distId, n, seed])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">大数定律</h1>
            <p className="text-gray-600">样本均值收敛到期望</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">累计均值曲线 · n = {n}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择分布</h3>
              <div className="space-y-2">
                {DISTRIBUTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDistId(d.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${distId === d.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">样本量 n</h3>
              <div className="space-y-2">
                {SAMPLE_COUNTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setN(c)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${n === c ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    n = {c}
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                🎲 重新随机采样
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 红色虚线是理论<b>期望</b> E[X]。</li>
                <li>• 每条彩色曲线是一次实验的<b>累计均值</b>。</li>
                <li>• n 越大，曲线越贴近期望、<b>波动越小</b>。</li>
                <li>• 这正是赌场与保险公司稳赚的数学依据。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
