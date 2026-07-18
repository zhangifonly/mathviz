import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { fastExponentiationNarration } from '../../narrations/scripts/fast-exponentiation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { fastPow, SAMPLES } from './fastExponentiation'
import { drawFastExponentiation } from './draw'

const W = 600
const H = 480

export default function FastExponentiationExperiment() {
  const [base, setBase] = useState(2)
  const [exp, setExp] = useState(100)
  const [mod, setMod] = useState(1000000007)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(fastExponentiationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawFastExponentiation(canvas, base, exp, mod, -1)
  }, [base, exp, mod])

  const trace = fastPow(base, exp, mod)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">快速幂</h1>
            <p className="text-gray-600">对数次乘法算幂</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{base}^{exp}{mod > 0 ? ` mod ${mod}` : ''} · 平方-乘过程</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数设置</h3>
              <label className="block text-sm text-gray-600 mb-1">底数 base</label>
              <input type="number" value={base} min={1} max={999} onChange={(e) => setBase(Math.max(1, Math.min(999, Number(e.target.value) || 1)))} className="w-full mb-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm" />
              <label className="block text-sm text-gray-600 mb-1">指数 exp</label>
              <input type="number" value={exp} min={0} max={100000} onChange={(e) => setExp(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))} className="w-full mb-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm" />
              <label className="block text-sm text-gray-600 mb-1">模数 mod（0 表示不取模）</label>
              <input type="number" value={mod} min={0} onChange={(e) => setMod(Math.max(0, Number(e.target.value) || 0))} className="w-full mb-3 px-3 py-1.5 rounded-lg border border-gray-300 text-sm" />
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((s) => (
                  <button key={`${s.base}-${s.exp}-${s.mod}`} onClick={() => { setBase(s.base); setExp(s.exp); setMod(s.mod) }} className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                    {s.base}^{s.exp}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">乘法次数对比</h3>
              <p className="text-sm text-gray-700">快速幂 <b className="text-emerald-600">{trace.fastMults}</b> 次 · 朴素法 <b className="text-rose-500">{trace.naiveMults}</b> 次</p>
              <p className="mt-2 text-sm text-gray-600 break-all">结果 = {trace.result}</p>
              <ul className="mt-3 text-sm text-gray-600 space-y-1.5">
                <li>• 指数写成<b>二进制</b>，底数逐步<b>平方</b>。</li>
                <li>• 二进制位为 1 时把底数<b>乘进结果</b>。</li>
                <li>• 乘法次数只与二进制位数有关，即 <b>O(log n)</b>。</li>
                <li>• 大数用 <b>BigInt</b> 取模，结果精确无溢出。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
