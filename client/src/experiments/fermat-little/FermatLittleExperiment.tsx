import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { fermatLittleNarration } from '../../narrations/scripts/fermat-little'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLES, CARMICHAEL, fermatTest, isPrime } from './fermatLittle'
import { drawFermatLittle } from './draw'

const W = 600
const H = 480

export default function FermatLittleExperiment() {
  const [p, setP] = useState(7)
  const [a, setA] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(fermatLittleNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawFermatLittle(canvas, p, a)
  }, [p, a])

  const cheat = CARMICHAEL[0]
  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">费马小定理</h1>
            <p className="text-gray-600">a^p≡a模p，素数的隐秘指纹</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">a^k mod {p} 幂表 · 末列恒为 1</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择素数 p</h3>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLES.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setP(n); setA(Math.min(a, n - 1)) }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${p === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    p = {n}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">高亮底数 a = {a}</h3>
              <input type="range" min={1} max={p - 1} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full accent-purple-500" />
              <p className="text-sm text-gray-600 mt-2">
                {a}^{p - 1} mod {p} = <b className="text-emerald-600">1</b>
                {isPrime(p) ? '（p 是素数，费马小定理成立）' : ''}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">伪素数陷阱</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 费马测试通过<b>不保证</b>是素数。</li>
                <li>• 卡迈克尔数 <b>{cheat}</b> = 3×11×17，对一切互素底数都骗过测试：fermatTest({cheat}, 2) = <b>{String(fermatTest(cheat, 2))}</b>，但它是合数。</li>
                <li>• 所以现实里用 Miller-Rabin 等更强的测试。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
