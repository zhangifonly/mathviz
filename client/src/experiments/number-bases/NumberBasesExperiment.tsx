import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { numberBasesNarration } from '../../narrations/scripts/number-bases'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { BASES, toBaseString } from './numberBases'
import { drawNumberBases } from './draw'

const W = 600
const H = 480
const PRESETS = [13, 42, 255, 365, 2748]

export default function NumberBasesExperiment() {
  const [n, setN] = useState(365)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(numberBasesNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawNumberBases(canvas, n, BASES)
  }, [n])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">进制转换</h1>
            <p className="text-gray-600">位值制的本质</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{n} 的多进制位值展开</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">输入十进制数</h3>
              <input
                type="number"
                min={0}
                max={1000000}
                value={n}
                onChange={(e) => setN(Math.max(0, Math.min(1000000, Math.floor(Number(e.target.value) || 0))))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setN(p)}
                    className={`px-2 py-1.5 rounded-lg text-sm font-medium ${n === p ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">各进制表示</h3>
              <ul className="text-sm text-gray-700 space-y-1.5 font-mono">
                {BASES.map((b) => (
                  <li key={b} className="flex justify-between">
                    <span className="text-gray-500">base {b}</span>
                    <b>{toBaseString(n, b)}</b>
                  </li>
                ))}
              </ul>
              <ul className="text-sm text-gray-600 space-y-1.5 mt-3">
                <li>• 每位权重 = <b>底数的幂</b>，逢 base 进一。</li>
                <li>• 二进制是<b>计算机的语言</b>，只有 0 和 1。</li>
                <li>• 十六进制更<b>紧凑</b>，四个二进制位对应一位。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
