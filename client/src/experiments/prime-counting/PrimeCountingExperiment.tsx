import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { primeCountingNarration } from '../../narrations/scripts/prime-counting'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { primePi, pnlApprox, primeRatio, UPPER_BOUNDS } from './primeCounting'
import { drawPrimeCounting } from './draw'

const W = 600
const H = 480

export default function PrimeCountingExperiment() {
  const [upper, setUpper] = useState(1000)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(primeCountingNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPrimeCounting(canvas, upper)
  }, [upper])

  const pi = primePi(upper)
  const approx = pnlApprox(upper)
  const ratio = primeRatio(upper)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">素数计数与素数定理</h1>
            <p className="text-gray-600">素数分布的宏观规律</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">上界 x = {upper} · π(x) 与近似曲线</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择上界 x</h3>
              <div className="space-y-2">
                {UPPER_BOUNDS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setUpper(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${upper === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    x = {n}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <div>π(x) = <b>{pi}</b></div>
                <div>x/ln(x) ≈ <b>{approx.toFixed(1)}</b></div>
                <div>比值 π(x)/(x/ln x) = <b>{ratio.toFixed(4)}</b></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• π(x) 数出<b>不超过 x 的素数个数</b>，是一条阶梯曲线。</li>
                <li>• 素数定理：π(x) ~ <b>x/ln(x)</b>，比值趋近 1。</li>
                <li>• <b>Li(x)</b> 对数积分是更精确的近似，几乎贴着阶梯。</li>
                <li>• x 越大，三条曲线越靠越紧,逼近愈发明显。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
