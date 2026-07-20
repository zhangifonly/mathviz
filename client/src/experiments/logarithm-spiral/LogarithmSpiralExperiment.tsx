import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { logarithmSpiralNarration } from '../../narrations/scripts/logarithm-spiral'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PARAMS, growthPerTurn, pitchAngle } from './logarithmSpiral'
import { drawLogarithmSpiral } from './draw'

const W = 600
const H = 480

export default function LogarithmSpiralExperiment() {
  const [idx, setIdx] = useState(1)
  const [compare, setCompare] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(logarithmSpiralNarration)
  }, [narration])

  const { a, b } = PARAMS[idx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLogarithmSpiral(canvas, a, b, 4, compare)
  }, [a, b, compare])

  const angleDeg = (pitchAngle(b) * 180) / Math.PI

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">对数螺线</h1>
            <p className="text-gray-600">自相似的等角螺线</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">r = a·e^(b·θ)，b = {b}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">松紧参数 b</h3>
              <div className="space-y-2">
                {PARAMS.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setCompare((c) => !c)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-700 hover:bg-amber-200">
                {compare ? '隐藏' : '对比'}阿基米德螺线
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">当前特征</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 等角（定角）= <b>{angleDeg.toFixed(1)}°</b>，处处不变。</li>
                <li>• 每转一圈半径放大 <b>{growthPerTurn(b).toFixed(2)}</b> 倍。</li>
                <li>• 鹦鹉螺壳、旋涡星系都近似这条曲线。</li>
                <li>• 对数螺线指数增长，阿基米德螺线线性增长。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
